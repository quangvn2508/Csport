def len_valid(s: str, l: int, r: int) -> bool:
    return l <= len(s) <= r

def new_post_validation(title: str, statement: str, testcase_url: str) -> bool:
    return len_valid(title, 6, 50) and len_valid(statement, 6, 4000) and len_valid(testcase_url, 1, 100) and testcase_url.count('/') > 0

def new_submission_validation(language: str):
    return language == 'cpp' or language == 'py'