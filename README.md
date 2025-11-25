# Blogging CMS - Admin Panel

A modern, responsive admin panel for managing blog content built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication
- Admin-only access control
- JWT-based authentication
- Secure login/logout functionality
- Protected routes with AuthGuard

### 📝 Content Management
- **Posts**: Create, edit, delete, and publish blog posts
- **Taxonomies**: Manage content categories and classifications
- **Terms**: Organize content with flexible taxonomy terms
- **SEO**: Complete SEO management (meta titles, descriptions, Open Graph, Twitter Cards)

### 🎨 User Interface
- Clean, modern design inspired by Isomorphic admin template
- Responsive layout that works on all devices
- Smooth scrolling form navigation
- Toast notifications for user feedback

### 🛠️ Technical Features
- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context for authentication
- **Icons**: Lucide React icons
- **Notifications**: Sonner for toast messages

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Running backend API (blogging-api)

### Installation

1. Clone the repository
2. Install dependencie
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
