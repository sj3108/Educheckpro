import re
from tika import parser


def split_connected_words(text):
    # Split connected words based on capital letters
    text = re.sub(r"([a-z])([A-Z])", r"\1 \2", text)

    # Split connected words based on digits and letters
    text = re.sub(r"(\D)(\d)", r"\1 \2", text)
    text = re.sub(r"(\d)(\D)", r"\1 \2", text)

    # Split connected words based on non-alphanumeric characters
    text = re.sub(r"(\w)([^\w\s])", r"\1 \2", text)
    text = re.sub(r"([^\w\s])(\w)", r"\1 \2", text)

    # Replace multiple spaces with a single space
    text = re.sub(r"\s+", " ", text)

    # Strip leading and trailing whitespaces
    text = text.strip()

    return text


def extract_text_with_tika(file_path):
    raw_text = parser.from_file(file_path)
    text = raw_text["content"]
    return text.strip()


def extract(file, file_format, filePath):
    # print("AAAAAAa", filePath)
    tempFilePath = filePath.replace("\\", "\\\\")
    # print("BBBBBBBBB", tempFilePath)

    text = ""
    if file_format == "docx":
        text = extract_text_with_tika(tempFilePath)
        text = split_connected_words(text)
    if file_format == "pdf":
        text = extract_text_with_tika(tempFilePath)
        text = split_connected_words(text)
        # print("AAAAAAA")
        # pdf_reader = PyPDF2.PdfReader(file)
        # print("BBBBB", len(pdf_reader.pages))
        # for page_num in range(len(pdf_reader.pages)):
        #     page = pdf_reader.pages[page_num]
        #     print("CCCCCCC", page)
        #     text += page.extract_text() + "\n"
        #     print("DDDDDDDDDD", text)
        # text = " ".join(text.replace("\xa0", " ").strip().split())
    return text
