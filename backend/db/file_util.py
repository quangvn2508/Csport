import uuid
import os
import zipfile

UPLOAD_FOLDER = 'uploads/'
TESTCASE_FOLDER = 'testcases/'
ALLOWED_EXTENSIONS = {'txt', 'png', 'jpg', 'jpeg', 'gif', 'cpp', 'py', 'zip'}

def file_url_to_file_path(file_url: str):
    """
        Get file local location using file url location
    """
    return UPLOAD_FOLDER + file_url.rsplit('/',1)[1]

def problem_testcase_directory(problem_id: int) -> str:
    """
        return testcase directory corresponding to problem id
    """
    return TESTCASE_FOLDER + 'problem_' + str(problem_id) + '/'

def file_extension_from_name(filename: str) -> str:
    """
        Get file extension from file name
    """
    # Check if file name contain '.' character
    if not '.' in filename:
        return None

    return filename.rsplit('.', 1)[1].lower()

def upload_file(file) -> str:
    """
        Save file to local directory and return the global url for file
    """
    # Get file extension
    fileExtension = file_extension_from_name(file.filename)

    if not fileExtension in ALLOWED_EXTENSIONS:
        raise Exception('File type not allowed')

    # Create new unique name for file
    filename = str(uuid.uuid4()) + '.' + fileExtension

    file.save(UPLOAD_FOLDER + filename)

    # Return static url
    return '/api/uploads/' + filename

def extract_testcase(zip_url: str, problem_id: int):
    """
        Unzip zip file provided by zip_url
    """
    path_to_zip_file = file_url_to_file_path(zip_url)
    directory_to_extract_to = problem_testcase_directory(problem_id)
    
    os.mkdir(directory_to_extract_to)

    with zipfile.ZipFile(path_to_zip_file, 'r') as zip_ref:
        zip_ref.extractall(directory_to_extract_to)
