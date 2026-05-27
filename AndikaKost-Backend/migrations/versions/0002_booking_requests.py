"""booking requests

Revision ID: 0002_booking_requests
Revises: 0001_init
Create Date: 2026-05-27
"""

from alembic import op
import sqlalchemy as sa


revision = "0002_booking_requests"
down_revision = "0001_init"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "booking_requests",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("room_id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=30), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="submitted"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["room_id"], ["rooms.id"]),
    )
    op.create_index("idx_booking_requests_room", "booking_requests", ["room_id"])
    op.create_index("idx_booking_requests_status", "booking_requests", ["status"])
    op.create_index("idx_booking_requests_email", "booking_requests", ["email"])


def downgrade() -> None:
    op.drop_table("booking_requests")

