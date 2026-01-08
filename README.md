
  # Real-Time Accident Detection System
# 🚨 Real-Time Accident Detection System

> A real-time computer-vision based system that detects road accidents from live video feeds or recorded footage.  
> When an accident is detected, the system shows detections with bounding boxes, triggers alerts, and saves outputs for analysis.

---

## 📌 Overview

Accidents on roads cause significant loss of life and property each year. This project uses machine learning and computer vision techniques to **detect accidents in real time**, helping improve emergency response and traffic safety.

---

## 🔍 Features

✅ Real-time detection using a state-of-the-art object detection model  
✅ Support for live webcam/CCTV input and pre-recorded video files  
✅ Visual output with bounding boxes for detected accident events  
✅ Alert mechanism (e.g., sound, notifications)  
✅ Save processed videos or images for analysis  
(Optional)  
✅ Emergency messaging or authority notification  

---

## 🧠 How It Works

1. **Model**  
   Uses a pre-trained object detection model (e.g., YOLOv8) trained/fine-tuned on accident datasets. 
2. **Video Input**  
   Frames are grabbed from a live video source or stored video.  
3. **Frame Processing**  
   Each frame is analyzed by the model to detect accidents.  
4. **Output**  
   Visualization + alerts + optional logging/save features.

---

## 📂 Folder Structure



  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
