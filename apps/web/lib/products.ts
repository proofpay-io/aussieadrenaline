// Nike-themed product catalog for demo store

export interface Product {
  id: string;
  name: string;
  category: 'shoes' | 'apparel' | 'accessories';
  price_cents: number;
  sizes?: string[]; // For shoes and some apparel
  colorways?: string[]; // Color variations (e.g., "Black/White", "Red/Blue")
  image_placeholder: string;
  sku: string;
  description?: string;
}

export const productCatalog: Product[] = [
  // Shoes
  {
    id: 'nike-001',
    name: 'Air Max 90',
    category: 'shoes',
    price_cents: 12999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['Black/White', 'White/Red', 'Triple Black', 'Volt/Black', 'Grey/Blue'],
    image_placeholder: '👟',
    sku: 'NK-AM90-001',
    description: 'Classic Air Max 90 with visible Air cushioning'
  },
  {
    id: 'nike-002',
    name: 'Air Force 1 Low',
    category: 'shoes',
    price_cents: 8999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['Triple White', 'Black/White', 'University Blue', 'Sail/Gum', 'Panda'],
    image_placeholder: '👟',
    sku: 'NK-AF1-LOW',
    description: 'The icon that changed sneaker culture forever'
  },
  {
    id: 'nike-003',
    name: 'Dunk Low Retro',
    category: 'shoes',
    price_cents: 10999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['Panda', 'Kentucky', 'Syracuse', 'Black/White', 'Grey Fog'],
    image_placeholder: '👟',
    sku: 'NK-DUNK-LR',
    description: 'Retro basketball-inspired design'
  },
  {
    id: 'nike-004',
    name: 'Air Jordan 1 High',
    category: 'shoes',
    price_cents: 16999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['Bred', 'Chicago', 'Royal Blue', 'Shadow', 'Obsidian'],
    image_placeholder: '👟',
    sku: 'NK-AJ1-HIGH',
    description: 'The original that started it all'
  },
  {
    id: 'nike-005',
    name: 'Blazer Mid 77',
    category: 'shoes',
    price_cents: 9999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['White/Black', 'Vintage', 'Sail', 'Black/Gum', 'Off-White'],
    image_placeholder: '👟',
    sku: 'NK-BLZ-M77',
    description: 'Vintage basketball court style'
  },
  {
    id: 'nike-006',
    name: 'React Element 55',
    category: 'shoes',
    price_cents: 11999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['Black/White', 'Sail', 'Volt', 'Grey', 'Pink'],
    image_placeholder: '👟',
    sku: 'NK-RE55',
    description: 'Innovative React foam cushioning'
  },
  {
    id: 'nike-007',
    name: 'Cortez Classic',
    category: 'shoes',
    price_cents: 7999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['White/Red/Blue', 'Black/White', 'Sail', 'Grey', 'Navy'],
    image_placeholder: '👟',
    sku: 'NK-CORTEZ',
    description: 'The original running shoe'
  },
  {
    id: 'nike-008',
    name: 'Pegasus 40',
    category: 'shoes',
    price_cents: 13999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['Black/White', 'Volt/Black', 'Grey/Blue', 'White/Pink', 'Navy'],
    image_placeholder: '👟',
    sku: 'NK-PEG40',
    description: 'Responsive running shoe with Air Zoom'
  },
  {
    id: 'nike-009',
    name: 'VaporMax Plus',
    category: 'shoes',
    price_cents: 18999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['Triple Black', 'White/Black', 'Volt', 'Grey', 'Multicolor'],
    image_placeholder: '👟',
    sku: 'NK-VM-PLUS',
    description: 'Maximal Air cushioning system'
  },
  {
    id: 'nike-010',
    name: 'Zoom Fly 5',
    category: 'shoes',
    price_cents: 14999,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colorways: ['Black/White', 'Volt/Black', 'Grey/Blue', 'White/Red', 'Navy'],
    image_placeholder: '👟',
    sku: 'NK-ZF5',
    description: 'Lightweight racing shoe'
  },
  
  // Apparel
  {
    id: 'nike-011',
    name: 'Dri-FIT T-Shirt',
    category: 'apparel',
    price_cents: 3499,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colorways: ['Black', 'White', 'Navy', 'Grey', 'Red'],
    image_placeholder: '👕',
    sku: 'NK-DF-TEE',
    description: 'Moisture-wicking performance tee'
  },
  {
    id: 'nike-012',
    name: 'Tech Fleece Hoodie',
    category: 'apparel',
    price_cents: 9999,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colorways: ['Black', 'Grey', 'Navy', 'Olive', 'Charcoal'],
    image_placeholder: '🧥',
    sku: 'NK-TF-HOOD',
    description: 'Premium fleece with modern fit'
  },
  {
    id: 'nike-013',
    name: 'Dri-FIT Shorts',
    category: 'apparel',
    price_cents: 4499,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colorways: ['Black', 'Navy', 'Grey', 'Volt', 'Royal Blue'],
    image_placeholder: '🩳',
    sku: 'NK-DF-SHORT',
    description: 'Lightweight running shorts'
  },
  {
    id: 'nike-014',
    name: 'Sportswear Joggers',
    category: 'apparel',
    price_cents: 7999,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colorways: ['Black', 'Grey', 'Navy', 'Olive', 'Charcoal'],
    image_placeholder: '👖',
    sku: 'NK-SW-JOG',
    description: 'Comfortable everyday joggers'
  },
  {
    id: 'nike-015',
    name: 'Pro Combat Compression Top',
    category: 'apparel',
    price_cents: 5999,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image_placeholder: '👕',
    sku: 'NK-PC-TOP',
    description: 'Athletic compression performance top'
  },
  {
    id: 'nike-016',
    name: 'Windrunner Jacket',
    category: 'apparel',
    price_cents: 11999,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image_placeholder: '🧥',
    sku: 'NK-WR-JKT',
    description: 'Classic wind-resistant jacket'
  },
  {
    id: 'nike-017',
    name: 'Dri-FIT Tank Top',
    category: 'apparel',
    price_cents: 2999,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image_placeholder: '👕',
    sku: 'NK-DF-TANK',
    description: 'Sleeveless performance tank'
  },
  {
    id: 'nike-018',
    name: 'Sportswear Sweatpants',
    category: 'apparel',
    price_cents: 6999,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image_placeholder: '👖',
    sku: 'NK-SW-SWP',
    description: 'Relaxed fit sweatpants'
  },
  {
    id: 'nike-019',
    name: 'Pro Hyperwarm Long Sleeve',
    category: 'apparel',
    price_cents: 7999,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image_placeholder: '👕',
    sku: 'NK-PH-LS',
    description: 'Insulated training top'
  },
  {
    id: 'nike-020',
    name: 'Dri-FIT Leggings',
    category: 'apparel',
    price_cents: 6499,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image_placeholder: '👖',
    sku: 'NK-DF-LEG',
    description: 'Performance leggings for training'
  },
  
  // Accessories
  {
    id: 'nike-021',
    name: 'Swoosh Cap',
    category: 'accessories',
    price_cents: 2999,
    image_placeholder: '🧢',
    sku: 'NK-SW-CAP',
    description: 'Classic adjustable cap'
  },
  {
    id: 'nike-022',
    name: 'Dri-FIT Headband',
    category: 'accessories',
    price_cents: 1499,
    image_placeholder: '🎽',
    sku: 'NK-DF-HB',
    description: 'Moisture-wicking headband'
  },
  {
    id: 'nike-023',
    name: 'Training Backpack',
    category: 'accessories',
    price_cents: 7999,
    image_placeholder: '🎒',
    sku: 'NK-TR-BP',
    description: 'Durable gym and training backpack'
  },
  {
    id: 'nike-024',
    name: 'Swoosh Socks (3-Pack)',
    category: 'accessories',
    price_cents: 1999,
    image_placeholder: '🧦',
    sku: 'NK-SW-SOCKS',
    description: 'Cushioned athletic socks'
  },
  {
    id: 'nike-025',
    name: 'Water Bottle',
    category: 'accessories',
    price_cents: 2499,
    image_placeholder: '💧',
    sku: 'NK-WB-750',
    description: '750ml reusable water bottle'
  },
  {
    id: 'nike-026',
    name: 'Gym Bag',
    category: 'accessories',
    price_cents: 5999,
    image_placeholder: '👜',
    sku: 'NK-GB-MED',
    description: 'Medium-sized gym duffel bag'
  },
  {
    id: 'nike-027',
    name: 'Wristband (2-Pack)',
    category: 'accessories',
    price_cents: 1299,
    image_placeholder: '🎽',
    sku: 'NK-WB-2PK',
    description: 'Sweat-absorbing wristbands'
  },
  {
    id: 'nike-028',
    name: 'Training Gloves',
    category: 'accessories',
    price_cents: 3499,
    image_placeholder: '🧤',
    sku: 'NK-TG-FIT',
    description: 'Grip-enhancing training gloves'
  },
  {
    id: 'nike-029',
    name: 'Yoga Mat',
    category: 'accessories',
    price_cents: 4999,
    image_placeholder: '🧘',
    sku: 'NK-YM-STD',
    description: 'Non-slip yoga and exercise mat'
  },
  {
    id: 'nike-030',
    name: 'Resistance Bands Set',
    category: 'accessories',
    price_cents: 3999,
    image_placeholder: '💪',
    sku: 'NK-RB-SET',
    description: '5-piece resistance band set'
  }
];

