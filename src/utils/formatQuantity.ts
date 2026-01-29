import { Product, Unit } from '../types';

// Helper to get unit display name
export function getUnitDisplayName(unit: Unit, t: (key: string) => string): string {
  return t(`unit.${unit}`);
}

// Format quantity with unit for display
export function formatQuantity(product: Product, t: (key: string) => string): string {
  if (!product.quantity && !product.unit) {
    return '';
  }
  
  const parts: string[] = [];
  
  if (product.quantity !== undefined && product.quantity !== null) {
    // Format quantity - remove trailing zeros if it's a whole number
    const qty = product.quantity;
    const formattedQty = qty % 1 === 0 ? qty.toString() : qty.toFixed(2);
    parts.push(formattedQty);
  }
  
  if (product.unit) {
    parts.push(getUnitDisplayName(product.unit, t));
  }
  
  return parts.join(' ');
}
