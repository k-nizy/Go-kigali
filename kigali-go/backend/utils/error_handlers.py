"""
Custom error handlers and exceptions for the KigaliGo API
"""
from flask import jsonify
from werkzeug.exceptions import HTTPException
import logging

logger = logging.getLogger(__name__)

class APIError(Exception):
    """Base error class for API exceptions"""
    status_code = 400
    
    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
    
    def to_dict(self):
        rv = dict(self.payload or ())
        rv['status'] = 'error'
        rv['message'] = self.message
        return rv

class ValidationError(APIError):
    """Raised when input validation fails"""
    status_code = 400
    
class AuthenticationError(APIError):
    """Raised when authentication fails"""
    status_code = 401

class AuthorizationError(APIError):
    """Raised when user is not authorized"""
    status_code = 403

class ResourceNotFoundError(APIError):
    """Raised when a requested resource is not found"""
    status_code = 404

class InternalServerError(APIError):
    """Raised when an unexpected error occurs"""
    status_code = 500

def register_error_handlers(app):
    """Register error handlers with the Flask app"""
    
    @app.errorhandler(APIError)
    def handle_api_error(error):
        """Handle custom API errors"""
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response
    
    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        """Handle HTTP exceptions"""
        response = {
            'status': 'error',
            'message': error.description or 'An error occurred',
            'code': error.code
        }
        if error.code == 404:
            response['message'] = 'The requested resource was not found'
        elif error.code == 500:
            logger.error(f"Internal Server Error: {error}")
            response['message'] = 'An internal server error occurred'
        
        return jsonify(response), error.code
    
    @app.errorhandler(Exception)
    def handle_generic_exception(error):
        """Handle all other exceptions"""
        logger.exception("An unexpected error occurred")
        response = {
            'status': 'error',
            'message': 'An unexpected error occurred',
            'code': 500
        }
        return jsonify(response), 500
