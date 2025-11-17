# 📧 Email Verification Setup Guide

## ⚠️ Important: Domain Verification Required

**Resend's free tier requires domain verification to send emails to any recipient.** Without a verified domain, you can only send emails to your own account email address.

## ✅ Current Solution (Works Now!)

The app is configured to **always return verification tokens in the API response**. This means:

1. **After registration**, the API response includes:
   - `verification_url`: Direct link to verify your email
   - `verification_token`: Token to use manually
   - `email_sent`: `false` (until domain is verified)

2. **To verify your email**, use the `verification_url` from the response or visit:
   ```
   https://go-kigali.vercel.app/verify-email?token=YOUR_TOKEN_HERE
   ```

3. **For password reset**, the API also returns the reset token in the response.

---

## 🚀 Enable Real Email Sending (Required for Production)

To send actual emails to users, you **must verify a domain** in Resend:

### Step 1: Verify Your Domain in Resend

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `kigaligo.com` or `yourdomain.com`)
4. Resend will provide DNS records to add:
   - **SPF record** (TXT)
   - **DKIM record** (TXT)
   - **DMARC record** (TXT) - optional but recommended

5. **Add these DNS records** to your domain's DNS settings:
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Find DNS settings
   - Add the TXT records provided by Resend
   - Wait 5-15 minutes for DNS propagation

6. **Return to Resend** and click **"Verify"**
7. Wait for verification (usually takes a few minutes)

### Step 2: Update Vercel Environment Variables

Once your domain is verified:

1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Add/Update:
   - **Name**: `MAIL_DEFAULT_SENDER`
   - **Value**: `KigaliGo <noreply@yourdomain.com>` (use your verified domain)
   - **Environment**: Production, Preview, Development
3. Click **Save**

### Step 3: Redeploy

1. Go to Vercel → **Deployments**
2. Click **Redeploy** on the latest deployment
3. Wait 2-3 minutes for deployment

### Step 4: Test

1. Register a new account
2. Check your email inbox (not spam folder)
3. You should receive the verification email
4. Check Vercel logs - should see: `"Verification email sent successfully"`

---

## 📝 Email Configuration

### Current Default (No Domain Verification)

- **Sender**: `KigaliGo <onboarding@resend.dev>`
- **Status**: ❌ **Does NOT work** - Resend requires domain verification
- **Result**: Emails fail with 403 error, but tokens are returned in API response

### After Domain Verification

- **Sender**: `KigaliGo <noreply@yourdomain.com>` (your verified domain)
- **Status**: ✅ **Works** - Can send to any email address
- **Result**: Real emails are sent successfully

---

## 🔧 Troubleshooting

### Error: "403 - You can only send testing emails to your own email address"

**Cause**: Domain not verified in Resend

**Solution**: 
1. Verify your domain in Resend (see Step 1 above)
2. Set `MAIL_DEFAULT_SENDER` to use your verified domain
3. Redeploy

### Emails Not Sending?

1. **Check domain verification**:
   - Go to Resend dashboard → Domains
   - Ensure your domain shows "Verified" status
   - If not verified, check DNS records are correct

2. **Check Vercel environment variables**:
   - Verify `RESEND_API_KEY` is set correctly
   - Verify `MAIL_DEFAULT_SENDER` uses your verified domain

3. **Check Vercel logs**:
   - Look for: `"Verification email sent successfully"` (success)
   - Look for: `"Resend API error"` (failure)
   - Check error messages for details

4. **Check Resend dashboard**:
   - Go to https://resend.com/emails
   - See if emails are being sent
   - Check for error messages

### Still Getting 403 Errors?

- ✅ **Tokens are always returned in API response** - users can verify manually
- ✅ **Registration still succeeds** - email failure doesn't block signup
- ⚠️ **To enable real emails**: Verify domain in Resend (required)

---

## 📚 Alternative Solutions

If you don't want to verify a domain, consider:

### Option 1: Use a Different Email Service

- **SendGrid**: Free tier (100 emails/day), easier setup
- **AWS SES**: Very cheap, requires AWS account
- **Mailgun**: Free tier (5,000 emails/month)

### Option 2: Use Your Own SMTP Server

- Configure Gmail SMTP (requires app password)
- Configure custom SMTP server
- Update `MAIL_SERVER`, `MAIL_USERNAME`, `MAIL_PASSWORD` in config

### Option 3: Keep Current Setup (Manual Verification)

- Users get tokens in API response
- They can verify manually using the verification URL
- No email service needed
- Works immediately, but less user-friendly

---

## ✅ Summary

**Current Status:**
- ✅ Registration works - tokens returned in response
- ✅ Users can verify email manually using the token
- ❌ Real emails not sent (domain verification required)
- ✅ App continues to work even when emails fail

**To Enable Real Emails:**
1. Verify domain in Resend (required)
2. Set `MAIL_DEFAULT_SENDER` to verified domain
3. Redeploy

**For Now:**
- Users can verify using the `verification_url` from the API response
- No email service needed for basic functionality
- Email sending is optional enhancement

---

**Need Help?** 
- Check Vercel logs for detailed error messages
- Check Resend dashboard for email status
- Verify DNS records are correct if domain verification fails
