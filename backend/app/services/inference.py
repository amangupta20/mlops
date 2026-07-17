import io
from ultralytics import YOLO
import cv2
from app.domain.model_ids import ModelName
from PIL import Image


def load_model():
    models={}
    for model_name in ModelName:
        model_path = f"models/{model_name.value}.pt"
        print(f"Loading model: {model_name.value}")
        models[model_name] = YOLO(model_path)
    return models
def infer(raw_image: bytes,model: YOLO,confidence: float) -> bytes:
    if not raw_image:
        raise ValueError("No image provided for inference.")

    try:
        image=Image.open(io.BytesIO(raw_image)).convert("RGB")
    except Exception:
        raise ValueError("Invalid image data provided for inference.")
    results = model.predict(
        source=image,
        conf=confidence,
    )

    result = results[0]

    print("Image annotated")
    annotated_image = result.plot()
    success,encoded_image = cv2.imencode(".jpg", annotated_image)
    if not success:
        raise ValueError("Failed to encode the annotated image.")
    image_bytes = encoded_image.tobytes()
    return image_bytes
