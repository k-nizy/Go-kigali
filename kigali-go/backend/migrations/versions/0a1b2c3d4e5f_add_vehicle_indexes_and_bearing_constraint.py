"""add vehicle indexes and bearing constraint

Revision ID: 0a1b2c3d4e5f
Revises: 68ce02d261b8
Create Date: 2025-11-21 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0a1b2c3d4e5f'
down_revision = '68ce02d261b8'
branch_labels = None
depends_on = None

def upgrade():
    # Add indexes for performance
    op.create_index('ix_vehicles_active', 'vehicles', ['is_active'], unique=False)
    op.create_index('ix_vehicles_vehicle_type', 'vehicles', ['vehicle_type'], unique=False)
    op.create_index('ix_vehicles_lat_lng', 'vehicles', ['current_lat', 'current_lng'], unique=False)

    # Add bearing check constraint (0 <= bearing < 360)
    # Note: bearing may be NULL; constraint applies when not NULL
    op.create_check_constraint(
        'ck_vehicles_bearing_range',
        'vehicles',
        '(bearing IS NULL) OR (bearing >= 0 AND bearing < 360)'
    )


def downgrade():
    # Drop constraint and indexes
    op.drop_constraint('ck_vehicles_bearing_range', 'vehicles', type_='check')
    op.drop_index('ix_vehicles_lat_lng', table_name='vehicles')
    op.drop_index('ix_vehicles_vehicle_type', table_name='vehicles')
    op.drop_index('ix_vehicles_active', table_name='vehicles')
