# TaskFlow - Team Task Management System

A comprehensive team task management web application with hierarchical task categorization, secure authentication, time tracking, and advanced PostgreSQL-powered reporting.

## Features

- **Team Task Management**: Create, assign, and track tasks with status updates
- **Custom Authentication**: Username/password authentication with role-based access control
- **Hierarchical Categories**: Organize tasks with nested category structures
- **Time Tracking**: Log time entries for detailed project analytics
- **Advanced Reporting**: PostgreSQL-powered analytics with interactive charts
- **Drag & Drop Interface**: Intuitive task prioritization and status management
- **Mobile Responsive**: Modern UI that works across all devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom session-based authentication
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel-ready configuration

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure:

```bash
# Database Configuration
DATABASE_URL=your_postgresql_database_url
PGHOST=your_postgres_host
PGPORT=5432
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=your_postgres_database_name

# Session Configuration
SESSION_SECRET=your_secure_random_session_secret

# Node Environment
NODE_ENV=production
```

### Installation & Development

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment on Vercel

### Step 1: Prepare Your Database

1. Set up a PostgreSQL database (recommended: Neon, Supabase, or PlanetScale)
2. Get your database connection URL
3. Run database migrations: `npm run db:push`

### Step 2: Deploy to Vercel

1. Push your code to GitHub/GitLab
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `NODE_ENV=production`
4. Deploy

### Step 3: Configure Build Settings

Vercel will automatically detect the configuration from `vercel.json`.

Build Command: `vite build`
Output Directory: `dist`

## Default Users

The system comes with pre-configured team members:

- **Zacchaeus James**: Team Lead (super admin)
- **Other team members**: Admin access
- **Guest access**: Available without login for viewing

## Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configurations
├── server/           # Express backend
│   ├── index.ts        # Main server file
│   ├── routes.ts       # API routes
│   ├── auth.ts         # Authentication logic
│   ├── db.ts           # Database connection
│   └── databaseStorage.ts  # Data access layer
├── shared/           # Shared types and schemas
│   └── schema.ts       # Database schema and types
└── vercel.json       # Vercel deployment configuration
```

## Key Features

### Authentication & Authorization
- Custom username/password authentication
- Role-based access control (Team Lead, Admin, Guest)
- Secure session management with PostgreSQL storage

### Task Management
- Create, edit, and delete tasks
- Assign tasks to team members
- Track task status (Todo, In Progress, Completed)
- Set priorities and due dates
- Add detailed descriptions and notes

### Advanced Analytics
- Task completion metrics and trends
- Team performance analysis
- Category distribution reports
- Time tracking analytics
- Workload distribution insights
- 30-day rolling analytics windows

### User Interface
- Modern, responsive design with Tailwind CSS
- Dark/light theme support
- Drag-and-drop task management
- Interactive charts and dashboards
- Mobile-optimized interface

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Analytics
- `GET /api/analytics/tasks` - Task status analytics
- `GET /api/analytics/team-performance` - Team performance metrics
- `GET /api/analytics/categories` - Category distribution
- `GET /api/analytics/productivity-trends` - Productivity trends
- `GET /api/analytics/time-tracking` - Time tracking analytics
- `GET /api/analytics/workload-distribution` - Workload distribution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For deployment issues or questions, please check the Vercel documentation or create an issue in the repository.