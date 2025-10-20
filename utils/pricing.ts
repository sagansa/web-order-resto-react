import { Product, SelectedVariant, SelectedModifier, OrderTypeDetails, CartItem, TakeawayProvider } from '../types';

export const TAX_RATE = 0.08;

/**
 * Calculates the final unit price of a product including variants, modifiers, and order type adjustments.
 * @param product The base product.
 * @param selectedVariants The chosen variants.
 * @param selectedModifiers The chosen modifiers.
 * @param orderType The details of the order type (Dine In or Takeaway).
 * @returns The final calculated unit price.
 */
export const calculateItemPrice = (
  product: Product,
  selectedVariants: SelectedVariant[],
  selectedModifiers: SelectedModifier[],
  orderType: OrderTypeDetails | null
): number => {
  let price = product.basePrice;

  // Apply order type adjustment for Takeaway
  if (orderType?.type === 'Takeaway' && product.priceAdjustments) {
    const adjustments = product.priceAdjustments;
    const provider = orderType.provider as TakeawayProvider;

    // Use the specific provider price if available, otherwise fall back to the generic 'takeaway' price.
    switch (provider) {
      case 'Shopee':
        price += adjustments.shopee ?? adjustments.takeaway ?? 0;
        break;
      case 'Gojek':
        price += adjustments.gojek ?? adjustments.takeaway ?? 0;
        break;
      case 'Grab':
        price += adjustments.grab ?? adjustments.takeaway ?? 0;
        break;
      case 'Non-Online':
      default:
        price += adjustments.takeaway ?? 0;
        break;
    }
  }

  // Apply variant and modifier price adjustments
  selectedVariants.forEach(v => price += v.priceAdjustment);
  selectedModifiers.forEach(m => price += m.priceAdjustment);
  
  return price;
};

/**
 * Calculates the subtotal, tax, and total for a list of cart items.
 * @param cartItems The items in the shopping cart.
 * @returns An object containing subtotal, taxAmount, total, and the taxRate used.
 */
export const calculateCartTotals = (cartItems: CartItem[]) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount;

  return { subtotal, taxAmount, total, taxRate: TAX_RATE };
};
