

// Fix: Imported useState and useEffect from React to resolve "Cannot find name" errors.
import React, { useState, useEffect } from 'react';
import { mockProducts } from './data/mockProducts';
import { mockOrderHistory } from './data/mockOrderHistory';
import { mockRestaurants } from './data/mockRestaurant';
import { Product, CartItem, OrderTypeDetails, Order, Restaurant } from './types';
import { calculateItemPrice } from './utils/pricing';
import ProductGrid from './components/ProductGrid';
import OrderSummary from './components/OrderSummary';
import SelectionModal from './components/SelectionModal';
import QrScannerModal from './components/QrScannerModal';
import CustomerInfoModal from './components/CustomerInfoModal';
import PaymentModal from './components/PaymentModal';
import OrderConfirmation from './components/OrderConfirmation';
import FloatingCartButton from './components/FloatingCartButton';
import ProfileModal from './components/ProfileModal';
import OrderDetailsModal from './components/OrderDetailsModal';
import SearchModal from './components/SearchModal';

const App: React.FC = () => {
    // State Management
    const [products] = useState<Product[]>(mockProducts);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [itemToEdit, setItemToEdit] = useState<CartItem | null>(null);

    const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
    const [orderTypeDetails, setOrderTypeDetails] = useState<OrderTypeDetails | null>(null);
    const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string } | null>(null);
    const [orderForPayment, setOrderForPayment] = useState<Omit<Order, 'paymentMethod' | 'paymentStatus'> | null>(null);
    const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [viewingOrderDetails, setViewingOrderDetails] = useState<Order | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Modal States
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);
    const [isCustomerInfoModalOpen, setIsCustomerInfoModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    // UI State
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [showOrderSummary, setShowOrderSummary] = useState(false);

    // Effects
    useEffect(() => {
        // Initialize from URL
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('restaurantId');
        const table = urlParams.get('table');
        
        if (restaurantId) {
            const foundRestaurant = mockRestaurants.find(r => r.id === restaurantId);
            if (foundRestaurant) {
                setActiveRestaurant(foundRestaurant);
                // Load customer info from local storage scoped to this restaurant
                const savedCustomer = localStorage.getItem(`customerInfo_${restaurantId}`);
                if (savedCustomer) {
                    setCustomerInfo(JSON.parse(savedCustomer));
                }
                // Load order history scoped to this restaurant
                const savedHistory = localStorage.getItem(`orderHistory_${restaurantId}`);
                setOrderHistory(savedHistory ? JSON.parse(savedHistory) : []);

            }
        }
        
        if (table) {
            setOrderTypeDetails({ type: 'Dine In', table });
        } else {
            // Default to takeaway if no table is specified but a restaurant is.
            setOrderTypeDetails({ type: 'Takeaway', provider: 'Non-Online'});
        }

        // Initialize categories from all products
        const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];
        setCategories(uniqueCategories);
    }, [products]);

    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, products]);
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (orderTypeDetails) {
            setCartItems(prevCart => prevCart.map(item => {
                const newUnitPrice = calculateItemPrice(item.product, item.selectedVariants, item.selectedModifiers, orderTypeDetails);
                return { ...item, unitPrice: newUnitPrice, totalPrice: newUnitPrice * item.quantity };
            }));
        }
    }, [orderTypeDetails]);
    
     useEffect(() => {
        // Persist order history to local storage when it changes
        if (activeRestaurant) {
            localStorage.setItem(`orderHistory_${activeRestaurant.id}`, JSON.stringify(orderHistory));
        }
    }, [orderHistory, activeRestaurant]);

    // Handlers
    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setIsSelectionModalOpen(true);
        setItemToEdit(null);
    };

    const handleAddToCart = (itemDraft: Omit<CartItem, 'id' | 'totalPrice'>) => {
        setCartItems(prevCart => {
            const idToUpdate = itemToEdit?.id;
            const itemExists = prevCart.find(item => item.id === idToUpdate);

            if (itemExists) {
                return prevCart.map(item =>
                    item.id === idToUpdate
                        ? { ...item, ...itemDraft, totalPrice: itemDraft.unitPrice * itemDraft.quantity }
                        : item
                );
            } else {
                const newItem: CartItem = {
                    ...itemDraft,
                    id: `cart_${Date.now()}_${Math.random()}`,
                    totalPrice: itemDraft.unitPrice * itemDraft.quantity,
                };
                return [...prevCart, newItem];
            }
        });
        setItemToEdit(null);
    };

    const handleRemoveItem = (itemId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
        setCartItems(prev => prev.map(item =>
            item.id === itemId
                ? { ...item, quantity: newQuantity, totalPrice: item.unitPrice * newQuantity }
                : item
        ));
    };

    const handleEditItem = (item: CartItem) => {
        setSelectedProduct(item.product);
        setItemToEdit(item);
        setIsSelectionModalOpen(true);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        if (customerInfo) {
            proceedToPayment(customerInfo);
        } else {
            setIsEditingProfile(false);
            setIsCustomerInfoModalOpen(true);
        }
    };
    
    const proceedToPayment = (customer: { name: string; phone: string; }) => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const taxAmount = subtotal * 0.08;
        const total = subtotal + taxAmount;
        
        if (!activeRestaurant) return;
        
        const newOrder: Omit<Order, 'paymentMethod' | 'paymentStatus'> = {
            id: `order_${Date.now()}`,
            timestamp: new Date().toISOString(),
            items: cartItems,
            subtotal,
            taxAmount,
            total,
            customerName: customer.name,
            customerPhone: customer.phone,
            orderTypeDetails: orderTypeDetails!,
            restaurantId: activeRestaurant.id,
            restaurantName: activeRestaurant.name,
        };
        setOrderForPayment(newOrder);
        setIsPaymentModalOpen(true);
    };

    const handleSaveCustomerInfo = (customer: { name: string; phone: string; }) => {
        setCustomerInfo(customer);
        if (activeRestaurant) {
            localStorage.setItem(`customerInfo_${activeRestaurant.id}`, JSON.stringify(customer));
        }
        setIsCustomerInfoModalOpen(false);
    
        if (!isEditingProfile) {
            proceedToPayment(customer);
        }
        setIsEditingProfile(false);
    };

    const handlePaymentSuccess = (finalOrder: Order) => {
        setCompletedOrder(finalOrder);
        setOrderHistory(prev => [finalOrder, ...prev]);
        setCartItems([]);
        setIsPaymentModalOpen(false);
        setOrderForPayment(null);
    };

    const handleStartNewOrder = () => {
        setCompletedOrder(null);
    };

    const handleQrScanSuccess = (decodedText: string) => {
        try {
            const url = new URL(decodedText);
            const restaurantId = url.searchParams.get('restaurantId');
            const table = url.searchParams.get('table');

            if (restaurantId && table) {
                // Full reload to correctly set restaurant context
                window.location.href = `/?restaurantId=${restaurantId}&table=${table}`;
            } else {
                alert("Invalid QR Code. It must contain 'restaurantId' and 'table'.");
            }
        } catch (e) {
             alert(`Invalid QR code scanned: ${decodedText}`);
        }
        setIsQrScannerModalOpen(false);
    };
    
    const handleEditProfile = () => {
        setIsProfileModalOpen(false);
        setIsEditingProfile(true);
        setIsCustomerInfoModalOpen(true);
    };
    
    const handleViewOrderDetails = (order: Order) => {
        setViewingOrderDetails(order);
        setIsProfileModalOpen(false);
    };
    
    const closeOrderDetails = () => {
        setViewingOrderDetails(null);
    };
    
    const handleSearchSelect = (product: Product) => {
        setIsSearchModalOpen(false);
        handleProductSelect(product);
    };

    if (completedOrder) {
        return <OrderConfirmation order={completedOrder} onStartNewOrder={handleStartNewOrder} />;
    }
    
    if (!activeRestaurant) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
                 <div className="max-w-md w-full">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
                    <p className="mt-2 text-gray-600">Please scan a QR code at your table to begin ordering.</p>
                     <button 
                        onClick={() => setIsQrScannerModalOpen(true)}
                        className="mt-8 w-full flex items-center justify-center gap-3 py-4 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636 6.364l.707.707M7 20v-1m9-15.364l.707-.707M17 4v1" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Scan QR Code
                    </button>
                 </div>
                 <QrScannerModal
                    isOpen={isQrScannerModalOpen}
                    onClose={() => setIsQrScannerModalOpen(false)}
                    onScanSuccess={handleQrScanSuccess}
                />
            </div>
        )
    }

    return (
        <div className="bg-gray-50 font-sans antialiased text-gray-800">
            <div className={`relative min-h-screen lg:flex lg:overflow-hidden ${isMobile ? 'overflow-x-hidden w-screen' : ''}`}>
                <main className="flex-1 p-4 lg:p-6 lg:overflow-y-auto">
                    {/* Header */}
                    <header className="mb-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img src={activeRestaurant.logoUrl} alt={`${activeRestaurant.name} logo`} className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"/>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{activeRestaurant.name}</h1>
                                <p className="text-sm text-gray-600">{orderTypeDetails?.type === 'Dine In' ? `Table: ${orderTypeDetails.table}` : 'Takeaway Order'}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsProfileModalOpen(true)}
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                aria-label="Open customer profile"
                             >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </button>
                        </div>
                    </header>
                    
                    {/* Filters */}
                    <div className="sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10 py-3 mb-4 flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => setIsSearchModalOpen(true)}
                            className="flex items-center gap-2 flex-grow bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <span className="flex-1 text-left text-sm">Search products...</span>
                        </button>
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <div className="flex items-center bg-white border rounded-lg p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>
                    
                    <ProductGrid products={filteredProducts} onProductSelect={handleProductSelect} viewMode={viewMode} />
                </main>

                {/* Order Summary (Sidebar) */}
                <aside className={`lg:w-1/3 xl:w-1/4 lg:flex-shrink-0 h-screen lg:h-auto lg:sticky lg:top-0 ${isMobile ? 'fixed top-0 right-0 w-full z-30 transform transition-transform duration-300' : ''} ${isMobile && !showOrderSummary ? 'translate-x-full' : 'translate-x-0'}`}>
                    <div className="p-4 h-full relative">
                       {isMobile && (
                         <button onClick={() => setShowOrderSummary(false)} className="absolute top-7 right-7 z-50 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-gray-900">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                       )}
                        <OrderSummary
                            cartItems={cartItems}
                            onRemoveItem={handleRemoveItem}
                            onUpdateQuantity={handleUpdateQuantity}
                            onCheckout={handleCheckout}
                            onEditItem={handleEditItem}
                            orderTypeDetails={orderTypeDetails}
                        />
                    </div>
                </aside>
            </div>
            
            {/* Modals */}
            <SelectionModal
                isOpen={isSelectionModalOpen}
                onClose={() => setIsSelectionModalOpen(false)}
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                itemToEdit={itemToEdit}
                orderType={orderTypeDetails}
            />
            <QrScannerModal
                isOpen={isQrScannerModalOpen}
                onClose={() => setIsQrScannerModalOpen(false)}
                onScanSuccess={handleQrScanSuccess}
            />
            <CustomerInfoModal
                isOpen={isCustomerInfoModalOpen}
                onClose={() => setIsCustomerInfoModalOpen(false)}
                onSave={handleSaveCustomerInfo}
                initialData={customerInfo}
                isEditing={isEditingProfile}
            />
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                order={orderForPayment}
                onPaymentSuccess={handlePaymentSuccess}
            />
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                customer={customerInfo}
                orders={orderHistory}
                onViewDetails={handleViewOrderDetails}
                onEditProfile={handleEditProfile}
            />
            {viewingOrderDetails && (
                <OrderDetailsModal
                    isOpen={!!viewingOrderDetails}
                    onClose={closeOrderDetails}
                    order={viewingOrderDetails}
                />
            )}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                products={products}
                onProductSelect={handleSearchSelect}
            />

            {isMobile && !showOrderSummary && (
                <FloatingCartButton
                    itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    onClick={() => setShowOrderSummary(true)}
                />
            )}
        </div>
    );
};

export default App;