"""
Email utilities for sending verification and reset emails
"""
from flask import current_app
import logging

logger = logging.getLogger(__name__)


def send_verification_email(email: str, token: str) -> None:
    """
    Send email verification link
    
    In production, integrate with email service (SendGrid, AWS SES, etc.)
    For development, token is logged
    
    Args:
        email: User email address
        token: Verification token
    """
    verification_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/verify-email?token={token}"
    
    # TODO: Integrate with actual email service
    # Example with Flask-Mail:
    # msg = Message(
    #     subject="Verify your KigaliGo account",
    #     recipients=[email],
    #     html=render_template('email/verification.html', url=verification_url)
    # )
    # mail.send(msg)
    
    logger.info(f"Verification email would be sent to {email}")
    logger.info(f"Verification URL: {verification_url}")


def send_password_reset_email(email: str, token: str) -> None:
    """
    Send password reset link
    
    In production, integrate with email service
    For development, token is logged
    
    Args:
        email: User email address
        token: Reset token
    """
    reset_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token={token}"
    
    # TODO: Integrate with actual email service
    # Example with Flask-Mail:
    # msg = Message(
    #     subject="Reset your KigaliGo password",
    #     recipients=[email],
    #     html=render_template('email/reset_password.html', url=reset_url)
    # )
    # mail.send(msg)
    
    logger.info(f"Password reset email would be sent to {email}")
    logger.info(f"Reset URL: {reset_url}")
