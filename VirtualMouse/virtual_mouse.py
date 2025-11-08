import cv2 
import mediapipe as mp
import utils 
import pyautogui 
from pynput.mouse import Button, Controller
import random

screen_width, screen_height = pyautogui.size()
mouse = Controller()

mpHand = mp.solutions.hands
hands = mpHand.Hands(
    static_image_mode = False,
    model_complexity = 1,
    min_detection_confidence = 0.7,
    min_tracking_confidence = 0.7,
    max_num_hands = 1
)

def find_finger_tip(procesed):
    if procesed.multi_hand_landmarks:
        hand_landmark = procesed.multi_hand_landmarks[0]
        index_tip = hand_landmark.landmark[mpHand.HandLandmark.INDEX_FINGER_TIP]
        return index_tip 
    
    return None, None

def  move_mouse(index_finger_tip):
    if index_finger_tip is not None:
        x = int(index_finger_tip.x * screen_width)
        y = int(index_finger_tip.y * screen_height)

        pyautogui.moveTo(x,y)

def is_left_click(landmark_list, thumb_dist):
    return(
        utils.get_angle(landmark_list[5], landmark_list[6], landmark_list[8]) < 50 and
        utils.get_angle(landmark_list[9], landmark_list[10], landmark_list[12]) > 90 and
        thumb_dist > 50
    )

def is_right_click(landmark_list, thumb_dist):
    return(
        utils.get_angle(landmark_list[9], landmark_list[10], landmark_list[12]) <50 and
        utils.get_angle(landmark_list[5], landmark_list[6], landmark_list[8]) > 90 and
        thumb_dist > 50
    )

def is_double_click(landmark_list, thumb_dist):
     return(
        utils.get_angle(landmark_list[5], landmark_list[6], landmark_list[8]) <50 and
        utils.get_angle(landmark_list[9], landmark_list[10], landmark_list[12]) < 50 and
        thumb_dist > 50
    )

def is_screenshot(landmark_list, thumb_dist): 
    return(
        utils.get_angle(landmark_list[5], landmark_list[6], landmark_list[8]) < 50 and
        utils.get_angle(landmark_list[9], landmark_list[10], landmark_list[12]) <50 and
        thumb_dist < 50
    )

def detect_gesture(frame, landmark_list, procesed):
    if len(landmark_list) >= 21:
        index_finger_tip = find_finger_tip(procesed)
        thumb_dist = utils.get_distance([landmark_list[4], landmark_list[5]])

        if utils.get_distance([landmark_list[4], landmark_list[5]]) < 50  and utils.get_angle(landmark_list[5], landmark_list[6], landmark_list[8]) > 90:
            move_mouse(index_finger_tip)

        elif is_left_click(landmark_list, thumb_dist):
            mouse.press(Button.left)
            mouse.release(Button.left)
            cv2.putText(frame, "Left Click", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        elif is_right_click(landmark_list, thumb_dist):
            mouse.press(Button.right)
            mouse.release(Button.right)
            cv2.putText(frame, "Right Click", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        elif is_double_click(landmark_list, thumb_dist):
            pyautogui.doubleClick()
            cv2.putText(frame, "Double Click", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        elif is_screenshot(landmark_list, thumb_dist):
            image = pyautogui.screenshot()
            label = random.randint(1,1000)
            image.save(f"my_screenshot{label}.png")
            cv2.putText(frame, "Screenshot Taken", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)   

def main():
    cap = cv2.VideoCapture(0)
    draw = mp.solutions.drawing_utils

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.flip(frame, 1)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            procesed = hands.process(frame_rgb)
            landmark_list = []

            if procesed.multi_hand_landmarks:
                hand_landmarks = procesed.multi_hand_landmarks[0]
                draw.draw_landmarks(frame, hand_landmarks, mpHand.HAND_CONNECTIONS)
                for lm in hand_landmarks.landmark:
                    landmark_list.append((lm.x, lm.y))

            detect_gesture(frame, landmark_list, procesed)
                

            cv2.imshow("Frame", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()