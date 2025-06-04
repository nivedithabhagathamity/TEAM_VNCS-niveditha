// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartModal = document.getElementById('cart-modal');
const productGrid = document.getElementById('product-grid');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  
  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll('.btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id') || this.parentElement.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
      const productPrice = parseInt(this.getAttribute('data-price') || this.parentElement.querySelector('.price').textContent.replace(/[^\d]/g, ''));
      const productName = this.getAttribute('data-name') || this.parentElement.querySelector('h3').textContent;
      
      addToCart(productId, productPrice, productName);
    });
  });
});

// Cart Functions
function addToCart(productId, price, name) {
  // Check if product already exists in cart
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: name,
      price: price,
      quantity: 1
    });
  }
  
  updateCart();
  showToast(`${name} added to cart`);
}

function updateCart() {
  updateCartCount();
  saveCartToLocalStorage();
  
  // If cart modal is open, update its contents
  if (cartModal.style.display === 'flex') {
    renderCartItems();
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty</p>';
    cartTotal.textContent = '0';
    return;
  }
  
  let itemsHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    itemsHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price.toLocaleString()} × ${item.quantity}</p>
        </div>
        <div class="cart-item-total">
          <span>₹${itemTotal.toLocaleString()}</span>
          <div class="cart-item-actions">
            <button onclick="changeQuantity('${item.id}', -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity('${item.id}', 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart('${item.id}')">×</button>
        </div>
      </div>
    `;
  });
  
  cartItems.innerHTML = itemsHTML;
  cartTotal.textContent = total.toLocaleString();
}

function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity += change;
    
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCart();
    }
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  showToast('Item removed from cart');
}
// Modal Functions
function showCart() {
  cartModal.style.display = 'flex';
  renderCartItems();
}

function closeCart() {
  cartModal.style.display = 'none';
}

function checkout() {
  if (cart.length === 0) {
    showToast('Your cart is empty');
    return;
  }
  
  // In a real app, this would redirect to checkout page
  alert(`Proceeding to checkout with ${cart.reduce((total, item) => total + item.quantity, 0)} items. Total: ₹${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()}`);
  closeCart();
}

// Product Filtering
function showCategory(category) {
  const products = document.querySelectorAll('.product-card');
  
  products.forEach(product => {
    if (category === 'all' || product.getAttribute('data-category') === category) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
  
  // Scroll to product section
  document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
  
  // Update active category button (if you have category buttons)
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
    }
  });
}
// Toast Notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    closeCart();
  }
});

// Add this CSS for toast notifications (you can add to your CSS file)
const toastStyles = document.createElement('style');
toastStyles.textContent = `
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--primary-color);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.toast.show {
  opacity: 1;
}
`;
document.head.appendChild(toastStyles);

// Add this CSS for cart items (you can add to your CSS file)
const cartItemStyles = document.createElement('style');
cartItemStyles.textContent = `
.cart-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.cart-item-info h4 {
  margin-bottom: 5px;
  font-size: 1rem;
}
.cart-item-info p {
  color: var(--secondary-color);
  font-size: 0.9rem;
}
.cart-item-total {
  display: flex;
  align-items: center;
}
.cart-item-total span {
  font-weight: 600;
  margin-right: 15px;
}
.cart-item-actions {
  display: flex;
  align-items: center;
  margin-right: 15px;
}
.cart-item-actions button {
  background: none;
  border: 1px solid #ddd;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-item-actions button:hover {
  background-color: #f5f5f5;
}
.cart-item-actions span {
  margin: 0 10px;
}
.remove-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--secondary-color);
}
.remove-btn:hover {
  color: #dc3545;
}
`;

