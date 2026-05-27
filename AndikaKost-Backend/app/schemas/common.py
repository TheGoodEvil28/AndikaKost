from pydantic import BaseModel


class SuccessResponse(BaseModel):
    data: object
    message: str = "Success"


class ListMeta(BaseModel):
    page: int
    limit: int
    total: int


class ListResponse(BaseModel):
    data: list[object]
    meta: ListMeta
