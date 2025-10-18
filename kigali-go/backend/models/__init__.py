"""
Database models for KigaliGo application
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

# Import all models to ensure they're registered
from .user import User
from .vehicle import Vehicle
from .zone import Zone
from .stop import Stop
from .trip import Trip
from .report import Report
from .fare_rule import FareRule

__all__ = [
    'db', 'User', 'Vehicle', 'Zone', 'Stop', 'Trip', 'Report', 'FareRule'
]
