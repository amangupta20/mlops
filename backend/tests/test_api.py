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
    assert response.json() == {
        "detail": "Only JPEG and PNG images are supported"
    }


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
