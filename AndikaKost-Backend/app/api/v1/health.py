from fastapi import APIRouter


router = APIRouter()


@router.get("")
def health():
    return {"data": {"status": "ok"}, "message": "Success"}
