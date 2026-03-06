// ==================== M7 MARKETPLACE - PREMIUM JAVASCRIPT ====================
// All functions fixed and optimized

// ==================== GLOBAL VARIABLES ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 M7 Marketplace - Premium Edition Initializing...');
    
    updateNavbarForUser();
    updateCartCount();
    
    let path = window.location.pathname.split('/').pop();
    
    switch(path) {
        case 'products.html':
            displayAllProducts();
            break;
        case 'products_details.html':
            loadProductDetails();
            break;
        case 'cart.html':
            displayCart();
            break;
        case 'checkout.html':
            loadCheckoutPage();
            break;
        case 'seller-dashboard.html':
            loadSellerDashboard();
            break;
        case 'my-products.html':
            loadMyProductsPage();
            break;
        case 'seller-add-product.html':
            initAddProductForm();
            break;
        case 'auth.html':
            loadAccountPage();
            break;
        case 'login.html':
            initLoginForm();
            break;
        case 'register.html':
            initRegisterForm();
            break;
        case 'contact.html':
            initContactForm();
            break;
        case 'orders.html':
            loadSellerOrders();
            break;
        default:
            console.log('📄 Page:', path || 'home');
    }
});

// ==================== PREMIUM NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.premium-notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'premium-notification';
    
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };
    
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 320px;
        padding: 16px 20px; border-radius: 12px; background: ${colors[type]};
        color: white; font-weight: 500; font-size: 15px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
        display: flex; align-items: center; gap: 12px;
        transform: translateX(400px);
        animation: slideInNotification 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
        <span style="font-size: 24px;">${icons[type]}</span>
        <span style="flex: 1;">${message}</span>
        <span onclick="this.parentElement.remove()" style="cursor:pointer; opacity:0.7; font-size:18px;">✕</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutNotification 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInNotification {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutNotification {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==================== NAVBAR FUNCTIONS ====================
function updateNavbarForUser() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let nav = document.querySelector('nav ul');
    if (!nav) return;
    
    let currentPage = window.location.pathname.split('/').pop();
    
    const navItems = [
        { name: 'Home', url: 'home.html', icon: '🏠' },
        { name: 'Products', url: 'products.html', icon: '🛍️' },
        { name: 'Cart', url: 'cart.html', icon: '🛒', count: getCartCount() },
        { name: 'About', url: 'about.html', icon: '📖' },
        { name: 'Contact', url: 'contact.html', icon: '📞' }
    ];
    
    let navHTML = '';
    
    navItems.forEach(item => {
        const isActive = currentPage === item.url ? 'active' : '';
        const countSpan = item.count > 0 ? `<span class="cart-count">(${item.count})</span>` : '';
        navHTML += `<li><a href="${item.url}" class="${isActive}">${item.icon} ${item.name} ${countSpan}</a></li>`;
    });
    
    if (currentUser && currentUser.role === 'seller') {
        navHTML += `<li><a href="seller-dashboard.html" ${currentPage === 'seller-dashboard.html' ? 'class="active"' : ''}>📊 Dashboard</a></li>`;
    }
    
    navHTML += `<li><a href="auth.html" ${currentPage === 'auth.html' ? 'class="active"' : ''}>👤 Account</a></li>`;
    nav.innerHTML = navHTML;
}

function getCartCount() {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
}

function updateCartCount() {
    let count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(link => {
        link.textContent = count > 0 ? `(${count})` : '';
    });
}

// ==================== CART FUNCTIONS ====================
function addToCart(productId) {
    let product = allProducts.find(p => p.id == productId);
    
    if (!product) { 
        showNotification('❌ Product not found!', 'error'); 
        return; 
    }
    if (product.quantity <= 0) { 
        showNotification('⚠️ Out of stock!', 'warning'); 
        return; 
    }
    
    let existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.quantity) {
            existingItem.quantity += 1;
            showNotification(`➕ Increased ${product.name} quantity`, 'success');
        } else { 
            showNotification('❌ Not enough stock!', 'error'); 
            return; 
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            sellerId: product.sellerId,
            sellerName: product.sellerName
        });
        showNotification(`✅ ${product.name} added to cart!`, 'success');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateNavbarForUser();
}

function removeFromCart(index) {
    let item = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
    updateNavbarForUser();
    showNotification(`🗑️ ${item.name} removed from cart`, 'info');
}

function updateQuantity(index, change) {
    let item = cart[index];
    let newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) { 
        removeFromCart(index); 
        return; 
    }
    
    let product = allProducts.find(p => p.id == item.id);
    if (product && newQuantity <= product.quantity) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
        updateNavbarForUser();
    } else {
        showNotification('❌ Not enough stock!', 'error');
    }
}

