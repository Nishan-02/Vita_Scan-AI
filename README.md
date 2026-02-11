# 🌿 VitaScan AI

**AI-Powered Non-Invasive Vitamin Deficiency Detection**

## 📖 Project Overview

**VitaScan AI** is a comprehensive health-tech application designed to detect potential vitamin deficiencies through image analysis of physical symptoms. By analyzing visual cues from the **skin, nails, and eyes**, the system identifies conditions (such as Eczema, Pale Nails, or Bitot's Spots) and correlates them with specific nutritional gaps.

This project implements a full-stack **Client-Server Architecture** that bridges high-performance Deep Learning (PyTorch) with a modern, responsive user interface (React). It serves as an accessible "first-step" screening tool to raise awareness about personal nutrition.

## 🎯 Core Objectives

* **Visual Diagnosis:** Leverage Computer Vision to classify skin and nail conditions from user-uploaded photos or live camera feeds.
* **Knowledge Mapping:** Implement a logic layer that translates medical conditions into actionable nutritional advice (e.g., "Pale Nails" → "Iron Deficiency").
* **Seamless UX:** Provide a frictionless experience using a modern React frontend with real-time feedback.
* **Privacy-First:** Process images for immediate inference without long-term storage of sensitive biometric data.

## 🧠 Deep Learning & System Architecture

The project utilizes a **Transfer Learning** approach to achieve high accuracy with a specialized medical dataset.

### 🔹 Component Breakdown

| Component | Technology | Role & Specialty |
| :--- | :--- | :--- |
| **AI Model** | **ResNet50** | A deep convolutional neural network pre-trained on ImageNet and fine-tuned on 22 classes of dermatological images. |
| **Backend** | **FastAPI** | High-performance Python API that handles image preprocessing, model inference, and nutritional mapping. |
| **Frontend** | **React + Vite** | A responsive web application featuring live camera integration, drag-and-drop uploads, and animated results. |
| **Logic Layer** | **Python Dict** | A "Knowledge Base" that maps predicted disease labels to specific vitamin deficiencies and food recommendations. |

### 🔁 The Analysis Pipeline

1.  **Input:** User captures an image via Webcam or uploads a file.
2.  **Preprocessing:** The image is resized to `224x224`, normalized, and converted to a PyTorch tensor.
3.  **Inference:** The **ResNet50** model predicts the condition (e.g., *Atopic Dermatitis*) with a confidence score.
4.  **Mapping:** The backend queries the internal database:
    * *Detected:* Atopic Dermatitis
    * *Correlation:* Low Vitamin D & Omega-3
5.  **Response:** The frontend displays the condition, the missing nutrients, and recommended foods (e.g., Salmon, Walnuts).

## 📊 Data & Model Performance

* **Dataset:** Trained on a diverse dataset of **22 distinct skin and nail conditions**, including Eczema, Acne, Melanoma, and Psoriasis.
* **Training:** Utilized **Transfer Learning** by freezing the early feature-extraction layers of ResNet50 and fine-tuning the final fully connected layers.
* **Optimization:** Implemented **Adam Optimizer** and **CrossEntropyLoss** to handle multi-class classification effectively.
* **Accuracy:** Achieved **>80% Validation Accuracy** on the test set.

## 🛠️ Tech Stack

### 🔬 Artificial Intelligence

* **Framework:** PyTorch
* **Model Architecture:** ResNet50 (Deep Residual Network)
* **Vision Tools:** Torchvision, PIL (Python Imaging Library)

### 💻 Backend API

* **Framework:** FastAPI
* **Server:** Uvicorn
* **Language:** Python 3.10+

### 🎨 Frontend UI

* **Library:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **Camera:** React Webcam

## 🚀 Key Features

* **Live Camera Analysis:** Real-time capture and analysis directly from the browser.
* **Smart Nutritional Mapping:** Goes beyond simple classification to provide actionable health insights.
* **Responsive Design:** Fully functional on desktop and mobile devices.
* **Confidence Scoring:** Displays the AI's certainty level to keep the user informed.

## 📌 Project Status

* ✅ **Completed:** Model training, Backend API development, Frontend UI integration.
* ✅ **Result:** Successfully detects 10+ major skin conditions and provides accurate nutritional links.
* 🚧 **In Progress:** Mobile App development (React Native).

## 🔮 Future Enhancements

* **Multimodal Analysis:** Combining symptom analysis with a user questionnaire (diet, age, gender) for higher accuracy.
* **Doctor Connect:** A feature to export the report as a PDF to share with a dermatologist.
* **History Tracking:** Allowing users to save scans and track the improvement of their condition over time.


