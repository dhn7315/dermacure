
import os
import base64
from io import BytesIO
from PIL import Image
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# Use environment variable for model path if available, otherwise default.
MODEL_PATH = os.environ.get('MODEL_PATH', 'skin_condition_model.h5')
# Define the image size your model expects
IMG_WIDTH = 224
IMG_HEIGHT = 224

# --- Flask App Initialization ---
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing to allow requests from the website
CORS(app) 

# --- Load the Model ---
# Load your trained model.
# This is done once when the server starts.
try:
    print(f"Loading model from: {MODEL_PATH}")
    model = load_model(MODEL_PATH)
    print("✅ Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# --- Image Preprocessing ---
def preprocess_image(image_data: str):
    """
    Preprocesses the base64 encoded image data to the format your model expects.
    
    IMPORTANT: You MUST adjust this function to match the preprocessing steps
    used in your training notebook (e.g., resizing, normalization).
    """
    # Decode the base64 string
    base64_string = image_data.split(",")[1]
    img_bytes = base64.b64decode(base64_string)
    
    # Open the image
    img = Image.open(BytesIO(img_bytes))
    
    # Ensure image is RGB
    img = img.convert('RGB')
    
    # Resize the image to what the model expects
    img = img.resize((IMG_WIDTH, IMG_HEIGHT))
    
    # Convert image to a numpy array
    img_array = np.array(img)
    
    # --- IMPORTANT: NORMALIZE YOUR IMAGE ---
    # For example, if you normalized to [0, 1] during training:
    img_array = img_array / 255.0
    
    # Add a batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

# --- API Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not loaded.'}), 500
        
    if not request.json or 'photoDataUri' not in request.json:
        return jsonify({'error': 'No image data provided.'}), 400

    try:
        # Get image data from the request
        image_data = request.json['photoDataUri']
        
        # Preprocess the image
        processed_image = preprocess_image(image_data)
        
        # Make a prediction
        prediction_result = model.predict(processed_image)
        
        # --- IMPORTANT: FORMAT THE PREDICTION ---
        # The format below is just an EXAMPLE. You must change this
        # to match your model's output and class labels.
        
        # Example class labels
        class_labels = ['Acne', 'Eczema', 'Psoriasis', 'Rosacea', 'Healthy']
        
        # Create a list of prediction objects
        predictions_formatted = []
        for i, prob in enumerate(prediction_result[0]):
            # Make sure you are accessing the correct class label
            if i < len(class_labels):
                predictions_formatted.append({
                    "condition": class_labels[i],
                    "probability": float(prob)
                })

        # The key here MUST be "predictions" for the website to understand it.
        return jsonify({"predictions": predictions_formatted})

    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        return jsonify({'error': 'Failed to process image.'}), 500

# --- Run the App ---
if __name__ == '__main__':
    # Runs the Flask server on localhost with port 5001.
    # The port must match the one in your .env.local file.
    app.run(host='0.0.0.0', port=5001, debug=True)

