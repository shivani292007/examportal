-- ============================================================================
-- Portal for Academia–Industry Collaboration: Secure Assessment Database
-- MySQL 8.0 Schema DDL
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `skill_assessment_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skill_assessment_db`;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS `students` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `hashed_password` VARCHAR(255) NOT NULL,
    `college` VARCHAR(150) NULL,
    `roll_number` VARCHAR(50) NULL,
    `target_domain` VARCHAR(50) DEFAULT 'Python',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_students_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Assessment Sessions Table
CREATE TABLE IF NOT EXISTS `assessment_sessions` (
    `id` VARCHAR(36) PRIMARY KEY, -- UUID
    `student_id` INT NOT NULL,
    `domain` VARCHAR(50) NOT NULL,
    `status` VARCHAR(30) DEFAULT 'in_progress', -- in_progress, submitted, terminated
    `start_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `end_time` DATETIME NULL,
    `total_duration_seconds` INT DEFAULT 5400,
    `time_remaining_seconds` INT DEFAULT 5400,
    `current_section` VARCHAR(50) DEFAULT 'aptitude',
    `strike_count` INT DEFAULT 0,
    `overall_score` FLOAT DEFAULT 0.0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
    INDEX `idx_sessions_student` (`student_id`),
    INDEX `idx_sessions_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Questions Bank Table
CREATE TABLE IF NOT EXISTS `questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `section` VARCHAR(50) NOT NULL, -- aptitude, programming, debugging, technical_mcq, output_prediction, short_answer
    `domain` VARCHAR(50) DEFAULT 'common', -- common, Python, Java, JavaScript, SQL, DSA
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `code_template` TEXT NULL,
    `faulty_code` TEXT NULL,
    `expected_output` TEXT NULL,
    `options_json` TEXT NULL,
    `correct_answer` TEXT NULL, -- Secret answer key (hidden from API queries)
    `test_cases_json` TEXT NULL,
    `skill_tag` VARCHAR(100) NOT NULL,
    `topic` VARCHAR(100) NOT NULL,
    `difficulty` VARCHAR(20) DEFAULT 'Medium',
    `marks` INT DEFAULT 10,
    INDEX `idx_questions_section` (`section`),
    INDEX `idx_questions_domain` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Student Answers Table
CREATE TABLE IF NOT EXISTS `student_answers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `session_id` VARCHAR(36) NOT NULL,
    `question_id` INT NOT NULL,
    `selected_option` VARCHAR(255) NULL,
    `code_submission` TEXT NULL,
    `language` VARCHAR(30) NULL,
    `text_response` TEXT NULL,
    `is_evaluated` BOOLEAN DEFAULT FALSE,
    `is_correct` BOOLEAN DEFAULT FALSE,
    `marks_obtained` FLOAT DEFAULT 0.0,
    `test_results_json` TEXT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`session_id`) REFERENCES `assessment_sessions`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
    INDEX `idx_answers_session` (`session_id`),
    INDEX `idx_answers_question` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Integrity Events Table
CREATE TABLE IF NOT EXISTS `integrity_events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `session_id` VARCHAR(36) NOT NULL,
    `event_type` VARCHAR(50) NOT NULL, -- tab_switch, fullscreen_exit, copy_attempt, paste_attempt, cut_attempt, restricted_key, devtools_detected, context_menu
    `details` TEXT NULL,
    `severity` VARCHAR(20) DEFAULT 'warning', -- info, warning, violation, critical
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`session_id`) REFERENCES `assessment_sessions`(`id`) ON DELETE CASCADE,
    INDEX `idx_integrity_session` (`session_id`),
    INDEX `idx_integrity_event_type` (`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Assessment Results & Skill Mapping Table
CREATE TABLE IF NOT EXISTS `assessment_results` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `session_id` VARCHAR(36) NOT NULL UNIQUE,
    `student_id` INT NOT NULL,
    `overall_score` FLOAT NOT NULL,
    `max_score` FLOAT NOT NULL,
    `percentage` FLOAT NOT NULL,
    `section_scores_json` TEXT NOT NULL,
    `skill_scores_json` TEXT NOT NULL,
    `strong_skills_json` TEXT NOT NULL,
    `weak_skills_json` TEXT NOT NULL,
    `skill_gaps_json` TEXT NOT NULL,
    `recommendations_json` TEXT NOT NULL,
    `submitted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`session_id`) REFERENCES `assessment_sessions`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
    INDEX `idx_results_session` (`session_id`),
    INDEX `idx_results_student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
