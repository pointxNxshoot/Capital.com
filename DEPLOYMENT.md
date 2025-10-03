# Capital.com Deployment Guide

## 🚀 Production Deployment to get-capital.com.au

### Prerequisites
- Domain: `get-capital.com.au` (and `www.get-capital.com.au`)
- Hosting: Vercel (recommended) or similar
- Database: Managed PostgreSQL (Vercel Postgres, Supabase, or PlanetScale)
- Google Cloud Console access

---

## Step 1: Database Setup

### Option A: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard → Your Project → Storage
2. Create a new Postgres database
3. Copy the connection string to use as `DATABASE_URL`

### Option B: Supabase
1. Create a new project at supabase.com
2. Go to Settings → Database
3. Copy the connection string

### Option C: PlanetScale
1. Create a new database at planetscale.com
2. Get the connection string from the dashboard

---

## Step 2: Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to APIs & Services → Credentials
4. Edit your OAuth 2.0 Client ID
5. Update **Authorized JavaScript origins**:
   - `https://get-capital.com.au`
   - `https://www.get-capital.com.au`
6. Update **Authorized redirect URIs**:
   - `https://get-capital.com.au/api/auth/callback/google`
   - `https://www.get-capital.com.au/api/auth/callback/google`
7. Copy the Client ID and Client Secret

---

## Step 3: Vercel Deployment

### 3.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the Capital.com repository

### 3.2 Configure Environment Variables
In Vercel Project Settings → Environment Variables, add:

```bash
NEXTAUTH_URL=https://get-capital.com.au
NEXTAUTH_SECRET=your-super-secret-key-here
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
DATABASE_URL=your-production-database-url
```

### 3.3 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Note the deployment URL (e.g., `https://capital-com-abc123.vercel.app`)

---

## Step 4: Domain Configuration

### 4.1 Add Domain in Vercel
1. Go to Project → Settings → Domains
2. Add `get-capital.com.au`
3. Add `www.get-capital.com.au`
4. Copy the DNS records provided by Vercel

### 4.2 Update DNS Records
In your domain registrar (e.g., GoDaddy, Namecheap):

**For root domain (get-capital.com.au):**
- Type: A
- Name: @
- Value: 76.76.21.21

**For www subdomain:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

**Wait 5-30 minutes for DNS propagation**

---

## Step 5: Database Migration

Run the production database migration:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run migration
npx prisma migrate deploy
```

---

## Step 6: Verification

### 6.1 Health Check
```bash
curl -i https://get-capital.com.au/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

### 6.2 Authentication Test
1. Visit: `https://get-capital.com.au/api/auth/signin`
2. Test both email/password and Google OAuth
3. Verify user data is saved to database

### 6.3 API Endpoints Test
```bash
# Test authentication endpoints
curl -I https://get-capital.com.au/api/auth/signin
curl -I https://get-capital.com.au/api/auth/signup

# Test other API endpoints
curl -I https://get-capital.com.au/api/companies
curl -I https://get-capital.com.au/api/listings
```

---

## Step 7: SSL and Security

Vercel automatically provides SSL certificates. Verify:
1. Site loads with `https://`
2. No mixed content warnings
3. Security headers are present

---

## Step 8: Monitoring and Analytics

### 8.1 Vercel Analytics
1. Go to Project → Analytics
2. Enable Vercel Analytics for performance monitoring

### 8.2 Error Monitoring (Optional)
Consider adding Sentry or similar for error tracking.

---

## Troubleshooting

### Common Issues

**1. "Invalid redirect URI" error**
- Check Google OAuth redirect URIs match exactly
- Ensure no trailing slashes

**2. Database connection errors**
- Verify DATABASE_URL is correct
- Check database is accessible from Vercel
- Run `npx prisma migrate deploy`

**3. NextAuth errors**
- Verify NEXTAUTH_URL matches your domain exactly
- Check NEXTAUTH_SECRET is set
- Ensure all environment variables are set

**4. DNS not working**
- Wait longer for propagation (up to 48 hours)
- Check DNS records are correct
- Use `dig get-capital.com.au` to verify

### Debug Commands

```bash
# Check DNS resolution
dig get-capital.com.au
nslookup get-capital.com.au

# Test SSL
openssl s_client -connect get-capital.com.au:443

# Check environment variables
vercel env ls
```

---

## Production Checklist

- [ ] Domain added to Vercel
- [ ] DNS records updated
- [ ] Environment variables set
- [ ] Google OAuth configured
- [ ] Database migration run
- [ ] Health check passes
- [ ] Authentication works
- [ ] SSL certificate active
- [ ] All API endpoints accessible

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test locally with production environment variables
4. Check Google Cloud Console for OAuth errors

Your Capital.com application should now be live at `https://get-capital.com.au`! 🎉
