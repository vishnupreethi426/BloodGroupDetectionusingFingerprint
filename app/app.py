import os
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

app = Flask(__name__)

# -------------------------
# Paths
# -------------------------
APP_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(APP_DIR, ".."))

MODEL_PATH = os.path.join(PROJECT_DIR, "model", "bloodgroup_model.keras")
DATASET_DIR = os.path.join(PROJECT_DIR, "dataset", "dataset_blood_group")
UPLOAD_DIR = os.path.join(APP_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

IMG_SIZE = (224, 224)

# -------------------------
# Load model
# -------------------------
print("Loading ML model...")
model = load_model(MODEL_PATH)
print("✅ Model loaded")

CLASS_NAMES = sorted([
    d for d in os.listdir(DATASET_DIR)
    if os.path.isdir(os.path.join(DATASET_DIR, d))
])

print("Classes:", CLASS_NAMES)

# -------------------------
# Prediction Function
# -------------------------
def predict_image(img_path):
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array, verbose=0)
    idx = np.argmax(preds[0])

    return CLASS_NAMES[idx], round(float(preds[0][idx]) * 100, 2)

# -------------------------
# Serve Frontend
# -------------------------
@app.route("/")
def index():
    return send_from_directory(APP_DIR, "index.html")
@app.route("/style.css")
def style():
    return send_from_directory(APP_DIR, "style.css")

@app.route("/script.js")
def script():
    return send_from_directory(APP_DIR, "script.js")

# -------------------------
# ML Prediction API
# -------------------------
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    img_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(img_path)

    blood_group, confidence = predict_image(img_path)

    return jsonify({
        "blood_group": blood_group,
        "confidence": confidence
    })

# -------------------------
# Dummy Login API (Mini Project)
# -------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    return jsonify({
        "status": "success",
        "message": "Login successful"
    })

# -------------------------
# Dummy Signup API
# -------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    return jsonify({
        "status": "success",
        "message": "Account created successfully"
    })

# -------------------------
# Run App
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)
