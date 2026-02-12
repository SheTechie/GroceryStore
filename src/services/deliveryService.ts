/**
 * Delivery Service
 * Handles delivery validation and distance calculations
 */

// Store location (for distance calculation)
// In production, this would come from your backend
const STORE_LOCATION = {
  latitude: 28.6139, // Example: Delhi coordinates
  longitude: 77.2090,
  zipCode: '110001', // Example zipcode
};

// Delivery settings
const DELIVERY_MIN_ORDER = 500; // Minimum order amount for delivery (₹500)
const DELIVERY_MAX_DISTANCE = 2; // Maximum distance in km

// Delivery charges based on distance (in ₹)
const DELIVERY_CHARGES = {
  BASE_CHARGE: 30, // Base delivery charge
  PER_KM: 10, // Charge per km after first 0.5km
  FREE_DELIVERY_THRESHOLD: 500, // Free delivery for orders above this amount
  FREE_DELIVERY_DISTANCE: 0.5, // First 0.5km is free (if order is above threshold)
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Get coordinates from zipcode and address
 * In production, use a geocoding API like Google Maps Geocoding API
 */
export const getCoordinatesFromAddress = async (
  zipCode: string,
  address?: string,
  city?: string
): Promise<{ latitude: number; longitude: number } | null> => {
  // In production, use a geocoding service like:
  // - Google Maps Geocoding API
  // - OpenStreetMap Nominatim
  // - India Post API
  
  // For demo, return mock coordinates based on zipcode
  // Expanded zipcode mapping with realistic distances
  const zipCodeMap: Record<string, { 
    latitude: number; 
    longitude: number;
    distance?: number; // Pre-calculated distance in km
  }> = {
    // Very close (0-0.5km) - Free delivery
    '110001': { latitude: 28.6139, longitude: 77.2090, distance: 0.3 },
    '110002': { latitude: 28.6145, longitude: 77.2095, distance: 0.4 },
    
    // Close (0.5-1km) - Low charge
    '110003': { latitude: 28.6150, longitude: 77.2100, distance: 0.7 },
    '110004': { latitude: 28.6155, longitude: 77.2105, distance: 0.9 },
    
    // Medium (1-1.5km) - Medium charge
    '110005': { latitude: 28.6160, longitude: 77.2110, distance: 1.2 },
    '110006': { latitude: 28.6165, longitude: 77.2115, distance: 1.4 },
    
    // Far (1.5-2km) - Higher charge
    '110007': { latitude: 28.6170, longitude: 77.2120, distance: 1.7 },
    '110008': { latitude: 28.6175, longitude: 77.2125, distance: 1.9 },
    
    // Other cities (for testing - will be out of range)
    '400001': { latitude: 19.0760, longitude: 72.8777, distance: 1400 }, // Mumbai - too far
    '560001': { latitude: 12.9716, longitude: 77.5946, distance: 1750 }, // Bangalore - too far
  };

  // Check if zipcode exists in map
  if (zipCodeMap[zipCode]) {
    const coords = zipCodeMap[zipCode];
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  }

  // For unknown zipcodes, calculate distance from store
  // Generate a random nearby location (within 2km)
  const randomOffset = (Math.random() * 0.02 - 0.01); // ~0-1km variation
  const coords = {
    latitude: STORE_LOCATION.latitude + randomOffset,
    longitude: STORE_LOCATION.longitude + randomOffset,
  };
  
  // Calculate actual distance
  const distance = calculateDistance(
    STORE_LOCATION.latitude,
    STORE_LOCATION.longitude,
    coords.latitude,
    coords.longitude
  );
  
  // If distance is more than 2km, adjust to be within range
  if (distance > DELIVERY_MAX_DISTANCE) {
    // Scale down to be within 2km
    const scale = DELIVERY_MAX_DISTANCE / distance;
    return {
      latitude: STORE_LOCATION.latitude + (coords.latitude - STORE_LOCATION.latitude) * scale,
      longitude: STORE_LOCATION.longitude + (coords.longitude - STORE_LOCATION.longitude) * scale,
    };
  }
  
  return coords;
};

/**
 * Get coordinates from zipcode (backward compatibility)
 */
export const getCoordinatesFromZipcode = async (
  zipCode: string
): Promise<{ latitude: number; longitude: number } | null> => {
  return getCoordinatesFromAddress(zipCode);
};

/**
 * Check if delivery is available for given address
 */
export const checkDeliveryAvailability = async (
  zipCode: string,
  address?: string,
  city?: string
): Promise<{
  available: boolean;
  distance?: number;
  message?: string;
  deliveryCharge?: number;
}> => {
  try {
    const coordinates = await getCoordinatesFromAddress(zipCode, address, city);
    
    if (!coordinates) {
      return {
        available: false,
        message: 'Unable to verify delivery location. Please contact us.',
      };
    }

    const distance = calculateDistance(
      STORE_LOCATION.latitude,
      STORE_LOCATION.longitude,
      coordinates.latitude,
      coordinates.longitude
    );

    if (distance > DELIVERY_MAX_DISTANCE) {
      return {
        available: false,
        distance,
        message: `Delivery not available. Your location is ${distance.toFixed(2)}km away. We deliver within ${DELIVERY_MAX_DISTANCE}km.`,
      };
    }

    // Calculate delivery charge (will be recalculated with order amount later)
    const deliveryCharge = calculateDeliveryCharge(0, distance);

    return {
      available: true,
      distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      message: `Delivery available! Your location is ${distance.toFixed(2)}km away.`,
      deliveryCharge,
    };
  } catch (error) {
    console.error('Error checking delivery availability:', error);
    return {
      available: false,
      message: 'Error checking delivery availability. Please try again.',
    };
  }
};

/**
 * Validate delivery requirements
 */
export const validateDeliveryRequirements = (
  orderAmount: number,
  deliveryType: 'pickup' | 'delivery'
): {
  valid: boolean;
  message?: string;
} => {
  if (deliveryType === 'pickup') {
    return { valid: true };
  }

  // Check minimum order amount for delivery
  if (orderAmount < DELIVERY_MIN_ORDER) {
    return {
      valid: false,
      message: `Minimum order of ₹${DELIVERY_MIN_ORDER} required for home delivery. Current order: ₹${orderAmount.toFixed(2)}`,
    };
  }

  return { valid: true };
};

/**
 * Calculate delivery charge based on order amount and distance
 */
export const calculateDeliveryCharge = (
  orderAmount: number,
  distance: number
): number => {
  // Free delivery for orders above threshold
  if (orderAmount >= DELIVERY_CHARGES.FREE_DELIVERY_THRESHOLD) {
    // Check if within free delivery distance
    if (distance <= DELIVERY_CHARGES.FREE_DELIVERY_DISTANCE) {
      return 0;
    }
    // Charge only for distance beyond free threshold
    const chargeableDistance = distance - DELIVERY_CHARGES.FREE_DELIVERY_DISTANCE;
    return Math.ceil(chargeableDistance * DELIVERY_CHARGES.PER_KM);
  }

  // Calculate charge based on distance
  // Base charge + per km charge after first 0.5km
  if (distance <= DELIVERY_CHARGES.FREE_DELIVERY_DISTANCE) {
    return DELIVERY_CHARGES.BASE_CHARGE;
  }

  const chargeableDistance = distance - DELIVERY_CHARGES.FREE_DELIVERY_DISTANCE;
  const totalCharge = DELIVERY_CHARGES.BASE_CHARGE + (chargeableDistance * DELIVERY_CHARGES.PER_KM);
  
  return Math.ceil(totalCharge);
};

/**
 * Get delivery fee (backward compatibility)
 */
export const getDeliveryFee = (orderAmount: number, distance?: number): number => {
  if (!distance) {
    return 0;
  }
  return calculateDeliveryCharge(orderAmount, distance);
};

export { 
  DELIVERY_MIN_ORDER, 
  DELIVERY_MAX_DISTANCE, 
  STORE_LOCATION,
  DELIVERY_CHARGES 
};
