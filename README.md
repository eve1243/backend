# Sport Liesbauer Online Shop Backend

This project is a Next.js application that provides a backend for the Sport Liesbauer online shop, featuring product management with Cloudinary image integration.

## Features

- Product management system with CRUD operations
- Admin dashboard for managing products
- Cloudinary integration for image uploads
- MongoDB database for data storage
- Next.js App Router architecture
- TypeScript for type safety
- Authentication with NextAuth.js

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file based on `.env.local.example` with your configuration:

```
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudinary Integration

This project uses Cloudinary for image storage and management. To set it up:

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the Cloudinary dashboard
3. Add these credentials to your `.env.local` file

The Cloudinary integration provides:
- Image upload and storage
- Image optimization
- Secure URL generation
- Image transformation capabilities

## Project Structure

- `/src/app/api` - API routes for data operations
- `/src/app/admin` - Admin dashboard and product management
- `/src/models` - MongoDB data models
- `/src/utils` - Utility functions including Cloudinary integration
- `/src/providers` - Provider components for the application

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
