# test.py
import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing import image

# ------------------------------
# Config: Set your paths here
# ------------------------------
MODEL_PATH = "model/bloodgroup_model.keras"  # updated Keras format
DATASET_DIR = "dataset/dataset_blood_group"  # path containing A-, A+, B-, B+, AB-, AB+, O-, O+
IMG_SIZE = (224, 224)  # same as used during training

# ------------------------------
# Load model
# ------------------------------
print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!\n")

# ------------------------------
# Get class names
# ------------------------------
class_names = sorted(os.listdir(DATASET_DIR))
print(f"Classes found: {class_names}\n")

# ------------------------------
# Loop through all classes & images
# ------------------------------
for blood_group in class_names:
    folder_path = os.path.join(DATASET_DIR, blood_group)
    if not os.path.isdir(folder_path):
        continue
    
    print(f"Testing images for blood group: {blood_group}")
    for img_file in os.listdir(folder_path):
        img_path = os.path.join(folder_path, img_file)
        
        # Load image
        img = image.load_img(img_path, target_size=IMG_SIZE)
        img_array = image.img_to_array(img)
        img_array = img_array / 255.0  # normalize
        img_array = np.expand_dims(img_array, axis=0)
        
        # Predict
        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions)
        predicted_class = class_names[predicted_index]
        confidence = predictions[0][predicted_index] * 100
        
        print(f"{img_file} → Predicted: {predicted_class}, Confidence: {confidence:.2f}%")
    print("-" * 50)

print("Testing completed for all blood groups!")
