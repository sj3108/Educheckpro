import os
import nltk
import numpy as np
import math
from nltk.corpus import stopwords
import docx
from extract_text import extract_text_with_tika, split_connected_words


def getText(filename, filePath):
    print("AAAA", filename)
    print("BBBB", filePath)
    doc = docx.Document()
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text)
    return "\n".join(fullText)


def build_lexicon(corpus):
    lexicon = set()
    for doc in corpus:
        # word tokenization
        word_token = [word for word in doc.split()]
        lower_word_list = [i.lower() for i in word_token]

        # stemming
        porter = nltk.PorterStemmer()
        stemmed_word = [porter.stem(t) for t in lower_word_list]

        # removing stop words
        stop_words = set(stopwords.words("english"))
        filtered_bag_of_word = [w for w in stemmed_word if not w in stop_words]
        lexicon.update(filtered_bag_of_word)
    return lexicon


def tf(term, document):
    return freq(term, document)


def freq(term, document):
    return document.split().count(term)


def l2_normalizer(vec):
    denom = np.sum([e1**2 for e1 in vec])
    if denom == 0:
        return [0] * len(vec)
    return [(e1 / math.sqrt(denom)) for e1 in vec]


def numDocsContaining(word, doclist):
    doccount = 0
    for doc in doclist:
        if freq(word, doc) > 0:
            doccount = +1
    return doccount


def idf(word, doclist):
    n_samples = len(doclist)
    df = numDocsContaining(word, doclist)
    return np.log(n_samples / 1 + df)


def build_idf_matrix(idf_vector):
    idf_mat = np.zeros((len(idf_vector), len(idf_vector)))
    np.fill_diagonal(idf_mat, idf_vector)
    return idf_mat


# main function
def calculateInternalPlagrismResult(filePath):
    docFiles = []
    docFileName = []
    for filename in os.listdir(filePath):
        print(filename)
        parts = filename.split("_")
        extracted_name = " ".join(parts[:2])
        # for not including assignment file
        temp = filePath.split("\\")

        print("YYYYY", temp[len(temp) - 1])
        print("XXXXXXX", extracted_name)
        if temp[len(temp) - 1] == " ".join(parts[:1]):
            continue
        if filename.endswith(".docx"):
            docFileName.append(extracted_name)
            filename = getText(filename, filePath)
            docFiles.append(filename)
        if filename.endswith(".pdf"):
            text = extract_text_with_tika(filePath + "/" + filename)
            text = split_connected_words(text)
            docFiles.append(text)
            docFileName.append(extracted_name)
    vocabulary = build_lexicon(docFiles)
    doc_term_matrix = []
    for doc in docFiles:
        tf_vector = [tf(word, doc) for word in vocabulary]
        tf_vector_string = ",".join(format(freq, "d") for freq in tf_vector)
        doc_term_matrix.append(tf_vector)
    doc_term_matrix_l2 = []
    for vec in doc_term_matrix:
        doc_term_matrix_l2.append(l2_normalizer(vec))
    my_idf_vector = [idf(word, docFiles) for word in vocabulary]
    my_idf_matrix = build_idf_matrix(my_idf_vector)
    doc_term_matrix_tfidf = []

    for tf_vector in doc_term_matrix:
        doc_term_matrix_tfidf.append(np.dot(tf_vector, my_idf_matrix))
    doc_term_matrix_tfidf_l2 = []
    for tf_vector in doc_term_matrix_tfidf:
        doc_term_matrix_tfidf_l2.append(l2_normalizer(tf_vector))
    matrix = [[0 for _ in range(len(docFiles))] for _ in range(len(docFiles))]
    for i in range(len(docFiles)):
        for j in range(i + 1, len(docFiles)):
            result_nltk = nltk.cluster.util.cosine_distance(
                doc_term_matrix_tfidf_l2[i],
                doc_term_matrix_tfidf_l2[j],
                # print(result_nltk)
            )
            cos_sin = 1 - result_nltk
            try:
                angle_in_radians = math.acos(cos_sin)
            except ValueError:
                print("\n")
                # print("Here Error")
            # Check if cos_sin is a valid number (not NaN or infinite)
            if math.isnan(cos_sin) or math.isinf(cos_sin):
                print("cos_sin is not a valid number. Assigning default value.")
                plagiarism = 0  # Assigning a default value, you can choose any value that makes sense in your context
            else:
                try:
                    plagiarism = int(cos_sin * 100)
                except ValueError:
                    print("Error: cannot convert to integer.")
                    plagiarism = 0  # Assigning a default value if conversion fails

            # plagiarism = int(cos_sin * 100)
            # print(
            #     "\n Plagarism btw student %s and student %s:"
            #     % (docFileName[i], docFileName[j])
            # )
            # print("\nPlagiarism =%s" % plagiarism)
            matrix[i][j] = plagiarism
            matrix[j][i] = plagiarism

    # print("{:<15}".format(""), end="")
    # for file in docFileName:
    #     print("{:<15}".format(file), end="")
    # print()
    # for i in range(len(matrix)):
    #     # Print row header with fixed width
    #     print("{:<15}".format(docFileName[i]), end="")

    #     for j in range(len(matrix[i])):
    #         # Print plagiarism score with fixed width
    #         print("{:<15}".format(matrix[i][j]), end="")
    #     print()
    return matrix, docFileName
