from flask import jsonify

from flask import Flask, request, render_template
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, BartTokenizer, BartForConditionalGeneration, pipeline
import re
import string
from nltk.tokenize import sent_tokenize

from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Tambahkan ini untuk mengizinkan request dari frontend

# Load sentiment analysis model and tokenizer
SENTIMENT_MODEL_PATH = r"C:\Users\Yoel\Documents\5term\Deep Learning\Final Project\model\sentiment-model-deberta-v3" # change path to your model in your local
sentiment_model = AutoModelForSequenceClassification.from_pretrained(SENTIMENT_MODEL_PATH)
sentiment_tokenizer = AutoTokenizer.from_pretrained(SENTIMENT_MODEL_PATH)

# Load summarization model and tokenizer
SUMMARIZATION_MODEL_PATH = r"C:\Users\Yoel\Documents\5term\Deep Learning\Final Project\model\model_sumaries\artikel_long\bart-large-cnn-summaries-final" # change path to your model in your local
summarization_tokenizer = BartTokenizer.from_pretrained(SUMMARIZATION_MODEL_PATH)
summarization_model = BartForConditionalGeneration.from_pretrained(SUMMARIZATION_MODEL_PATH)

# Initialize summarization pipeline
summarization_pipe = pipeline(
    "summarization",
    model=summarization_model,
    tokenizer=summarization_tokenizer,
    device=0 if torch.cuda.is_available() else -1
)

# Sentiment label mapping
label_mapping = {
    0: 'negative',
    1: 'neutral',
    2: 'positive'
}

# Preprocessing for sentiment analysis
def basic_cleaning(text):
    text = re.sub(r"http\S+", '', text)  # Remove URLs
    text = re.sub(r'\d+', '', text)      # Remove numbers
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = text.lower().strip()
    return text

# Preprocessing for summarization
def preprocess_text(text):
    text = text.lower()
    text = text.replace('\n', ' ')
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)  # Remove URLs
    text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
    text = text.translate(str.maketrans('', '', string.punctuation))  # Remove punctuation
    return text.strip()

# Post-process summary to ensure complete sentence
def post_process_summary(summary):
    sentences = sent_tokenize(summary)
    if sentences:
        return sentences[0]  # Return the first complete sentence
    return summary

# Count words for summarization check
def count_words(text):
    return len(text.split())

# Predict sentiment
def predict_sentiment(review):
    cleaned_review = basic_cleaning(review)
    inputs = sentiment_tokenizer(cleaned_review, padding="max_length", truncation=True, return_tensors="pt")
    with torch.no_grad():
        outputs = sentiment_model(**inputs)
        logits = outputs.logits
        prediction = torch.argmax(logits, dim=-1).item()
    return label_mapping[prediction]

# Generate summary
def generate_summary(text):
    processed_text = preprocess_text(text)
    word_count = count_words(processed_text)
    if word_count <= 4:
        return text, "Text is too short (≤4 words), returning original text."
    
    summary = summarization_pipe(
        processed_text,
        max_length=20,
        min_length=5,
        do_sample=False,
        num_beams=2,
        length_penalty=1.0
    )[0]['summary_text']
    
    cleaned_summary = post_process_summary(summary)
    return cleaned_summary, None

# Route for main page
@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    summary = None
    review = None
    message = None
    
    if request.method == 'POST':
        review = request.form['review']
        if review.strip():
            # Perform sentiment analysis
            prediction = predict_sentiment(review)
            # Generate summary
            summary, message = generate_summary(review)
    
    return render_template('index.html', prediction=prediction, summary=summary, review=review, message=message)


@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    review = data.get("review", "")
    
    if not review.strip():
        return jsonify({"error": "Empty review"}), 400

    # Sentiment
    sentiment = predict_sentiment(review)

    # Summary
    summary, _ = generate_summary(review)

    return jsonify({
        "sentiment": sentiment,
        "summary": summary
    })

if __name__ == '__main__':
    app.run(debug=True)
