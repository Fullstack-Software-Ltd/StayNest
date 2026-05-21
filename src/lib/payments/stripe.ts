import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // Use a fallback or throw an error only in production
  // For dev, helpful to see it's missing
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  typescript: true,
});
