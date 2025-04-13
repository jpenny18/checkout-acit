import subscriptionService from '../services/subscriptionService';

// This file simulates API endpoints that would normally be on the server side
// In a production environment, these functions would be replaced with actual API calls

const stripeAPI = {
  // Create a subscription
  createSubscription: async (customerInfo, priceId, selectedBalance) => {
    try {
      // First create order in database
      const orderData = {
        orderId: 'ACI-' + Date.now().toString(36).toUpperCase() + 
                 Math.random().toString(36).substring(2, 7).toUpperCase(),
        customerInfo,
        orderDetails: {
          accountSize: selectedBalance,
          basePrice: subscriptionService.getMonthlyPrice(selectedBalance),
          finalAmount: subscriptionService.getMonthlyPrice(selectedBalance),
          paymentMethod: 'card',
          platform: 'mt5', // Default
          fastPass: false,
          isSubscription: true,
        },
        subscription: {
          priceId,
          interval: 'month',
          status: 'pending'
        }
      };

      // Save the order in Firestore first
      const orderId = await subscriptionService.createSubscriptionOrder(orderData);

      // Create a payment intent for the subscription
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo,
          priceId,
          orderId,
          selectedBalance
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      const data = await response.json();
      
      return {
        success: true,
        subscriptionId: data.subscriptionId,
        clientSecret: data.clientSecret,
        status: data.status,
        orderId
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Cancel a subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const result = await response.json();
      
      return {
        success: true,
        message: 'Subscription cancelled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default stripeAPI; 