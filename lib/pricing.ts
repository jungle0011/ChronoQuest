import { getCurrentUserPlan } from './firebase-client';

export type Plan = 'free' | 'basic' | 'premium';

export interface PricingFeature {
  id: string;
  name: string;
  description: string;
}

export interface PricingTier {
  id: Plan;
  name: string;
  // Deprecated: use priceMonthly/priceYearly
  price: number;
  priceMonthly?: number;
  priceYearly?: number;
  paystackMonthly?: string;
  paystackYearly?: string;
  currency: string;
  features: PricingFeature[];
  limits: {
    maxLandingPages: number;
    styleTemplates: number;
    colorSchemes: number;
    fonts: number;
    layoutStyles: number;
  };
  access: {
    logoUpload: boolean;
    ownerUpload: boolean;
    profileAnalytics: boolean;
    appointmentBooking: boolean;
    leadCapture: boolean;
    realTimeAnalytics: boolean;
    aiContentGenerator: boolean;
    languageAndLocation: boolean;
    whatsappWidget: boolean;
    socialMediaAndSeo: boolean;
    businessHours: boolean;
    contactOptions: boolean;
  };
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'NGN',
    features: [
      {
        id: 'basic-landing',
        name: 'Basic Landing Page',
        description: 'Create one simple landing page with basic features'
      }
    ],
    limits: {
      maxLandingPages: 1,
      styleTemplates: 1,
      colorSchemes: 1,
      fonts: 1,
      layoutStyles: 1
    },
    access: {
      logoUpload: false,
      ownerUpload: false,
      profileAnalytics: false,
      appointmentBooking: false,
      leadCapture: false,
      realTimeAnalytics: false,
      aiContentGenerator: false,
      languageAndLocation: false,
      whatsappWidget: false,
      socialMediaAndSeo: false,
      businessHours: false,
      contactOptions: true
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 3000, // Deprecated
    priceMonthly: 3000,
    priceYearly: 28000,
    paystackMonthly: 'https://paystack.shop/pay/mto0epoefe',
    paystackYearly: 'https://paystack.shop/pay/oyjqh49cae',
    currency: 'NGN',
    features: [
      {
        id: 'multiple-pages',
        name: 'Multiple Landing Pages',
        description: 'Create up to 3 landing pages'
      },
      {
        id: 'logo-upload',
        name: 'Logo Upload',
        description: 'Upload your business logo'
      },
      {
        id: 'analytics',
        name: 'Basic Analytics',
        description: 'Access to profile analytics and real-time data'
      },
      {
        id: 'appointment-booking',
        name: 'Appointment Booking',
        description: 'Allow customers to book appointments'
      },
      {
        id: 'lead-capture',
        name: 'Lead Capture',
        description: 'Capture and manage leads'
      },
      {
        id: 'ai-content',
        name: 'AI Content Generator',
        description: 'Generate content using AI'
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Widget',
        description: 'Add WhatsApp chat widget'
      },
      {
        id: 'business-hours',
        name: 'Business Hours',
        description: 'Display your business hours'
      }
    ],
    limits: {
      maxLandingPages: 3,
      styleTemplates: 5,
      colorSchemes: 5,
      fonts: 3,
      layoutStyles: 3
    },
    access: {
      logoUpload: true,
      ownerUpload: false,
      profileAnalytics: true,
      appointmentBooking: true,
      leadCapture: true,
      realTimeAnalytics: true,
      aiContentGenerator: true,
      languageAndLocation: false,
      whatsappWidget: true,
      socialMediaAndSeo: false,
      businessHours: true,
      contactOptions: true
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 5000, // Deprecated
    priceMonthly: 5000,
    priceYearly: 48000,
    paystackMonthly: 'https://paystack.shop/pay/vom5k8ch38',
    paystackYearly: 'https://paystack.shop/pay/63wkw-i79s',
    currency: 'NGN',
    features: [
      {
        id: 'unlimited-pages',
        name: 'Unlimited Landing Pages',
        description: 'Create unlimited landing pages'
      },
      {
        id: 'all-features',
        name: 'All Features',
        description: 'Access to all premium features'
      },
      {
        id: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'Comprehensive analytics and reporting'
      },
      {
        id: 'seo-tools',
        name: 'SEO Tools',
        description: 'Advanced SEO optimization tools'
      },
      {
        id: 'social-media',
        name: 'Social Media Integration',
        description: 'Full social media integration'
      },
      {
        id: 'multilingual',
        name: 'Multilingual Support',
        description: 'Support for multiple languages'
      },
      {
        id: 'location-based',
        name: 'Location-Based Features',
        description: 'Advanced location-based features'
      }
    ],
    limits: {
      maxLandingPages: Infinity,
      styleTemplates: Infinity,
      colorSchemes: Infinity,
      fonts: Infinity,
      layoutStyles: Infinity
    },
    access: {
      logoUpload: true,
      ownerUpload: true,
      profileAnalytics: true,
      appointmentBooking: true,
      leadCapture: true,
      realTimeAnalytics: true,
      aiContentGenerator: true,
      languageAndLocation: true,
      whatsappWidget: true,
      socialMediaAndSeo: true,
      businessHours: true,
      contactOptions: true
    }
  }
];

export function getPricingTier(plan: Plan): PricingTier {
  return PRICING_TIERS.find(tier => tier.id === plan) || PRICING_TIERS[0];
}

export function hasFeatureAccess(plan: Plan, feature: keyof PricingTier['access']): boolean {
  const tier = getPricingTier(plan);
  return tier.access[feature];
}

export function getFeatureLimit(plan: Plan, limit: keyof PricingTier['limits']): number {
  const tier = getPricingTier(plan);
  return tier.limits[limit];
}

export async function isFeatureLocked(feature: string): Promise<boolean> {
  const plan = await getCurrentUserPlan();
  // List features that are pro-only
  const proFeatures = [
    'aiContentGenerator',
    'aiReviewGenerator',
    'analytics',
    'seo',
    'leadCapture',
    'appointmentBooking',
    'googleMaps',
    'whatsappWidget',
    'productImages',
    // add more as needed
  ];
  if (plan === 'free' && proFeatures.includes(feature)) return true;
  return false;
} 