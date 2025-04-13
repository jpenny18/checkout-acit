import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const createStripeSubscription = async (customerInfo, priceId) => {
  try {
    // Create the subscription through our backend API
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerInfo,
        priceId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create subscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Stripe subscription:', error);
    throw error;
  }
};

const subscriptionService = {
  // Create a new subscription order
  createSubscriptionOrder: async (orderData) => {
    try {
      // Add order to Firestore first
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        timestamp: new Date(),
        status: 'pending',
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating subscription order:', error);
      throw error;
    }
  },

  // Process card payment for subscription
  processCardSubscription: async (orderId, customerInfo, priceId) => {
    try {
      // Create subscription in Stripe
      const subscription = await createStripeSubscription(customerInfo, priceId);
      
      // Update order in Firestore
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: subscription.status || 'processing',
        subscription: {
          id: subscription.subscriptionId,
          status: subscription.status,
          clientSecret: subscription.clientSecret,
          priceId: priceId
        },
        paymentDetails: {
          method: 'card',
          updatedAt: new Date()
        }
      });
      
      return subscription;
    } catch (error) {
      console.error('Error processing card subscription:', error);
      throw error;
    }
  },
  
  // Get price ID based on account size
  getPriceId: (accountSize) => {
    switch(accountSize) {
      case 50000:
        return process.env.REACT_APP_STRIPE_PRICE_ID_50K;
      case 100000:
        return process.env.REACT_APP_STRIPE_PRICE_ID_100K;
      case 200000:
        return process.env.REACT_APP_STRIPE_PRICE_ID_200K;
      default:
        throw new Error(`No price ID found for account size: ${accountSize}`);
    }
  },
  
  // Get monthly price based on account size
  getMonthlyPrice: (accountSize) => {
    switch(accountSize) {
      case 50000:
        return 99;
      case 100000:
        return 149;
      case 200000:
        return 249;
      default:
        throw new Error(`No monthly price found for account size: ${accountSize}`);
    }
  }
};

export default subscriptionService; 