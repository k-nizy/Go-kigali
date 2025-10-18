# KigaliGo Deployment Guide

This guide covers deploying KigaliGo to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account
- Render account
- Google Maps API key
- Domain name (optional)

## Frontend Deployment (Vercel)

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `kigali-go`

### 2. Configure Build Settings

- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 3. Set Environment Variables

Add these environment variables in Vercel:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api/v1
REACT_APP_GOOGLE_MAPS_KEY=your-google-maps-api-key
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Backend Deployment (Render)

### 1. Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `kigali-go`

### 2. Configure Service Settings

- **Name**: `kigali-go-backend`
- **Root Directory**: `backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:create_app()`

### 3. Set Environment Variables

Add these environment variables in Render:

```
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
FLASK_ENV=production
```

### 4. Create PostgreSQL Database

1. In Render dashboard, click "New +" → "PostgreSQL"
2. Configure the database:
   - **Name**: `kigali-go-db`
   - **Database**: `kigali_go_db`
   - **User**: `kigali_user`
   - **Region**: Choose closest to your users

3. Copy the database URL and use it as `DATABASE_URL`

### 5. Deploy

Click "Create Web Service" and wait for deployment.

## Database Setup

After backend deployment:

1. Access your backend service URL
2. Run the seed script:
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/v1/admin/seed
   ```

## Environment Variables Reference

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://kigali-go-backend.onrender.com/api/v1` |
| `REACT_APP_GOOGLE_MAPS_KEY` | Google Maps API Key | `AIzaSy...` |

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `SECRET_KEY` | Flask secret key | `your-secret-key` |
| `GOOGLE_MAPS_API_KEY` | Google Maps API Key | `AIzaSy...` |
| `FLASK_ENV` | Flask environment | `production` |

## Custom Domain Setup

### Frontend (Vercel)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### Backend (Render)

1. Go to your service settings in Render
2. Navigate to "Custom Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## Monitoring and Maintenance

### Health Checks

- Frontend: `https://your-domain.com/health`
- Backend: `https://your-backend-url.onrender.com/health`

### Logs

- **Vercel**: Check function logs in dashboard
- **Render**: Check service logs in dashboard

### Database Backups

Render automatically backs up PostgreSQL databases. Configure backup retention in database settings.

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify all dependencies are in requirements.txt
   - Check build logs for specific errors

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check database is accessible from Render
   - Ensure database user has proper permissions

3. **API Connection Issues**
   - Verify REACT_APP_API_URL points to correct backend
   - Check CORS settings in backend
   - Verify backend is running and accessible

### Performance Optimization

1. **Frontend**
   - Enable Vercel's Edge Network
   - Use CDN for static assets
   - Implement service worker caching

2. **Backend**
   - Enable Render's auto-scaling
   - Implement database connection pooling
   - Add Redis caching layer

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to repository
   - Use strong, unique secret keys
   - Rotate API keys regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access

3. **API Security**
   - Implement rate limiting
   - Add request validation
   - Use HTTPS only

## Scaling

### Horizontal Scaling

- **Frontend**: Vercel automatically scales
- **Backend**: Render auto-scales based on traffic
- **Database**: Upgrade to higher tier as needed

### Vertical Scaling

- **Backend**: Increase memory/CPU in Render settings
- **Database**: Upgrade PostgreSQL plan in Render

## Cost Optimization

1. **Monitor Usage**
   - Track API calls and bandwidth
   - Monitor database connections
   - Review monthly bills

2. **Optimize Resources**
   - Use appropriate service tiers
   - Implement caching to reduce API calls
   - Optimize database queries

## Support

For deployment issues:

1. Check service logs
2. Review environment variables
3. Test endpoints manually
4. Contact platform support if needed

- **Vercel Support**: [vercel.com/help](https://vercel.com/help)
- **Render Support**: [render.com/docs](https://render.com/docs)
