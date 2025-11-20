# 🚀 Deployment Guide

## Quick Deployment Steps

### 1. **Vercel Setup**
- Connect GitHub repo to Vercel
- Vercel auto-detects and deploys

### 2. **Environment Variables** (Vercel → Settings → Environment Variables)

**Required:**
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `JWT_SECRET_KEY` - Random secret key
- `SECRET_KEY` - Random secret key

**Optional (for email):**
- `RESEND_API_KEY` - Resend API key (or use SMTP below)
- `MAIL_SERVER` - SMTP server (e.g., `smtp.gmail.com`)
- `MAIL_USERNAME` - SMTP username
- `MAIL_PASSWORD` - SMTP password (Gmail: use App Password)
- `MAIL_PORT` - SMTP port (default: 587)

### 3. **Database Setup**
- Run `supabase_setup.sql` in Supabase SQL Editor
- Tables will be created automatically

### 4. **Deploy**
- Push to `main` branch → Auto-deploys
- Or manually redeploy in Vercel dashboard

## Email Configuration

**Option 1: Resend (requires domain verification)**
- Get API key from resend.com
- Add `RESEND_API_KEY` to Vercel

**Option 2: Gmail SMTP (works immediately)**
- Enable 2FA on Gmail
- Generate App Password
- Add to Vercel:
  - `MAIL_SERVER=smtp.gmail.com`
  - `MAIL_USERNAME=your-email@gmail.com`
  - `MAIL_PASSWORD=your-app-password`
  - `MAIL_PORT=587`
  - `MAIL_DEFAULT_SENDER=Your Name <your-email@gmail.com>`

## That's It! 🎉

Your app is live at: `https://your-project.vercel.app`








