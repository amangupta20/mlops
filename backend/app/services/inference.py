import io
from ultralytics import YOLO
import cv2
from app.domain.model_ids import ModelName
from PIL import Image, UnidentifiedImageError

class InvalidImageError(ValueError):
    """Raised when the uploaded bytes are not a valid image."""


class ImageEncodingError(RuntimeError):
    """Raised when the inference result cannot be encoded."""



def load_model():
    models={}
    for model_name in ModelName:
        model_path = f"models/{model_name.value}.pt"
        print(f"Loading model: {model_name.value}")
        models[model_name] = YOLO(model_path)
    return models
def infer(raw_image: bytes,model: YOLO,confidence: float) -> bytes:
    if not raw_image:
        raise InvalidImageError("No image provided for inference.")

    try:
        image=Image.open(io.BytesIO(raw_image)).convert("RGB")
    except (UnidentifiedImageError, OSError, ValueError) as exc:
            raise InvalidImageError(
                "The uploaded file is not a valid image."
            ) from exc
    results = model.predict(
        source=image,
        conf=confidence,
    )

    result = results[0]
    if not results:
            raise RuntimeError("The model returned no inference result.")

    print("Image annotated")
    annotated_image = result.plot()
    success,encoded_image = cv2.imencode(".jpg", annotated_image)
    if not success:
        raise ImageEncodingError("Failed to encode the inference result.")
    image_bytes = encoded_image.tobytes()
    return image_bytes
