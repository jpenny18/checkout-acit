import stripeAPI from './stripe-api';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

// This simulates a server-side API handler
// In a production environment, this would be replaced by actual endpoints

// Map of API endpoints
const endpoints = {
  '/api/create-subscription': async (data) => {
    const { customerInfo, priceId } = data;
    
    try {
      // Create a customer first
      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'email': customerInfo.email,
          'name': `${customerInfo.firstName} ${customerInfo.lastName}`,
          'phone': customerInfo.phone
        })
      });

      if (!customerResponse.ok) {
        const error = await customerResponse.json();
        console.error('Customer error:', error);
        throw new Error(error.error?.message || 'Failed to create customer');
      }

      const customer = await customerResponse.json();

      // Create the subscription
      const subscriptionResponse = await fetch('https://api.stripe.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'customer': customer.id,
          'items[0][price]': priceId,
          'payment_behavior': 'default_incomplete',
          'payment_settings[payment_method_types][]': 'card',
          'expand[]': 'latest_invoice.payment_intent'
        })
      });

      if (!subscriptionResponse.ok) {
        const error = await subscriptionResponse.json();
        console.error('Subscription error:', error);
        throw new Error(error.error?.message || 'Failed to create subscription');
      }

      const subscription = await subscriptionResponse.json();
      console.log('Subscription created:', subscription);

      return {
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        status: subscription.status
      };
    } catch (error) {
      console.error('Error in create-subscription:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  '/api/cancel-subscription': async (data) => {
    const { subscriptionId } = data;
    try {
      const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to cancel subscription');
      }

      return {
        success: true,
        message: 'Subscription cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  '/api/stripe-webhook': async (request) => {
    const sig = request.headers['stripe-signature'];
    const endpointSecret = process.env.REACT_APP_STRIPE_WEBHOOK_SECRET;
    
    try {
      // Verify webhook signature
      const event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      
      // Handle different event types
      switch (event.type) {
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object);
          break;
          
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;
          
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;
          
        case 'invoice.payment_succeeded':
          await handlePaymentSucceeded(event.data.object);
          break;
          
        case 'invoice.payment_failed':
          await handlePaymentFailed(event.data.object);
          break;
      }
      
      return { success: true };
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return { success: false, error: err.message };
    }
  }
};

// Webhook event handlers
const handleSubscriptionCreated = async (subscription) => {
  try {
    // Update subscription status in your database
    const subscriptionRef = doc(db, 'subscriptions', subscription.id);
    await setDoc(subscriptionRef, {
      status: subscription.status,
      customerId: subscription.customer,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
};

const handleSubscriptionUpdated = async (subscription) => {
  try {
    // Update subscription status in your database
    const subscriptionRef = doc(db, 'subscriptions', subscription.id);
    await updateDoc(subscriptionRef, {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
};

const handleSubscriptionDeleted = async (subscription) => {
  try {
    // Update subscription status in your database
    const subscriptionRef = doc(db, 'subscriptions', subscription.id);
    await updateDoc(subscriptionRef, {
      status: 'canceled',
      canceledAt: new Date(),
    });
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
};

const handlePaymentSucceeded = async (invoice) => {
  try {
    // Update payment status in your database
    const paymentRef = doc(db, 'payments', invoice.id);
    await setDoc(paymentRef, {
      status: 'succeeded',
      amount: invoice.amount_paid,
      customerId: invoice.customer,
      subscriptionId: invoice.subscription,
      paidAt: new Date(invoice.status_transitions.paid_at * 1000),
    });
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
};

const handlePaymentFailed = async (invoice) => {
  try {
    // Update payment status in your database
    const paymentRef = doc(db, 'payments', invoice.id);
    await setDoc(paymentRef, {
      status: 'failed',
      amount: invoice.amount_due,
      customerId: invoice.customer,
      subscriptionId: invoice.subscription,
      failedAt: new Date(),
    });
    
    // Optionally notify the customer
    // await sendPaymentFailureNotification(invoice.customer);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

// Intercept fetch calls to our simulated API
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  // Only intercept our simulated API calls
  if (typeof url === 'string' && url.startsWith('/api/')) {
    return new Promise(async (resolve) => {
      console.log(`Intercepted API call to: ${url}`);
      
      // Parse the request body
      let data = {};
      if (options && options.body) {
        try {
          data = JSON.parse(options.body);
        } catch (e) {
          console.error('Error parsing request body:', e);
        }
      }
      
      // Find the matching endpoint handler
      const handler = endpoints[url];
      if (!handler) {
        console.error(`No handler found for ${url}`);
        resolve(new Response(JSON.stringify({ 
          error: 'Not Found',
          message: `Endpoint ${url} not found`
        }), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        }));
        return;
      }
      
      try {
        // Call the handler with the request data
        const result = await handler(data);
        
        // Create a simulated response
        resolve(new Response(JSON.stringify(result), { 
          status: result.success ? 200 : 400, 
          headers: { 'Content-Type': 'application/json' } 
        }));
      } catch (error) {
        console.error(`Error handling ${url}:`, error);
        resolve(new Response(JSON.stringify({ 
          error: 'Internal Server Error',
          message: error.message
        }), { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }));
      }
    });
  }
  
  // Pass through to the original fetch for all other requests
  return originalFetch.apply(this, arguments);
};

// Initialize the API handler
export const initApiHandler = () => {
  console.log('API handler initialized');
};

export default {
  initApiHandler
}; 