import json
from sqlalchemy.orm import Session
from app.models import Question

QUESTIONS_BANK = [
    # =========================================================================
    # 1. APTITUDE SECTION (10 Questions)
    # =========================================================================
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Work and Time Efficiency",
        "description": "A can complete a software module in 12 days, and B can complete the same module in 18 days. If they work together for 4 days, what fraction of the module remains unfinished?",
        "options_json": json.dumps(["4/9", "5/9", "1/3", "2/9"]),
        "correct_answer": "4/9",
        "skill_tag": "Quantitative Aptitude",
        "topic": "Time and Work",
        "difficulty": "Medium",
        "marks": 5
    },
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Relative Speed & Data Synchronization",
        "description": "Two data sync streams start from server X and server Y towards each other with speeds of 45 Mbps and 55 Mbps respectively. The total network link bandwidth distance is 300 megabits. When do they meet?",
        "options_json": json.dumps(["3.0 seconds", "2.5 seconds", "3.5 seconds", "4.0 seconds"]),
        "correct_answer": "3.0 seconds",
        "skill_tag": "Logical Reasoning",
        "topic": "Speed & Distance",
        "difficulty": "Easy",
        "marks": 5
    },
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Probability & Server Redundancy",
        "description": "An availability cluster has 3 independent nodes, each with a 90% (0.9) probability of functioning normally. What is the probability that at least one node is operational?",
        "options_json": json.dumps(["0.999", "0.970", "0.810", "0.729"]),
        "correct_answer": "0.999",
        "skill_tag": "Quantitative Aptitude",
        "topic": "Probability",
        "difficulty": "Medium",
        "marks": 5
    },
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Logical Deductions & Syllogism",
        "description": "Statements: \n1. All Microservices are Stateless. \n2. Some Stateless systems are Fault-Tolerant.\nConclusions: \nI. Some Microservices are Fault-Tolerant.\nII. Some Fault-Tolerant systems are Stateless.",
        "options_json": json.dumps(["Only Conclusion II follows", "Only Conclusion I follows", "Both I and II follow", "Neither follows"]),
        "correct_answer": "Only Conclusion II follows",
        "skill_tag": "Logical Reasoning",
        "topic": "Syllogism",
        "difficulty": "Medium",
        "marks": 5
    },
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Sequence & Pattern Recognition",
        "description": "Identify the next number in the algorithmic progression: 2, 6, 12, 20, 30, 42, ?",
        "options_json": json.dumps(["56", "54", "60", "52"]),
        "correct_answer": "56",
        "skill_tag": "Problem Solving",
        "topic": "Number Series",
        "difficulty": "Easy",
        "marks": 5
    },
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Permutations in Load Balancer Routing",
        "description": "In how many distinct ways can a load balancer distribute 4 unique incoming tasks across 4 worker threads such that each thread receives exactly 1 task?",
        "options_json": json.dumps(["24", "16", "12", "64"]),
        "correct_answer": "24",
        "skill_tag": "Quantitative Aptitude",
        "topic": "Combinatorics",
        "difficulty": "Easy",
        "marks": 5
    },
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Data Interpretation & Latency Ratios",
        "description": "Service A takes 150ms and Service B takes 225ms. By what percentage is Service A faster in latency than Service B?",
        "options_json": json.dumps(["33.33%", "50%", "25%", "66.66%"]),
        "correct_answer": "33.33%",
        "skill_tag": "Data Interpretation",
        "topic": "Percentages & Ratios",
        "difficulty": "Medium",
        "marks": 5
    },
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Clock Angles in Event Schedulers",
        "description": "At what exact angle (in degrees) are the minute and hour hands situated at 3:30?",
        "options_json": json.dumps(["75°", "90°", "85°", "70°"]),
        "correct_answer": "75°",
        "skill_tag": "Logical Reasoning",
        "topic": "Analytical Puzzles",
        "difficulty": "Medium",
        "marks": 5
    },
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Venn Diagram Set Optimization",
        "description": "In a department of 100 engineers, 65 know Python, 45 know Java, and 20 know both. How many engineers know neither Python nor Java?",
        "options_json": json.dumps(["10", "15", "20", "5"]),
        "correct_answer": "10",
        "skill_tag": "Problem Solving",
        "topic": "Set Theory",
        "difficulty": "Easy",
        "marks": 5
    },
    {
        "section": "aptitude",
        "domain": "common",
        "title": "Graph Traversal Logic",
        "description": "In an unweighted graph with 6 vertices, what is the maximum number of edges the graph can have without containing any cycles?",
        "options_json": json.dumps(["5", "6", "15", "7"]),
        "correct_answer": "5",
        "skill_tag": "Problem Solving",
        "topic": "Tree & Graph Logic",
        "difficulty": "Medium",
        "marks": 5
    },

    # =========================================================================
    # 2. PROGRAMMING SECTION (5 Questions)
    # =========================================================================
    {
        "section": "programming",
        "domain": "common",
        "title": "Find Second Largest Element in an Array (Without Sorting)",
        "description": "Given an array of integers `nums`, find and print the second largest distinct element. If no second largest element exists, print `-1`.\n\nConstraint: Do NOT sort the array.\nInput format: Space-separated integers from stdin (e.g. `12 35 1 10 34 1`)\nOutput format: The single integer.",
        "code_template": "# Read input and print the second largest distinct element\nimport sys\n\ndef find_second_largest():\n    input_data = sys.stdin.read().strip()\n    if not input_data:\n        return\n    nums = list(map(int, input_data.split()))\n    \n    # Write your solution here without sorting\n    \n    \nif __name__ == '__main__':\n    find_second_largest()\n",
        "test_cases_json": json.dumps([
            {"input": "12 35 1 10 34 1", "expected": "34", "hidden": False},
            {"input": "10 10 10", "expected": "-1", "hidden": False},
            {"input": "5 1 8 9 2", "expected": "8", "hidden": True},
            {"input": "100 200", "expected": "100", "hidden": True}
        ]),
        "skill_tag": "Problem Solving",
        "topic": "Arrays & Pointers",
        "difficulty": "Medium",
        "marks": 15
    },
    {
        "section": "programming",
        "domain": "common",
        "title": "First Non-Repeating Character in a Stream",
        "description": "Given a string `s`, find and print the first non-repeating character. If all characters repeat, print `$`.\n\nInput format: A single string from stdin.\nOutput format: The character or `$`.",
        "code_template": "import sys\n\ndef first_non_repeating():\n    s = sys.stdin.read().strip()\n    if not s:\n        print(\"$\")\n        return\n    \n    # Implement frequency mapping\n    \n\nif __name__ == '__main__':\n    first_non_repeating()\n",
        "test_cases_json": json.dumps([
            {"input": "swiss", "expected": "w", "hidden": False},
            {"input": "aabbcc", "expected": "$", "hidden": False},
            {"input": "developer", "expected": "d", "hidden": True}
        ]),
        "skill_tag": "Data Structures",
        "topic": "Hash Maps & Strings",
        "difficulty": "Easy",
        "marks": 15
    },
    {
        "section": "programming",
        "domain": "common",
        "title": "Valid Parentheses Checker with Multiple Bracket Types",
        "description": "Given a string containing `()`, `[]`, `{}` characters, determine if the input string is valid. Print `True` or `False`.\n\nInput format: String of brackets from stdin.\nOutput format: `True` or `False`",
        "code_template": "import sys\n\ndef is_valid_brackets():\n    s = sys.stdin.read().strip()\n    # Use a stack to validate matching pairs\n    \n    \nif __name__ == '__main__':\n    is_valid_brackets()\n",
        "test_cases_json": json.dumps([
            {"input": "()[]{}", "expected": "True", "hidden": False},
            {"input": "([)]", "expected": "False", "hidden": False},
            {"input": "{[]}", "expected": "True", "hidden": True}
        ]),
        "skill_tag": "Data Structures",
        "topic": "Stack",
        "difficulty": "Easy",
        "marks": 15
    },
    {
        "section": "programming",
        "domain": "common",
        "title": "Longest Substring Without Repeating Characters",
        "description": "Given a string `s`, find the length of the longest substring without repeating characters.\n\nInput format: String from stdin.\nOutput format: Integer length.",
        "code_template": "import sys\n\ndef length_of_longest_substring():\n    s = sys.stdin.read().strip()\n    # Implement sliding window algorithm\n    \n\nif __name__ == '__main__':\n    length_of_longest_substring()\n",
        "test_cases_json": json.dumps([
            {"input": "abcabcbb", "expected": "3", "hidden": False},
            {"input": "bbbbb", "expected": "1", "hidden": False},
            {"input": "pwwkew", "expected": "3", "hidden": True}
        ]),
        "skill_tag": "Algorithms",
        "topic": "Sliding Window",
        "difficulty": "Hard",
        "marks": 20
    },
    {
        "section": "programming",
        "domain": "common",
        "title": "Merge Intervals for Cloud Resource Scheduling",
        "description": "Given a collection of intervals represented as space-separated start-end pairs on each line or format: `1 3, 2 6, 8 10, 15 18`, merge all overlapping intervals and print merged intervals in format `1 6, 8 10, 15 18`.",
        "code_template": "import sys\n\ndef merge_intervals():\n    data = sys.stdin.read().strip()\n    if not data:\n        return\n    # Parse pairs, sort by start time, and merge overlapping spans\n    \n\nif __name__ == '__main__':\n    merge_intervals()\n",
        "test_cases_json": json.dumps([
            {"input": "1 3, 2 6, 8 10, 15 18", "expected": "1 6, 8 10, 15 18", "hidden": False},
            {"input": "1 4, 4 5", "expected": "1 5", "hidden": False}
        ]),
        "skill_tag": "Algorithms",
        "topic": "Interval Merging",
        "difficulty": "Hard",
        "marks": 20
    },

    # =========================================================================
    # 3. DEBUGGING SECTION (5 Questions)
    # =========================================================================
    {
        "section": "debugging",
        "domain": "common",
        "title": "Fix Off-by-One and Integer Overflow in Binary Search",
        "description": "The following code is supposed to return the 0-based index of `target` in sorted array `arr`, or `-1` if not found. It currently gets stuck in an infinite loop or throws index out of bounds. Identify and fix the bug.",
        "faulty_code": "def binary_search(arr, target):\n    left = 0\n    right = len(arr) # BUG: Should be len(arr) - 1 or correct bound\n    while left <= right:\n        mid = (left + right) // 2\n        if mid >= len(arr):\n            break\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid # BUG: Causes infinite loop when left == mid\n        else:\n            right = mid - 1\n    return -1\n\nimport sys\ndata = sys.stdin.read().split()\narr = list(map(int, data[:-1]))\ntarget = int(data[-1])\nprint(binary_search(arr, target))\n",
        "code_template": "def binary_search(arr, target):\n    left = 0\n    right = len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nimport sys\ndata = sys.stdin.read().split()\nif data:\n    arr = list(map(int, data[:-1]))\n    target = int(data[-1])\n    print(binary_search(arr, target))\n",
        "test_cases_json": json.dumps([
            {"input": "1 3 5 7 9 11 7", "expected": "3", "hidden": False},
            {"input": "2 4 6 8 10 5", "expected": "-1", "hidden": False},
            {"input": "10 20 30 10", "expected": "0", "hidden": True}
        ]),
        "skill_tag": "Debugging",
        "topic": "Binary Search",
        "difficulty": "Medium",
        "marks": 10
    },
    {
        "section": "debugging",
        "domain": "common",
        "title": "Fix Runtime Mutation & Key Error in Frequency Map",
        "description": "The function `get_highest_frequency_word` crashes with `RuntimeError: dictionary changed size during iteration` when removing stop words. Fix the code so it safely filters words and returns the highest frequency word.",
        "faulty_code": "def get_highest_freq(text):\n    words = text.split()\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    \n    # Buggy deletion during iteration:\n    for w in counts:\n        if len(w) <= 2:\n            del counts[w]\n            \n    if not counts:\n        return \"none\"\n    return max(counts, key=counts.get)\n\nimport sys\ntext = sys.stdin.read().strip()\nprint(get_highest_freq(text))\n",
        "code_template": "def get_highest_freq(text):\n    words = text.split()\n    counts = {}\n    for w in words:\n        if len(w) > 2:\n            counts[w] = counts.get(w, 0) + 1\n            \n    if not counts:\n        return \"none\"\n    return max(counts, key=counts.get)\n\nimport sys\ntext = sys.stdin.read().strip()\nif text:\n    print(get_highest_freq(text))\n",
        "test_cases_json": json.dumps([
            {"input": "the apple is on the apple tree and the apple", "expected": "apple", "hidden": False},
            {"input": "to be or not to be", "expected": "not", "hidden": False}
        ]),
        "skill_tag": "Debugging",
        "topic": "Dictionary Mutation & Memory Safety",
        "difficulty": "Medium",
        "marks": 10
    },
    {
        "section": "debugging",
        "domain": "common",
        "title": "Fix Case Insensitive & Non-Alphanumeric Palindrome Bug",
        "description": "The function `is_valid_palindrome` should check if a string is a palindrome ignoring non-alphanumeric characters and casing. The current implementation fails for strings containing spaces and punctuation.",
        "faulty_code": "def is_palindrome(s):\n    # BUG: Doesn't clean or handle casing correctly\n    left = 0\n    right = len(s) - 1\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    return True\n\nimport sys\ns = sys.stdin.read().strip()\nprint(is_palindrome(s))\n",
        "code_template": "def is_palindrome(s):\n    filtered = [c.lower() for c in s if c.isalnum()]\n    return filtered == filtered[::-1]\n\nimport sys\ns = sys.stdin.read().strip()\nprint(is_palindrome(s))\n",
        "test_cases_json": json.dumps([
            {"input": "A man, a plan, a canal: Panama", "expected": "True", "hidden": False},
            {"input": "race a car", "expected": "False", "hidden": False}
        ]),
        "skill_tag": "Debugging",
        "topic": "String Processing",
        "difficulty": "Easy",
        "marks": 10
    },
    {
        "section": "debugging",
        "domain": "common",
        "title": "Fix Broken Two-Sum Pointer Bounds",
        "description": "The function `two_sum_sorted` takes a sorted array and target, returning 1-based indices of the two numbers that add up to target. The pointer increment/decrement logic is inverted causing incorrect indices or index errors.",
        "faulty_code": "def two_sum(arr, target):\n    l, r = 0, len(arr) - 1\n    while l < r:\n        s = arr[l] + arr[r]\n        if s == target:\n            return f\"{l+1} {r+1}\"\n        elif s < target:\n            r -= 1 # BUG: inverted logic\n        else:\n            l += 1 # BUG: inverted logic\n    return \"-1\"\n\nimport sys\nd = sys.stdin.read().split()\narr = list(map(int, d[:-1]))\ntgt = int(d[-1])\nprint(two_sum(arr, tgt))\n",
        "code_template": "def two_sum(arr, target):\n    l, r = 0, len(arr) - 1\n    while l < r:\n        s = arr[l] + arr[r]\n        if s == target:\n            return f\"{l+1} {r+1}\"\n        elif s < target:\n            l += 1\n        else:\n            r -= 1\n    return \"-1\"\n\nimport sys\nd = sys.stdin.read().split()\nif d:\n    arr = list(map(int, d[:-1]))\n    tgt = int(d[-1])\n    print(two_sum(arr, tgt))\n",
        "test_cases_json": json.dumps([
            {"input": "2 7 11 15 9", "expected": "1 2", "hidden": False},
            {"input": "1 2 3 4 4 9 8", "expected": "4 5", "hidden": False}
        ]),
        "skill_tag": "Debugging",
        "topic": "Two Pointers Logic",
        "difficulty": "Easy",
        "marks": 10
    },
    {
        "section": "debugging",
        "domain": "common",
        "title": "Fix Memory Overflow / Recursion Depth in Fibonacci Calculator",
        "description": "A recursive Fibonacci function causes a `RecursionError` for $N > 35$. Rewrite it using iterative DP or memoization to handle values up to $N = 1000$ in $O(N)$ time.",
        "faulty_code": "def fib(n):\n    # BUG: Naive recursion takes O(2^N) and exceeds recursion stack\n    if n <= 0: return 0\n    if n == 1: return 1\n    return fib(n - 1) + fib(n - 2)\n\nimport sys\nn = int(sys.stdin.read().strip())\nprint(fib(n))\n",
        "code_template": "def fib(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nimport sys\ninp = sys.stdin.read().strip()\nif inp:\n    n = int(inp)\n    print(fib(n))\n",
        "test_cases_json": json.dumps([
            {"input": "10", "expected": "55", "hidden": False},
            {"input": "40", "expected": "102334155", "hidden": False}
        ]),
        "skill_tag": "Debugging",
        "topic": "Dynamic Programming & Stack Safety",
        "difficulty": "Medium",
        "marks": 10
    },

    # =========================================================================
    # 4. TECHNICAL MCQ SECTION (Domain Specific: Python, Java, JS, SQL, DSA)
    # =========================================================================
    # PYTHON DOMAIN
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Python Global Interpreter Lock (GIL) Impact",
        "description": "How does the Python Global Interpreter Lock (GIL) affect multi-threaded CPU-bound programs in CPython?",
        "options_json": json.dumps([
            "It prevents multiple native threads from executing Python bytecodes concurrently on multiple CPU cores.",
            "It automatically accelerates multi-core processing by batching thread execution.",
            "It disables I/O-bound asynchronous event loops.",
            "It restricts memory usage to a single 4GB address space."
        ]),
        "correct_answer": "It prevents multiple native threads from executing Python bytecodes concurrently on multiple CPU cores.",
        "skill_tag": "Python",
        "topic": "Concurrency & Memory",
        "difficulty": "Hard",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Mutable Default Arguments in Function Definitions",
        "description": "What happens in Python when a function defined as `def append_to(item, target=[])` is called multiple times without passing `target`?",
        "options_json": json.dumps([
            "The same default list instance created at function definition time is mutated and shared across calls.",
            "A fresh empty list is instantiated on every invocation.",
            "Python raises a `UnboundLocalError` on the second call.",
            "The list is garbage collected immediately after each call returns."
        ]),
        "correct_answer": "The same default list instance created at function definition time is mutated and shared across calls.",
        "skill_tag": "Python",
        "topic": "Core Fundamentals",
        "difficulty": "Medium",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Generators & Memory Efficiency",
        "description": "Why does a generator comprehension `(x*x for x in range(10**7))` consume negligible memory compared to a list comprehension `[x*x for x in range(10**7)]`?",
        "options_json": json.dumps([
            "Generators compute values lazily on demand using the iterator protocol without storing the entire sequence in RAM.",
            "Generators compress numbers in memory using LZMA compression.",
            "Generators delegate storage to the operating system swap disk.",
            "Generators compile the range into a hardware C struct."
        ]),
        "correct_answer": "Generators compute values lazily on demand using the iterator protocol without storing the entire sequence in RAM.",
        "skill_tag": "Python",
        "topic": "Generators & Iterators",
        "difficulty": "Medium",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Dunder Methods and Context Managers",
        "description": "Which pair of magic/dunder methods must a Python class implement to be compatible with the `with` statement?",
        "options_json": json.dumps([
            "__enter__ and __exit__",
            "__open__ and __close__",
            "__start__ and __finish__",
            "__init__ and __del__"
        ]),
        "correct_answer": "__enter__ and __exit__",
        "skill_tag": "Python",
        "topic": "Context Managers",
        "difficulty": "Easy",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Identity vs Equality Operators",
        "description": "What is the key difference between the `is` keyword and the `==` operator in Python?",
        "options_json": json.dumps([
            "`is` checks for identical memory object identity (address), whereas `==` checks for value equality.",
            "`is` compares values while `==` compares data types.",
            "`is` is used only for strings and `==` only for numeric types.",
            "`is` performs a deep structural comparison while `==` performs a shallow comparison."
        ]),
        "correct_answer": "`is` checks for identical memory object identity (address), whereas `==` checks for value equality.",
        "skill_tag": "Python",
        "topic": "Object Model",
        "difficulty": "Easy",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Decorator Mechanics",
        "description": "In Python, what is the underlying behavior of `@my_decorator` placed above `def foo(): pass`?",
        "options_json": json.dumps([
            "It evaluates `foo = my_decorator(foo)` at function definition time.",
            "It intercepts bytecode execution whenever `foo()` is invoked at runtime.",
            "It creates a multithreaded wrapper daemon around `foo`.",
            "It converts `foo` into a static C extension method."
        ]),
        "correct_answer": "It evaluates `foo = my_decorator(foo)` at function definition time.",
        "skill_tag": "Python",
        "topic": "Functional Programming",
        "difficulty": "Hard",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Metaclasses in Python",
        "description": "What is the primary role of a metaclass in Python?",
        "options_json": json.dumps([
            "A metaclass is a class whose instances are classes, allowing customization of class creation and validation.",
            "A metaclass is an abstract base class that cannot have methods.",
            "A metaclass manages garbage collection cycles for cyclic references.",
            "A metaclass is used only for serializing objects to JSON format."
        ]),
        "correct_answer": "A metaclass is a class whose instances are classes, allowing customization of class creation and validation.",
        "skill_tag": "Python",
        "topic": "Advanced OOP",
        "difficulty": "Hard",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Unpacking with * and **",
        "description": "What does `func(*args, **kwargs)` allow a function to accept?",
        "options_json": json.dumps([
            "An arbitrary number of positional arguments as a tuple and keyword arguments as a dictionary.",
            "Only pointer references to heap allocated variables.",
            "Fixed length arrays and hash maps exclusively.",
            "Arguments evaluated inside a separate background thread."
        ]),
        "correct_answer": "An arbitrary number of positional arguments as a tuple and keyword arguments as a dictionary.",
        "skill_tag": "Python",
        "topic": "Function Parameters",
        "difficulty": "Easy",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Garbage Collection & Cyclic References",
        "description": "How does CPython reclaim memory for circular reference objects where reference counting alone fails?",
        "options_json": json.dumps([
            "A generational cyclic garbage collector periodically runs and detects unreachable reference cycles.",
            "It never frees circular references, leading to unavoidable leaks.",
            "The OS kernel forcibly frees circular references every 60 seconds.",
            "All circular objects are automatically converted to weakref references."
        ]),
        "correct_answer": "A generational cyclic garbage collector periodically runs and detects unreachable reference cycles.",
        "skill_tag": "Python",
        "topic": "Memory Management",
        "difficulty": "Hard",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Python",
        "title": "Asyncio Event Loop Model",
        "description": "In Python's `asyncio` framework, what causes an asynchronous coroutine to yield execution control back to the event loop?",
        "options_json": json.dumps([
            "An `await` expression on an awaitable object or non-blocking I/O operation.",
            "A standard `time.sleep()` call.",
            "A hardware timer interrupt generated by the CPU.",
            "Any function returning a standard tuple."
        ]),
        "correct_answer": "An `await` expression on an awaitable object or non-blocking I/O operation.",
        "skill_tag": "Python",
        "topic": "Asynchronous Programming",
        "difficulty": "Medium",
        "marks": 5
    },

    # JAVA DOMAIN
    {
        "section": "technical_mcq",
        "domain": "Java",
        "title": "Java Memory Model: String Pool & Reference Equality",
        "description": "Why does `String s1 = \"hello\"; String s2 = new String(\"hello\"); s1 == s2` evaluate to `false` in Java?",
        "options_json": json.dumps([
            "`s1` points to the String Constant Pool in Heap, while `s2` creates an explicit new object reference on Heap.",
            "The characters inside `s2` are encoded in UTF-16 while `s1` is UTF-8.",
            "`==` is overloaded in Java to compare object hash codes only.",
            "`s2` is stored in the Stack memory frame while `s1` is in CPU registers."
        ]),
        "correct_answer": "`s1` points to the String Constant Pool in Heap, while `s2` creates an explicit new object reference on Heap.",
        "skill_tag": "Java",
        "topic": "JVM Memory & Strings",
        "difficulty": "Medium",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Java",
        "title": "Volatile Keyword in Multithreaded Java",
        "description": "What guarantee does the `volatile` keyword provide when applied to a variable in Java?",
        "options_json": json.dumps([
            "It guarantees visibility of changes across threads by reading/writing directly to main memory and prevents instruction reordering.",
            "It provides mutual exclusion like a synchronized block.",
            "It makes compound operations like `count++` completely atomic.",
            "It prevents the variable from being garbage collected."
        ]),
        "correct_answer": "It guarantees visibility of changes across threads by reading/writing directly to main memory and prevents instruction reordering.",
        "skill_tag": "Java",
        "topic": "Concurrency & Memory",
        "difficulty": "Hard",
        "marks": 5
    },
    {
        "section": "technical_mcq",
        "domain": "Java",
        "title": "Type Erasure in Java Generics",
        "description": "What happens to generic type parameters like `List<String>` after compilation by javac?",
        "options_json": json.dumps([
            "Type information is erased at compile-time and replaced with `Object` (or bound), inserting casts where necessary.",
            "The JVM creates separate specialized bytecode classes for each type instantiation.",
            "Type parameters are preserved as reflection metadata only in debug builds.",
            "Generic collections are converted into primitive array pointers."
        ]),
        "correct_answer": "Type information is erased at compile-time and replaced with `Object` (or bound), inserting casts where necessary.",
        "skill_tag": "Java",
        "topic": "Generics & Bytecode",
        "difficulty": "Hard",
        "marks": 5
    },

    # JAVASCRIPT DOMAIN
    {
        "section": "technical_mcq",
        "domain": "JavaScript",
        "title": "JavaScript Event Loop: Microtasks vs Macrotasks",
        "description": "Given a `Promise.resolve().then(...)` and a `setTimeout(..., 0)`, which queue takes precedence when the call stack clears?",
        "options_json": json.dumps([
            "Microtask Queue (Promises) executes completely before the Event Loop processes the next Macrotask (setTimeout).",
            "Macrotask queue has strict priority over Microtasks.",
            "They execute alternately in round-robin fashion.",
            "Both execute in parallel using web worker background threads."
        ]),
        "correct_answer": "Microtask Queue (Promises) executes completely before the Event Loop processes the next Macrotask (setTimeout).",
        "skill_tag": "JavaScript",
        "topic": "Event Loop & Asynchrony",
        "difficulty": "Hard",
        "marks": 5
    },

    # SQL DOMAIN
    {
        "section": "technical_mcq",
        "domain": "SQL",
        "title": "ACID Transaction Isolation & Phantom Reads",
        "description": "Which SQL transaction isolation level prevents Dirty Reads, Non-Repeatable Reads, AND Phantom Reads?",
        "options_json": json.dumps([
            "SERIALIZABLE",
            "REPEATABLE READ",
            "READ COMMITTED",
            "READ UNCOMMITTED"
        ]),
        "correct_answer": "SERIALIZABLE",
        "skill_tag": "SQL",
        "topic": "ACID & Transactions",
        "difficulty": "Medium",
        "marks": 5
    },

    # DATA STRUCTURES DOMAIN
    {
        "section": "technical_mcq",
        "domain": "Data Structures",
        "title": "Amortized Time Complexity of Dynamic Array Resizing",
        "description": "What is the amortized time complexity of an `append()` operation in a dynamic array (like Python list or Java ArrayList) that doubles capacity when full?",
        "options_json": json.dumps([
            "O(1)",
            "O(N)",
            "O(log N)",
            "O(N log N)"
        ]),
        "correct_answer": "O(1)",
        "skill_tag": "Data Structures",
        "topic": "Array Dynamics & Complexity",
        "difficulty": "Medium",
        "marks": 5
    },

    # =========================================================================
    # 5. OUTPUT PREDICTION SECTION (5 Questions)
    # =========================================================================
    {
        "section": "output_prediction",
        "domain": "common",
        "title": "Predict Output: Mutable Default Arguments Accumulation",
        "description": "What is printed when this Python script executes?\n\n```python\ndef add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\nprint(add_item('apple'))\nprint(add_item('banana'))\n```",
        "options_json": json.dumps([
            "['apple'] then ['apple', 'banana']",
            "['apple'] then ['banana']",
            "['apple'] then ['banana', 'apple']",
            "Raises ValueError on second call"
        ]),
        "correct_answer": "['apple'] then ['apple', 'banana']",
        "skill_tag": "Code Reasoning",
        "topic": "Python Execution Model",
        "difficulty": "Medium",
        "marks": 10
    },
    {
        "section": "output_prediction",
        "domain": "common",
        "title": "Predict Output: Closure Variable Binding in Loops",
        "description": "What is the logged output of this JavaScript snippet?\n\n```javascript\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n```",
        "options_json": json.dumps([
            "3 3 3",
            "0 1 2",
            "undefined undefined undefined",
            "0 0 0"
        ]),
        "correct_answer": "3 3 3",
        "skill_tag": "Code Reasoning",
        "topic": "Scope & Hoisting",
        "difficulty": "Medium",
        "marks": 10
    },
    {
        "section": "output_prediction",
        "domain": "common",
        "title": "Predict Output: Tuple In-Place Modification Traps",
        "description": "What happens when executing the following Python code?\n\n```python\nt = (1, 2, [30, 40])\ntry:\n    t[2] += [50]\nexcept Exception as e:\n    pass\nprint(t)\n```",
        "options_json": json.dumps([
            "(1, 2, [30, 40, 50])",
            "(1, 2, [30, 40])",
            "TypeError without modifying the list",
            "RecursionError"
        ]),
        "correct_answer": "(1, 2, [30, 40, 50])",
        "skill_tag": "Code Reasoning",
        "topic": "Immutability & Bytecode",
        "difficulty": "Hard",
        "marks": 10
    },
    {
        "section": "output_prediction",
        "domain": "common",
        "title": "Predict Output: Boolean Logic & Short-Circuit Evaluation",
        "description": "What will be printed by the following expression in Python?\n\n```python\nresult = [] or {} or [0] or False or \"Done\"\nprint(result)\n```",
        "options_json": json.dumps([
            "[0]",
            "\"Done\"",
            "False",
            "[]"
        ]),
        "correct_answer": "[0]",
        "skill_tag": "Code Reasoning",
        "topic": "Truthiness & Short-Circuit",
        "difficulty": "Easy",
        "marks": 10
    },
    {
        "section": "output_prediction",
        "domain": "common",
        "title": "Predict Output: Object Reference Mutation in Function Scope",
        "description": "What is printed by this Python code?\n\n```python\ndef modify(a, b):\n    a = a + [1]\n    b.append(1)\n\nx = [10]\ny = [10]\nmodify(x, y)\nprint(x, y)\n```",
        "options_json": json.dumps([
            "[10] [10, 1]",
            "[10, 1] [10, 1]",
            "[10] [10]",
            "[10, 1] [10]"
        ]),
        "correct_answer": "[10] [10, 1]",
        "skill_tag": "Code Reasoning",
        "topic": "Pass-by-Object-Reference",
        "difficulty": "Medium",
        "marks": 10
    },

    # =========================================================================
    # 6. SHORT ANSWER / CONCEPT SECTION (4 Questions)
    # =========================================================================
    {
        "section": "short_answer",
        "domain": "common",
        "title": "Deduplication in High-Throughput Streaming Systems",
        "description": "A high-frequency payment system receives millions of webhook transactions per minute with occasional duplicates. Describe an efficient architectural approach (mentioning data structures like Bloom Filters, Redis TTL keys, or idempotency tokens) to detect and drop duplicate events in near real-time without overwhelming database disk I/O.",
        "correct_answer": "idempotency token redis bloom filter ttl distributed lock database index",
        "skill_tag": "System Design",
        "topic": "Streaming & Deduplication",
        "difficulty": "Hard",
        "marks": 15
    },
    {
        "section": "short_answer",
        "domain": "common",
        "title": "Connection Pooling vs Thread Exhaustion",
        "description": "Explain how an asynchronous Database Connection Pool (e.g. HikariCP or SQLAlchemy Pool) prevents cascading server crashes during sudden traffic spikes compared to creating a new TCP connection per HTTP request.",
        "correct_answer": "connection pool tcp handshake overhead thread exhaustion max connections queue latency resource limits",
        "skill_tag": "Database Engineering",
        "topic": "Connection Management",
        "difficulty": "Medium",
        "marks": 15
    },
    {
        "section": "short_answer",
        "domain": "common",
        "title": "Optimistic vs Pessimistic Concurrency Control",
        "description": "Compare Optimistic Concurrency Control (e.g., using version numbers/ETags) with Pessimistic Locking (`SELECT FOR UPDATE`). Identify a concrete industry scenario where Optimistic locking is strictly superior to Pessimistic locking.",
        "correct_answer": "optimistic concurrency version number row lock high contention read heavy low collision e-commerce inventory update",
        "skill_tag": "Database Engineering",
        "topic": "Concurrency Control",
        "difficulty": "Hard",
        "marks": 15
    },
    {
        "section": "short_answer",
        "domain": "common",
        "title": "Cache Invalidation Strategies: Cache-Aside vs Write-Through",
        "description": "Explain the architectural trade-offs between the Cache-Aside (Lazy Loading) pattern and Write-Through caching with respect to read latency, cache staleness, and write throughput.",
        "correct_answer": "cache aside write through cache invalidation consistency read latency cache miss write overhead stale data",
        "skill_tag": "System Design",
        "topic": "Distributed Caching",
        "difficulty": "Medium",
        "marks": 15
    }
]

def seed_question_bank(db: Session):
    count = db.query(Question).count()
    if count == 0:
        for q_data in QUESTIONS_BANK:
            q = Question(**q_data)
            db.add(q)
        db.commit()
        print(f"Successfully seeded {len(QUESTIONS_BANK)} questions into the Question Bank.")
    else:
        print(f"Question Bank already contains {count} questions.")
