import numpy as np
from PIL import Image

def process_image(image):
    np_img = np.array(image)
    np_img = np.where(np_img == 0, 0, 255)

    pil_img = Image.fromarray(np_img)
    pil_img.thumbnail((25, 25))

    white_back = Image.fromarray(np.full((28,28),0))
    width_offset = round((white_back.width - pil_img.width) / 2)
    height_offset = round((white_back.height - pil_img.height) / 2)
    white_back.paste(pil_img, (width_offset, height_offset))

    ret_img = np.array(white_back)
    ret_img = np.where(ret_img < 50, 0, 1)
    ret_img = ret_img.reshape(1, 28, 28, 1)

    return ret_img