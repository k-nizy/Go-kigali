"""
Saved Locations API routes for user's favorite places
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from models.saved_location import SavedLocation
from models.user import User
from datetime import datetime

saved_locations_bp = Blueprint('saved_locations', __name__)


@saved_locations_bp.route('/', methods=['GET'])
@jwt_required()
def get_saved_locations():
    """Get all saved locations for current user"""
    try:
        user_id = get_jwt_identity()
        
        locations = db.session.query(SavedLocation).filter_by(
            user_id=user_id
        ).order_by(SavedLocation.location_type, SavedLocation.name).all()
        
        return jsonify({
            'locations': [loc.to_dict() for loc in locations],
            'count': len(locations)
        })
        
    except Exception as e:
        current_app.logger.error(f'Error fetching saved locations: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@saved_locations_bp.route('/', methods=['POST'])
@jwt_required()
def create_saved_location():
    """Create a new saved location"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        
        name = data.get('name')
        location_type = data.get('location_type', 'custom')
        address = data.get('address')
        lat = float(data.get('lat', 0))
        lng = float(data.get('lng', 0))
        is_default = data.get('is_default', False)
        
        if not name or not lat or not lng:
            return jsonify({'error': 'Name, lat, and lng are required'}), 400
        
        if location_type not in ['home', 'work', 'custom']:
            return jsonify({'error': 'Invalid location_type. Must be home, work, or custom'}), 400
        
        # If setting as default, unset other defaults of same type
        if is_default:
            db.session.query(SavedLocation).filter_by(
                user_id=user_id,
                location_type=location_type
            ).update({'is_default': False})
        
        # Check if location type already exists (only one home/work allowed)
        if location_type in ['home', 'work']:
            existing = db.session.query(SavedLocation).filter_by(
                user_id=user_id,
                location_type=location_type
            ).first()
            
            if existing:
                # Update existing instead of creating new
                existing.name = name
                existing.address = address
                existing.lat = lat
                existing.lng = lng
                existing.is_default = is_default
                existing.updated_at = datetime.utcnow()
                db.session.commit()
                
                return jsonify({
                    'message': 'Location updated',
                    'location': existing.to_dict()
                }), 200
        
        # Create new location
        location = SavedLocation(
            user_id=user_id,
            name=name,
            location_type=location_type,
            address=address,
            lat=lat,
            lng=lng,
            is_default=is_default
        )
        
        db.session.add(location)
        db.session.commit()
        
        return jsonify({
            'message': 'Location saved',
            'location': location.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creating saved location: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@saved_locations_bp.route('/<int:location_id>', methods=['PUT'])
@jwt_required()
def update_saved_location(location_id):
    """Update a saved location"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        
        location = db.session.query(SavedLocation).filter_by(
            id=location_id,
            user_id=user_id
        ).first()
        
        if not location:
            return jsonify({'error': 'Location not found'}), 404
        
        # Update fields
        if 'name' in data:
            location.name = data['name']
        if 'address' in data:
            location.address = data['address']
        if 'lat' in data:
            location.lat = float(data['lat'])
        if 'lng' in data:
            location.lng = float(data['lng'])
        if 'is_default' in data:
            is_default = data['is_default']
            if is_default:
                # Unset other defaults of same type
                db.session.query(SavedLocation).filter_by(
                    user_id=user_id,
                    location_type=location.location_type
                ).filter(SavedLocation.id != location_id).update({'is_default': False})
            location.is_default = is_default
        
        location.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Location updated',
            'location': location.to_dict()
        })
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating saved location: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@saved_locations_bp.route('/<int:location_id>', methods=['DELETE'])
@jwt_required()
def delete_saved_location(location_id):
    """Delete a saved location"""
    try:
        user_id = get_jwt_identity()
        
        location = db.session.query(SavedLocation).filter_by(
            id=location_id,
            user_id=user_id
        ).first()
        
        if not location:
            return jsonify({'error': 'Location not found'}), 404
        
        db.session.delete(location)
        db.session.commit()
        
        return jsonify({'message': 'Location deleted'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting saved location: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


