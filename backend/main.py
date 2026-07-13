from pathlib import Path

from ultralytics import YOLO


INPUT_IMAGE = Path("storage/inputs/test.jpg")
OUTPUT_IMAGE = Path("storage/outputs/test-result.jpg")


def main() -> None:
    if not INPUT_IMAGE.is_file():
        raise FileNotFoundError(f"Input image not found: {INPUT_IMAGE}")

    OUTPUT_IMAGE.parent.mkdir(parents=True, exist_ok=True)

    model = YOLO("yolo26n.pt")
    results = model.predict(
        source=INPUT_IMAGE,
        conf=0.25,
    )

    result = results[0]
    result.save(filename=str(OUTPUT_IMAGE))

    print(results)
    print(f"Saved annotated image to {OUTPUT_IMAGE}")


if __name__ == "__main__":
    main()