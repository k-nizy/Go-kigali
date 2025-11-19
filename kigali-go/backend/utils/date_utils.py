"""
Date formatting utilities for KigaliGo API
"""
from datetime import datetime
import pytz

# Kigali timezone
KIGALI_TZ = pytz.timezone('Africa/Kigali')

def format_datetime(dt):
    """Format datetime to ISO string with Kigali timezone"""
    if dt is None:
        return None
    
    # Ensure datetime has timezone info
    if dt.tzinfo is None:
        dt = KIGALI_TZ.localize(dt)
    else:
        dt = dt.astimezone(KIGALI_TZ)
    
    return dt.isoformat()

def parse_datetime(dt_str):
    """Parse ISO datetime string to datetime object with timezone"""
    if not dt_str:
        return None
    
    try:
        dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        if dt.tzinfo is None:
            dt = KIGALI_TZ.localize(dt)
        return dt
    except ValueError:
        return None

def get_current_time():
    """Get current time in Kigali timezone"""
    return datetime.now(KIGALI_TZ)
