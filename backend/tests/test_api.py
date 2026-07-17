import asyncio

from app.domain.model_ids import ModelName
from app.services import inference
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_returns_healthy() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_inference_rejects_unsupported_content_type() -> None:
    response = client.post(
        "/infer",
        files={
            "image": (
                "notes.txt",
                b"this is not an image",
                "text/plain",
            )
        },
    )

    assert response.status_code == 415
    assert response.json() == {"detail": "Only JPEG and PNG images are supported"}


def test_inference_rejects_confidence_above_one() -> None:
    response = client.post(
        "/infer",
        files={
            "image": (
                "image.jpg",
                b"placeholder",
                "image/jpeg",
            )
        },
        data={
            "confidence": "1.5",
        },
    )

    assert response.status_code == 422


def test_inference_returns_annotated_image_and_detections(monkeypatch) -> None:
    app.state.yolo_models = {ModelName.YOLO26N: object()}
    app.state.inference_slots = asyncio.Semaphore(5)
    monkeypatch.setattr(
        inference,
        "infer",
        lambda raw_image, model, confidence: (
            b"jpeg",
            [
                {
                    "class_id": 0,
                    "label": "person",
                    "confidence": 0.94,
                    "box": {"x1": 0.1, "y1": 0.2, "x2": 0.4, "y2": 0.8},
                }
            ],
        ),
    )

    response = client.post(
        "/infer",
        files={"image": ("image.jpg", b"placeholder", "image/jpeg")},
        data={"model_name": "yolo26n", "confidence": "0.42"},
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    assert response.headers["x-model-used"] == "yolo26n"
    assert response.headers["x-processing-time"].endswith(" ms")
    assert response.json() == {
        "image": {"content_type": "image/jpeg", "base64": "anBlZw=="},
        "detections": [
            {
                "class_id": 0,
                "label": "person",
                "confidence": 0.94,
                "box": {"x1": 0.1, "y1": 0.2, "x2": 0.4, "y2": 0.8},
            }
        ],
    }
