# FieldPulse Dashboard

A modern Next.js application that interfaces with the FieldPulse API to provide a comprehensive dashboard for field service management.

## Features

- **Dashboard Overview**: Real-time stats and recent activity
- **Customer Management**: View, create, and manage customers
- **Job Tracking**: Monitor job status and progress
- **Estimates**: Create and track estimates
- **Invoice Management**: Handle billing and payments
- **Project Management**: Organize work into projects
- **Location Tracking**: Manage service locations
- **Time Tracking**: Monitor work hours and timesheets
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state
- **Icons**: Lucide React
- **Authentication**: Custom API key authentication
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- FieldPulse API key (contact support@fieldpulse.com)

### Installation

1. Navigate to the project directory:
```bash
cd "C:\Users\Buyer\Documents\CascadeProjects\KMT_FieldPulse_AI"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your FieldPulse API key to `.env.local`:
```env
FIELDPULSE_API_KEY=your_api_key_here
FIELDPULSE_BASE_URL=https://api.fieldpulse.com
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The application integrates with the FieldPulse API to provide the following functionality:

### Supported Endpoints

- **Customers**: Create, read, update, delete
- **Jobs**: Create, read, update, delete
- **Estimates**: Create, read, update, delete
- **Invoices**: Create, read, update
- **Projects**: Create, read, update, delete
- **Users**: Read only
- **Teams**: Read only
- **Assets**: Create, read, update, delete
- **Locations**: Create, read, update, delete
- **Subtasks**: Create, read, update, delete
- **Comments**: Create, read, update, delete
- **Timesheets**: Create, read, update, delete

### Authentication

The application uses API key authentication. Users need to:

1. Obtain an API key from FieldPulse support
2. Enter the API key in the login form
3. The key is stored locally and used for all API requests

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── globals.css           # Global styles
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Adding New Features

1. Define types in `src/types/fieldpulse.ts`
2. Add API methods in `src/lib/fieldpulse-api.ts`
3. Create components in appropriate directories
4. Add navigation items in `src/components/layout/Sidebar.tsx`

## Deployment

The application can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker

Make sure to set the environment variables in your deployment platform.

## Support

For issues related to:
- **Application bugs**: Create an issue in this repository
- **FieldPulse API**: Contact support@fieldpulse.com
- **API key requests**: Contact support@fieldpulse.com

## License

This project is licensed under the MIT License.
