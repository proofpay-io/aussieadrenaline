'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, getRandomProducts, formatPrice, getRandomColorway, getRandomSize, productCatalog } from '../../lib/products';

interface CartItem {
  product: Product;
  size?: string;
  quantity: number;
}

export default function DemoStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [saleSuccess, setSaleSuccess] = useState<{
    order_id: string;
    payment_id: string;
    total_cents: number;
    source?: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [demoStatus, setDemoStatus] = useState<{
    latest_receipt_id: string | null;
    latest_dispute_id: string | null;
  } | null>(null);
  const [loadingDemoStatus, setLoadingDemoStatus] = useState(false);
  const [generateLowConfidence, setGenerateLowConfidence] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoRefunded, setDemoRefunded] = useState(false);
  const [demoDisputed, setDemoDisputed] = useState(false);
  const [demoExpiredQR, setDemoExpiredQR] = useState(false);

  // Function to fetch demo status
  const fetchDemoStatus = async () => {
    setLoadingDemoStatus(true);
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/demo/status`);
      
      if (response.ok) {
        const data = await response.json();
        setDemoStatus({
          latest_receipt_id: data.latest_receipt_id,
          latest_dispute_id: data.latest_dispute_id
        });
      }
    } catch (error) {
      console.error('Error fetching demo status:', error);
    } finally {
      setLoadingDemoStatus(false);
    }
  };

  // Load random products on mount and fetch demo status
  useEffect(() => {
    setProducts(getRandomProducts(8));
    fetchDemoStatus();
  }, []);

  const randomizeProducts = () => {
    setProducts(getRandomProducts(8));
    setSelectedSizes({});
    setSaleSuccess(null);
  };

  const quickAddRandomCart = () => {
    // Select 2-5 random products
    const numItems = Math.floor(Math.random() * 4) + 2; // 2-5 items
    const shuffled = [...productCatalog].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffled.slice(0, numItems);
    
    const newCart: CartItem[] = [];
    const newSelectedSizes: Record<string, string> = {};
    
    selectedProducts.forEach(product => {
      // Random quantity (1-2)
      const quantity = Math.floor(Math.random() * 2) + 1;
      
      // Random size if product has sizes
      let size: string | undefined;
      if (product.sizes && product.sizes.length > 0) {
        size = getRandomSize(product);
        if (size) {
          newSelectedSizes[product.id] = size;
        }
      }
      
      // Random colorway if product has colorways (stored in size field for variation)
      // Actually, we'll use the size field for size, and add colorway to the product name in the API call
      
      newCart.push({
        product,
        size,
        quantity,
      });
    });
    
    // Ensure cart total > 0 (should always be true, but double-check)
    const total = newCart.reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0);
    if (total > 0) {
      setCart(newCart);
      setSelectedSizes(newSelectedSizes);
      setCartOpen(true);
      setSaleSuccess(null);
    } else {
      // Fallback: if somehow total is 0, add a single item
      const fallbackProduct = productCatalog[0];
      const fallbackSize = fallbackProduct.sizes ? getRandomSize(fallbackProduct) : undefined;
      setCart([{
        product: fallbackProduct,
        size: fallbackSize,
        quantity: 1,
      }]);
      if (fallbackSize) {
        setSelectedSizes({ [fallbackProduct.id]: fallbackSize });
      }
      setCartOpen(true);
    }
  };

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const addToCart = (product: Product) => {
    const size = product.sizes ? selectedSizes[product.id] : undefined;
    
    if (product.sizes && !size) {
      alert('Please select a size');
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { product, size, quantity: 1 }];
    });

    setCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.product.price_cents * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const simulatePurchase = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some products first!');
      return;
    }

    setIsSimulating(true);

    try {
      // Build cart payload with colorway variations
      const items = cart.map(item => {
        // Add colorway to name if available
        let itemName = item.product.name;
        const colorway = getRandomColorway(item.product);
        if (colorway) {
          itemName = `${item.product.name} (${colorway})`;
        }
        
        return {
          product_id: item.product.id,
          name: itemName,
          sku: item.product.sku,
          quantity: item.quantity,
          unit_price_cents: item.product.price_cents,
          variation: item.size || colorway || undefined,
        };
      });

      console.log('🎭 Simulating purchase with items:', items);

      // Call simulated purchase API
      const response = await fetch('/api/demo/simulate-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items,
          low_confidence: generateLowConfidence,
          demo_refunded: demoRefunded,
          demo_disputed: demoDisputed,
          demo_expired_qr: demoExpiredQR,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to simulate purchase');
      }

      // Success! Show success state
      setSaleSuccess({
        order_id: data.order_id,
        payment_id: data.payment_id,
        total_cents: data.total_cents,
        source: data.source || 'simulated',
      });

      // Clear cart after successful sale
      setCart([]);
      setCartOpen(false);
      setSelectedSizes({});

      // Fetch demo status after a short delay to allow receipt creation
      setTimeout(() => {
        fetchDemoStatus();
      }, 1000);
    } catch (error) {
      console.error('Error simulating purchase:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to simulate purchase'}`);
      setSaleSuccess(null);
    } finally {
      setIsSimulating(false);
    }
  };

  const generateSandboxSale = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some products first!');
      return;
    }

    setIsProcessing(true);

    try {
      // Build cart payload with colorway variations
      const items = cart.map(item => {
        // Add colorway to name if available
        let itemName = item.product.name;
        const colorway = getRandomColorway(item.product);
        if (colorway) {
          itemName = `${item.product.name} (${colorway})`;
        }
        
        // Use size as variation, or colorway if no size
        const variation = item.size || colorway || undefined;
        
        return {
          product_id: item.product.id,
          name: itemName,
          sku: item.product.sku,
          quantity: item.quantity,
          unit_price_cents: item.product.price_cents,
          variation: variation,
        };
      });

      console.log('🛒 Creating sale with items:', items);

      // Call API
      const response = await fetch('/api/demo/create-sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create sale');
      }

      // Success! Show success state
      setSaleSuccess({
        order_id: data.order_id,
        payment_id: data.payment_id,
        total_cents: data.total_cents,
        source: data.source || 'square',
      });

      // Clear cart after successful sale
      setCart([]);
      setCartOpen(false);
      setSelectedSizes({});

      // Fetch demo status after a short delay to allow receipt creation
      setTimeout(() => {
        fetchDemoStatus();
      }, 2000); // Longer delay for Square webhook
    } catch (error) {
      console.error('Error creating sale:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to create sale'}`);
      setSaleSuccess(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              ProofPay
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 hidden md:block"
              >
                Home
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center gap-2"
              >
                <span className="text-2xl">🛒</span>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
                <span className="hidden sm:inline">Cart</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nike Demo Store
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Powered by ProofPay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <button
                onClick={randomizeProducts}
                className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                🔀 Randomise Products
              </button>
              <button
                onClick={quickAddRandomCart}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                🛒 Quick Add Random Cart
              </button>
            </div>
            
            {/* Demo Toggles */}
            <div className="mt-4 space-y-2 max-w-2xl mx-auto">
              {/* Low Confidence Toggle */}
              <div className="flex items-center justify-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <input
                  type="checkbox"
                  id="low-confidence-toggle"
                  checked={generateLowConfidence}
                  onChange={(e) => setGenerateLowConfidence(e.target.checked)}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="low-confidence-toggle" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                  Generate low-confidence receipt
                </label>
                <span className="text-xs text-gray-500">
                  (Score: 40-70, LOW/MEDIUM)
                </span>
              </div>
              
              {/* Demo Verification State Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="demo-refunded-toggle"
                    checked={demoRefunded}
                    onChange={(e) => setDemoRefunded(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="demo-refunded-toggle" className="text-xs font-medium text-gray-700 cursor-pointer">
                    Simulate Refunded
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="demo-disputed-toggle"
                    checked={demoDisputed}
                    onChange={(e) => setDemoDisputed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="demo-disputed-toggle" className="text-xs font-medium text-gray-700 cursor-pointer">
                    Simulate Disputed
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="demo-expired-qr-toggle"
                    checked={demoExpiredQR}
                    onChange={(e) => setDemoExpiredQR(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="demo-expired-qr-toggle" className="text-xs font-medium text-gray-700 cursor-pointer">
                    Simulate Expired QR
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap mt-4">
              <button
                onClick={simulatePurchase}
                disabled={isSimulating || cart.length === 0}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSimulating ? '⏳ Simulating...' : '🎭 Simulate Purchase'}
              </button>
              <button
                onClick={generateSandboxSale}
                disabled={isProcessing || cart.length === 0}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? '⏳ Processing...' : '💳 Generate Sandbox Sale'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {saleSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                  ✅
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-green-900 mb-4">
                  {saleSuccess.source === 'simulated' ? 'Purchase simulated successfully' : 'Sale generated successfully'}
                </h2>
                
                <div className="bg-white rounded-lg p-4 mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Order ID:</span>
                    <span className="font-mono text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                      {saleSuccess.order_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Payment ID:</span>
                    <span className="font-mono text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                      {saleSuccess.payment_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Total:</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {formatPrice(saleSuccess.total_cents)}
                    </span>
                  </div>
                  {saleSuccess.source === 'simulated' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded">
                        🎭 Simulated Purchase
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <Link
                    href="/receipts"
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-center"
                  >
                    View Receipts
                  </Link>
                  <button
                    onClick={() => {
                      setSaleSuccess(null);
                      quickAddRandomCart();
                    }}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Generate Another Sale
                  </button>
                  <button
                    onClick={() => setSaleSuccess(null)}
                    className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>

                {saleSuccess.source === 'simulated' ? (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Simulated Purchase:</strong> This receipt was created directly in the database for demo purposes. 
                      It appears immediately in your receipts list.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> It may take 2–5 seconds for the webhook to write the receipt. 
                      If you don't see it immediately, refresh the receipts page.
                    </p>
                  </div>
                )}

                {/* Demo Status Panel */}
                <div className="mt-6 bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                    <span>📊</span>
                    Demo Status
                  </h3>
                  
                  {loadingDemoStatus ? (
                    <div className="flex items-center gap-2 text-sm text-indigo-700">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      Loading status...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Latest Receipt:</span>
                        {demoStatus?.latest_receipt_id ? (
                          <Link
                            href={`/receipts/${demoStatus.latest_receipt_id}`}
                            className="font-mono text-xs text-indigo-600 hover:text-indigo-800 underline bg-white px-2 py-1 rounded"
                          >
                            {demoStatus.latest_receipt_id.substring(0, 8)}...
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Latest Dispute:</span>
                        {demoStatus?.latest_dispute_id ? (
                          <Link
                            href={`/bank-admin/disputes`}
                            className="font-mono text-xs text-red-600 hover:text-red-800 underline bg-white px-2 py-1 rounded"
                          >
                            {demoStatus.latest_dispute_id.substring(0, 8)}...
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                      
                      <div className="pt-2 border-t border-indigo-200">
                        <Link
                          href="/bank-admin"
                          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-900"
                        >
                          <span>🔐</span>
                          Open Bank Admin Console
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image Placeholder */}
              <div className="bg-gray-100 h-64 flex items-center justify-center text-6xl">
                {product.image_placeholder}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {product.description}
                </p>
                <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>

                {/* Size Selection */}
                {product.sizes && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <select
                      value={selectedSizes[product.id] || ''}
                      onChange={(e) =>
                        handleSizeChange(product.id, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select size</option>
                      {product.sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price_cents)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setCartOpen(false)}
          />

          {/* Cart Drawer */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div
                        key={`${item.product.id}-${item.size || 'no-size'}-${index}`}
                        className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl">
                            {item.product.image_placeholder}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h3>
                          {item.size && (
                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                          )}
                          <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            >
                              −
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.product.price_cents * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-600 text-sm hover:text-red-700 mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {formatPrice(getCartTotal())}
                      </span>
                    </div>
                    {/* Low Confidence Toggle */}
                    <div className="mb-3 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="low-confidence-toggle-mobile"
                        checked={generateLowConfidence}
                        onChange={(e) => setGenerateLowConfidence(e.target.checked)}
                        className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                      />
                      <label htmlFor="low-confidence-toggle-mobile" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                        Generate low-confidence receipt
                      </label>
                      <span className="text-xs text-gray-500">
                        (40-70)
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={simulatePurchase}
                        disabled={isSimulating}
                        className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSimulating ? '⏳ Simulating...' : '🎭 Simulate Purchase'}
                      </button>
                      <button
                        onClick={generateSandboxSale}
                        disabled={isProcessing}
                        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isProcessing ? '⏳ Processing...' : '💳 Generate Sandbox Sale'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

