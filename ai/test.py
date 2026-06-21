from predict import load_model, get_class_names
import numpy as np
from PIL import Image

model = load_model()
class_names = get_class_names()

paths = [
    r'C:\Users\Gauri Salaskar\Downloads\images.jpg',
    r'C:\Users\Gauri Salaskar\Downloads\download (1).jpg'
]

for p in paths:
    img = Image.open(p).convert('RGB').resize((224, 224))
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, axis=0)
    preds = model.predict(arr, verbose=0)[0]
    top5 = np.argsort(preds)[::-1][:5]
    print(f'--- {p} ---')
    for i in top5:
        print(f'  {class_names[i]}: {preds[i]*100:.2f}%')