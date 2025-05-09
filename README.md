# Yeamazing Mini Team - Real-time Chat Application

A modern real-time chat application built with Next.js, featuring instant messaging, file sharing, and real-time updates using Pusher.

## Features

- 💬 Real-time messaging with Pusher integration
- 👥 User-to-user private messaging
- 📎 File attachments support
- 🔍 User search functionality
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure authentication with NextAuth.js
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend:**

  - Next.js 14 (App Router)
  - React
  - Tailwind CSS
  - Shadcn UI Components

- **Backend:**

  - Next.js API Routes
  - Prisma (Database ORM)
  - PostgreSQL (Database)
  - Pusher (Real-time functionality)
  - Cloudinary (For File Upload)

- **Authentication:**
  - NextAuth.js
  - JWT

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Pusher account
- Cloudinary account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"

# NextAuth
AUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="your-app-url"

# Pusher
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-app-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_APP_SECRET="your-pusher-app-secret"
PUSHER_APP_CLUSTER="your-pusher-cluster"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/yeamazing_mini_team.git
cd yeamazing_mini_team
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
yeamazing_mini_team/
├── app/
│   ├── (dashboard)/
│   │   └── messages/      # Chat interface
│   ├── api/              # API routes
│   └── auth/             # Authentication pages
├── components/
│   ├── messages/         # Chat components
│   └── ui/              # UI components
├── lib/
│   ├── pusher.js        # Pusher configuration
│   └── prisma.js        # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Features in Detail

### Real-time Messaging

- Instant message delivery using Pusher
- Optimistic updates for better UX

### File Sharing

- Support for multiple file types
- Image previews
- File upload progress indicators
- Secure file storage

### User Management

- User search functionality
- Online/offline status
- User profiles
- Private messaging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Pusher](https://pusher.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository

2. Go to [Vercel](https://vercel.com) and create a new project

3. Import your GitHub repository

4. Configure the following environment variables in Vercel:

   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel deployment URL)
   - `NEXT_PUBLIC_PUSHER_APP_KEY`
   - `PUSHER_APP_ID`
   - `PUSHER_APP_SECRET`
   - `PUSHER_APP_CLUSTER`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

5. Deploy your project

### Troubleshooting Vercel Deployment

If you encounter build errors:

1. Check that all environment variables are properly set in Vercel
2. Ensure your database is accessible from Vercel's servers
3. Verify that your Pusher and Cloudinary credentials are correct
4. Check the build logs for specific error messages

Common issues:

- Database connection errors: Make sure your database URL is correct and the database is accessible
- Authentication errors: Verify your AUTH_SECRET and NEXTAUTH_URL are set correctly
- API route errors: Ensure all API routes are properly exported and handle errors correctly
