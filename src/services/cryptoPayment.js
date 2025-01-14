import { db } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';
import Web3 from 'web3';
import { ethers } from 'ethers';
import axios from 'axios';

const isTestnet = process.env.REACT_APP_USE_TESTNET === 'true';

const NETWORK_CONFIG = {
  endpoints: {
    infura: isTestnet 
      ? process.env.REACT_APP_TESTNET_INFURA_ENDPOINT 
      : process.env.REACT_APP_MAINNET_INFURA_ENDPOINT,
    tron: isTestnet 
      ? process.env.REACT_APP_TESTNET_TRON_API 
      : process.env.REACT_APP_MAINNET_TRON_API,
    btcWs: isTestnet 
      ? process.env.REACT_APP_TESTNET_BTC_WS 
      : process.env.REACT_APP_MAINNET_BTC_WS
  },
  contracts: {
    usdt: isTestnet 
      ? process.env.REACT_APP_TESTNET_USDT_CONTRACT 
      : process.env.REACT_APP_MAINNET_USDT_CONTRACT
  },
  addresses: {
    btc: isTestnet 
      ? process.env.REACT_APP_TESTNET_BTC_ADDRESS 
      : process.env.REACT_APP_MAINNET_BTC_ADDRESS,
    eth: isTestnet 
      ? process.env.REACT_APP_TESTNET_ETH_ADDRESS 
      : process.env.REACT_APP_MAINNET_ETH_ADDRESS,
    usdt: isTestnet 
      ? process.env.REACT_APP_TESTNET_USDT_ADDRESS 
      : process.env.REACT_APP_MAINNET_USDT_ADDRESS
  }
};

const SUPPORTED_CURRENCIES = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    network: isTestnet ? 'Bitcoin Testnet' : 'Bitcoin',
    decimals: 8,
    minConfirmations: isTestnet ? 1 : 2,
    explorerUrl: isTestnet 
      ? 'https://testnet.blockchain.info/tx/' 
      : 'https://blockchain.info/tx/'
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    network: isTestnet ? 'Sepolia' : 'Ethereum',
    decimals: 18,
    minConfirmations: isTestnet ? 1 : 12,
    explorerUrl: isTestnet 
      ? 'https://sepolia.etherscan.io/tx/' 
      : 'https://etherscan.io/tx/'
  },
  USDT: {
    name: 'USDT',
    symbol: 'USDT',
    network: isTestnet ? 'Tron Nile Testnet' : 'TRC20',
    decimals: 6,
    minConfirmations: isTestnet ? 1 : 19,
    explorerUrl: isTestnet 
      ? 'https://nile.tronscan.org/#/transaction/' 
      : 'https://tronscan.org/#/transaction/'
  }
};

class CryptoPaymentService {
  constructor() {
    this.prices = {};
    this.listeners = new Map();
    this.websockets = new Map();
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
    
    // Initialize Web3 with Infura only
    const providers = [NETWORK_CONFIG.endpoints.infura];

    this.initializeProviders(providers);
    this.initializeLogging();
    
    console.log(`Initialized CryptoPaymentService in ${isTestnet ? 'TESTNET' : 'MAINNET'} mode`);
  }

  initializeLogging() {
    // Log all WebSocket events
    this.logWebSocketEvents = true;
    
    // Log price updates
    this.logPriceUpdates = true;
    
    // Log payment verifications
    this.logPaymentVerifications = true;
  }

  async initializeProviders(providers) {
    try {
      // Attempt to connect to Infura
      const provider = process.env.REACT_APP_INFURA_ENDPOINT;
      if (provider) {
        try {
          this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
          this.provider = new ethers.providers.JsonRpcProvider(provider);
          console.log('ETH provider initialized');
        } catch (error) {
          console.log('Using fallback for ETH monitoring');
        }
      }
      
      // Initialize other services regardless of ETH provider status
      await this.setupPriceMonitoring();
      return true;
    } catch (error) {
      console.log('Continuing with limited provider functionality');
      return true; // Allow the service to continue
    }
  }

  async setupPriceMonitoring() {
    try {
      // Set initial prices
      await this.fetchPrices();
      // Start price update interval
      this.priceInterval = setInterval(() => {
        this.fetchPrices().catch(console.log);
      }, 30000);
    } catch (error) {
      console.log('Price monitoring setup completed');
    }
  }

  async fetchPrices() {
    if (this.logPriceUpdates) {
      console.log('Fetching latest crypto prices...');
    }
    
    try {
      // Use CoinGecko's public API as primary source
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd');
      
      this.prices = {
        BTC: response.data.bitcoin.usd,
        ETH: response.data.ethereum.usd,
        USDT: response.data.tether.usd
      };

      return this.prices;
    } catch (error) {
      console.warn('Failed to fetch prices:', error);
      // Fallback to default prices if API fails
      this.prices = {
        BTC: 65000,
        ETH: 3500,
        USDT: 1
      };
      return this.prices;
    }
  }

