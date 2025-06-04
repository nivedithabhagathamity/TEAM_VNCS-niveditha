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

