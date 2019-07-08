import os
import time
from selenium import webdriver

LOGIN_URL = 'https://console.cloud.google.com/storage/browser/quickdraw_dataset/full/numpy_bitmap'
DOWNLOAD_URL_FMT = 'https://storage.cloud.google.com/quickdraw_dataset/full/numpy_bitmap/{}.npy'

DOWNLOAD_PATH = r'C:\Users\yanhw\Downloads'
DOWNLOAD_FILE_FMT = 'full_numpy_bitmap_{}.npy'
MOVE_TO_PATH = r'C:\Users\yanhw\Desktop\QuickDraw\full_datasets'
MOVE_TO_FILE_FMT = '{}.npy'

DELAY = (10, 3)

# Get Categories
with open('categories.txt') as file:
    categories = file.read().split('\n')

# Initialise Browser
browser = webdriver.Chrome('chromedriver.exe')
browser.get(LOGIN_URL)

time.sleep(15)

# Download
for index, cat in enumerate(categories):
    print(index, cat)
    # Variables
    url = DOWNLOAD_URL_FMT.format(cat)
    download_file_name = DOWNLOAD_FILE_FMT.format(cat)
    move_to_file_name = MOVE_TO_FILE_FMT.format(cat)
    file_download_path = os.path.join(DOWNLOAD_PATH, download_file_name)
    file_move_to_path = os.path.join(MOVE_TO_PATH, move_to_file_name)

    # Download
    browser.execute_script(f'window.open("{url}")')

    # Wait
    time.sleep(DELAY[0])
    while not os.path.exists(file_download_path):
        time.sleep(DELAY[1])

    # Move
    os.rename(file_download_path, file_move_to_path)