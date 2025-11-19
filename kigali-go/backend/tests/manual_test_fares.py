"""
Manual test script for randomized fare calculation
Run this to verify fares are randomized correctly
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.trip_planning_routes import calculate_fare_estimate


def test_fare_randomization():
    """Manually test fare randomization"""
    print("=" * 60)
    print("Testing Randomized Fare Calculation")
    print("=" * 60)
    
    distance_km = 5.0
    duration_minutes = 15.0
    
    # Test Taxi fares (should be 7000, 8000, or 9000)
    print("\n1. Testing TAXI fares (should be 7,000, 8,000, or 9,000 RWF):")
    print("-" * 60)
    taxi_fares = []
    for i in range(10):
        fare = calculate_fare_estimate('taxi', distance_km, duration_minutes)
        taxi_fares.append(fare)
        print(f"  Trip {i+1}: {fare:,} RWF")
    
    unique_taxi_fares = set(taxi_fares)
    print(f"\n  Unique taxi fares: {sorted(unique_taxi_fares)}")
    print(f"  All fares valid: {all(f in [7000, 8000, 9000] for f in taxi_fares)}")
    
    # Test Moto fares (should be between 1000 and 2000)
    print("\n2. Testing MOTO fares (should be between 1,000 and 2,000 RWF):")
    print("-" * 60)
    moto_fares = []
    for i in range(10):
        fare = calculate_fare_estimate('moto', distance_km, duration_minutes)
        moto_fares.append(fare)
        print(f"  Trip {i+1}: {fare:,} RWF")
    
    min_moto = min(moto_fares)
    max_moto = max(moto_fares)
    print(f"\n  Min moto fare: {min_moto:,} RWF")
    print(f"  Max moto fare: {max_moto:,} RWF")
    print(f"  All fares in range: {all(1000 <= f <= 2000 for f in moto_fares)}")
    
    # Test Bus fares (should use distance-based calculation)
    print("\n3. Testing BUS fares (distance-based calculation):")
    print("-" * 60)
    bus_fare = calculate_fare_estimate('bus', distance_km, duration_minutes)
    print(f"  Bus fare: {bus_fare:,} RWF")
    print(f"  Fare >= 500: {bus_fare >= 500}")
    
    # Summary
    print("\n" + "=" * 60)
    print("Summary:")
    print("=" * 60)
    print(f"[OK] Taxi fares randomized: {len(unique_taxi_fares) > 1}")
    print(f"[OK] Moto fares randomized: {min_moto != max_moto}")
    print(f"[OK] All taxi fares in range [7000, 8000, 9000]: {all(f in [7000, 8000, 9000] for f in taxi_fares)}")
    print(f"[OK] All moto fares in range [1000, 2000]: {all(1000 <= f <= 2000 for f in moto_fares)}")
    print("=" * 60)


if __name__ == '__main__':
    test_fare_randomization()

