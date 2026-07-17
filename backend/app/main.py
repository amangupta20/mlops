import asyncio
import base64
from contextlib import asynccontextmanager
from time import perf_counter
from typing import Annotated

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from app.domain.model_ids import ModelName
from app.services import inference


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.yolo_models = inference.load_model()
    app.state.inference_slots = asyncio.Semaphore(5)
    print("Models loaded successfully.")
    yield
    app.state.yolo_models.clear()
    print("Models cleared from memory.")


app = FastAPI(lifespan=lifespan)


@app.post("/infer")
async def run_inference(
    request: Request,
    image: Annotated[UploadFile, File(...)],
    model_name: Annotated[ModelName, Form()] = ModelName.YOLO26N,
    confidence: Annotated[
        float,
        Form(ge=0.0, le=1.0),
    ] = 0.25,
):
    start_time = perf_counter()
    if not image:
        raise HTTPException(status_code=400, detail="No image provided for inference.")
    ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Only JPEG and PNG images are supported",
        )
    max_image_size = 10 * 1024 * 1024  # 10 MB
    if image.size is not None and image.size > max_image_size:
        raise HTTPException(
            status_code=413, detail="Image size exceeds the maximum limit of 10 MB."
        )
    model = app.state.yolo_models.get(model_name)
    if model is None:
        raise HTTPException(status_code=400, detail=f"Model {model_name} not found.")

    image_data = await image.read()
    try:
        async with request.app.state.inference_slots:
            result_bytes, detections = await asyncio.to_thread(
                inference.infer, image_data, model, confidence
            )
    except inference.InvalidImageError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    elapsed_time = (perf_counter() - start_time) * 1000
    return JSONResponse(
        content={
            "image": {
                "content_type": "image/jpeg",
                "base64": base64.b64encode(result_bytes).decode("ascii"),
            },
            "detections": detections,
        },
        headers={
            "X-Processing-Time": f"{elapsed_time:.2f} ms",
            "X-Model-Used": model_name.value,
        },
    )


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
