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
DATABASE_URL="postgresql://api@accelerator_key/mini_team?sslmode=require"
DIRECT_URL="postgresql://user:password@localhost:5432/your_database"

# NextAuth
AUTH_SECRET="your-nextauth-secret"

# Pusher
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-app-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_APP_SECRET="your-pusher-app-secret"
PUSHER_APP_CLUSTER="your-pusher-cluster"

CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
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
