import io
from typing import TypedDict

import cv2
from PIL import Image, UnidentifiedImageError
from ultralytics import YOLO

from app.domain.model_ids import ModelName


class InvalidImageError(ValueError):
    """Raised when the uploaded bytes are not a valid image."""


class ImageEncodingError(RuntimeError):
    """Raised when the inference result cannot be encoded."""


class DetectionBox(TypedDict):
    x1: float
    y1: float
    x2: float
    y2: float


class Detection(TypedDict):
    class_id: int
    label: str
    confidence: float
    box: DetectionBox


def load_model():
    models = {}
    for model_name in ModelName:
        model_path = f"models/{model_name.value}.pt"
        print(f"Loading model: {model_name.value}")
        models[model_name] = YOLO(model_path)
    return models


def infer(
    raw_image: bytes, model: YOLO, confidence: float
) -> tuple[bytes, list[Detection]]:
    if not raw_image:
        raise InvalidImageError("No image provided for inference.")

    try:
        image = Image.open(io.BytesIO(raw_image)).convert("RGB")
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise InvalidImageError("The uploaded file is not a valid image.") from exc
    results = model.predict(
        source=image,
        conf=confidence,
    )
    if not results:
        raise RuntimeError("The model returned no inference result.")
    result = results[0]

    detections: list[Detection] = []
    if result.boxes is not None:
        normalized_boxes = result.boxes.xyxyn.cpu().tolist()
        confidence_scores = result.boxes.conf.cpu().tolist()
        class_ids = result.boxes.cls.cpu().tolist()

        for normalized_box, confidence_score, class_id_value in zip(
            normalized_boxes,
            confidence_scores,
            class_ids,
            strict=True,
        ):
            class_id = int(class_id_value)
            x1, y1, x2, y2 = normalized_box
            detections.append(
                {
                    "class_id": class_id,
                    "label": result.names[class_id],
                    "confidence": round(float(confidence_score), 4),
                    "box": {
                        "x1": round(float(x1), 6),
                        "y1": round(float(y1), 6),
                        "x2": round(float(x2), 6),
                        "y2": round(float(y2), 6),
                    },
                }
            )

    annotated_image = result.plot()
    success, encoded_image = cv2.imencode(".jpg", annotated_image)
    if not success:
        raise ImageEncodingError("Failed to encode the inference result.")
    return encoded_image.tobytes(), detections
