from pathlib import Path
import io
from ultralytics import YOLO
import cv2
import numpy as np
from domain.model_ids import ModelName
from PIL import Image

OUTPUT_IMAGE = Path("storage/outputs/test-result.jpg")
models={}

def load_model():
    models={}
    for model_name in ModelName:
        model_path = f"models/{model_name.value}.pt"
        print(f"Loading model: {model_name.value}")
        models[model_name] = YOLO(model_path)
    return models

async def infer(raw_image: bytes,model: YOLO,confidence: float) -> bytes:
    if not raw_image:
        raise ValueError("No image provided for inference.")
    max_image_size = 10 * 1024 * 1024  # 10 MB

    try:
        image=Image.open(io.BytesIO(raw_image)).convert("RGB")
    except Exception:
        raise ValueError("Invalid image data provided for inference.")

    OUTPUT_IMAGE.parent.mkdir(parents=True, exist_ok=True)

    results = await model.predict(
        source=image,
        conf=confidence,
    )

    result = results[0]

    print(f"Image annotated")
    annotated_image = result.plot()
    success,encoded_image = cv2.imencode(".jpg", annotated_image)
    if not success:
        raise ValueError("Failed to encode the annotated image.")
    image_bytes = encoded_image.tobytes()
    return image_bytes
