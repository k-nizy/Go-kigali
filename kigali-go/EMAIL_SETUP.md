# 📧 Email Verification Setup Guide

## ✅ Quick Fix (Works Now!)

After registration, the API response now includes your verification token. You can verify your email immediately:

1. **After registering**, check the API response - it includes:
   - `verification_url`: Direct link to verify
   - `verification_token`: Token to use manually
   - `email_sent`: Whether email was actually sent

2. **Verify your email** by visiting:
   ```
   https://go-kigali.vercel.app/verify-email?token=YOUR_TOKEN_HERE
   ```

3. **Or use the verification URL** from the response directly.

---

## 🚀 Proper Email Setup (Recommended)

To enable **actual email sending**, set up Resend API:

### Step 1: Get Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month free)
3. Go to **API Keys** section
4. Create a new API key
5. Copy the API key (starts with `re_...`)

### Step 2: Add to Vercel Environment Variables

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project: **go-kigali**
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_your_api_key_here` (paste your Resend API key)
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**

### Step 3: Verify Domain (Optional but Recommended)

For production, you should verify your domain:

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `kigaligo.com`)
3. Add the DNS records they provide
4. Wait for verification (usually a few minutes)

**For testing**, you can use Resend's default domain which works immediately.

### Step 4: Redeploy

After adding the environment variable:

1. Go to Vercel dashboard
2. Click **Deployments**
3. Click **Redeploy** on the latest deployment
4. Or push a new commit to trigger redeployment

---

## 📝 Email Configuration

### Default Sender (Works Immediately) ✅

By default, the app uses **Resend's default domain** (`onboarding@resend.dev`), which allows sending to **any email address** without domain verification. This works right away - no setup needed!

**Emails will come from:** `KigaliGo <onboarding@resend.dev>`

### Custom Sender (Optional)

If you want to use your own domain (e.g., `support@kigaligo.com`):

1. **Verify your domain in Resend**:
   - Go to Resend dashboard → **Domains**
   - Add your domain (e.g., `kigaligo.com`)
   - Add the DNS records they provide
   - Wait for verification

2. **Set custom sender in Vercel**:
   - Add environment variable:
     - **Name**: `MAIL_DEFAULT_SENDER`
     - **Value**: `KigaliGo <support@yourdomain.com>`
     - **Note**: Must use a verified domain in Resend

---

## 🧪 Testing

### Test 1: Registration with Email

1. Register a new account
2. Check the API response - it should show `email_sent: true` if Resend is configured
3. Check your email inbox for the verification email
4. Click the verification link

### Test 2: Check Vercel Logs

If emails aren't being sent:

1. Go to Vercel dashboard → **Deployments** → Click on latest deployment
2. Go to **Functions** tab
3. Check the logs for email-related errors
4. Look for: `"Verification email sent successfully"` or error messages

---

## 🔧 Troubleshooting

### Emails Not Sending?

1. **Check RESEND_API_KEY is set**:
   - Go to Vercel → Settings → Environment Variables
   - Verify `RESEND_API_KEY` exists and is correct

2. **Check Resend Dashboard**:
   - Go to https://resend.com/emails
   - See if emails are being sent
   - Check for any error messages

3. **Check Vercel Logs**:
   - Look for error messages about Resend API
   - Common errors:
     - `401 Unauthorized`: Invalid API key
     - `403 Forbidden`: Domain not verified
     - `422 Unprocessable`: Invalid email format

### Still Using Token in Response?

The registration endpoint currently returns the verification token in the response as a **temporary measure**. Once email is working reliably, you can remove it for security.

To remove the token from response:
- Edit `backend/app/resources/auth.py`
- Remove `'verification_token': verification_token` from the response

---

## 📚 Alternative Email Services

If you prefer a different email service:

### SendGrid
- Free tier: 100 emails/day
- Update `send_verification_email()` to use SendGrid API

### AWS SES
- Very cheap ($0.10 per 1,000 emails)
- Requires AWS account setup

### Mailgun
- Free tier: 5,000 emails/month
- Good for production use

---

## ✅ Summary

**Right Now:**
- ✅ Registration returns verification token in response
- ✅ You can verify immediately using the token
- ⚠️ No actual emails sent (until Resend is configured)

**After Resend Setup:**
- ✅ Real emails sent to users
- ✅ Professional email templates
- ✅ Better user experience
- ✅ More secure (no tokens in API responses)

---

**Need Help?** Check Vercel logs or Resend dashboard for detailed error messages.

