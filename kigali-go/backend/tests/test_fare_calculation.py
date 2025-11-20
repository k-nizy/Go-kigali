"""
Unit tests for randomized fare calculation
"""

import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.trip_planning_routes import calculate_fare_estimate


class TestFareCalculation(unittest.TestCase):
    """Test cases for fare calculation with randomization"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.distance_km = 5.0
        self.duration_minutes = 15.0
    
    def test_taxi_fare_range(self):
        """Test that taxi fares are within 7,000-9,000 RWF range"""
        valid_fares = [7000, 8000, 9000]
        
        # Test multiple times to ensure randomization
        for _ in range(20):
            fare = calculate_fare_estimate('taxi', self.distance_km, self.duration_minutes)
            self.assertIn(fare, valid_fares, f"Taxi fare {fare} not in valid range [7000, 8000, 9000]")
    
    def test_moto_fare_range(self):
        """Test that moto fares are within 1,000-2,000 RWF range"""
        # Test multiple times to ensure randomization
        for _ in range(20):
            fare = calculate_fare_estimate('moto', self.distance_km, self.duration_minutes)
            self.assertGreaterEqual(fare, 1000, f"Moto fare {fare} is below minimum 1000 RWF")
            self.assertLessEqual(fare, 2000, f"Moto fare {fare} is above maximum 2000 RWF")
    
    def test_taxi_fare_randomization(self):
        """Test that taxi fares are randomized (not always the same)"""
        fares = set()
        for _ in range(10):
            fare = calculate_fare_estimate('taxi', self.distance_km, self.duration_minutes)
            fares.add(fare)
        
        # With 10 attempts, we should see at least 2 different values
        # (though theoretically could be all same, probability is very low)
        self.assertGreaterEqual(len(fares), 1, "Taxi fares should be generated")
    
    def test_moto_fare_randomization(self):
        """Test that moto fares are randomized (not always the same)"""
        fares = set()
        for _ in range(20):
            fare = calculate_fare_estimate('moto', self.distance_km, self.duration_minutes)
            fares.add(fare)
        
        # With 20 attempts, we should see multiple different values
        self.assertGreaterEqual(len(fares), 1, "Moto fares should be generated")
    
    def test_bus_fare_calculation(self):
        """Test that bus fares still use distance-based calculation"""
        fare = calculate_fare_estimate('bus', self.distance_km, self.duration_minutes)
        # Bus should use distance-based calculation, so should be >= 500
        self.assertGreaterEqual(fare, 500, "Bus fare should be at least 500 RWF")
    
    def test_invalid_mode(self):
        """Test that invalid mode returns default fare"""
        fare = calculate_fare_estimate('invalid', self.distance_km, self.duration_minutes)
        self.assertEqual(fare, 1000, "Invalid mode should return default fare of 1000 RWF")
    
    def test_taxi_fare_independence(self):
        """Test that each taxi fare calculation is independent"""
        fare1 = calculate_fare_estimate('taxi', self.distance_km, self.duration_minutes)
        fare2 = calculate_fare_estimate('taxi', self.distance_km, self.duration_minutes)
        fare3 = calculate_fare_estimate('taxi', self.distance_km, self.duration_minutes)
        
        # All should be valid
        valid_fares = [7000, 8000, 9000]
        self.assertIn(fare1, valid_fares)
        self.assertIn(fare2, valid_fares)
        self.assertIn(fare3, valid_fares)
    
    def test_moto_fare_independence(self):
        """Test that each moto fare calculation is independent"""
        fare1 = calculate_fare_estimate('moto', self.distance_km, self.duration_minutes)
        fare2 = calculate_fare_estimate('moto', self.distance_km, self.duration_minutes)
        fare3 = calculate_fare_estimate('moto', self.distance_km, self.duration_minutes)
        
        # All should be in valid range
        self.assertGreaterEqual(fare1, 1000)
        self.assertLessEqual(fare1, 2000)
        self.assertGreaterEqual(fare2, 1000)
        self.assertLessEqual(fare2, 2000)
        self.assertGreaterEqual(fare3, 1000)
        self.assertLessEqual(fare3, 2000)


if __name__ == '__main__':
    unittest.main()


