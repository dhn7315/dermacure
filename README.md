
# DERMA CARE - AI Skin Analysis

This is a Next.js web application that uses a custom, locally-run Python CNN model to analyze images of skin and provide potential condition predictions. It also features a GenAI component to give personalized skincare advice based on the model's prediction.

![DERMA CARE Screenshot](https://storage.googleapis.com/stabl-media/6a032890-410a-42c2-8419-fcc61a0a57e3.png)

## Core Features

- **AI-Powered Analysis**: Upload an image of your skin to get an analysis from a custom-trained Convolutional Neural Network (CNN).
- **Local Model Execution**: The Python/TensorFlow model runs on a local Flask server, ensuring user data privacy and leveraging your custom-trained model.
- **Personalized Routines**: Get AI-generated skincare routine recommendations based on the analysis results.
- **Modern UI/UX**: Built with Next.js, ShadCN UI, and Tailwind CSS for a sleek, responsive, and animated user interface.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **AI (Backend Model)**: Python, Flask, TensorFlow/Keras
- **AI (Recommendations)**: Genkit, Google Gemini

---

## Getting Started

This project requires two separate processes to be running simultaneously: the **Next.js website** and the **Python Flask API**.

### Prerequisites

- **Node.js**: Version 18 or later.
- **Python**: Version 3.9 or later.
- **Your Trained Model**: You must have your trained model file, named `skin_condition_model.h5`, placed in the root directory of this project.

### Step 1: Set Up the Frontend (Next.js Website)

First, open a terminal, navigate to the project's root directory, and follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Create Environment File**:
    Create a file named `.env.local` in the root of your project and add the following line. This tells the website where to find your local Python API.
    ```
    PYTHON_API_URL=http://127.0.0.1:5001/predict
    ```

3.  **Run the Website Server**:
    ```bash
    npm run dev
    ```
    Your website should now be running at `http://localhost:9002`.

### Step 2: Set Up the Backend (Python API)

Now, **open a new, separate terminal** and navigate to the same project root directory.

1.  **Install Python Dependencies**:
    It's recommended to use a virtual environment.
    ```bash
    # Create a virtual environment (optional but recommended)
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

    # Install the required packages
    pip install Flask tensorflow "Pillow" "python-dotenv" "Flask-Cors" numpy
    ```

2.  **Ensure Model File is Present**:
    Make sure your trained model file, `skin_condition_model.h5`, is in the root directory of the project.

3.  **Run the Python Server**:
    ```bash
    python main.py
    ```
    You should see a message like "✅ Model loaded successfully." Your Python API is now running and ready to receive requests.

### Step 3: Use the Application

With both servers running, you can now open your web browser to `http://localhost:9002`. Navigate to the "Analyze" section, upload an image, and see your custom model in action!