// Get random subset of products with varied categories and price ranges
export function getRandomProducts(count: number = 8): Product[] {
  // Ensure we get a mix of categories
  const shoes = productCatalog.filter(p => p.category === 'shoes');
  const apparel = productCatalog.filter(p => p.category === 'apparel');
  const accessories = productCatalog.filter(p => p.category === 'accessories');
  
  // Shuffle each category
  const shuffledShoes = [...shoes].sort(() => 0.5 - Math.random());
  const shuffledApparel = [...apparel].sort(() => 0.5 - Math.random());
  const shuffledAccessories = [...accessories].sort(() => 0.5 - Math.random());
  
  // Distribute products across categories (ensure variety)
  const result: Product[] = [];
  const categoryCounts = {
    shoes: Math.ceil(count * 0.4), // ~40% shoes
    apparel: Math.ceil(count * 0.4), // ~40% apparel
    accessories: Math.floor(count * 0.2), // ~20% accessories
  };
  
  // Adjust if we don't have enough in a category
  const totalAllocated = categoryCounts.shoes + categoryCounts.apparel + categoryCounts.accessories;
  if (totalAllocated > count) {
    categoryCounts.accessories = Math.max(0, count - categoryCounts.shoes - categoryCounts.apparel);
  }
  
  result.push(...shuffledShoes.slice(0, Math.min(categoryCounts.shoes, shuffledShoes.length)));
  result.push(...shuffledApparel.slice(0, Math.min(categoryCounts.apparel, shuffledApparel.length)));
  result.push(...shuffledAccessories.slice(0, Math.min(categoryCounts.accessories, shuffledAccessories.length)));
  
  // Fill remaining slots with random products from any category
  const remaining = count - result.length;
  if (remaining > 0) {
    const allShuffled = [...productCatalog].sort(() => 0.5 - Math.random());
    const usedIds = new Set(result.map(p => p.id));
    for (const product of allShuffled) {
      if (!usedIds.has(product.id) && result.length < count) {
        result.push(product);
        usedIds.add(product.id);
      }
    }
  }
  
  // Final shuffle to mix categories
  return result.sort(() => 0.5 - Math.random());
}

// Get a random colorway for a product
export function getRandomColorway(product: Product): string | undefined {
  if (product.colorways && product.colorways.length > 0) {
    return product.colorways[Math.floor(Math.random() * product.colorways.length)];
  }
  return undefined;
}

// Get a random size for a product
export function getRandomSize(product: Product): string | undefined {
  if (product.sizes && product.sizes.length > 0) {
    return product.sizes[Math.floor(Math.random() * product.sizes.length)];
  }
  return undefined;
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
  return productCatalog.find(p => p.id === id);
}

// Format price from cents to currency string
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100);
}

