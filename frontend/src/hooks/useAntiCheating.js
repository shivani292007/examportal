import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '../api/client';

export function useAntiCheating({
  sessionId,
  isActive = false,
  onAutoSubmit,
  maxStrikes = 3
}) {
  const [strikeCount, setStrikeCount] = useState(0);
  const [violations, setViolations] = useState([]);
  const [violationModal, setViolationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    severity: 'warning', // 'warning', 'severe', 'fullscreen', 'terminated'
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isTerminatedRef = useRef(false);
  const lastBlurTimeRef = useRef(0);

  // Helper to log violation to server and update local state
  const recordViolation = useCallback(async (eventType, details, severity = 'warning') => {
    if (!sessionId || !isActive || isTerminatedRef.current) return;

    try {
      const res = await apiClient.logIntegrityEvent({
        session_id: sessionId,
        event_type: eventType,
        details,
        severity
      });

      setStrikeCount(res.strike_count);
      setViolations(res.recent_events || []);

      if (res.is_terminated) {
        isTerminatedRef.current = true;
        setViolationModal({
          isOpen: true,
          title: 'Assessment Terminated',
          message: 'Your assessment has been automatically submitted due to exceeding the maximum allowed integrity violations (3 Strikes).',
          severity: 'terminated'
        });
        if (onAutoSubmit) {
          onAutoSubmit('integrity_termination');
        }
      }
    } catch (err) {
      console.error('Failed to log integrity event:', err);
    }
  }, [sessionId, isActive, onAutoSubmit]);

  // Request Fullscreen helper
  const enterFullscreen = useCallback(async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
      setIsFullscreen(true);
      setViolationModal((prev) => (prev.severity === 'fullscreen' ? { ...prev, isOpen: false } : prev));
    } catch (err) {
      console.warn('Fullscreen request failed or was rejected:', err);
    }
  }, []);

  // Handle Tab Switch / Blur
  const handleTabSwitch = useCallback(() => {
    if (!isActive || isTerminatedRef.current) return;
    
    // Throttle blur events occurring within 1 second
    const now = Date.now();
    if (now - lastBlurTimeRef.current < 1200) return;
    lastBlurTimeRef.current = now;

    const nextStrike = strikeCount + 1;
    recordViolation('tab_switch', 'Student navigated away or switched browser tabs/windows.', 'violation');

    if (nextStrike === 1) {
      setViolationModal({
        isOpen: true,
        title: 'Integrity Warning: Tab Switch Detected (Strike 1/3)',
        message: 'Leaving the assessment tab is strictly prohibited. Your activity is logged. Two more violations will result in automatic submission.',
        severity: 'warning'
      });
    } else if (nextStrike === 2) {
      setViolationModal({
        isOpen: true,
        title: 'Severe Warning: Tab Switch Detected (Strike 2/3)',
        message: 'Final Warning! You have accumulated 2 integrity strikes. One additional violation will immediately submit and terminate your assessment.',
        severity: 'severe'
      });
    }
  }, [isActive, strikeCount, recordViolation]);

  useEffect(() => {
    if (!isActive) return;

    // 1. Visibility & Blur listeners
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleTabSwitch();
      }
    };

    const onWindowBlur = () => {
      handleTabSwitch();
    };

    // 2. Fullscreen change listener
    const onFullscreenChange = () => {
      const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
      setIsFullscreen(isFull);
      if (!isFull && isActive && !isTerminatedRef.current) {
        recordViolation('fullscreen_exit', 'Student exited fullscreen mode during examination.', 'warning');
        setViolationModal({
          isOpen: true,
          title: 'Fullscreen Mode Required',
          message: 'The secure examination environment must remain in full-screen mode to prevent external assistance. Please return to fullscreen immediately.',
          severity: 'fullscreen'
        });
      }
    };

    // 3. Prevent Context Menu (Right Click)
    const onContextMenu = (e) => {
      e.preventDefault();
      recordViolation('context_menu', 'Right-click context menu attempted.', 'info');
      return false;
    };

    // 4. Prevent Copy & Cut
    const onCopy = (e) => {
      e.preventDefault();
      recordViolation('copy_attempt', 'Attempted to copy assessment content to clipboard.', 'warning');
    };

    const onCut = (e) => {
      e.preventDefault();
      recordViolation('cut_attempt', 'Attempted to cut content.', 'warning');
    };

    // 5. Intercept Restricted Keyboard Shortcuts
    const onKeyDown = (e) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key.toUpperCase();

      // Block DevTools keys: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (isCtrlOrMeta && e.shiftKey && (key === 'I' || key === 'J' || key === 'C'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        recordViolation('devtools_detected', `Attempted DevTools shortcut: ${e.key}`, 'violation');
        return false;
      }

      // Block Ctrl+U (View Source), Ctrl+S (Save), Ctrl+P (Print)
      if (isCtrlOrMeta && (key === 'U' || key === 'S' || key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        recordViolation('restricted_key', `Attempted browser shortcut: Ctrl+${key}`, 'warning');
        return false;
      }

      // Block Ctrl+C and Ctrl+V globally outside editor
      if (isCtrlOrMeta && (key === 'C' || key === 'V' || key === 'X')) {
        const isEditable = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
        if (!isEditable) {
          e.preventDefault();
          recordViolation('restricted_key', `Attempted Ctrl+${key} outside input fields`, 'warning');
        }
      }
    };

    // 6. Navigation protection (beforeunload)
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'An active assessment is in progress. Leaving will count as an integrity violation.';
      return e.returnValue;
    };

    // 7. DevTools opening detection heuristic (Window resize check)
    let devToolsInterval = setInterval(() => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if ((widthDiff || heightDiff) && !isTerminatedRef.current) {
        recordViolation('devtools_detected', 'Potential browser Developer Tools dock detected via window geometry variance.', 'warning');
      }
    }, 4000);

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('copy', onCopy);
    document.addEventListener('cut', onCut);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('cut', onCut);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('beforeunload', onBeforeUnload);
      clearInterval(devToolsInterval);
    };
  }, [isActive, handleTabSwitch, recordViolation]);

  return {
    strikeCount,
    violations,
    violationModal,
    setViolationModal,
    isFullscreen,
    enterFullscreen,
    recordViolation
  };
}
