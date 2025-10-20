// Fix: Replaced mock data with actual type definitions for the application.
export type TakeawayProvider = 'Non-Online' | 'Shopee' | 'Gojek' | 'Grab';

export interface VariantOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface VariantGroup {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
  defaultSelected?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  options: ModifierOption[];
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  imageUrl: string;
  description: string;
  category: string;
  variants?: VariantGroup[];
  modifiers?: ModifierGroup[];
  priceAdjustments?: {
    takeaway?: number;
    shopee?: number;
    gojek?: number;
    grab?: number;
  };
}

export interface SelectedVariant {
  variantGroupId: string;
  optionId: string;
  optionName: string;
  priceAdjustment: number;
}

export interface SelectedModifier {
  modifierGroupId: string;
  optionId: string;
  optionName: string;
  priceAdjustment: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants: SelectedVariant[];
  selectedModifiers: SelectedModifier[];
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export type OrderTypeDetails =
  | { type: 'Dine In'; table: string }
  | { type: 'Takeaway'; provider: TakeawayProvider };

export interface Order {
  id: string;
  timestamp: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  customerName: string;
  customerPhone: string;
  orderTypeDetails: OrderTypeDetails;
  restaurantId: string;
  restaurantName: string;
  paymentMethod: 'cash' | 'midtrans';
  paymentStatus: 'Paid' | 'Unpaid';
  midtransTransactionId?: string;
}

export interface Restaurant {
    id: string;
    name: string;
    address: string;
    phone: string;
    logoUrl: string;
}
