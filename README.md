# 🛒 Digital Marketplace - Full-Stack E-Commerce Platform

A modern, production-ready e-commerce platform built with Next.js 15, featuring digital product sales, secure payments with Stripe, and a comprehensive admin dashboard.

![Digital Marketplace](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Customer Features
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Product Catalog**: Browse and search digital products
- **Secure Checkout**: Stripe-powered payment processing
- **Instant Downloads**: 24-hour secure download links after purchase
- **Order Management**: Track purchase history and download files

### 🔧 Admin Features
- **Dashboard**: Overview of sales, products, and customers
- **Product Management**: Add, edit, delete, and manage product availability
- **Customer Management**: View customer information and order history
- **Sales Analytics**: Track orders and revenue
- **File Management**: Secure file upload and storage

### 🛡️ Security & Production Features
- **Admin Authentication**: Basic auth protection for admin routes
- **Error Handling**: Comprehensive error boundaries and validation
- **File Security**: Secure file storage and download verification
- **Input Validation**: Zod schema validation for all forms
- **Database Security**: Prisma ORM with SQLite for development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Full-Stack-E-Commerce-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Stripe (get from https://stripe.com/dashboard)
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # Admin Authentication
   ADMIN_USERNAME="admin"
   HASHED_ADMIN_PASSWORD="your_hashed_password_here"
   
   # Application
   NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Setup

### Generate Admin Password Hash
```bash
node -e "
const crypto = require('crypto');
const password = 'your-secure-password';
const hash = crypto.createHash('sha512').update(password).digest('base64');
console.log('Hashed password:', hash);
"
```

### Admin Access
- URL: `http://localhost:3000/admin`
- Username: Your configured `ADMIN_USERNAME`
- Password: Your configured password

## 📁 Project Structure

```
src/
├── app/
│   ├── (costumerFacing)/          # Customer-facing pages
│   │   ├── layout.tsx            # Customer layout
│   │   ├── page.tsx              # Homepage
│   │   ├── products/             # Product pages
│   │   └── orders/               # Order management
│   ├── admin/                    # Admin dashboard
│   │   ├── layout.tsx            # Admin layout
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── products/             # Product management
│   │   ├── users/                # Customer management
│   │   └── orders/               # Sales management
│   ├── actions/                  # Server actions
│   └── webhooks/                 # Stripe webhooks
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── nav.tsx                   # Navigation component
│   ├── ProductCard.tsx           # Product display component
│   ├── ErrorBoundary.tsx         # Error handling
│   └── LoadingSpinner.tsx        # Loading states
├── db/
│   └── db.ts                     # Database connection
├── lib/
│   ├── cache.ts                  # Caching utilities
│   ├── formatters.ts             # Data formatting
│   ├── isValidPassword.ts        # Password validation
│   └── utils.ts                  # Utility functions
└── middleware.ts                 # Route protection
```

## 🗄️ Database Schema

### Products
- Digital products with file downloads
- Image thumbnails and descriptions
- Price in cents for precise calculations
- Availability toggle

### Users
- Customer email addresses
- Order history tracking

### Orders
- Purchase records with Stripe integration
- Price paid and timestamps
- User and product relationships

### Download Verifications
- Secure download links with expiration
- 24-hour access windows
- Product association

## 🔌 Stripe Integration

### Webhook Setup
1. Create a Stripe webhook endpoint: `https://yourdomain.com/webhooks/stripe`
2. Select events: `payment_intent.succeeded`
3. Copy the webhook secret to your environment variables

### Test Cards
Use Stripe test cards for development:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Production Considerations
- Use PostgreSQL instead of SQLite for production
- Set up proper file storage (AWS S3, Cloudinary)
- Configure proper CORS settings
- Set up monitoring and logging
- Use a CDN for static assets

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📝 API Routes

### Customer Routes
- `GET /` - Homepage with featured products
- `GET /products` - Product catalog
- `GET /products/[id]/purchase` - Checkout page
- `GET /orders` - Customer order history
- `GET /products/download/[id]` - Secure file download

### Admin Routes (Protected)
- `GET /admin` - Admin dashboard
- `GET /admin/products` - Product management
- `GET /admin/users` - Customer management
- `GET /admin/orders` - Sales analytics

### Webhook Routes
- `POST /webhooks/stripe` - Stripe payment processing

## 🛠️ Development

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/app/`
3. Implement server actions in `src/app/actions/`
4. Update database schema in `prisma/schema.prisma`
5. Run `npx prisma db push` to update database

### Database Changes
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the excellent database toolkit
- [Stripe](https://stripe.com/) for secure payment processing
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/Full-Stack-E-Commerce-Project/issues) page
2. Create a new issue if your problem isn't already addressed
3. Join our community discussions

---

**Built with ❤️ using modern web technologies**
