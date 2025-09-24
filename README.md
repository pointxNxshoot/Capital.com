# Capital.com - Equity Marketplace

A modern, full-stack equity marketplace platform built with Next.js 15, TypeScript, and Prisma. This platform allows companies to list their equity opportunities and connect with potential investors and advisors.

## 🚀 Features

### Core Functionality
- **Company Listings**: Create and manage company profiles with detailed information
- **Advanced Image System**: Professional photo galleries with cropping and multi-resolution support
- **Advisor Integration**: Connect companies with industry advisors
- **Search & Filtering**: Powerful search with sector, location, and tag filtering
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Technical Features
- **Next.js 15**: App Router with TypeScript
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Image Processing**: Advanced cropping with canvas manipulation
- **Form Management**: React Hook Form with Zod validation
- **Gallery System**: Swiper.js with navigation and thumbnails
- **State Management**: React hooks with localStorage persistence

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM, SQLite (dev), PostgreSQL (production)
- **Validation**: Zod schemas
- **Forms**: React Hook Form
- **Images**: Next.js Image, Canvas API, Swiper.js
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd nextjs-boilerplate.1-1
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Optional: Add other environment variables as needed
```

### 4. Database Setup

Initialize the database and run migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── companies/         # Company listing pages
│   └── list/             # Company creation form
├── components/            # React components
│   ├── ImprovedCropModal.tsx    # Advanced image cropping
│   ├── RealestateGallery.tsx   # Property gallery with Swiper
│   └── WorkingEnhancedListingForm.tsx  # Main listing form
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma client
│   ├── validators.ts     # Zod schemas
│   └── imageUtils.ts     # Image processing utilities
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🎨 Key Components

### Image System
- **Multi-resolution Processing**: Automatic thumbnail, preview, and full-size generation
- **Advanced Cropping**: Interactive crop tool with aspect ratio locking
- **Gallery Display**: Professional real estate style photo galleries
- **Format Support**: JPEG, PNG, WebP with optimization

### Form System
- **Validation**: Zod schemas for type-safe validation
- **File Upload**: Drag-and-drop image upload with preview
- **Advisor Integration**: Optional advisor profile creation
- **Multi-step Process**: Company and advisor data collection

### Database Models
- **Company**: Core company information and photos
- **Advisor**: Advisor profiles and contact information
- **Relationships**: Many-to-one advisor-company relationships

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with sample data
```

### Database Commands

```bash
npx prisma studio           # Open Prisma Studio (database GUI)
npx prisma migrate dev      # Create and apply migrations
npx prisma migrate reset    # Reset database and reapply migrations
npx prisma generate         # Generate Prisma client
npx prisma db seed          # Seed database
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Yes |

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure `DATABASE_URL` is correctly set
   - Run `npx prisma generate` and `npx prisma migrate dev`

2. **Image Upload Issues**
   - Check file size limits
   - Ensure proper file types (JPEG, PNG, WebP)

3. **Build Issues**
   - Clear `.next` folder and rebuild
   - Check for TypeScript errors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- Swiper.js for the gallery functionality

## 📞 Support

For support, email support@capital.com or create an issue in the repository.

---

**Happy coding! 🚀**