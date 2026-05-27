from pydantic import BaseModel


class LoginRequest(BaseModel):
    # PoC: accept emails like "admin@...local" without strict TLD validation
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MeResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str | None
    role: str
