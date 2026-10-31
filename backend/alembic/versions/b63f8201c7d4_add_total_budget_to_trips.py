"""add total budget to trips

Revision ID: b63f8201c7d4
Revises: a008a73f9a0f
Create Date: 2026-10-29 15:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b63f8201c7d4"
down_revision: Union[str, Sequence[str], None] = "a008a73f9a0f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("trips", sa.Column("total_budget", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("trips", "total_budget")
