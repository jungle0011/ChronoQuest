"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Star, CheckCircle, MapPin, Phone, Mail, Clock, Users, Zap, Shield, Globe, Smartphone, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description: "Create your landing page in under 5 minutes. No coding required."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Perfect on all devices - phones, tablets, and desktops."
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description: "Built-in SEO features to help customers find your business online."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee."
  }
]

const killerFeatures = [
  {
    icon: "💬",
    title: "WhatsApp Integration",
    description: "Direct customer chat with auto-replies and business hours"
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description: "Track visitors, clicks, and leads in real-time"
  },
  {
    icon: "🎨",
    title: "Custom Branding",
    description: "Your logo, colors, and fonts throughout the site"
  },
  {
    icon: "📱",
    title: "Social Media Ready",
    description: "Share buttons and social media integration"
  },
  {
    icon: "📍",
    title: "Google Maps",
    description: "Show your location and help customers find you"
  },
  {
    icon: "⭐",
    title: "Customer Reviews",
    description: "Display testimonials and build trust instantly"
  },
  {
    icon: "📧",
    title: "Lead Capture",
    description: "Collect customer information and follow up"
  },
  {
    icon: "🚀",
    title: "AI-Powered Content",
    description: "Generate compelling content for your business"
  }
]

const testimonials = [
  {
    name: "Aisha Mohammed",
    business: "Beauty by Aisha",
    content: "Bizplannaija helped me create a stunning website in just 10 minutes. My bookings increased by 300% in the first month!",
    rating: 5
  },
  {
    name: "Emeka Okonkwo",
    business: "TechFix Nigeria",
    content: "As a small business owner, I needed something simple and effective. This platform delivered exactly what I needed.",
    rating: 5
  },
  {
    name: "Fatima Hassan",
    business: "Hassan Catering",
    content: "The WhatsApp integration is a game-changer! Customers can reach me instantly and I get more orders than ever.",
    rating: 5
  },
  {
    name: "David Johnson",
    business: "Johnson Auto Parts",
    content: "Professional looking website that actually converts visitors into customers. Best investment for my business.",
    rating: 5
  },
  {
    name: "Grace Okechukwu",
    business: "Grace Fashion House",
    content: "I was worried about the technical side, but it's so easy to use. My fashion business is now thriving online!",
    rating: 5
  },
  {
    name: "Musa Ibrahim",
    business: "Ibrahim Electronics",
    content: "The analytics help me understand my customers better. Sales have doubled since I started using Bizplannaija.",
    rating: 5
  }
]

const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      { id: 1, name: '1 Landing Page', description: 'Create one beautiful landing page' },
      { id: 2, name: 'Basic Templates', description: 'Access to modern design templates' },
      { id: 3, name: 'Mobile Responsive', description: 'Works perfectly on all devices' },
      { id: 4, name: 'WhatsApp Integration', description: 'Direct customer communication' },
    ],
    limits: {
      maxLandingPages: 1,
      styleTemplates: 3,
      colorSchemes: 5,
      fonts: 3,
      layoutStyles: 2,
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 3000,
    features: [
      { id: 1, name: '5 Landing Pages', description: 'Create multiple landing pages' },
      { id: 2, name: 'Premium Templates', description: 'Access to all design templates' },
      { id: 3, name: 'Analytics Dashboard', description: 'Track visitors and performance' },
      { id: 4, name: 'Custom Domain', description: 'Use your own domain name' },
      { id: 5, name: 'Priority Support', description: 'Get help when you need it' },
    ],
    limits: {
      maxLandingPages: 5,
      styleTemplates: 10,
      colorSchemes: 15,
      fonts: 8,
      layoutStyles: 6,
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 5000,
    features: [
      { id: 1, name: 'Unlimited Pages', description: 'Create as many pages as you need' },
      { id: 2, name: 'Advanced Analytics', description: 'Detailed insights and reports' },
      { id: 3, name: 'AI Content Generation', description: 'Generate compelling content' },
      { id: 4, name: 'SEO Optimization', description: 'Rank higher in search results' },
      { id: 5, name: 'Lead Capture Forms', description: 'Collect customer information' },
      { id: 6, name: '24/7 Support', description: 'Round-the-clock assistance' },
    ],
    limits: {
      maxLandingPages: Infinity,
      styleTemplates: Infinity,
      colorSchemes: Infinity,
      fonts: Infinity,
      layoutStyles: Infinity,
    }
  }
]

const faqs = [
  {
    question: "Do I need technical skills to use Bizplannaija?",
    answer: "Not at all! Our platform is designed for non-technical users. You can create a professional landing page in minutes using our drag-and-drop interface."
  },
  {
    question: "Can I use my own domain name?",
    answer: "Yes! Premium users can connect their own domain name. Free users get a subdomain (yourbusiness.bizplannaija.com)."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your payment, no questions asked."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely! We use enterprise-grade security with SSL encryption and regular backups. Your business data is safe with us."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes! We provide email support for all users, and Premium users get priority support with faster response times."
  }
]

