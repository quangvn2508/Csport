def new_post_validation(title: str, statement: str, testcase_url: str) -> bool:
    return 6 <= len(title) <= 50 and 6 <= len(statement) <= 2000 and 