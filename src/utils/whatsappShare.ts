import { CartItem } from '../types';

import { formatCurrency } from './currency';
import { formatCartQuantityPlain, getUnitKind } from './units';

export function generateWhatsAppMessage(items: CartItem[], total: number, showPrices: boolean = true): string {
  let message = '🛒 *My Grocery List*\n\n';
  
  items.forEach((item, index) => {
    const kind = getUnitKind(item.product.unit);
    let quantityText: string;
    if (kind === 'weight' || kind === 'volume') {
      quantityText = formatCartQuantityPlain(item.product, item.quantity);
    } else {
      quantityText = item.quantity.toString();
    }
    message += `${index + 1}. *${item.product.name}* : ${quantityText}\n`;
  });
  
  // Calculate total items count
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `*Total Items: ${totalItems}*\n`;
  
  if (showPrices) {
    message += `*Total: ${formatCurrency(total)}*\n\n`;
  } else {
    message += `\n`;
  }
  message += `Generated from Kirana Store 🛍️`;
  
  return message;
}

export function shareOnWhatsApp(items: CartItem[], total: number, showPrices: boolean = true): void {
  const message = generateWhatsAppMessage(items, total, showPrices);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}
