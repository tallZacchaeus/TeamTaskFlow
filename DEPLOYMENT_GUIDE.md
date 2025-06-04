# Vercel Deployment Guide

## Prerequisites

1. **PostgreSQL Database**: Set up a database with a provider like:
   - Neon (recommended)
   - Supabase
   - PlanetScale
   - Railway
   - Heroku Postgres

2. **Vercel Account**: Sign up at vercel.com

## Step-by-Step Deployment

### 1. Database Setup

Create a PostgreSQL database and obtain the connection URL in this format:
```
postgresql://username:password@host:port/database
```

### 2. Push Database Schema

Before deploying, run this command locally to create the database tables:

```bash
# Set your DATABASE_URL in .env file
echo "DATABASE_URL=your_postgresql_url_here" > .env

# Install dependencies
npm install

# Push schema to database
npm run db:push
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow the prompts to link your project
```

#### Option B: Using Vercel Dashboard

1. Push your code to GitHub/GitLab
2. Go to vercel.com and click "New Project"
3. Import your repository
4. Configure build settings (should auto-detect from vercel.json)

### 4. Environment Variables

In Vercel dashboard, add these environment variables:

```
DATABASE_URL=your_postgresql_connection_url
SESSION_SECRET=your_secure_random_string_min_32_chars
NODE_ENV=production
PGHOST=your_postgres_host
PGPORT=5432
PGUSER=your_postgres_username
PGPASSWORD=your_postgres_password
PGDATABASE=your_postgres_database_name
```

### 5. Build Configuration

Vercel should automatically detect the configuration from `vercel.json`:

- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 6. Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Add your custom domain
3. Configure DNS settings as instructed

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Ensure database allows external connections
   - Check firewall settings

2. **Build Failures**
   - Check build logs for specific errors
   - Verify all dependencies are in package.json
   - Ensure TypeScript compilation succeeds

3. **Runtime Errors**
   - Check function logs in Vercel dashboard
   - Verify environment variables are set
   - Ensure database schema is up to date

### Performance Optimization

1. **Database Optimization**
   - Use connection pooling
   - Add database indexes for frequently queried fields
   - Monitor query performance

2. **Frontend Optimization**
   - Enable Vercel's Edge Network
   - Optimize images and assets
   - Use React.lazy for code splitting

## Default Login Credentials

The system includes these default team members:

- **Zacchaeus James**: Team Lead (full access)
- **Other team members**: Admin access
- **Guest access**: View-only without login

You can modify team members through the Team page after deployment.

## Post-Deployment

1. **Test Authentication**: Verify login/logout functionality
2. **Create Sample Data**: Add tasks, categories, and time entries
3. **Test Analytics**: Verify reporting charts display correctly
4. **Mobile Testing**: Check responsive design on mobile devices

## Support

For deployment issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test database connectivity
4. Review function logs for runtime errors