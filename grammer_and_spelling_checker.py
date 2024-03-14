from flask import Flask, request, jsonify
from flask_cors import CORS
import textract
import language_tool_python
from spellchecker import SpellChecker
import PyPDF2

import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from nltk.tokenize import RegexpTokenizer
import heapq

# from summary import generate_summary

# nltk.download("punkt")
# nltk.download("stopwords")


app = Flask(__name__)
CORS(app)

grammer_tool = language_tool_python.LanguageTool("en-US")
spell = SpellChecker()
ALLOWED_EXTENSIONS = [".pdf", ".docx"]
file_format = ""


def generate_summary(text, num_sentences=3):
    # Remove newline characters from the input text
    text = text.replace("\n", "")
    text = text.replace("\u201c", "")
    text = text.replace("\u201d", "")

    # Tokenize the text into sentences
    sentences = sent_tokenize(text)

    # Tokenize the text into words
    words = word_tokenize(text)

    # Filter out stopwords
    stop_words = set(stopwords.words("english"))
    words = [
        word.lower()
        for word in words
        if word.isalnum() and word.lower() not in stop_words
    ]

    # Calculate word frequency
    word_freq = FreqDist(words)

    # Calculate weighted frequency of each sentence
    ranking = {}
    for i, sentence in enumerate(sentences):
        for word in word_tokenize(sentence.lower()):
            if word in word_freq:
                if i in ranking:
                    ranking[i] += word_freq[word]
                else:
                    ranking[i] = word_freq[word]

    # Get top sentences based on ranking
    top_sentences = heapq.nlargest(num_sentences, ranking, key=ranking.get)

    # Reconstruct summary
    summary = " ".join([sentences[i] for i in sorted(top_sentences)])

    return summary


def check_grammar_and_spelling(sample_text):
    grammer_mistake = grammer_tool.check(sample_text)
    # foundmistakes = []
    # for error in grammer_mistake["corrections"]:
    #     foundmistakes.append(error["text"])
    # foundmistakes_count = len(foundmistakes)
    # print("cccccccccccccc", foundmistakes_count)
    # print(grammer_mistake)
    return len(grammer_mistake)


def extract(file, file_format):
    text = ""
    if file_format == "docx":
        text = textract.process(file)
    if file_format == "pdf":
        pdf_reader = PyPDF2.PdfReader(file)
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    return text


@app.route("/upload", methods=["POST"])
def moduleApi():
    if "file" not in request.files:
        return "No file part"
    file = request.files["file"]
    if file.filename == "":
        return "No image selected for uploading"

    file_format = "." in file.filename and file.filename.rsplit(".", 1)[1].lower()
    extracted_text = extract(file, file_format)
    print(extracted_text)

    # Grammer and spelling checker
    grammer_error = check_grammar_and_spelling(extracted_text)
    GrammerErrorCount = str(grammer_error) + " Out of " + str(len(extracted_text))
    ERROR_percent = (grammer_error / len(extracted_text)) * 100

    # Summary Generator
    summary = generate_summary(extracted_text)
    print(summary)

    res = {
        "GrammerAndSpellingErrorCount": GrammerErrorCount,
        "GrammerAndSpellingErrorPercent": round(ERROR_percent, 3),
        "Summary": summary,
    }
    print(res)
    return jsonify(res)


if __name__ == "__main__":
    app.run(debug=True)
