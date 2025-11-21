"""Utility helpers for seeding demo vehicles near Kigali."""
from __future__ import annotations

import math
import random
import string
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Optional, Tuple

from app.extensions import db
from models.vehicle import Vehicle

# Default Kigali coordinates (Nyabugogo bus terminal)
DEFAULT_CENTER = {"lat": -1.9441, "lng": 30.0619}

VEHICLE_SPEEDS = {
    "bus": (25, 40),
    "taxi": (30, 55),
    "moto": (35, 65),
}

VEHICLE_CAPACITY = {
    "bus": 60,
    "taxi": 4,
    "moto": 1,
}

PRESET_SPOTS = [
    ("City Center", -1.9500, 30.0580),
    ("Nyabugogo", -1.9441, 30.0619),
    ("Remera", -1.9300, 30.1100),
    ("Kimironko", -1.9200, 30.0900),
    ("Kicukiro", -1.9700, 30.0900),
]


def _random_registration(vehicle_type: str) -> str:
    prefix = {
        "bus": "KB",
        "taxi": "KT",
        "moto": "KM",
    }.get(vehicle_type, "KG")
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{prefix}-{suffix}"


def _random_coordinate(center: Dict[str, float], radius_km: float) -> Tuple[float, float]:
    """Return a random lat/lng within radius_km of center."""
    # Convert radius from km to degrees approximately
    radius_deg = radius_km / 111.0
    u = random.random()
    v = random.random()
    w = radius_deg * (u ** 0.5)
    theta = 2 * 3.1415926535 * v
    lat_offset = w * math.cos(theta)
    lng_offset = w * math.sin(theta) / max(0.01, math.cos(math.radians(center["lat"])))
    return center["lat"] + lat_offset, center["lng"] + lng_offset


@dataclass
class SeedConfig:
    total: int = 20
    per_type: Optional[Dict[str, int]] = None
    radius_km: float = 5.0
    center: Optional[Dict[str, float]] = None
    include_presets: bool = True

    def resolve_counts(self) -> Dict[str, int]:
        if self.per_type:
            return self.per_type
        base = {"bus": 8, "taxi": 6, "moto": 6}
        total = sum(base.values())
        if self.total == total:
            return base
        scale = self.total / float(total)
        return {k: max(1, int(v * scale)) for k, v in base.items()}


class VehicleSeeder:
    """Creates demo vehicles with randomized positions near Kigali."""

    def __init__(self, session=None):
        self.session = session or db.session

    def seed(self, config: SeedConfig) -> Dict[str, int]:
        center = config.center or DEFAULT_CENTER
        counts = config.resolve_counts()
        created = 0
        reused = 0

        for vehicle_type, count in counts.items():
            for _ in range(count):
                vehicle = self._create_or_update_vehicle(vehicle_type, center, config.radius_km)
                if vehicle is None:
                    reused += 1
                else:
                    created += 1

        if config.include_presets:
            for name, lat, lng in PRESET_SPOTS:
                vehicle = self._ensure_vehicle_at_location("bus", lat, lng, route_name=name)
                if vehicle:
                    created += 1

        self.session.commit()
        return {"created": created, "reused": reused, "total_active": self._active_count()}

    def _create_or_update_vehicle(self, vehicle_type: str, center: Dict[str, float], radius_km: float):
        lat, lng = _random_coordinate(center, radius_km)
        registration = _random_registration(vehicle_type)
        existing = (
            self.session.query(Vehicle)
            .filter(Vehicle.registration == registration)
            .one_or_none()
        )
        if existing:
            existing.update_location(lat, lng, bearing=random.uniform(0, 360), speed=self._random_speed(vehicle_type))
            existing.vehicle_type = vehicle_type
            return None

        vehicle = Vehicle(
            vehicle_type=vehicle_type,
            registration=registration,
            operator="KigaliGo",
            capacity=VEHICLE_CAPACITY.get(vehicle_type, 4),
            is_active=True,
            is_available=True,
            route_name=f"{vehicle_type.title()} Loop",
        )
        vehicle.update_location(lat, lng, bearing=random.uniform(0, 360), speed=self._random_speed(vehicle_type))
        self.session.add(vehicle)
        return vehicle

    def _ensure_vehicle_at_location(self, vehicle_type: str, lat: float, lng: float, route_name: str):
        existing = (
            self.session.query(Vehicle)
            .filter(
                Vehicle.vehicle_type == vehicle_type,
                Vehicle.route_name == route_name,
            )
            .first()
        )
        if existing:
            existing.update_location(lat, lng, bearing=random.uniform(0, 360), speed=self._random_speed(vehicle_type))
            return None

        vehicle = Vehicle(
            vehicle_type=vehicle_type,
            registration=_random_registration(vehicle_type),
            operator="KigaliGo",
            capacity=VEHICLE_CAPACITY.get(vehicle_type, 4),
            route_name=route_name,
            is_active=True,
            is_available=True,
        )
        vehicle.update_location(lat, lng, bearing=random.uniform(0, 360), speed=self._random_speed(vehicle_type))
        self.session.add(vehicle)
        return vehicle

    def _random_speed(self, vehicle_type: str) -> float:
        low, high = VEHICLE_SPEEDS.get(vehicle_type, (25, 45))
        return round(random.uniform(low, high), 1)

    def _active_count(self) -> int:
        return self.session.query(Vehicle).filter(Vehicle.is_active == True).count()


def seed_default(count: int = 20) -> Dict[str, int]:
    """Seed vehicles using default config."""
    config = SeedConfig(total=count)
    seeder = VehicleSeeder()
    return seeder.seed(config)
