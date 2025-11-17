"""
Email utilities for sending verification and reset emails
"""
from flask import current_app
import logging
import os
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)


def send_verification_email(email: str, token: str) -> bool:
    """
    Send email verification link using Resend API
    
    Args:
        email: User email address
        token: Verification token
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    verification_url = f"{current_app.config.get('FRONTEND_URL', 'https://go-kigali.vercel.app')}/verify-email?token={token}"
    
    # Try Resend API first (recommended for production)
    resend_api_key = os.getenv('RESEND_API_KEY')
    if resend_api_key:
        try:
            # Use Resend's default domain if no custom sender is configured
            # This allows sending to any email without domain verification
            default_sender = current_app.config.get('MAIL_DEFAULT_SENDER')
            # If sender is not set or uses the default unverified domain, use Resend's default
            if not default_sender or default_sender == 'noreply@kigaligo.com' or '@kigaligo.com' in default_sender:
                # Use Resend's default domain (works without verification)
                from_email = 'KigaliGo <onboarding@resend.dev>'
            else:
                # Use the custom sender (must be a verified domain in Resend)
                from_email = default_sender
            
            response = requests.post(
                'https://api.resend.com/emails',
                headers={
                    'Authorization': f'Bearer {resend_api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'from': from_email,
                    'to': [email],
                    'subject': 'Verify your KigaliGo account',
                    'html': f'''
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                            .button {{ display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                            .button:hover {{ background-color: #0056b3; }}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Welcome to KigaliGo!</h2>
                            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
                            <a href="{verification_url}" class="button">Verify Email Address</a>
                            <p>Or copy and paste this link into your browser:</p>
                            <p><a href="{verification_url}">{verification_url}</a></p>
                            <p>This link will expire in 24 hours.</p>
                            <p>If you didn't create an account, please ignore this email.</p>
                        </div>
                    </body>
                    </html>
                    '''
                },
                timeout=10
            )
            
            if response.status_code == 200:
                logger.info(f"Verification email sent successfully to {email} via Resend")
                return True
            else:
                # Resend failed, try SMTP fallback
                logger.info(f"Resend failed, trying SMTP fallback")
                
        except Exception as e:
            logger.info(f"Resend error, trying SMTP fallback: {str(e)}")
    
    # Fallback to SMTP if Resend fails or is not configured
    html_body = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Welcome to KigaliGo!</h2>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <a href="{verification_url}" class="button">Verify Email Address</a>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="{verification_url}">{verification_url}</a></p>
            <p>This link will expire in 24 hours.</p>
        </div>
    </body>
    </html>
    '''
    return _send_email_via_smtp(email, 'Verify your KigaliGo account', html_body)


def send_password_reset_email(email: str, token: str) -> bool:
    """
    Send password reset link using Resend API
    
    Args:
        email: User email address
        token: Reset token
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    reset_url = f"{current_app.config.get('FRONTEND_URL', 'https://go-kigali.vercel.app')}/reset-password?token={token}"
    
    # Try Resend API first
    resend_api_key = os.getenv('RESEND_API_KEY')
    if resend_api_key:
        try:
            # Use Resend's default domain if no custom sender is configured
            default_sender = current_app.config.get('MAIL_DEFAULT_SENDER')
            # If sender is not set or uses the default unverified domain, use Resend's default
            if not default_sender or default_sender == 'noreply@kigaligo.com' or '@kigaligo.com' in default_sender:
                # Use Resend's default domain (works without verification)
                from_email = 'KigaliGo <onboarding@resend.dev>'
            else:
                # Use the custom sender (must be a verified domain in Resend)
                from_email = default_sender
            
            response = requests.post(
                'https://api.resend.com/emails',
                headers={
                    'Authorization': f'Bearer {resend_api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'from': from_email,
                    'to': [email],
                    'subject': 'Reset your KigaliGo password',
                    'html': f'''
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                            .button {{ display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                            .button:hover {{ background-color: #c82333; }}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Password Reset Request</h2>
                            <p>You requested to reset your password. Click the button below to reset it:</p>
                            <a href="{reset_url}" class="button">Reset Password</a>
                            <p>Or copy and paste this link into your browser:</p>
                            <p><a href="{reset_url}">{reset_url}</a></p>
                            <p>This link will expire in 1 hour.</p>
                            <p>If you didn't request a password reset, please ignore this email.</p>
                        </div>
                    </body>
                    </html>
                    '''
                },
                timeout=10
            )
            
            if response.status_code == 200:
                logger.info(f"Password reset email sent successfully to {email} via Resend")
                return True
            else:
                # Resend failed, try SMTP fallback
                logger.info(f"Resend failed, trying SMTP fallback")
                
        except Exception as e:
            logger.info(f"Resend error, trying SMTP fallback: {str(e)}")
    
    # Fallback to SMTP if Resend fails or is not configured
    html_body = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="{reset_url}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="{reset_url}">{reset_url}</a></p>
            <p>This link will expire in 1 hour.</p>
        </div>
    </body>
    </html>
    '''
    return _send_email_via_smtp(email, 'Reset your KigaliGo password', html_body)


def _send_email_via_smtp(to_email: str, subject: str, html_body: str) -> bool:
    """
    Send email via SMTP (fallback when Resend fails)
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_body: HTML email content
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        mail_server = current_app.config.get('MAIL_SERVER', '')
        mail_port = current_app.config.get('MAIL_PORT', 587)
        mail_username = current_app.config.get('MAIL_USERNAME', '')
        mail_password = current_app.config.get('MAIL_PASSWORD', '')
        mail_use_tls = current_app.config.get('MAIL_USE_TLS', True)
        mail_sender = current_app.config.get('MAIL_DEFAULT_SENDER', 'noreply@kigaligo.com')
        
        # Check if SMTP is configured
        if not mail_server or not mail_username or not mail_password:
            logger.debug("SMTP not configured, skipping email send")
            return False
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = mail_sender
        msg['To'] = to_email
        
        # Add HTML content
        html_part = MIMEText(html_body, 'html')
        msg.attach(html_part)
        
        # Send email
        if mail_use_tls:
            server = smtplib.SMTP(mail_server, mail_port)
            server.starttls()
        else:
            server = smtplib.SMTP_SSL(mail_server, mail_port)
        
        server.login(mail_username, mail_password)
        server.send_message(msg)
        server.quit()
        
        logger.info(f"Email sent successfully to {to_email} via SMTP")
        return True
        
    except Exception as e:
        logger.error(f"Error sending email via SMTP: {str(e)}")
        return False
