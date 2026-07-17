import io
from types import SimpleNamespace

from app.services import inference
from PIL import Image


class FakeTensor:
    def __init__(self, values):
        self.values = values
        self.moved_to_cpu = False

    def cpu(self):
        self.moved_to_cpu = True
        return self

    def tolist(self):
        return self.values


class FakeEncodedImage:
    def tobytes(self):
        return b"encoded-jpeg"


def test_infer_serializes_detection_tensors(monkeypatch) -> None:
    normalized_boxes = FakeTensor([[0.1234567, 0.2, 0.8, 0.9123456]])
    confidence_scores = FakeTensor([0.94321])
    class_ids = FakeTensor([2.0])
    boxes = SimpleNamespace(
        xyxyn=normalized_boxes,
        conf=confidence_scores,
        cls=class_ids,
    )
    result = SimpleNamespace(
        boxes=boxes,
        names={2: "car"},
        plot=lambda: object(),
    )

    class FakeModel:
        def predict(self, *, source, conf):
            assert isinstance(source, Image.Image)
            assert conf == 0.42
            return [result]

    monkeypatch.setattr(
        inference.cv2,
        "imencode",
        lambda extension, image: (True, FakeEncodedImage()),
    )

    image_bytes, detections = inference.infer(
        _valid_png_bytes(), FakeModel(), confidence=0.42
    )

    assert image_bytes == b"encoded-jpeg"
    assert detections == [
        {
            "class_id": 2,
            "label": "car",
            "confidence": 0.9432,
            "box": {
                "x1": 0.123457,
                "y1": 0.2,
                "x2": 0.8,
                "y2": 0.912346,
            },
        }
    ]
    assert normalized_boxes.moved_to_cpu
    assert confidence_scores.moved_to_cpu
    assert class_ids.moved_to_cpu


def _valid_png_bytes() -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", (2, 2)).save(buffer, format="PNG")
    return buffer.getvalue()