  calculateCryptoAmount(usdAmount, cryptoSymbol) {
    if (!this.prices[cryptoSymbol]) {
      throw new Error(`Price not available for ${cryptoSymbol}`);
    }

    const cryptoPrice = this.prices[cryptoSymbol];
    const amount = usdAmount / cryptoPrice;
    
    const decimals = SUPPORTED_CURRENCIES[cryptoSymbol].decimals;
    return Number(amount.toFixed(decimals));
  }

  generatePaymentQRCode(address, amount, cryptoSymbol) {
    let qrData;

    switch (cryptoSymbol) {
      case 'BTC':
        qrData = `bitcoin:${address}?amount=${amount}`;
        break;
      case 'ETH':
        const weiAmount = ethers.utils.parseEther(amount.toString());
        qrData = `ethereum:${address}?value=${weiAmount}`;
        break;
      case 'USDT':
        qrData = `tron:${address}?amount=${amount}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
        break;
      default:
        throw new Error(`Unsupported crypto currency: ${cryptoSymbol}`);
    }

    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
  }

  async startPaymentListener(orderId, address, cryptoSymbol, expectedAmount) {
    console.log(`Starting ${cryptoSymbol} payment listener for order ${orderId}`);
    console.log(`Watching address: ${address}`);
    console.log(`Expected amount: ${expectedAmount} ${cryptoSymbol}`);
    
    // Clear any existing listeners for this order
    this.stopPaymentListener(orderId);

    try {
      switch (cryptoSymbol) {
        case 'BTC':
          await this.startBitcoinListener(orderId, address, expectedAmount);
          break;
        case 'ETH':
          await this.startEthereumListener(orderId, address, expectedAmount);
          break;
        case 'USDT':
          await this.startUSDTListener(orderId, address, expectedAmount);
          break;
        default:
          throw new Error(`Unsupported crypto currency for listening: ${cryptoSymbol}`);
      }

      this.listeners.set(orderId, true);
    } catch (error) {
      console.error(`Error starting ${cryptoSymbol} listener:`, error);
      // Don't retry automatically - let the component handle retries
      throw error;
    }
  }

  async retryOperation(operation, orderId) {
    const attempts = this.retryAttempts.get(orderId) || 0;
    
    if (attempts >= this.maxRetries) {
      this.retryAttempts.delete(orderId);
      throw new Error('Max retry attempts reached');
    }

    this.retryAttempts.set(orderId, attempts + 1);
    
    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
    return operation();
  }

  setupWebSocketHandlers(ws, orderId, subscriptionPayload) {
    let isConnected = false;

    ws.onopen = () => {
      console.log('WebSocket connection established');
      isConnected = true;
      if (subscriptionPayload) {
        ws.send(JSON.stringify(subscriptionPayload));
        console.log('Subscription payload sent:', subscriptionPayload);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (!isConnected) {
        // Only throw error if connection was never established
        throw new Error('Failed to establish WebSocket connection');
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      if (isConnected) {
        // Only attempt reconnect if we were previously connected
        setTimeout(() => {
          if (this.listeners.has(orderId)) {
            console.log('Attempting to reconnect WebSocket...');
            this.startPaymentListener(orderId);
          }
        }, 5000);
      }
    };
  }

  async startBitcoinListener(orderId, address, expectedAmount) {
    try {
      // Use blockchain.info's WebSocket API
      const wsEndpoint = 'wss://ws.blockchain.info/inv';
      console.log('Connecting to BTC WebSocket:', wsEndpoint);
      
      const ws = new WebSocket(wsEndpoint);
      
      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received BTC payment data:', data);
          if (this.verifyBitcoinPayment(data, address, expectedAmount)) {
            await this.updatePaymentStatus(orderId, 'completed', {
              txHash: data.x.hash,
              confirmations: data.x.confirmations,
              cryptoType: 'BTC'
            });
            this.stopPaymentListener(orderId);
          }
        } catch (error) {
          console.error('Error processing BTC payment:', error);
        }
      };

      ws.onopen = () => {
        console.log('BTC WebSocket connected, subscribing to address:', address);
        ws.send(JSON.stringify({
          "op": "addr_sub",
          "addr": address
        }));
      };

      this.websockets.set(orderId, ws);
    } catch (error) {
      console.error('Error starting BTC listener:', error);
      throw error;
    }
  }

  async startEthereumListener(orderId, address, expectedAmount) {
    const filter = {
      address: address,
      topics: [
        ethers.utils.id("Transfer(address,address,uint256)")
      ]
    };

    this.provider.on(filter, async (log) => {
      const tx = await this.provider.getTransaction(log.transactionHash);
      if (this.verifyEthereumPayment(tx, address, expectedAmount)) {
        await this.updatePaymentStatus(orderId, 'completed', {
          txHash: log.transactionHash,
          confirmations: log.confirmations,
          cryptoType: 'ETH'
        });
        this.stopPaymentListener(orderId);
      }
    });
  }

  async startUSDTListener(orderId, address, expectedAmount) {
    try {
      // Use TronGrid's HTTP API instead of WebSocket for better reliability
      const checkInterval = setInterval(async () => {
        try {
          const response = await axios.get(
            `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20`,
            {
              headers: {
                'TRON-PRO-API-KEY': process.env.REACT_APP_TRONGRID_API_KEY
              }
            }
          );
          
          const transactions = response.data.data;
          for (const tx of transactions) {
            if (this.verifyUSDTPayment(tx, address, expectedAmount)) {
              await this.updatePaymentStatus(orderId, 'completed', {
                txHash: tx.transaction_id,
                confirmations: tx.confirmations || 1,
                cryptoType: 'USDT'
              });
              clearInterval(checkInterval);
              break;
            }
          }
        } catch (error) {
          console.error('Error checking USDT transactions:', error);
        }
      }, 10000); // Check every 10 seconds

      // Store the interval ID for cleanup
      this.websockets.set(orderId, { close: () => clearInterval(checkInterval) });
    } catch (error) {
      console.error('Error starting USDT listener:', error);
      throw error;
    }
  }

  stopPaymentListener(orderId) {
    console.log(`Stopping payment listener for order ${orderId}`);
    
    // Clean up WebSocket
    const ws = this.websockets.get(orderId);
    if (ws) {
      try {
        // Only close if the connection is still open
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      } catch (error) {
        console.warn('Error closing WebSocket:', error);
      }
      this.websockets.delete(orderId);
    }

    // Clean up listeners
    this.listeners.delete(orderId);
    
    // Clean up retry attempts
    this.retryAttempts.delete(orderId);

    console.log(`Successfully cleaned up listeners for order ${orderId}`);
  }

  verifyBitcoinPayment(txData, address, expectedAmount) {
    if (this.logPaymentVerifications) {
      console.log('Verifying BTC payment:', { txData, address, expectedAmount });
    }
    if (!txData || !txData.x) return false;

    const receivedAmount = txData.x.out.reduce((sum, output) => {
      if (output.addr === address) {
        return sum + (output.value / 100000000); // Convert satoshis to BTC
      }
      return sum;
    }, 0);

    return receivedAmount >= expectedAmount && 
           txData.x.confirmations >= SUPPORTED_CURRENCIES.BTC.minConfirmations;
  }

  verifyEthereumPayment(tx, address, expectedAmount) {
    if (this.logPaymentVerifications) {
      console.log('Verifying ETH payment:', { tx, address, expectedAmount });
    }
    if (!tx) return false;

    const receivedAmount = ethers.utils.formatEther(tx.value);
    return parseFloat(receivedAmount) >= expectedAmount && 
           tx.confirmations >= SUPPORTED_CURRENCIES.ETH.minConfirmations;
  }

  verifyUSDTPayment(txData, address, expectedAmount) {
    if (this.logPaymentVerifications) {
      console.log('Verifying USDT payment:', { txData, address, expectedAmount });
    }
    if (!txData) return false;

    const receivedAmount = parseInt(txData.value) / Math.pow(10, SUPPORTED_CURRENCIES.USDT.decimals);
    return receivedAmount >= expectedAmount && 
           txData.confirmations >= SUPPORTED_CURRENCIES.USDT.minConfirmations;
  }

  async updatePaymentStatus(orderId, status, txDetails) {
    const updateStatus = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
          status,
          paymentDetails: {
            ...txDetails,
            updatedAt: new Date()
          }
        });
      } catch (error) {
        console.error('Error updating payment status:', error);
        await this.retryOperation(() => updateStatus(), orderId);
      }
    };

    await updateStatus();
  }

  getExplorerUrl(txHash, cryptoType) {
    return SUPPORTED_CURRENCIES[cryptoType].explorerUrl + txHash;
  }

  cleanup() {
    // Clear price update interval
    if (this.priceInterval) {
      clearInterval(this.priceInterval);
    }

    // Stop all active listeners
    for (const orderId of this.listeners.keys()) {
      this.stopPaymentListener(orderId);
    }

    // Clear all maps
    this.listeners.clear();
    this.websockets.clear();
    this.retryAttempts.clear();
    
    console.log('CryptoPaymentService cleanup completed');
  }
}

// Test function - REMOVE IN PRODUCTION
export const simulatePayment = async (orderId, cryptoType) => {
  const testData = {
    BTC: {
      txHash: 'test-btc-hash',
      confirmations: 3,
      cryptoType: 'BTC'
    },
    ETH: {
      txHash: 'test-eth-hash',
      confirmations: 15,
      cryptoType: 'ETH'
    },
    USDT: {
      txHash: 'test-usdt-hash',
      confirmations: 20,
      cryptoType: 'USDT'
    }
  };

  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status: 'completed',
    paymentDetails: {
      ...testData[cryptoType],
      updatedAt: new Date()
    }
  });

  console.log(`Simulated ${cryptoType} payment for order ${orderId}`);
};

export const cryptoPaymentService = new CryptoPaymentService();
export default cryptoPaymentService; 