function displayCart() {
    console.log('🛒 Displaying cart...');
    let container = document.getElementById('cart-items-container');
    let summaryContainer = document.getElementById('summary-details');
    
    if (!container) {
        console.error('❌ Cart container not found!');
        return;
    }
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 80px; margin-bottom: 20px;">🛒</div>
                <h2>Your cart is empty</h2>
                <p style="margin: 20px 0; opacity: 0.8;">Looks like you haven't added any items yet.</p>
                <a href="products.html" class="btn btn-primary" style="padding: 12px 30px;">Browse Products</a>
            </div>
        `;
        if (summaryContainer) summaryContainer.innerHTML = '';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    let totalItems = 0;
    
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        totalItems += item.quantity;
        
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100'">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${item.price.toLocaleString()} DZD</p>
                    <p class="cart-item-seller">Sold by: ${item.sellerName || 'Unknown'}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${i}, -1)" class="quantity-btn">−</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button onclick="updateQuantity(${i}, 1)" class="quantity-btn">+</button>
                    </div>
                    <p class="item-total">${itemTotal.toLocaleString()} DZD</p>
                    <button onclick="removeFromCart(${i})" class="remove-btn">Remove</button>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    if (summaryContainer) {
        let tax = Math.round(subtotal * 0.05);
        let shipping = 0;
        let total = subtotal + tax;
        
        summaryContainer.innerHTML = `
            <h3 style="margin-top: 0; color: #d96565;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Subtotal (${totalItems} items)</span>
                <span>${subtotal.toLocaleString()} DZD</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Tax (5%)</span>
                <span>${tax.toLocaleString()} DZD</span>
            </div>
            <hr style="border-color: #d96565; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; color: #4CAF50;">
                <span>Total</span>
                <span>${total.toLocaleString()} DZD</span>
            </div>
            <button onclick="proceedToCheckout()" class="checkout-btn">Proceed to Checkout</button>
        `;
    }
    
    console.log('✅ Cart displayed successfully');
}

function proceedToCheckout() {
    if (!currentUser) {
        showNotification('🔒 Please login to checkout', 'warning');
        window.location.href = 'login.html?redirect=checkout';
        return;
    }
    if (cart.length === 0) { 
        showNotification('🛒 Your cart is empty', 'error'); 
        return; 
    }
    window.location.href = 'checkout.html';
}

// ==================== CHECKOUT FUNCTIONS ====================
function loadCheckoutPage() {
    console.log('🛒 Loading checkout page...');
    let container = document.getElementById('checkout-container');
    if (!container) return;
    
    if (!currentUser) {
        container.innerHTML = `
            <div class="login-prompt" style="text-align: center; padding: 60px; background: rgba(255,255,255,0.1); border-radius: 30px; max-width: 500px; margin: 0 auto;">
                <div style="font-size: 80px; margin-bottom: 20px;">🔒</div>
                <h2>Please Login to Checkout</h2>
                <p style="margin: 20px 0; opacity: 0.8;">You need to be logged in to complete your purchase.</p>
                <div style="display: flex; gap: 20px; justify-content: center;">
                    <a href="login.html?redirect=checkout" class="btn btn-primary" style="padding: 12px 30px;">Login</a>
                    <a href="register.html" class="btn btn-success" style="padding: 12px 30px;">Register</a>
                </div>
            </div>
        `;
        return;
    }
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 60px; background: rgba(255,255,255,0.1); border-radius: 30px; max-width: 500px; margin: 0 auto;">
                <div style="font-size: 80px; margin-bottom: 20px;">🛒</div>
                <h2>Your cart is empty</h2>
                <p style="margin: 20px 0; opacity: 0.8;">Add some items to your cart before checkout.</p>
                <a href="products.html" class="btn btn-primary" style="padding: 12px 30px;">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let tax = Math.round(subtotal * 0.05);
    let total = subtotal + tax;
    
    let shippingName = currentUser.fullName || '';
    let shippingPhone = currentUser.phone || '';
    let shippingEmail = currentUser.email || '';
    
    container.innerHTML = `
        <h1 class="text-center" style="margin-bottom: 40px;">Checkout</h1>
        
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
            <div>
                <div class="step" style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
                    <h2 style="display: flex; align-items: center; gap: 10px; margin-top: 0; color: #d96565;">
                        <span style="background: #d96565; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">1</span>
                        Shipping Information
                    </h2>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #d96565;">Full Name *</label>
                        <input type="text" id="shipping-name" class="form-input" value="${shippingName}" placeholder="Enter your full name" style="width: 100%; padding: 12px; border-radius: 10px; border: none;">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #d96565;">Address *</label>
                        <input type="text" id="shipping-address" class="form-input" placeholder="Street, City, Wilaya" style="width: 100%; padding: 12px; border-radius: 10px; border: none;">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 5px; color: #d96565;">Phone Number *</label>
                            <input type="tel" id="shipping-phone" class="form-input" value="${shippingPhone}" placeholder="+213 XXX XXX XXX" style="width: 100%; padding: 12px; border-radius: 10px; border: none;">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 5px; color: #d96565;">Email</label>
                            <input type="email" id="shipping-email" class="form-input" value="${shippingEmail}" readonly style="width: 100%; padding: 12px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2);">
                        </div>
                    </div>
                </div>
                
                <div class="step" style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
                    <h2 style="display: flex; align-items: center; gap: 10px; margin-top: 0; color: #d96565;">
                        <span style="background: #d96565; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">2</span>
                        Payment Method
                    </h2>
                    
                    <div class="payment-methods">
                        <div class="payment-method selected" onclick="selectPayment('ccp')" id="payment-ccp" style="border: 2px solid #4CAF50; background: rgba(76,175,80,0.1); padding: 20px; border-radius: 15px; margin-bottom: 15px; cursor: pointer; display: flex; align-items: center; gap: 15px;">
                            <span style="font-size: 24px;">💳</span>
                            <div>
                                <h3 style="margin: 0 0 5px 0;">CCP / Bank Transfer</h3>
                                <p style="margin: 0; opacity: 0.7;">Pay directly from your CCP account</p>
                            </div>
                        </div>
                        
                        <div class="payment-method" onclick="selectPayment('cash')" id="payment-cash" style="border: 2px solid transparent; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; margin-bottom: 15px; cursor: pointer; display: flex; align-items: center; gap: 15px;">
                            <span style="font-size: 24px;">💵</span>
                            <div>
                                <h3 style="margin: 0 0 5px 0;">Cash on Delivery</h3>
                                <p style="margin: 0; opacity: 0.7;">Pay when you receive your order</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="step" style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
                    <h2 style="display: flex; align-items: center; gap: 10px; margin-top: 0; color: #d96565;">
                        <span style="background: #d96565; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">3</span>
                        Review Order
                    </h2>
                    
                    <div class="order-review" style="background: rgba(0,0,0,0.2); border-radius: 15px; padding: 20px;">
                        ${cart.map(item => `
                            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <span>${item.name} x${item.quantity}</span>
                                <span>${(item.price * item.quantity).toLocaleString()} DZD</span>
                            </div>
                        `).join('')}
                        
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold;">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()} DZD</span>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <span>Tax (5%)</span>
                            <span>${tax.toLocaleString()} DZD</span>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; padding: 15px 0 0; font-size: 20px; font-weight: bold; color: #4CAF50;">
                            <span>Total</span>
                            <span>${total.toLocaleString()} DZD</span>
                        </div>
                    </div>
                </div>
                
                <button onclick="placeOrder()" class="btn btn-success" style="width: 100%; padding: 18px; font-size: 18px; font-weight: bold; border-radius: 50px; cursor: pointer;">✅ Place Order</button>
            </div>
            
            <div>
                <div class="summary-card" style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 25px; position: sticky; top: 100px;">
                    <h3 style="margin-top: 0; color: #d96565; margin-bottom: 20px;">Order Summary</h3>
                    
                    ${cart.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <span>${item.name} x${item.quantity}</span>
                            <span>${(item.price * item.quantity).toLocaleString()} DZD</span>
                        </div>
                    `).join('')}
                    
                    <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 20px; font-weight: bold; color: #4CAF50;">
                        <span>Total</span>
                        <span>${total.toLocaleString()} DZD</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('✅ Checkout page loaded successfully');
}

let selectedPayment = 'ccp';
function selectPayment(method) {
    console.log('💳 Selected payment method:', method);
    selectedPayment = method;
    
    ['ccp', 'cash'].forEach(m => {
        let el = document.getElementById('payment-' + m);
        if (el) {
            if (m === method) {
                el.style.border = '2px solid #4CAF50';
                el.style.background = 'rgba(76,175,80,0.1)';
            } else {
                el.style.border = '2px solid transparent';
                el.style.background = 'rgba(255,255,255,0.05)';
            }
        }
    });
}

function placeOrder() {
    let name = document.getElementById('shipping-name')?.value;
    let address = document.getElementById('shipping-address')?.value;
    let phone = document.getElementById('shipping-phone')?.value;
    
    if (!name || !address || !phone) {
        showNotification('❌ Please fill all shipping information', 'error');
        return;
    }
    
    let payment = selectedPayment;
    let subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    let tax = Math.round(subtotal * 0.05);
    let total = subtotal + tax;
    
    let order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleString(),
        customer: { name, address, phone, email: document.getElementById('shipping-email')?.value },
        items: [...cart],
        payment,
        subtotal,
        tax,
        total,
        status: 'pending'
    };
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart.forEach(item => {
        let product = allProducts.find(p => p.id == item.id);
        if (product) {
            product.quantity -= item.quantity;
            product.sold = (product.sold || 0) + item.quantity;
        }
    });
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
    
    let sellers = [...new Set(cart.map(item => item.sellerId))];
    sellers.forEach(sellerId => {
        let sellerProducts = JSON.parse(localStorage.getItem('sellerProducts_' + sellerId)) || [];
        cart.forEach(item => {
            if (item.sellerId === sellerId) {
                let sellerProduct = sellerProducts.find(p => p.id == item.id);
                if (sellerProduct) {
                    sellerProduct.quantity -= item.quantity;
                    sellerProduct.sold = (sellerProduct.sold || 0) + item.quantity;
                }
            }
        });
        localStorage.setItem('sellerProducts_' + sellerId, JSON.stringify(sellerProducts));
    });
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateNavbarForUser();
    
    document.getElementById('checkout-container').innerHTML = `
        <div class="success-message">
            <div class="success-icon" style="font-size:80px;">🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p class="order-number">${order.id}</p>
            <p>Total: <strong>${order.total.toLocaleString()} DZD</strong></p>
            <p style="margin: 2rem 0;">Sellers have been notified of your order.</p>
            <div class="action-buttons">
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                <a href="orders.html" class="btn btn-success">View Orders</a>
            </div>
        </div>
    `;
}

// ==================== PRODUCT FUNCTIONS ====================
// ==================== DISPLAY ALL PRODUCTS WITH FILTER ====================
function displayAllProducts() {
    console.log('📦 Displaying all products...');
    let container = document.getElementById('products-container');
    if (!container) {
        console.error('❌ Products container not found!');
        return;
    }
    
    // Get products from localStorage
    allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    console.log('Found products:', allProducts.length);
    
    if (allProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h1>No Products Yet</h1>
                <p>Be the first seller to add a product to our marketplace!</p>
                <a href="register.html?role=seller" class="btn btn-success">Become a Seller</a>
            </div>
        `;
        return;
    }
    
    // Fix any products with missing categories
    allProducts = allProducts.map(p => {
        if (!p.category || p.category === 'undefined' || p.category === '') {
            p.category = 'other';
        }
        return p;
    });
    
    // Count products per category
    let categoryCounts = {};
    allProducts.forEach(p => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    
    // Get unique categories that actually have products
    let categories = [...new Set(allProducts.map(p => p.category))].sort();
    console.log('Categories with products:', categories);
    
    // Category icons mapping
    const categoryIcons = {
        'electronics': '📱',
        'fashion': '👕',
        'clothing': '👕',
        'home': '🏠',
        'garden': '🌱',
        'crafts': '🎨',
        'handmade': '✂️',
        'sports': '⚽',
        'books': '📚',
        'food': '🍕',
        'bakery': '🥐',
        'desserts': '🍰',
        'beauty': '💄',
        'health': '💊',
        'toys': '🧸',
        'games': '🎮',
        'automotive': '🚗',
        'pet': '🐶',
        'music': '🎵',
        'art': '🖼️',
        'office': '📎',
        'baby': '👶',
        'jewelry': '💍',
        'shoes': '👟',
        'bags': '👜',
        'watches': '⌚',
        'other': '🔄'
    };
    
    // Build HTML with filter section
    let html = '<h1 class="text-center">Our Products</h1>';
    
    // Filter section
    html += `
        <div class="filter-section">
            <div class="filter-title">
                <span>🔍 Filter by Category</span>
            </div>
            
            <div class="category-filter" id="category-filter">
                <button class="filter-btn active" onclick="filterProducts('all')" data-category="all">
                    📋 All <span class="count">${allProducts.length}</span>
                </button>
    `;
    
    // Add buttons for categories that HAVE products
    categories.forEach(cat => {
        let icon = categoryIcons[cat] || '📦';
        let displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        let count = categoryCounts[cat] || 0;
        
        html += `
            <button class="filter-btn" onclick="filterProducts('${cat}')" data-category="${cat}">
                ${icon} ${displayName} <span class="count">${count}</span>
            </button>
        `;
    });
    
    html += `
            </div>
            
            <div id="results-count" class="results-count">
                Showing <span id="showing-count">${allProducts.length}</span> of ${allProducts.length} products
            </div>
        </div>
    `;
    
    // Products grid
    html += '<div class="products-grid" id="products-grid">';
    
    for (let p of allProducts) {
        let icon = categoryIcons[p.category] || '📦';
        
        html += `
            <div class="product-card" data-category="${p.category || 'other'}">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
                <h3>${p.name} ${icon}</h3>
                <p class="seller">by ${p.sellerStore || p.sellerName}</p>
                <p class="price">${(p.price || 0).toLocaleString()} DZD</p>
                <p class="stock">📦 ${p.quantity || 0} left</p>
                <div class="product-actions">
                    <button onclick="viewProductDetails(${p.id})" class="btn btn-secondary">View</button>
                    <button onclick="addToCart(${p.id})" class="btn btn-success">Add to Cart</button>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
    console.log('✅ Products displayed with filter');
}

// ==================== FILTER PRODUCTS FUNCTION ====================
function filterProducts(category) {
    console.log('Filtering by category:', category);
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the clicked button
    let activeBtn;
    if (category === 'all') {
        activeBtn = document.querySelector('[data-category="all"]');
    } else {
        activeBtn = document.querySelector(`[data-category="${category}"]`);
    }
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Filter products
    let products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        if (category === 'all') {
            product.style.display = 'block';
            visibleCount++;
        } else {
            let productCategory = product.dataset.category;
            if (productCategory === category) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        }
    });
    
    // Update results count
    const showingSpan = document.getElementById('showing-count');
    if (showingSpan) {
        showingSpan.textContent = visibleCount;
    }
    
    console.log(`Showing ${visibleCount} products`);
}

function viewProductDetails(productId) {
    window.location.href = 'products_details.html?id=' + productId;
}

function loadProductDetails() {
    let urlParams = new URLSearchParams(window.location.search);
    let productId = parseInt(urlParams.get('id'));
    let container = document.getElementById('details-container');
    if (!container) return;
    
    allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    let product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        container.innerHTML = '<h2>Product not found</h2>';
        return;
    }
    
    console.log('Loading product:', product);
    
    let whatsappNumber = product.phone ? product.phone.replace(/\D/g, '') : '';
    
    const categoryIcons = {
        'electronics': '📱', 'fashion': '👕', 'home': '🏠', 'crafts': '🎨',
        'sports': '⚽', 'books': '📚', 'food': '🍕', 'desserts': '🍰',
        'beauty': '💄', 'toys': '🧸', 'other': '🔄'
    };
    let categoryIcon = categoryIcons[product.category] || '📦';
    
    let html = `
        <div class="product-detail">
            <img src="${product.image || 'https://via.placeholder.com/600'}" alt="${product.name}" class="product-detail-image" onerror="this.src='https://via.placeholder.com/600'">
            <div class="product-detail-info">
                <h2>${product.name} ${categoryIcon}</h2>
                <p class="seller-badge">Sold by: ${product.sellerStore}</p>
                <p class="product-detail-price">${product.price.toLocaleString()} DZD</p>
                
                <div class="product-meta">
                    <p><strong>Category:</strong> ${categoryIcon} ${product.category}</p>
                    <p><strong>Condition:</strong> ${product.condition}</p>
                    <p><strong>Available:</strong> ${product.quantity} units</p>
                    <p><strong>Added:</strong> ${product.dateAdded}</p>
    `;
    
    if (product.phone) {
        html += `<p><strong>📞 Seller Phone:</strong> ${product.phone}</p>`;
    }
    
    html += `</div>`;
    
    if (product.phone) {
        html += `
            <div class="contact-section">
                <h3>📱 Contact Seller</h3>
                <p style="margin-bottom: 20px;">Have questions? Reach out directly!</p>
                <div class="contact-buttons">
                    <a href="tel:${product.phone}" class="contact-btn call">📞 Call</a>
                    <a href="https://wa.me/${whatsappNumber}" target="_blank" class="contact-btn whatsapp">💬 WhatsApp</a>
                </div>
                <div class="phone-display"><strong>Phone:</strong> ${product.phone}</div>
            </div>
        `;
    }
    
    html += `
                <h3>📝 Description</h3>
                <p style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 15px;">${product.description}</p>
                
                <div class="action-buttons">
                    <button onclick="addToCart(${product.id})" class="btn btn-success">🛒 Add to Cart</button>
                    <button onclick="history.back()" class="btn btn-secondary">← Back</button>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ==================== SELLER DASHBOARD ====================
function loadSellerDashboard() {
    let container = document.getElementById('dashboard-content');
    if (!container) return;
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔒</div><h2>Please Login</h2><p>You need to login to access the seller dashboard.</p><a href="login.html" class="btn btn-primary">Login</a></div>`;
        return;
    }
    
    if (currentUser.role !== 'seller') {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><h2>Seller Only</h2><p>This page is only for sellers.</p><a href="register.html?role=seller" class="btn btn-success">Become a Seller</a></div>`;
        return;
    }
    
    let sellerProducts = JSON.parse(localStorage.getItem('sellerProducts_' + currentUser.id)) || [];
    
    let totalProducts = sellerProducts.length;
    let totalStock = sellerProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
    let totalSold = sellerProducts.reduce((sum, p) => sum + (p.sold || 0), 0);
    let totalRevenue = sellerProducts.reduce((sum, p) => sum + ((p.sold || 0) * p.price), 0);
    let commission = Math.round(totalRevenue * 0.1); // 10% commission
    let netEarnings = totalRevenue - commission;
    
    container.innerHTML = `
        <div class="welcome-section">
            <div class="welcome-text">
                <h1>📦 Welcome back, ${currentUser.store?.name || currentUser.fullName}!</h1>
                <p>Manage your products, track sales, and grow your business.</p>
            </div>
            <button onclick="logout()" class="logout-btn">🚪 Logout</button>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon">📦</div><div class="stat-label">Total Products</div><div class="stat-value">${totalProducts}</div></div>
            <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-label">In Stock</div><div class="stat-value">${totalStock}</div></div>
            <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-label">Revenue</div><div class="stat-value">${totalRevenue.toLocaleString()} DZD</div></div>
            <div class="stat-card"><div class="stat-icon">📈</div><div class="stat-label">Items Sold</div><div class="stat-value">${totalSold}</div></div>
        </div>
        
        <div class="quick-actions">
            <a href="seller-add-product.html" class="action-card"><div class="action-icon">➕</div><h3>Add Product</h3><p>List a new item for sale</p></a>
            <a href="my-products.html" class="action-card"><div class="action-icon">📋</div><h3>My Products</h3><p>View and manage listings</p></a>
            <a href="orders.html" class="action-card"><div class="action-icon">📦</div><h3>My Orders</h3><p>View customer orders</p></a>
        </div>
        
        ${sellerProducts.length > 0 ? `
            <div class="recent-products">
                <div class="recent-header"><h3>🆕 Recent Products</h3><a href="my-products.html" class="view-all">View All →</a></div>
                ${sellerProducts.slice(-3).reverse().map(p => `
                    <div class="product-item">
                        <img src="${p.image}" class="product-thumb" onerror="this.src='https://via.placeholder.com/60'">
                        <div class="product-info"><h4>${p.name}</h4><p>${p.price.toLocaleString()} DZD | Stock: ${p.quantity}</p></div>
                        <button onclick="editProduct(${p.id})" class="btn btn-sm">✏️ Edit</button>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;

    // Update the payment section
    if (document.getElementById('totalRevenue')) {
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString() + ' DZD';
        document.getElementById('commissionDue').textContent = commission.toLocaleString() + ' DZD';
        document.getElementById('netEarnings').textContent = netEarnings.toLocaleString() + ' DZD';
        document.getElementById('sellerRef').textContent = 'M7-' + currentUser.id;
    }
}

function viewSales() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    let sellerProducts = JSON.parse(localStorage.getItem('sellerProducts_' + currentUser.id)) || [];
    let totalRevenue = sellerProducts.reduce((sum, p) => sum + ((p.sold || 0) * p.price), 0);
    let commission = Math.round(totalRevenue * 0.1);
    showNotification(`📊 SALES REPORT\nProducts: ${sellerProducts.length}\nSold: ${sellerProducts.reduce((sum, p) => sum + (p.sold || 0), 0)}\nRevenue: ${totalRevenue.toLocaleString()} DZD\nCommission: ${commission.toLocaleString()} DZD\nNet: ${(totalRevenue - commission).toLocaleString()} DZD`, 'info');
}

// ==================== MY PRODUCTS PAGE ====================
function loadMyProductsPage() {
    let container = document.getElementById('myproducts-container');
    if (!container) return;
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'seller') {
        window.location.href = 'auth.html';
        return;
    }
    
    let sellerProducts = JSON.parse(localStorage.getItem('sellerProducts_' + currentUser.id)) || [];
    let totalValue = sellerProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    if (sellerProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h2>No Products Yet</h2>
                <p>Start selling by adding your first product!</p>
                <a href="seller-add-product.html" class="btn btn-success">Add Your First Product</a>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="products-header">
            <h1>📋 My Products</h1>
            <a href="seller-add-product.html" class="btn btn-success">➕ Add New Product</a>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon">📦</div><div class="stat-label">Total Products</div><div class="stat-value">${sellerProducts.length}</div></div>
            <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-label">Inventory Value</div><div class="stat-value">${totalValue.toLocaleString()} DZD</div></div>
            <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-label">Total Stock</div><div class="stat-value">${sellerProducts.reduce((sum, p) => sum + p.quantity, 0)}</div></div>
            <div class="stat-card"><div class="stat-icon">📈</div><div class="stat-label">Items Sold</div><div class="stat-value">${sellerProducts.reduce((sum, p) => sum + (p.sold || 0), 0)}</div></div>
        </div>
        
        <div class="filter-tabs">
            <span class="filter-tab active" onclick="filterMyProducts('all')">All</span>
            <span class="filter-tab" onclick="filterMyProducts('in-stock')">In Stock</span>
            <span class="filter-tab" onclick="filterMyProducts('low-stock')">Low Stock (≤5)</span>
            <span class="filter-tab" onclick="filterMyProducts('out-of-stock')">Out of Stock</span>
        </div>
        
        <div class="search-bar">
            <input type="text" id="searchProduct" placeholder="🔍 Search products..." onkeyup="searchMyProducts()">
        </div>
        
        <div class="table-container">
            <table class="product-table">
                <thead><tr><th>Image</th><th>Product</th><th>Price</th><th>Stock</th><th>Sold</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
    `;
    
    for (let p of sellerProducts) {
        let statusClass = p.quantity > 10 ? 'badge-success' : (p.quantity > 0 ? 'badge-warning' : 'badge-danger');
        let statusText = p.quantity > 10 ? 'In Stock' : (p.quantity > 0 ? 'Low Stock' : 'Out of Stock');
        
        html += `
            <tr data-stock="${p.quantity}">
                <td><img src="${p.image}" class="product-image-small" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.price.toLocaleString()} DZD</td>
                <td>${p.quantity}</td>
                <td>${p.sold || 0}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editProduct(${p.id})" class="btn btn-sm btn-success">✏️ Edit</button>
                        <button onclick="duplicateProduct(${p.id})" class="btn btn-sm btn-warning">📋 Copy</button>
                        <button onclick="deleteProduct(${p.id})" class="btn btn-sm btn-danger">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function filterMyProducts(filter) {
    let tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    let rows = document.querySelectorAll('.product-table tbody tr');
    rows.forEach(row => {
        let stock = parseInt(row.dataset.stock);
        switch(filter) {
            case 'all': row.style.display = ''; break;
            case 'in-stock': row.style.display = stock > 0 ? '' : 'none'; break;
            case 'low-stock': row.style.display = (stock > 0 && stock <= 5) ? '' : 'none'; break;
            case 'out-of-stock': row.style.display = stock === 0 ? '' : 'none'; break;
        }
    });
}

function searchMyProducts() {
    let search = document.getElementById('searchProduct').value.toLowerCase();
    let rows = document.querySelectorAll('.product-table tbody tr');
    rows.forEach(row => {
        let productName = row.cells[1].textContent.toLowerCase();
        row.style.display = productName.includes(search) ? '' : 'none';
    });
}

function editProduct(productId) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let sellerProducts = JSON.parse(localStorage.getItem('sellerProducts_' + currentUser.id)) || [];
    let product = sellerProducts.find(p => p.id === productId);
    if (!product) return;
    
    let newName = prompt('Edit product name:', product.name);
    if (newName) product.name = newName;
    
    let newPrice = prompt('Edit price (DZD):', product.price);
    if (newPrice && !isNaN(newPrice) && newPrice > 0) product.price = parseInt(newPrice);
    
    let newQty = prompt('Edit quantity:', product.quantity);
    if (newQty && !isNaN(newQty) && newQty >= 0) product.quantity = parseInt(newQty);
    
    localStorage.setItem('sellerProducts_' + currentUser.id, JSON.stringify(sellerProducts));
    
    let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    let index = allProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
        allProducts[index] = product;
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
    }
    
    showNotification('✅ Product updated successfully', 'success');
    loadMyProductsPage();
}

function duplicateProduct(productId) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let sellerProducts = JSON.parse(localStorage.getItem('sellerProducts_' + currentUser.id)) || [];
    let original = sellerProducts.find(p => p.id === productId);
    if (!original) return;
    
    let duplicate = {...original, id: Date.now(), name: original.name + ' (Copy)', dateAdded: new Date().toLocaleString(), sold: 0};
    
    sellerProducts.push(duplicate);
    localStorage.setItem('sellerProducts_' + currentUser.id, JSON.stringify(sellerProducts));
    
    let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    allProducts.push(duplicate);
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
    
    showNotification('✅ Product duplicated successfully', 'success');
    loadMyProductsPage();
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let sellerProducts = JSON.parse(localStorage.getItem('sellerProducts_' + currentUser.id)) || [];
    sellerProducts = sellerProducts.filter(p => p.id !== productId);
    localStorage.setItem('sellerProducts_' + currentUser.id, JSON.stringify(sellerProducts));
    
    let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    allProducts = allProducts.filter(p => p.id !== productId);
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
    
    showNotification('🗑️ Product deleted', 'info');
    loadMyProductsPage();
}

// ==================== ADD PRODUCT ====================
let currentStep = 1;

function initAddProductForm() {
    console.log('Initializing add product form...');
    
    window.nextStep = function(step) {
        if (currentStep === 1 && step > 1) {
            if (!document.getElementById('productName')?.value) { showNotification('Please enter product name', 'error'); return; }
            if (!document.getElementById('productCategory')?.value) { showNotification('Please select a category', 'error'); return; }
        }
        if (currentStep === 2 && step > 2) {
            if (!document.getElementById('productPrice')?.value || document.getElementById('productPrice').value <= 0) { showNotification('Please enter a valid price', 'error'); return; }
            if (!document.getElementById('productPhone')?.value) { showNotification('Phone number is required', 'error'); return; }
        }
        
        document.getElementById(`step${currentStep}-content`).style.display = 'none';
        document.getElementById(`step${step}-content`).style.display = 'block';
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById(`step${step}`).classList.add('active');
        document.getElementById('progress-fill').style.width = (step * 25) + '%';
        
        if (step === 4) updateReview();
        currentStep = step;
    };
    
    window.prevStep = function(step) {
        document.getElementById(`step${currentStep}-content`).style.display = 'none';
        document.getElementById(`step${step}-content`).style.display = 'block';
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById(`step${step}`).classList.add('active');
        document.getElementById('progress-fill').style.width = (step * 25) + '%';
        currentStep = step;
    };
    
    window.previewImage = function(input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function(e) {
                let img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    let maxWidth = 300, maxHeight = 300;
                    let width = img.width, height = img.height;
                    
                    if (width > height) {
                        if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
                    } else {
                        if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
                    }
                    
                    canvas.width = width; canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    document.getElementById('imagePreview').src = canvas.toDataURL('image/jpeg', 0.7);
                    document.getElementById('imagePreview').style.display = 'block';
                    showNotification('✅ Image uploaded successfully', 'success');
                };
            };
            reader.readAsDataURL(input.files[0]);
        }
    };
    
    window.updateReview = function() {
        document.getElementById('reviewContent').innerHTML = `
            <p><strong>📝 Name:</strong> ${document.getElementById('productName')?.value || 'Not provided'}</p>
            <p><strong>📂 Category:</strong> ${document.getElementById('productCategory')?.value || 'Not provided'}</p>
            <p><strong>🏷️ Condition:</strong> ${document.getElementById('productCondition')?.value || 'new'}</p>
            <p><strong>💰 Price:</strong> ${parseInt(document.getElementById('productPrice')?.value || 0).toLocaleString()} DZD</p>
            <p><strong>📦 Quantity:</strong> ${document.getElementById('productQuantity')?.value || 1}</p>
            <p><strong>📞 Phone:</strong> ${document.getElementById('productPhone')?.value || 'Not provided'}</p>
            <p><strong>📋 Description:</strong> ${document.getElementById('productDescription')?.value || 'No description'}</p>
            <p><strong>🖼️ Image:</strong> ${document.getElementById('productImage').files.length > 0 ? '✅ Image uploaded' : '⏭️ No image'}</p>
        `;
    };
    
    let form = document.getElementById('add-product-form');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            if (currentStep !== 4) { showNotification('Please complete all steps first!', 'warning'); return false; }
            return addProduct(e);
        };
    }
}

function addProduct(event) {
    event.preventDefault();
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'seller') {
        showNotification('Only sellers can add products!', 'error');
        return false;
    }
    
    let name = document.getElementById('productName')?.value;
    let category = document.getElementById('productCategory')?.value || 'other';
    let price = document.getElementById('productPrice')?.value;
    let quantity = document.getElementById('productQuantity')?.value || 1;
    let condition = document.getElementById('productCondition')?.value || 'new';
    let phone = document.getElementById('productPhone')?.value;
    let description = document.getElementById('productDescription')?.value || '';
    let imageInput = document.getElementById('productImage');
    
    if (!name || !price || !phone) {
        showNotification('❌ Product name, price, and phone are required!', 'error');
        return false;
    }
    
    let newProduct = {
        id: Date.now(),
        name, category, price: parseInt(price), quantity: parseInt(quantity),
        condition, phone, description,
        sellerId: currentUser.id,
        sellerName: currentUser.fullName,
        sellerStore: currentUser.store?.name || currentUser.fullName,
        dateAdded: new Date().toLocaleString(),
        sold: 0
    };
    
    if (imageInput.files && imageInput.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                let maxWidth = 400, maxHeight = 400;
                let width = img.width, height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
                } else {
                    if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
                }
                
                canvas.width = width; canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                newProduct.image = canvas.toDataURL('image/jpeg', 0.6);
                saveProductToStorage(newProduct, currentUser);
            };
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        newProduct.image = 'https://via.placeholder.com/300x300?text=No+Image';
        saveProductToStorage(newProduct, currentUser);
    }
    
    return false;
}

function saveProductToStorage(product, user) {
    try {
        let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        allProducts.push(product);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
        
        let sellerKey = 'sellerProducts_' + user.id;
        let sellerProducts = JSON.parse(localStorage.getItem(sellerKey)) || [];
        sellerProducts.push(product);
        localStorage.setItem(sellerKey, JSON.stringify(sellerProducts));
        
        showNotification('✅ Product listed successfully! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'my-products.html', 1500);
        
    } catch (error) {
        console.error('Storage error:', error);
        if (error.name === 'QuotaExceededError') {
            showNotification('❌ Image too large! Try a smaller image.', 'error');
        } else {
            showNotification('❌ Failed to save product.', 'error');
        }
    }
}

// ==================== ACCOUNT FUNCTIONS ====================
function loadAccountPage() {
    let container = document.getElementById('account-container');
    if (!container) return;
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        container.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <div class="avatar-container">
                        <div class="profile-avatar">${currentUser.profilePic || '👤'}</div>
                        <div class="edit-avatar" onclick="changeProfilePic()">✏️</div>
                    </div>
                    <div class="profile-title">
                        <h1>${currentUser.fullName}</h1>
                        <span class="profile-badge ${currentUser.role === 'seller' ? 'seller' : 'buyer'}">
                            ${currentUser.role === 'seller' ? '🛒 SELLER' : '👤 BUYER'}
                        </span>
                    </div>
                </div>
                
                <div class="info-grid">
                    <div class="info-item"><div class="info-label">📧 Email</div><div class="info-value">${currentUser.email}</div></div>
                    <div class="info-item"><div class="info-label">🔑 Username</div><div class="info-value">${currentUser.username}</div></div>
                    <div class="info-item"><div class="info-label">⚥ Gender</div><div class="info-value">${currentUser.gender || 'Not specified'}</div></div>
                    <div class="info-item"><div class="info-label">📅 Joined</div><div class="info-value">${currentUser.registrationDate || 'Recently'}</div></div>
                    ${currentUser.phone ? `<div class="info-item"><div class="info-label">📱 Phone</div><div class="info-value">${currentUser.phone}</div></div>` : ''}
                </div>
                
                ${currentUser.role === 'seller' && currentUser.store ? `
                <div class="store-section">
                    <h3>🏪 Store Information</h3>
                    <div class="store-grid">
                        <div class="store-item"><div class="label">Store Name</div><div class="value">${currentUser.store.name}</div></div>
                        <div class="store-item"><div class="label">Description</div><div class="value">${currentUser.store.description || 'No description'}</div></div>
                        <div class="store-item"><div class="label">Address</div><div class="value">${currentUser.store.address || 'No address'}</div></div>
                    </div>
                </div>
                ` : ''}
                
                <div class="action-buttons">
                    <button onclick="showEditProfileForm()" class="btn btn-success">✏️ Edit Profile</button>
                    <button onclick="showChangePasswordForm()" class="btn btn-warning">🔑 Change Password</button>
                    ${currentUser.role === 'seller' ? `
                    <a href="seller-dashboard.html" class="btn btn-info">📊 Dashboard</a>
                    ` : ''}
                    <button onclick="logout()" class="btn btn-danger">🚪 Logout</button>
                    <!-- DELETE ACCOUNT BUTTON - FULL WIDTH -->
                    <button onclick="confirmDeleteAccount()" class="btn btn-danger" style="background: #b84343; grid-column: span 2; margin-top: 10px;">
                        🗑️ Delete Account
                    </button>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="guest-container">
                <div class="guest-card">
                    <div class="guest-icon">👋</div>
                    <h1>Welcome!</h1>
                    <p>Join M7 Marketplace today to start shopping or selling.</p>
                    <div class="guest-actions">
                        <a href="login.html" class="btn btn-primary">🔐 Login</a>
                        <a href="register.html" class="btn btn-success">📝 Register</a>
                    </div>
                </div>
            </div>
        `;
    }
}

function displayPayments(container) {
    let payments = JSON.parse(localStorage.getItem('seller_payments')) || [];
    let sellers = allUsers.filter(u => u.role === 'seller');
    
    // Calculate totals
    let totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    let totalPending = 0;
    sellers.forEach(s => {
        if (!hasSellerPaid(s.id)) {
            totalPending += calculateSellerCommission(s.id);
        }
    });
    
    let html = '<h2>💰 Payment Reports</h2>';
    
    // Summary cards
    html += `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-number">${totalCollected.toLocaleString()} DZD</div>
                <div>Total Collected</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" style="color: #FF9800;">${totalPending.toLocaleString()} DZD</div>
                <div>Pending</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${payments.length}</div>
                <div>Total Payments</div>
            </div>
        </div>
    `;
    
    // Payment history table
    html += '<h3>📋 Payment History</h3>';
    html += '<table><thead><tr><th>Date</th><th>Seller</th><th>Amount</th><th>Reference</th><th>Status</th></tr></thead><tbody>';
    
    payments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    payments.forEach(p => {
        let seller = allUsers.find(u => u.id == p.sellerId);
        html += `
            <tr>
                <td>${p.date}</td>
                <td>${seller?.fullName || 'Unknown'}</td>
                <td><strong>${p.amount.toLocaleString()} DZD</strong></td>
                <td>${p.reference || 'N/A'}</td>
                <td><span class="payment-status payment-paid">✅ Paid</span></td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Update the switchTab function to include payments
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let content = document.getElementById('admin-content');
    
    switch(tab) {
        case 'users': displayUsers(content); break;
        case 'sellers': displaySellers(content); break;
        case 'products': displayProducts(content); break;
        case 'orders': displayOrders(content); break;
        case 'payments': displayPayments(content); break;
        case 'deleted': displayDeleted(content); break;
    }
}

function showEditProfileForm() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let newName = prompt('Enter new full name:', currentUser.fullName);
    if (newName) currentUser.fullName = newName;
    let newEmail = prompt('Enter new email:', currentUser.email);
    if (newEmail) currentUser.email = newEmail;
    let newPhone = prompt('Enter new phone number:', currentUser.phone || '');
    if (newPhone) currentUser.phone = newPhone;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('✅ Profile updated successfully', 'success');
        loadAccountPage();
    }
}

function showChangePasswordForm() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let oldPass = prompt('Enter current password:');
    if (oldPass !== currentUser.password) { showNotification('❌ Incorrect password!', 'error'); return; }
    let newPass = prompt('Enter new password:');
    let confirmPass = prompt('Confirm new password:');
    if (newPass !== confirmPass) { showNotification('❌ Passwords do not match!', 'error'); return; }
    if (newPass.length < 4) { showNotification('❌ Password must be at least 4 characters', 'error'); return; }
    
    currentUser.password = newPass;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('✅ Password changed successfully', 'success');
    }
}

function changeProfilePic() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let pics = ['👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🛒', '🏪', '👤'];
    let newPic = prompt('Choose an emoji: ' + pics.join(' '), currentUser.profilePic);
    if (newPic && pics.includes(newPic)) {
        currentUser.profilePic = newPic;
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users[index] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showNotification('✅ Profile picture updated', 'success');
            loadAccountPage();
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateNavbarForUser();
    showNotification('👋 Logged out successfully', 'info');
    window.location.href = 'home.html';
}

// ==================== AUTH FUNCTIONS ====================
function initLoginForm() {
    let form = document.getElementById('login-form');
    if (form) form.onsubmit = function(e) { e.preventDefault(); login(); };
}

function login() {
    let email = document.getElementById('email')?.value;
    let password = document.getElementById('password')?.value;
    if (!email || !password) { showNotification('❌ Please fill all fields', 'error'); return; }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        updateNavbarForUser();
        showNotification(`✅ Welcome back, ${user.fullName}!`, 'success');
        
        let redirect = new URLSearchParams(window.location.search).get('redirect');
        if (redirect === 'checkout') window.location.href = 'checkout.html';
        else if (user.role === 'seller') window.location.href = 'seller-dashboard.html';
        else window.location.href = 'home.html';
    } else {
        showNotification('❌ Invalid email or password', 'error');
    }
        // After user logs in
    if (user.role === 'seller') {
        let paymentStatus = localStorage.getItem('paid_' + user.id);
        if (paymentStatus === 'paid') {
            showNotification('✅ Your latest payment is up to date!', 'success');
        } else {
            let products = JSON.parse(localStorage.getItem('sellerProducts_' + user.id)) || [];
            let revenue = products.reduce((sum, p) => sum + ((p.sold || 0) * p.price), 0);
            let commission = Math.round(revenue * 0.1);
            if (commission > 0) {
                showNotification(`💰 You have ${commission.toLocaleString()} DZD commission due`, 'warning');
            }
        }
    }
}

function showCCPPayment() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let sellerProducts = JSON.parse(localStorage.getItem('sellerProducts_' + currentUser.id)) || [];
    let totalRevenue = sellerProducts.reduce((sum, p) => sum + ((p.sold || 0) * p.price), 0);
    let commission = Math.round(totalRevenue * 0.1);
    
    // Create payment instructions with QR code
    let paymentHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: #1a1a1a; padding: 40px; border-radius: 30px; max-width: 500px; text-align: center;">
                <h2 style="color: #d96565;">💳 CCP Mobile Payment</h2>
                
                <!-- QR Code (generated via API) -->
                <div style="margin: 30px auto; width: 250px; height: 250px; background: white; border-radius: 20px; padding: 20px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CCP:${commission} DZD - Ref:M7-${currentUser.id}" alt="QR Code" style="width: 100%;">
                </div>
                
                <p style="font-size: 18px; margin: 20px 0;">
                    <strong>Amount:</strong> ${commission.toLocaleString()} DZD
                </p>
                
                <div style="background: rgba(76, 175, 80, 0.1); padding: 20px; border-radius: 15px; margin: 20px 0;">
                    <h3 style="color: #4CAF50;">📋 BaridiMob Instructions</h3>
                    <ol style="text-align: left; line-height: 2;">
                        <li>Open <strong>BaridiMob</strong> app</li>
                        <li>Click on <strong>"Paiement"</strong> tab</li>
                        <li>Select <strong>"Ajouter un bénéficiaire"</strong></li>
                        <li>Enter our CCP: <strong>88 0042745945</strong></li>
                        <li>Amount: <strong>${commission.toLocaleString()} DZD</strong></li>
                        <li>Reference: <strong>M7-${currentUser.id}</strong></li>
                        <li>Enter your OTP code</li>
                        <li>Save the receipt</li>
                    </ol>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 30px;">
                    <button onclick="copyCCPDetails()" class="btn" style="flex: 1;">📋 Copy Details</button>
                    <button onclick="closePayment()" class="btn" style="flex: 1; background: #666;">Close</button>
                </div>
                
                <p style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                    After payment, send screenshot to m7.contact.us@gmail.com
                </p>
            </div>
        </div>
    `;
    
    // Add to page
    let paymentDiv = document.createElement('div');
    paymentDiv.id = 'payment-modal';
    paymentDiv.innerHTML = paymentHTML;
    document.body.appendChild(paymentDiv);
    
    // Add copy function
    window.copyCCPDetails = function() {
        let text = `CCP: 1234 5678 9012 3456\nAmount: ${commission.toLocaleString()} DZD\nReference: M7-${currentUser.id}`;
        navigator.clipboard.writeText(text);
        alert('✅ Details copied!');
    };
    
    window.closePayment = function() {
        document.getElementById('payment-modal').remove();
    };
}

// ==================== DELETE ACCOUNT FUNCTIONS ====================
function confirmDeleteAccount() {
    // Show confirmation dialog with warning
    if (confirm('⚠️ ARE YOU SURE?\n\nDeleting your account will:\n' +
        '- Permanently remove your profile\n' +
        '- Delete all your products (if you\'re a seller)\n' +
        '- Remove all your orders\n' +
        '- This action CANNOT be undone!\n\n' +
        'Do you want to continue?')) {
        
        // Second confirmation with password
        let password = prompt('Please enter your password to confirm deletion:');
        if (password) {
            verifyAndDeleteAccount(password);
        }
    }
}

function verifyAndDeleteAccount(password) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Verify password
    if (password !== currentUser.password) {
        showNotification('❌ Incorrect password! Account not deleted.', 'error');
        return;
    }
    
    // Third and final confirmation
    if (confirm('🔴 FINAL WARNING!\n\nThis is your last chance. Click OK to permanently delete your account.')) {
        deleteUserAccount(currentUser.id);
    }
}

function deleteUserAccount(userId) {
    try {
        // Get all users
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let userToDelete = users.find(u => u.id === userId);
        
        if (!userToDelete) {
            showNotification('❌ User not found!', 'error');
            return;
        }
        
        // If user is a seller, delete all their products
        if (userToDelete.role === 'seller') {
            deleteSellerProducts(userId);
        }
        
        // Delete user's orders
        deleteUserOrders(userToDelete.email);
        
        // Remove user from users array
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Clear current user
        localStorage.removeItem('currentUser');
        
        showNotification('✅ Your account has been permanently deleted.', 'info');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('❌ Error deleting account. Please try again.', 'error');
    }
}

function deleteSellerProducts(sellerId) {
    // Remove from all products
    let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    allProducts = allProducts.filter(p => p.sellerId !== sellerId);
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
    
    // Remove seller's products
    localStorage.removeItem('sellerProducts_' + sellerId);
    
    console.log(`✅ Deleted all products for seller ${sellerId}`);
}

function deleteUserOrders(userEmail) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter(order => order.customer?.email !== userEmail);
    localStorage.setItem('orders', JSON.stringify(orders));
    console.log(`✅ Deleted orders for user ${userEmail}`);
}

function initRegisterForm() {
    let form = document.getElementById('register-form');
    if (form) form.onsubmit = function(e) { e.preventDefault(); register(); };
}

function register() {
    let fullName = document.getElementById('fullName')?.value;
    let email = document.getElementById('email')?.value;
    let username = document.getElementById('username')?.value;
    let password = document.getElementById('password')?.value;
    let confirmPassword = document.getElementById('confirmPassword')?.value;
    let terms = document.getElementById('terms')?.checked;
    let role = document.getElementById('role')?.value;
    
    if (!fullName || !email || !username || !password || !confirmPassword) {
        showNotification('❌ Please fill all required fields', 'error'); return;
    }
    if (password !== confirmPassword) {
        showNotification('❌ Passwords do not match', 'error'); return;
    }
    if (!terms) {
        showNotification('❌ You must agree to the Terms and Conditions', 'error'); return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        showNotification('❌ Email already exists', 'error'); return;
    }
    if (users.some(u => u.username === username)) {
        showNotification('❌ Username already taken', 'error'); return;
    }
    
    let profileImage = document.getElementById('profile-image-data')?.value || '';
    
    let newUser = {
        id: Date.now(),
        fullName, email, username, password,
        gender: document.getElementById('gender')?.value || 'Not specified',
        profilePic: profileImage || document.getElementById('profilePic')?.value || '👤',
        role: role || 'buyer',
        dob: document.getElementById('dob')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        registrationDate: new Date().toLocaleString()
    };
    
    if (role === 'seller') {
        let storeName = document.getElementById('storeName')?.value;
        if (!storeName) { showNotification('❌ Store name is required for sellers', 'error'); return; }
        newUser.store = {
            name: storeName,
            description: document.getElementById('storeDescription')?.value || '',
            address: document.getElementById('businessAddress')?.value || ''
        };
    }
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    currentUser = newUser;
    updateNavbarForUser();
    
    showNotification('✅ Registration successful! Welcome to M7 Marketplace!', 'success');
    
    setTimeout(() => {
        if (role === 'seller') window.location.href = 'seller-dashboard.html';
        else window.location.href = 'home.html';
    }, 1500);
}

// ==================== CONTACT FUNCTIONS ====================
function initContactForm() {
    let form = document.getElementById('contact-form');
    if (form) {
        form.onsubmit = function(e) { 
            e.preventDefault(); 
            sendMessage(); 
        };
    }
}

function sendMessage() {
    let name = document.getElementById('contact-name')?.value;
    let email = document.getElementById('contact-email')?.value;
    let subject = document.getElementById('contact-subject')?.value;
    let message = document.getElementById('contact-message')?.value;
    
    if (!name || !email || !subject || !message) {
        showNotification('❌ Please fill all required fields', 'error'); 
        return;
    }
    
    let messages = JSON.parse(localStorage.getItem('contact_messages')) || [];
    messages.push({
        id: Date.now(),
        name, email,
        phone: document.getElementById('contact-phone')?.value || '',
        subject, message,
        date: new Date().toLocaleString(),
        status: 'unread'
    });
    localStorage.setItem('contact_messages', JSON.stringify(messages));
    
    document.getElementById('contact-form').reset();
    showNotification('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
}

// ==================== ADMIN FUNCTIONS ====================
function viewAllSecretData() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) { showNotification('No user data found', 'info'); return; }
    
    let report = "🔐 M7 MARKETPLACE - COMPLETE USER DATABASE 🔐\n";
    report += "=".repeat(50) + "\n\n";
    report += `📊 TOTAL USERS: ${users.length}\n`;
    report += `📅 REPORT DATE: ${new Date().toLocaleString()}\n\n`;
    
    let buyers = users.filter(u => u.role === 'buyer').length;
    let sellers = users.filter(u => u.role === 'seller').length;
    report += `👥 BUYERS: ${buyers}\n`;
    report += `🛒 SELLERS: ${sellers}\n\n`;
    report += "═".repeat(50) + "\n\n";
    
    users.forEach((u, i) => {
        report += `USER #${i+1}\n`;
        report += "─".repeat(30) + "\n";
        report += `👤 Name: ${u.fullName}\n`;
        report += `📧 Email: ${u.email}\n`;
        report += `🔑 Username: ${u.username}\n`;
        report += `🔐 Password: ${u.password}\n`;
        report += `🎭 Role: ${u.role}\n`;
        report += `📅 Registered: ${u.registrationDate}\n`;
        
        if (u.role === 'seller' && u.store) {
            report += `\n🏪 STORE INFO:\n`;
            report += `   Name: ${u.store.name}\n`;
            report += `   Desc: ${u.store.description || 'N/A'}\n`;
            report += `   Addr: ${u.store.address || 'N/A'}\n`;
        }
        report += "─".repeat(30) + "\n\n";
    });
    
    let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    report += "📦 PRODUCT STATISTICS\n";
    report += "═".repeat(30) + "\n";
    report += `Total Products: ${allProducts.length}\n`;
    report += `Total Value: ${allProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()} DZD\n`;
    
    let blob = new Blob([report], { type: 'text/plain' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'M7_USERS_' + Date.now() + '.txt';
    a.click();
    
    showNotification('✅ User data downloaded! Check your downloads folder.', 'success');
}

// ==================== ORDERS FUNCTIONS ====================
function loadSellerOrders() {
    let container = document.getElementById('orders-container');
    if (!container) return;
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔒</div><h2>Please Login</h2><p>You need to login to view your orders.</p><a href="login.html" class="btn btn-primary">Login</a></div>`;
        return;
    }
    
    let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    let userOrders, roleText;
    
    if (currentUser.role === 'seller') {
        userOrders = allOrders.filter(order => order.items.some(item => item.sellerId === currentUser.id));
        roleText = 'Seller Orders';
    } else {
        userOrders = allOrders.filter(order => order.customer && order.customer.email === currentUser.email);
        roleText = 'My Orders';
    }
    
    let totalOrders = userOrders.length;
    let totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    let totalItems = userOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    let pendingOrders = userOrders.filter(o => o.status === 'pending').length;
    
    if (userOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h2>No Orders Yet</h2>
                <p>${currentUser.role === 'seller' ? 'When customers buy your products, they will appear here.' : 'Start shopping to place your first order!'}</p>
                <a href="${currentUser.role === 'seller' ? 'seller-add-product.html' : 'products.html'}" class="btn btn-success">
                    ${currentUser.role === 'seller' ? 'Add Products' : 'Start Shopping'}
                </a>
            </div>
        `;
        return;
    }
    
    let html = `
        <h1 class="text-center">📋 ${roleText}</h1>
        
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon">📦</div><div class="stat-label">Total Orders</div><div class="stat-value">${totalOrders}</div></div>
            <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-label">Total ${currentUser.role === 'seller' ? 'Revenue' : 'Spent'}</div><div class="stat-value">${totalSpent.toLocaleString()} DZD</div></div>
            <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-label">Items Purchased</div><div class="stat-value">${totalItems}</div></div>
            <div class="stat-card"><div class="stat-icon">⏳</div><div class="stat-label">Pending</div><div class="stat-value">${pendingOrders}</div></div>
        </div>
        
        <div class="filter-section">
            <span class="filter-btn active" onclick="filterOrders('all')">All Orders</span>
            <span class="filter-btn" onclick="filterOrders('pending')">Pending</span>
            <span class="filter-btn" onclick="filterOrders('processing')">Processing</span>
            <span class="filter-btn" onclick="filterOrders('shipped')">Shipped</span>
            <span class="filter-btn" onclick="filterOrders('delivered')">Delivered</span>
        </div>
        
        <div class="orders-list" id="orders-list">
    `;
    
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    userOrders.forEach(order => {
        let itemsToShow = currentUser.role === 'seller' ? order.items.filter(item => item.sellerId === currentUser.id) : order.items;
        let orderTotal = currentUser.role === 'seller' ? itemsToShow.reduce((sum, item) => sum + (item.price * item.quantity), 0) : order.total;
        
        html += `
            <div class="order-card" data-status="${order.status || 'pending'}">
                <div class="order-header">
                    <div><span class="order-id">${order.id}</span><span class="order-date">📅 ${order.date}</span></div>
                    <span class="order-status status-${order.status || 'pending'}">${(order.status || 'pending').toUpperCase()}</span>
                </div>
                
                ${currentUser.role === 'seller' ? `
                <div class="customer-info">
                    <p><strong>👤 Customer:</strong> ${order.customer?.name || 'N/A'}</p>
                    <p><strong>📞 Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
                    <p><strong>📍 Address:</strong> ${order.customer?.address || 'N/A'}</p>
                </div>
                ` : ''}
                
                <div class="order-items">
                    <h4>Items</h4>
                    ${itemsToShow.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" class="order-item-image" onerror="this.src='https://via.placeholder.com/60'">
                            <div class="order-item-details">
                                <div class="order-item-name">${item.name}</div>
                                <div class="order-item-meta">Qty: ${item.quantity} × ${item.price.toLocaleString()} DZD</div>
                            </div>
                            <div class="order-item-price">${(item.price * item.quantity).toLocaleString()} DZD</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">Total: ${orderTotal.toLocaleString()} DZD</div>
                    
                    ${currentUser.role === 'seller' ? `
                        <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>🔄 Processing</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>🚚 Shipped</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>✅ Delivered</option>
                        </select>
                    ` : `<div class="payment-method">💳 Payment: ${order.paymentMethod || 'CCP'}</div>`}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function filterOrders(status) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('.order-card').forEach(order => {
        order.style.display = (status === 'all' || order.dataset.status === status) ? 'block' : 'none';
    });
}

function updateOrderStatus(orderId, newStatus) {
    let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    let orderIndex = allOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        allOrders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(allOrders));
        showNotification(`✅ Order status updated to ${newStatus}`, 'success');
        
        let orderCard = event.target.closest('.order-card');
        let statusBadge = orderCard.querySelector('.order-status');
        statusBadge.className = `order-status status-${newStatus}`;
        statusBadge.textContent = newStatus.toUpperCase();
        orderCard.dataset.status = newStatus;
    }
}
// supabase-client.js
// M7 Marketplace - Supabase Client Configuration

// Your Supabase credentials
const SUPABASE_URL = 'https://grqgypzdghmpzznzqjhe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycWd5cHpkZ2htcHp6bnpxamhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTIyNDAsImV4cCI6MjA4ODMyODI0MH0.erUqVwXwFiu0PHc_Gda9hcMjuIh7X1oy1REBKv-p2vs';

// Global supabase variable (check if it already exists)
window.SUPABASE = (function() {
    // Don't redeclare if it already exists
    if (window.supabaseClient) {
        return window.supabaseClient;
    }
    
    // Check if supabase library is loaded
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase library not loaded! Make sure the script tag is included.');
        return null;
    }
    
    try {
        // Create new client
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
        
        console.log('✅ Supabase client initialized successfully');
        return client;
    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return null;
    }
})();

// Make it globally available
window.supabase = window.SUPABASE;
window.supabaseClient = window.SUPABASE;

// Check user on page load
document.addEventListener('DOMContentLoaded', function() {
    checkUser();
});

// Check current user and update UI
async function checkUser() {
    if (!window.SUPABASE) return;
    
    try {
        const { data: { user }, error } = await window.SUPABASE.auth.getUser();
        
        if (error) throw error;
        
        if (user) {
            // Get user profile from profiles table
            const { data: profile, error: profileError } = await window.SUPABASE
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (!profileError && profile) {
                // Store in localStorage for backward compatibility
                localStorage.setItem('currentUser', JSON.stringify(profile));
                console.log('👤 Logged in as:', profile.full_name);
            }
        } else {
            localStorage.removeItem('currentUser');
            console.log('👤 Not logged in');
        }
        
        // Update navbar
        if (typeof updateNavbarForUser === 'function') {
            updateNavbarForUser();
        }
        
    } catch (error) {
        console.error('Error checking user:', error);
    }
}

// Logout function
async function logout() {
    if (!window.SUPABASE) return;
    
    try {
        const { error } = await window.SUPABASE.auth.signOut();
        if (error) throw error;
        
        localStorage.removeItem('currentUser');
        
        // Use existing notification if available
        if (typeof showNotification === 'function') {
            showNotification('👋 Logged out successfully', 'success');
        } else {
            alert('👋 Logged out successfully');
        }
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
        
    } catch (error) {
        console.error('Logout error:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error logging out', 'error');
        } else {
            alert('❌ Error logging out');
        }
    }
}

// Make functions globally available
window.checkUser = checkUser;
window.logout = logout;
