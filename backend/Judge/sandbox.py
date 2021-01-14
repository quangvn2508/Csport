import epicbox
from Judge.SubmissionResult import SubmissionResult, Verdict

MAX_NUMBER_OF_TESTCASES = 20

limits = {
    'py': {'cputime': 2, 'memory': 128},
    'cpp': {'cputime': 1, 'memory': 128}
}

# Get all non-empty lines from string
def get_non_empty_lines(s: str):
    return [l.strip() for l in s.splitlines() if l.strip()]

# Compare 2 output (expected and actual)
def compare_output(expected_output: str, actual_output: str) -> bool:
    expected_lines = get_non_empty_lines(expected_output)
    actual_lines = get_non_empty_lines(actual_output)

    if len(expected_lines) != len(actual_lines):
        return False
    
    for l1, l2 in zip(expected_lines, actual_lines):
        if l1 != l2:
            return False
        
    return True

# Get stdin and expected output from testcase directory
def get_input_expected_output(testcase_dir: str, test_no: int):
    try:
        stdin = open(testcase_dir + 'input_' + str(test_no) + '.txt').read()
        expected = open(testcase_dir + 'output_' + str(test_no) + '.txt').read()
        return stdin, expected
    except FileNotFoundError:
        return None, None

# Process output from sandbox and set result for each test case
def process_output(test_no: int, output, expected: str, result: SubmissionResult):
    if output['exit_code'] != 0 and output['exit_code'] != None:
        result.add_testcase_verdict(test_no, False, Verdict.RUNTIME_ERROR, 0)
        result.add_log(output['stderr'].decode())
        return
    
    if output['timeout']:
        result.add_testcase_verdict(test_no, False, Verdict.TIME_LIMIT_EXCEED, 0)

    elif compare_output(expected, output['stdout'].decode()):
        result.add_testcase_verdict(test_no, True, Verdict.ACCEPT, output['duration'])

    else:
        result.add_testcase_verdict(test_no, False, Verdict.WRONG_ANSWER, output['duration'])
        
# Run python code
def python(code: str, testcase_dir: str) -> SubmissionResult:
    files = [{'name': 'main.py', 'content': code}]

    result = SubmissionResult()

    epicbox.configure(profiles=[epicbox.Profile('python', 'python:3.6.5-alpine')])

    test_no = 0
    while test_no < MAX_NUMBER_OF_TESTCASES:
        stdin, expected = get_input_expected_output(testcase_dir, test_no)

        if stdin == None or expected == None:
            break

        output = epicbox.run('python', 'python3 main.py', stdin=stdin, files=files, limits=limits['py'])

        process_output(test_no, output, expected, result)
        
        test_no += 1
    return result

# Run cpp code
def cpp(code: str, testcase_dir: str) -> SubmissionResult:
    files = [{'name': 'main.cpp', 'content': code}]

    result = SubmissionResult()

    PROFILES = {
        'gcc_compile': {
            'docker_image': 'stepik/epicbox-gcc:6.3.0',
            'user': 'root',
        },
        'gcc_run': {
            'docker_image': 'stepik/epicbox-gcc:6.3.0',
            # It's safer to run untrusted code as a non-root user (even in a container)
            'user': 'sandbox',
            'read_only': True,
            'network_disabled': True,
        }
    }

    epicbox.configure(profiles=PROFILES)

    test_no = 0
    with epicbox.working_directory() as workdir:
        compilation_output = epicbox.run('gcc_compile', 'g++ -std=c++14 -O2 -o main main.cpp', files=files, workdir=workdir)

        if compilation_output['exit_code'] != 0:
            result.add_testcase_verdict(test_no, False, Verdict.COMPILATION_ERROR, 0)
            result.add_log(compilation_output['stderr'])
            return result
        
        while test_no < MAX_NUMBER_OF_TESTCASES:
            stdin, expected = get_input_expected_output(testcase_dir, test_no)
            
            if stdin == None or expected == None:
                break

            output = epicbox.run('gcc_run', './main', stdin=stdin, limits=limits['cpp'], workdir=workdir)

            process_output(test_no, output, expected, result)

            test_no += 1

    return result

# Judge submission with corresponding language
def judge(code_path: str, testcase_dir: str, language: str) -> SubmissionResult:
    code = open(code_path, 'rb').read()
    
    if language == 'py':
        return python(code, testcase_dir)
    
    if language == 'cpp':
        return cpp(code, testcase_dir)
    
    return None