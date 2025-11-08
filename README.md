# Project Saarthi (The_Endurance_T202_Saarthi25)

![Project Saarthi](https://img.shields.io/badge/Project-Saarthi-blue)
![Status](https://img.shields.io/badge/Status-In--Development-green)
![Tech-JS](https://img.shields.io/badge/JavaScript-75.7%25-yellow)
![Tech-Python](https://img.shields.io/badge/Python-6.6%25-blue)
![Tech-C++](https://img.shields.io/badge/C++-5.0%25-lightgrey)

A multi-modal assistive technology system designed to enhance navigation, computer interaction, and information access for visually impaired individuals. "Saarthi," meaning charioteer or guide, aims to provide sensory substitution through a web platform, computer vision, and haptic/Braille feedback hardware.

## Features

This project integrates several key components into one cohesive system:

* **🖥️ Web Application:** A central dashboard (likely React/Node.js) that serves as the main user interface and control center.
* **🤚 Haptic Feedback Glove:** An IoT-enabled glove (Arduino based) that provides tactile feedback to the user, likely for navigation and object avoidance.
* **👁️ AI Virtual Mouse:** A computer vision module (Python, OpenCV) that allows users to control the system's mouse cursor using hand gestures.
* **📹 Real-time Video Feedback:** A Python-based system that processes live video, detects objects or text, and sends corresponding signals to the haptic glove.
* **📟 Braille Display:** An Arduino-based module (`NewBrailleUno`) designed to present digital information in Braille format.
* **🌐 Web-Hardware Bridge:** A web component (`WebHapticFeedback`) that uses Web Serial API to bridge communication between the browser and the hardware devices.

## Technology Stack

This project is built with a diverse set of technologies to handle everything from low-level hardware to a modern web interface.

* **Frontend:** JavaScript, HTML, CSS
* **Backend / Computer Vision:** Python (OpenCV, MediaPipe), Node.js (likely)
* **Hardware (IoT):** C++ (Arduino programming language)
* **Hardware Devices:** Arduino Uno, vibration motors.

### Component Deep-Dive

1.  **`Web-Application`**: The core of the user experience. This is likely where the user configures settings, views information, and manages connections to the hardware modules.
2.  **`HapticGloveIOT`**: Contains the firmware for the haptic glove. It listens for commands (e.g., from the web app or video module) and triggers specific vibration patterns.
3.  **`NewBrailleUno`**: Firmware for the Braille device. It likely receives text data and actuates pins to form Braille characters.
4.  **`VideoFeedbackOnHapticGlove`**: A Python service that uses OpenCV to capture video, perform object detection, and map detected objects to haptic signals sent to the glove.
5.  **`VirtualMouse`**: A Python service, likely using MediaPipe, that tracks hand movements via a webcam to simulate mouse movements and clicks.
6.  **`WebHapticFeedback`**: The crucial link between the browser and the physical devices. It allows the `Web-Application` to send and receive data from the Arduino-based hardware.

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

You will need the following software installed:

* [Node.js](https://nodejs.org/) (for the Web Application)
* [Python 3.x](https://www.python.org/) (for CV modules)
* [Arduino IDE](https://www.arduino.cc/en/software) (for hardware firmware)
* Required Python libraries: `pip install opencv-python mediapipe`
* Required Node modules: `npm install` (run in the `Web-Application` directory)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/ambth1216/The_Endurance_T202_Saarthi25.git](https://github.com/ambth1216/The_Endurance_T202_Saarthi25.git)
    cd The_Endurance_T202_Saarthi25
    ```

2.  **Setup the Hardware:**
    * Open the `.ino` files from `HapticGloveIOT/` and `NewBrailleUno/` in the Arduino IDE.
    * Select your board and port, then upload the sketches.

3.  **Setup the Web Application:**
    ```sh
    cd Web-Application
    npm install
    npm start
    ```

4.  **Run the Computer Vision Modules:**
    * In a new terminal, run the Virtual Mouse:
        ```sh
        cd VirtualMouse
        python main.py  # (or the main script name)
        ```
    * In another terminal, run the Video Feedback system:
        ```sh
        cd VideoFeedbackOnHapticGlove
        python main.py  # (or the main script name)
        ```

## Usage

1.  Ensure all hardware (glove, Braille display) is connected via USB.
2.  Start the `Web-Application`.
3.  Connect to the hardware devices through the web interface (likely via a "Connect" button that uses the Web Serial API).
4.  Run the Python scripts for Virtual Mouse and Video Feedback.
5.  You should now be able to control the mouse with hand gestures and receive haptic feedback based on the camera's view.
