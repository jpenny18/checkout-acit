import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

let cachedPromotions = {
  cryptoDiscount: {
    percentage: 35,
    enabled: true,
    description: 'Crypto payment discount',
    code: 'CRYPTO',
    type: 'payment_method'
  }
};

let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchPromotions = async () => {
  try {
    const now = new Date();
    const promotionsRef = collection(db, 'promotions');
    const activePromotionsQuery = query(
      promotionsRef,
      where('enabled', '==', true),
      where('startDate', '<=', now),
      where('endDate', '>=', now)
    );
    
    const querySnapshot = await getDocs(activePromotionsQuery);
    const promotions = {};
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      promotions[data.code] = {
        percentage: data.percentage,
        enabled: data.enabled,
        description: data.name,
        code: data.code,
        type: data.type
      };
    });
    
    // Always ensure we have a crypto discount
    if (!promotions.CRYPTO) {
      promotions.CRYPTO = cachedPromotions.cryptoDiscount;
    }
    
    cachedPromotions = promotions;
    lastFetch = Date.now();
    
    return promotions;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return cachedPromotions;
  }
};

export const getCryptoDiscountMultiplier = async () => {
  if (Date.now() - lastFetch > CACHE_DURATION) {
    await fetchPromotions();
  }
  const discount = cachedPromotions.CRYPTO?.percentage || 35;
  return (100 - discount) / 100;
};

export const getCryptoDiscountPercentage = async () => {
  if (Date.now() - lastFetch > CACHE_DURATION) {
    await fetchPromotions();
  }
  return cachedPromotions.CRYPTO?.percentage || 35;
};

// For components that need synchronous access
export const getCachedCryptoDiscountPercentage = () => {
  return cachedPromotions.CRYPTO?.percentage || 35;
};

export const getCachedCryptoDiscountMultiplier = () => {
  const discount = cachedPromotions.CRYPTO?.percentage || 35;
  return (100 - discount) / 100;
};

export default {
  fetchPromotions,
  getCryptoDiscountMultiplier,
  getCryptoDiscountPercentage,
  getCachedCryptoDiscountPercentage,
  getCachedCryptoDiscountMultiplier
}; 