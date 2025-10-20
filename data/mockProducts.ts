import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Espresso',
    basePrice: 2.50,
    imageUrl: 'https://picsum.photos/seed/espresso/300/200',
    description: 'Strong and bold classic espresso.',
    category: 'Coffee',
    variants: [
      {
        id: 'var_espresso_size',
        name: 'Size',
        options: [
          { id: 'opt_espresso_single', name: 'Single', priceAdjustment: 0 },
          { id: 'opt_espresso_double', name: 'Double', priceAdjustment: 0.75 },
        ],
      },
    ],
    modifiers: [
      {
        id: 'mod_espresso_milk',
        name: 'Milk Option (Choose 1)',
        minSelection: 0,
        maxSelection: 1,
        options: [
          { id: 'opt_milk_none', name: 'None', priceAdjustment: 0, defaultSelected: true },
          { id: 'opt_milk_dairy', name: 'Dairy Milk', priceAdjustment: 0.50 },
          { id: 'opt_milk_almond', name: 'Almond Milk', priceAdjustment: 0.75 },
          { id: 'opt_milk_oat', name: 'Oat Milk', priceAdjustment: 0.75 },
        ],
      },
    ],
    priceAdjustments: {
      takeaway: 0.20, // for Non-Online
    },
  },
  {
    id: 'prod_2',
    name: 'Margherita Pizza',
    basePrice: 12.00,
    imageUrl: 'https://picsum.photos/seed/pizza/300/200',
    description: 'Classic Margherita with fresh mozzarella and basil.',
    category: 'Food',
    variants: [
      {
        id: 'var_pizza_size',
        name: 'Size',
        options: [
          { id: 'opt_pizza_medium', name: 'Medium (12")', priceAdjustment: 0 },
          { id: 'opt_pizza_large', name: 'Large (16")', priceAdjustment: 4.00 },
        ],
      },
    ],
    modifiers: [
      {
        id: 'mod_pizza_crust',
        name: 'Crust (Choose 1)',
        minSelection: 1,
        maxSelection: 1,
        options: [
          { id: 'opt_crust_thin', name: 'Thin Crust', priceAdjustment: 0, defaultSelected: true },
          { id: 'opt_crust_thick', name: 'Thick Crust', priceAdjustment: 1.00 },
          { id: 'opt_crust_stuffed', name: 'Stuffed Crust', priceAdjustment: 2.50 },
        ],
      },
      {
        id: 'mod_pizza_toppings',
        name: 'Extra Toppings (Up to 3)',
        minSelection: 0,
        maxSelection: 3,
        options: [
          { id: 'opt_topping_pepperoni', name: 'Pepperoni', priceAdjustment: 1.50 },
          { id: 'opt_topping_mushrooms', name: 'Mushrooms', priceAdjustment: 1.00 },
          { id: 'opt_topping_olives', name: 'Olives', priceAdjustment: 0.75 },
          { id: 'opt_topping_onions', name: 'Onions', priceAdjustment: 0.50 },
        ],
      },
    ],
    priceAdjustments: {
      takeaway: 0.50, // Non-Online fee
      shopee: 1.00,
      gojek: 1.00,
      grab: 1.20,
    },
  },
  {
    id: 'prod_3',
    name: 'Classic Burger',
    basePrice: 8.50,
    imageUrl: 'https://picsum.photos/seed/burger/300/200',
    description: 'Juicy beef patty with lettuce, tomato, and onion.',
    category: 'Food',
    modifiers: [
      {
        id: 'mod_burger_cheese',
        name: 'Cheese (Optional)',
        minSelection: 0,
        maxSelection: 1,
        options: [
          { id: 'opt_cheese_none', name: 'No Cheese', priceAdjustment: 0, defaultSelected: true },
          { id: 'opt_cheese_cheddar', name: 'Cheddar', priceAdjustment: 1.00 },
          { id: 'opt_cheese_swiss', name: 'Swiss', priceAdjustment: 1.00 },
        ],
      },
      {
        id: 'mod_burger_addons',
        name: 'Add-ons',
        minSelection: 0,
        maxSelection: 2, // Select up to 2 add-ons
        options: [
          { id: 'opt_addon_bacon', name: 'Bacon', priceAdjustment: 1.50 },
          { id: 'opt_addon_avocado', name: 'Avocado', priceAdjustment: 2.00 },
          { id: 'opt_addon_egg', name: 'Fried Egg', priceAdjustment: 1.25 },
        ],
      },
    ],
    priceAdjustments: {
      takeaway: 0.25,
    },
  },
  {
    id: 'prod_4',
    name: 'Croissant',
    basePrice: 3.00,
    imageUrl: 'https://picsum.photos/seed/croissant/300/200',
    description: 'Buttery and flaky French croissant.',
    category: 'Bakery',
  },
  {
    id: 'prod_5',
    name: 'Iced Latte',
    basePrice: 4.00,
    imageUrl: 'https://picsum.photos/seed/latte/300/200',
    description: 'Chilled espresso with milk over ice.',
    category: 'Coffee',
    variants: [
      {
        id: 'var_latte_size',
        name: 'Size',
        options: [
          { id: 'opt_latte_regular', name: 'Regular', priceAdjustment: 0 },
          { id: 'opt_latte_large', name: 'Large', priceAdjustment: 1.00 },
        ],
      },
    ],
    modifiers: [
       {
        id: 'mod_latte_milk',
        name: 'Milk Option (Choose 1)',
        minSelection: 1,
        maxSelection: 1,
        options: [
          { id: 'opt_latte_milk_dairy', name: 'Dairy Milk', priceAdjustment: 0, defaultSelected: true },
          { id: 'opt_latte_milk_almond', name: 'Almond Milk', priceAdjustment: 0.75 },
          { id: 'opt_latte_milk_oat', name: 'Oat Milk', priceAdjustment: 0.75 },
          { id: 'opt_latte_milk_soy', name: 'Soy Milk', priceAdjustment: 0.50 },
        ],
      },
      {
        id: 'mod_latte_sweetener',
        name: 'Sweetener (Optional)',
        minSelection: 0,
        maxSelection: 1,
        options: [
          { id: 'opt_sweet_none', name: 'None', priceAdjustment: 0, defaultSelected: true },
          { id: 'opt_sweet_sugar', name: 'Sugar', priceAdjustment: 0 },
          { id: 'opt_sweet_vanilla', name: 'Vanilla Syrup', priceAdjustment: 0.50 },
          { id: 'opt_sweet_caramel', name: 'Caramel Syrup', priceAdjustment: 0.50 },
        ],
      },
    ],
  },
];