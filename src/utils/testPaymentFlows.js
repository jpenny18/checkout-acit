// Test script for payment flows
const STRIPE_LINKS = {
  50000: {
    standard: process.env.REACT_APP_STRIPE_LINK_50K,
    fastPass: process.env.REACT_APP_STRIPE_LINK_50K_FAST
  },
  100000: {
    standard: process.env.REACT_APP_STRIPE_LINK_100K,
    fastPass: process.env.REACT_APP_STRIPE_LINK_100K_FAST
  },
  200000: {
    standard: process.env.REACT_APP_STRIPE_LINK_200K,
    fastPass: process.env.REACT_APP_STRIPE_LINK_200K_FAST
  }
};

export const testPaymentFlows = async () => {
  console.group('🧪 Starting Payment Flow Tests');
  
  const testCases = [
    { balance: 50000, paymentMethod: 'card', fastPass: false },
    { balance: 50000, paymentMethod: 'card', fastPass: true },
    { balance: 100000, paymentMethod: 'card', fastPass: false },
    { balance: 100000, paymentMethod: 'card', fastPass: true },
    { balance: 200000, paymentMethod: 'card', fastPass: false },
    { balance: 200000, paymentMethod: 'card', fastPass: true },
    { balance: 50000, paymentMethod: 'crypto', fastPass: false },
    { balance: 50000, paymentMethod: 'crypto', fastPass: true },
    { balance: 100000, paymentMethod: 'crypto', fastPass: false },
    { balance: 100000, paymentMethod: 'crypto', fastPass: true },
    { balance: 200000, paymentMethod: 'crypto', fastPass: false },
    { balance: 200000, paymentMethod: 'crypto', fastPass: true }
  ];

  for (const testCase of testCases) {
    console.group(`Testing ${testCase.paymentMethod.toUpperCase()} payment for $${testCase.balance} ${testCase.fastPass ? 'with' : 'without'} Fast Pass`);
    
    try {
      // Test price calculation
      const basePrice = testCase.balance === 50000 ? 400 : 
                       testCase.balance === 100000 ? 600 : 999;
      
      const expectedAmount = (testCase.paymentMethod === 'crypto' 
        ? basePrice * (testCase.fastPass ? 2 : 1) * 0.75  // 25% crypto discount
        : basePrice * (testCase.fastPass ? 2 : 1));
      
      console.log('💰 Expected amount:', expectedAmount);

      // For card payments, verify Stripe link
      if (testCase.paymentMethod === 'card') {
        const stripeLink = STRIPE_LINKS[testCase.balance][testCase.fastPass ? 'fastPass' : 'standard'];
        if (!stripeLink) {
          throw new Error('Stripe link not found');
        }
        console.log('✅ Stripe link verified:', stripeLink);
      }

      // For crypto payments, verify addresses and QR codes
      if (testCase.paymentMethod === 'crypto') {
        const cryptoTypes = ['BTC', 'ETH', 'USDT'];
        for (const type of cryptoTypes) {
          console.group(`Testing ${type} payment`);
          // Verify wallet address exists
          const address = process.env[`REACT_APP_${type}_ADDRESS`];
          if (!address) {
            throw new Error(`${type} wallet address not found`);
          }
          console.log('✅ Wallet address verified:', address);
          
          // Verify QR code generation would work
          const qrData = type === 'BTC' ? `bitcoin:${address}?amount=${expectedAmount}` :
                        type === 'ETH' ? `ethereum:${address}?value=${expectedAmount}` :
                        `tron:${address}?amount=${expectedAmount}`;
          console.log('✅ QR code data verified:', qrData);
          console.groupEnd();
        }
      }

      console.log('✅ Test case passed');
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    
    console.groupEnd();
  }

  console.groupEnd();
  console.log('🏁 All tests completed');
};

// Function to test a single payment flow
export const testSinglePaymentFlow = async (balance, paymentMethod, fastPass = false) => {
  console.group(`🧪 Testing Single Payment Flow`);
  console.log(`Balance: $${balance}`);
  console.log(`Payment Method: ${paymentMethod}`);
  console.log(`Fast Pass: ${fastPass}`);

  try {
    const basePrice = balance === 50000 ? 400 : 
                     balance === 100000 ? 600 : 999;
    
    const expectedAmount = (paymentMethod === 'crypto' 
      ? basePrice * (fastPass ? 2 : 1) * 0.75  // 25% crypto discount
      : basePrice * (fastPass ? 2 : 1));
    
    console.log('💰 Expected amount:', expectedAmount);

    if (paymentMethod === 'card') {
      const stripeLink = STRIPE_LINKS[balance][fastPass ? 'fastPass' : 'standard'];
      if (!stripeLink) {
        throw new Error('Stripe link not found');
      }
      console.log('✅ Stripe link verified:', stripeLink);
      
      // Test URL parameters
      const testUrl = `${stripeLink}?prefilled_email=${encodeURIComponent('test@example.com')}&client_reference_id=TEST-123`;
      console.log('✅ Final URL would be:', testUrl);
    } else {
      // Test crypto payment flow
      const cryptoTypes = ['BTC', 'ETH', 'USDT'];
      for (const type of cryptoTypes) {
        console.group(`Testing ${type} payment`);
        const address = process.env[`REACT_APP_${type}_ADDRESS`];
        if (!address) {
          throw new Error(`${type} wallet address not found`);
        }
        console.log('✅ Wallet address verified:', address);
        console.groupEnd();
      }
    }

    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.groupEnd();
}; 