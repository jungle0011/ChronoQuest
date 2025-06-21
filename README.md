# BizPlanNaija - Business Landing Page Builder

A modern SaaS platform for creating professional business landing pages with AI-powered features, analytics, and custom domains.

## 🚀 Features

### Core Features
- **Drag & Drop Builder**: Intuitive interface for creating landing pages
- **Live Preview**: Real-time preview of changes
- **Responsive Design**: Mobile-first, responsive templates
- **Custom Domains**: Connect your own domain (Premium)
- **Multi-language Support**: English, Yoruba, Igbo, Hausa

### Premium Features
- **AI Content Generation**: AI-powered content suggestions
- **Advanced Analytics**: Detailed visitor insights
- **SEO Optimization**: Built-in SEO tools
- **Lead Capture**: Contact form and lead management
- **Booking System**: Appointment scheduling
- **Reviews System**: Customer review management
- **Products & Services**: Showcase your offerings
- **WhatsApp Integration**: Direct customer communication

### Security & Performance
- **Enterprise Security**: Comprehensive security measures
- **Rate Limiting**: API protection and abuse prevention
- **Input Validation**: XSS and injection prevention
- **Caching System**: Optimized performance with intelligent caching
- **Error Monitoring**: Real-time error tracking and alerting
- **Security Headers**: CSP, HSTS, and other security headers

## 🛡️ Security Features

### Authentication & Authorization
- Firebase Authentication with secure session management
- Role-based access control (Free, Premium, Admin)
- JWT token validation with configurable expiration
- Secure password requirements and validation

### Data Protection
- Input sanitization with DOMPurify
- SQL injection prevention
- File upload validation and restrictions
- Environment variable validation
- Comprehensive error logging and monitoring

### API Security
- Rate limiting for all endpoints
- Input validation with Zod schemas
- CORS protection
- Security headers (CSP, X-Frame-Options, etc.)
- Request/response logging

## ⚡ Performance & Scaling

### Optimization
- **Image Optimization**: WebP/AVIF support with lazy loading
- **Bundle Optimization**: Code splitting and tree shaking
- **Caching Strategy**: Multi-level caching (memory, CDN, database)
- **CDN Integration**: Global content delivery network

### Scalability
- **Horizontal Scaling**: Load balancing and auto-scaling
- **Database Scaling**: Firestore with global distribution
- **Microservices Ready**: Modular API architecture
- **Performance Monitoring**: Real-time metrics and alerting

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Database**: Firestore (Firebase)
- **Authentication**: Firebase Auth
- **File Storage**: Cloudinary
- **Payments**: Paystack
- **Deployment**: Vercel
- **Monitoring**: Custom error monitoring and analytics

### Project Structure
```
bizplannaija/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── create/            # Business creation
│   ├── edit/              # Business editing
│   └── site/              # Public business sites
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
└── scripts/               # Build and utility scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Firebase project
- Cloudinary account
- Paystack account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bizplannaija.git
   cd bizplannaija
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```bash
   # Firebase
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Paystack
   PAYSTACK_SECRET_KEY=your-secret-key
   PAYSTACK_PUBLIC_KEY=your-public-key
   
   # Security (Recommended)
   JWT_SECRET=your-32-character-jwt-secret
   NEXTAUTH_SECRET=your-32-character-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development

### Available Scripts
```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking

# Security & Quality
pnpm security-audit   # Run security audit
pnpm format           # Format code with Prettier
pnpm format-check     # Check code formatting
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and quality checks
- **Prettier**: Code formatting
- **Security Audit**: Automated security checks

### Testing
```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🛡️ Security

### Security Audit
Run the comprehensive security audit:
```bash
pnpm security-audit
```

This checks:
- ✅ Environment variable configuration
- ✅ Rate limiting setup
- ✅ Caching configuration
- ✅ Package vulnerabilities
- ✅ Security headers
- ✅ Input validation
- ✅ Authentication setup
- ✅ File upload security
- ✅ Database security
- ✅ API endpoint security

### Security Documentation
See [SECURITY.md](./SECURITY.md) for detailed security information.

## 📈 Scaling

### Performance Monitoring
- Real-time performance metrics
- Error tracking and alerting
- User behavior analytics
- Business metrics tracking

### Scaling Documentation
See [SCALING.md](./SCALING.md) for detailed scaling information.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all required environment variables are set in your production environment:

```bash
# Required
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PAYSTACK_SECRET_KEY=your-secret-key
PAYSTACK_PUBLIC_KEY=your-public-key

# Security
JWT_SECRET=your-32-character-jwt-secret
NEXTAUTH_SECRET=your-32-character-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Optional
VERCEL_API_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=your-project-id
ERROR_WEBHOOK_URL=your-error-webhook-url
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- Page view tracking
- User behavior analysis
- Conversion tracking
- Performance metrics

### Error Monitoring
- Real-time error tracking
- Performance monitoring
- Security event logging
- API request logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Run security audit before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.bizplannaija.com](https://docs.bizplannaija.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/bizplannaija/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/bizplannaija/discussions)
- **Email**: support@bizplannaija.com

## 🏆 Roadmap

### Phase 1: MVP (✅ Complete)
- [x] Basic landing page builder
- [x] User authentication
- [x] Payment integration
- [x] Basic analytics

### Phase 2: Growth (🚧 In Progress)
- [x] AI content generation
- [x] Advanced analytics
- [x] Custom domains
- [x] Security hardening
- [x] Performance optimization

### Phase 3: Enterprise (📋 Planned)
- [ ] Multi-tenancy
- [ ] Advanced security features
- [ ] Compliance automation
- [ ] Advanced reporting
- [ ] API marketplace

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for components
- [Vercel](https://vercel.com/) for deployment

---

**Built with ❤️ for Nigerian businesses**
