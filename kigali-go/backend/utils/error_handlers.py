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
    
    def __init__(self, message, status_code=None, payload=None, error_code=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
        self.error_code = error_code
    
    def to_dict(self):
        rv = dict(self.payload or ())
        rv['status'] = 'error'
        rv['message'] = self.message
        rv['error_code'] = self.error_code
        if self.payload:
            rv['details'] = self.payload
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
            'code': error.code,
            'error_type': 'http_exception'
        }
        
        # Enhanced error messages for common HTTP errors
        if error.code == 400:
            response['message'] = 'Bad request - Please check your input parameters'
            response['suggestion'] = 'Verify all required fields are present and correctly formatted'
        elif error.code == 401:
            response['message'] = 'Authentication required - Please login or provide valid credentials'
            response['suggestion'] = 'Check your API key or login credentials'
        elif error.code == 403:
            response['message'] = 'Access denied - You do not have permission to perform this action'
            response['suggestion'] = 'Contact administrator if you believe this is an error'
        elif error.code == 404:
            response['message'] = 'The requested resource was not found'
            response['suggestion'] = 'Verify the resource ID or endpoint URL is correct'
        elif error.code == 405:
            response['message'] = 'Method not allowed - This endpoint does not support the HTTP method used'
            response['suggestion'] = 'Check the API documentation for allowed methods'
        elif error.code == 429:
            response['message'] = 'Too many requests - Rate limit exceeded'
            response['suggestion'] = 'Please wait before making another request'
        elif error.code == 500:
            logger.error(f"Internal Server Error: {error}")
            response['message'] = 'An internal server error occurred'
            response['suggestion'] = 'Try again later or contact support if the problem persists'
        
        return jsonify(response), error.code
    
    @app.errorhandler(Exception)
    def handle_generic_exception(error):
        """Handle all other exceptions"""
        logger.exception("An unexpected error occurred")
        
        # Get error details for debugging (only in development)
        import os
        is_debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
        
        response = {
            'status': 'error',
            'message': 'An unexpected error occurred',
            'code': 500,
            'error_type': 'server_error',
            'timestamp': logger.handlers[0].formatter.formatTime(logger.makeRecord(
                '', 0, '', 0, '', (), None
            )) if logger.handlers else None
        }
        
        if is_debug:
            response['debug'] = {
                'exception_type': type(error).__name__,
                'exception_message': str(error)
            }
        
        response['suggestion'] = 'Try again later or contact support if the problem persists'
        response['request_id'] = f"ERR-{hash(str(error)) % 100000:05d}"
        
        return jsonify(response), 500
