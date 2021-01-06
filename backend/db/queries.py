USER_CREATE_TABLE = """
    CREATE TABLE IF NOT EXISTS user (
        UserId INTEGER PRIMARY KEY AUTOINCREMENT,
        username varchar(255) NOT NULL,
        social_id varchar(255) NOT NULL
    )
"""

PROBLEM_CREATE_TABLE = """
    CREATE TABLE IF NOT EXISTS problem (
        ProblemId INTEGER PRIMARY KEY AUTOINCREMENT,
        UserId int NOT NULL,
        title varchar(255) NOT NULL,
        statement text NOT NULL,
        difficulty int DEFAULT 0 CHECK(difficulty >= 0 and difficulty <= 100),
        problem_point int DEFAULT 0,
        ranked BOOL DEFAULT 0,
        FOREIGN KEY (UserId) REFERENCES user (UserId)
    )
"""

SUBMISSION_CREATE_TABLE = """
    CREATE TABLE IF NOT EXISTS submission (
        SubmissionId INTEGER PRIMARY KEY AUTOINCREMENT,
        UserId int NOT NULL,
        ProblemId int NOT NULL,
        status BOOL DEFAULT 1,
        log text DEFAULT '',
        FOREIGN KEY (UserId) REFERENCES user (UserId),
        FOREIGN KEY (ProblemId) REFERENCES problem (ProblemId)
    )
"""

TESTCASE_VERDICT_CREATE_TABLE = """
    CREATE TABLE IF NOT EXISTS testcase_verdict (
        TestcaseId INTEGER PRIMARY KEY AUTOINCREMENT,
        SubmissionId int NOT NULL,
        test_no int NOT NULL,
        duration float NOT NULL,
        verdict VARCHAR(2) NOT NULL,
        FOREIGN KEY (SubmissionId) REFERENCES submission (SubmissionId)
    )
"""