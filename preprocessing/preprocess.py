import cv2
import os

INPUT_DIR = "dataset"
IMG_SIZE = 224

for blood_group in os.listdir(INPUT_DIR):
    folder_path = os.path.join(INPUT_DIR, blood_group)
    if not os.path.isdir(folder_path):
        continue

    for img_name in os.listdir(folder_path):
        img_path = os.path.join(folder_path, img_name)

        try:
            img = cv2.imread(img_path)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
            cv2.imwrite(img_path, img)
        except:
            print(f"Error processing {img_path}")

print("Preprocessing completed")