export default function HomePage() {
  const { user, loading, initialized } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Bizplannaija
          </motion.div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {initialized && (
              <>
                {user ? (
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Create Site
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/login">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800" />
        
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02]" />
        
        {/* Radial gradient for hero */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-transparent" />

        <div className="container relative mx-auto px-4 py-20">
          <div className="flex flex-col items-center max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge 
                className="mb-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50"
                variant="secondary"
              >
                <span className="font-semibold">🚀 Trusted by 10,000+ Nigerian Businesses</span>
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-10 text-center"
              style={{
                lineHeight: '1.5',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Stunning Business
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Landing Pages in Minutes
              </div>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-14 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Instantly generate a beautiful, high-converting landing page for your business.
              <span className="block mt-2 text-gray-500 dark:text-gray-400">No code, no hassle.</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href={user ? "/create" : "/login"}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/examples">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  View Examples <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Free to start
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                30-day guarantee
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-sm mb-2">Scroll to explore</div>
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Problem with Traditional Websites</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most Nigerian businesses struggle with expensive, complicated website solutions that take months to build and don't convert visitors into customers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            {/* Problems */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-8 text-red-600">❌ Common Problems</h3>
              <div className="space-y-6 max-w-md mx-auto">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-lg">×</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Expensive Development</h4>
                    <p className="text-gray-600">Websites cost ₦500,000+ and take months to build</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-lg">×</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Poor Mobile Experience</h4>
                    <p className="text-gray-600">Most websites don't work well on phones</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-lg">×</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">No Customer Conversion</h4>
                    <p className="text-gray-600">Visitors don't become customers</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-lg">×</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Technical Maintenance</h4>
                    <p className="text-gray-600">Constant updates and security issues</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-8 text-green-600">✅ Bizplannaija Solution</h3>
              <div className="space-y-6 max-w-md mx-auto">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Affordable & Fast</h4>
                    <p className="text-gray-600">Create in minutes, not months. Starting at ₦3,000/month</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Mobile-First Design</h4>
                    <p className="text-gray-600">Perfect on all devices, especially phones</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">High Conversion Rate</h4>
                    <p className="text-gray-600">Built to turn visitors into customers</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Zero Maintenance</h4>
                    <p className="text-gray-600">We handle all updates and security</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed Online</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for Nigerian businesses with features that convert visitors into customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Killer Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">🚀 Killer Features Included</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every landing page comes packed with powerful features to grow your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {killerFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Nigerian Business Owners</h2>
            <p className="text-xl text-gray-600">See how Bizplannaija is transforming businesses across Nigeria</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.business}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid md:grid-cols-4 gap-8 text-center"
          >
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Landing Pages Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50 border-t">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the plan that fits your business needs. Upgrade anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier) => (
              <div key={tier.id} className={`border rounded-lg shadow-sm p-8 flex flex-col items-center bg-white hover:shadow-lg transition-shadow relative ${tier.id === 'premium' ? 'ring-2 ring-purple-500' : ''}`}>
                {tier.id === 'premium' && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">Most Popular</span>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="text-4xl font-extrabold mb-4">
                  {tier.price === 0 ? 'Free' : `₦${tier.price.toLocaleString()}`}
                  <span className="text-base font-medium text-gray-500 ml-1">/mo</span>
                </div>
                <ul className="mb-6 space-y-2 text-left w-full">
                  {tier.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>
                        <span className="font-medium">{feature.name}</span>
                        <span className="block text-gray-500 text-sm">{feature.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mb-4 w-full">
                  <span className="block text-gray-700 font-semibold mb-1">Limits:</span>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Landing Pages: {tier.limits.maxLandingPages === Infinity ? 'Unlimited' : tier.limits.maxLandingPages}</li>
                    <li>Style Templates: {tier.limits.styleTemplates === Infinity ? 'Unlimited' : tier.limits.styleTemplates}</li>
                    <li>Color Schemes: {tier.limits.colorSchemes === Infinity ? 'Unlimited' : tier.limits.colorSchemes}</li>
                    <li>Fonts: {tier.limits.fonts === Infinity ? 'Unlimited' : tier.limits.fonts}</li>
                    <li>Layouts: {tier.limits.layoutStyles === Infinity ? 'Unlimited' : tier.limits.layoutStyles}</li>
                  </ul>
                </div>
                <a href={tier.id === 'free' ? '/login' : `/checkout?plan=${tier.id}` } className="w-full">
                  {tier.id === 'free' ? (
                    <button className="w-full py-2 px-4 rounded font-semibold bg-gray-300 text-gray-700 transition-colors">
                      Get Started
                    </button>
                  ) : (
                    <button className="w-full py-2 px-4 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      Upgrade Now
                    </button>
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about Bizplannaija
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location/Contact Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help you succeed online. Contact us anytime.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-8 text-center">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-600">infobizplannaija@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Business Hours</div>
                    <div className="text-gray-600">24/7</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-8 text-center">Why Choose Bizplannaija?</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Made specifically for Nigerian businesses</span>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Local payment methods (Paystack)</span>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Nigerian customer support</span>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Local business templates</span>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">WhatsApp integration for local communication</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Email Subscription Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">💼 Get Special Offers</h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to receive exclusive deals and updates
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-2">
                We'll never spam you. Unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 text-gray-600">Join thousands of Nigerian businesses already winning online</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={user ? "/create" : "/login"}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
                  Create Your Landing Page Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/examples">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  View Examples
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ⚡ Start free • No credit card required • 30-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bizplannaija
          </div>
          <p className="text-gray-400 mb-8">Empowering Nigerian businesses to succeed online</p>
          <div className="flex justify-center space-x-8 mb-8">
            <Link href="/legal/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a href="mailto:infobizplannaija@gmail.com" className="text-gray-400 hover:text-white transition-colors">
              Support
            </a>
          </div>
          <p className="text-gray-500">
            © 2025{" "}
            <a
              href="https://sageverse.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sageverse
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
} 
