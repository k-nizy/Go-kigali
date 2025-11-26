# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of KigaliGo seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

📧 **security@kigaligo.com** (or your team email)

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

### Preferred Languages

We prefer all communications to be in English.

### Security Update Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release new security patch versions as soon as possible

### Disclosure Policy

- Security issues are disclosed via GitHub Security Advisories
- We will coordinate the disclosure timing with the reporter
- We aim to fully disclose vulnerabilities within 90 days of the initial report

### Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request.

## Security Best Practices for Users

### For Deployment

- Always use HTTPS in production
- Keep your dependencies up to date
- Use strong, unique secret keys
- Enable rate limiting on sensitive endpoints
- Regularly rotate API keys and tokens
- Use environment variables for sensitive data
- Enable database SSL connections
- Implement proper CORS policies
- Use secure password hashing (we use bcrypt with 12 rounds)
- Enable HTTP-only cookies for refresh tokens

### For Development

- Never commit secrets to the repository
- Use `.env` files for local development (never commit these)
- Keep your local dependencies updated
- Run security audits regularly:
  ```bash
  # Frontend
  npm audit
  
  # Backend
  pip-audit
  ```

## Known Security Features

KigaliGo implements the following security measures:

- ✅ JWT token authentication with rotation
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Rate limiting on sensitive endpoints
- ✅ HTTP-only cookies for refresh tokens
- ✅ Token revocation/blocklist
- ✅ Email verification
- ✅ Password reset with time-limited tokens
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ SQL injection protection (SQLAlchemy ORM)

## Security Contacts

- **Security Team**: security@kigaligo.com
- **Project Maintainers**: Team KigaliMobility

---

Thank you for helping keep KigaliGo and our users safe! 🛡️
