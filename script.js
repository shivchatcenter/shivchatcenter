// Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cartCount').textContent = count;
}

// Toggle cart sidebar
function toggleCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  cartSidebar.classList.toggle('open');
  displayCartItems();
}

// Add to cart
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Show animation
  const cartIcon = document.querySelector('.cart-icon');
  cartIcon.style.transform = 'scale(1.2)';
  setTimeout(() => {
    cartIcon.style.transform = 'scale(1)';
  }, 200);
  
  // Auto open cart
  document.getElementById('cartSidebar').classList.add('open');
  displayCartItems();
}

// Display cart items
function displayCartItems() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>';
    cartTotal.textContent = '₹0';
    return;
  }
  
  let html = '';
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/60x60/f5f5f5/333?text=${item.name}'">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">₹${item.price}</div>
          <div class="cart-item-quantity">
            <button onclick="updateQuantity(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${index}, 1)">+</button>
          </div>
        </div>
        <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:#ff4444; cursor:pointer;"></i>
      </div>
    `;
  });
  
  cartItems.innerHTML = html;
  cartTotal.textContent = `₹${total}`;
}

// Update quantity
function updateQuantity(index, change) {
  if (cart[index].quantity + change > 0) {
    cart[index].quantity += change;
  } else {
    cart.splice(index, 1);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  displayCartItems();
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  displayCartItems();
}

// Proceed to checkout
function proceedToCheckout() {
  const user = localStorage.getItem('user');
  
  if (!user) {
    alert('Please login to proceed with checkout');
    openLoginModal();
    return;
  }
  
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  
  // Prepare order details
  const orderDetails = cart.map(item => 
    `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
  ).join('\n');
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Send to email via mailto
  const emailBody = `New Order from ${JSON.parse(user).name}\n\nItems:\n${orderDetails}\n\nTotal: ₹${total}\n\nPhone: ${JSON.parse(user).phone || 'Not provided'}`;
  
  window.location.href = `mailto:shivchatcenter@gmail.com?subject=New Order from Shiv Chat Center&body=${encodeURIComponent(emailBody)}`;
  
  // Clear cart
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  toggleCart();
  
  alert('Order placed! You will receive confirmation shortly.');
}

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// Auto slide change
setInterval(nextSlide, 5000);

// Login Modal
function openLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}

// Handle login
function handleLogin(event) {
  event.preventDefault();
  const email = event.target[0].value;
  const password = event.target[1].value;
  
  // Simple validation
  if (email && password) {
    localStorage.setItem('user', JSON.stringify({
      name: email.split('@')[0],
      email: email
    }));
    
    alert('Login successful!');
    closeLoginModal();
    updateNavButton();
  }
}

// Update nav button
function updateNavButton() {
  const user = localStorage.getItem('user');
  const loginBtn = document.querySelector('.nav-login-btn');
  
  if (user) {
    loginBtn.innerHTML = `<i class="fas fa-user"></i> ${JSON.parse(user).name.split(' ')[0]}`;
  }
}

// Reviews System
let reviews = JSON.parse(localStorage.getItem('reviews')) || [
  {
    name: "Rahul Sharma",
    rating: 5,
    date: "2024-03-15",
    text: "Best Aloo Chat in Agara! Fresh ingredients and amazing taste."
  },
  {
    name: "Priya Patel",
    rating: 4,
    date: "2024-03-10",
    text: "Samosa was crispy and delicious. Very reasonable prices."
  },
  {
    name: "Amit Verma",
    rating: 5,
    date: "2024-03-05",
    text: "Authentic taste, friendly owner. Pani Puri is a must-try!"
  }
];

// Display reviews
function displayReviews() {
  const reviewsGrid = document.getElementById('reviewsGrid');
  
  let html = '';
  reviews.slice(0, 3).forEach(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    html += `
      <div class="review-card">
        <div class="review-header">
          <span class="reviewer-name">${review.name}</span>
          <span class="review-rating">${stars}</span>
        </div>
        <div class="review-date">${review.date}</div>
        <p class="review-text">${review.text}</p>
      </div>
    `;
  });
  
  reviewsGrid.innerHTML = html;
}

// Add review
function addReview(event) {
  event.preventDefault();
  
  const name = document.getElementById('reviewName').value;
  const rating = parseInt(document.getElementById('reviewRating').value);
  const text = document.getElementById('reviewText').value;
  
  if (name && rating && text) {
    const newReview = {
      name: name,
      rating: rating,
      date: new Date().toLocaleDateString('en-GB'),
      text: text
    };
    
    reviews.unshift(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    displayReviews();
    event.target.reset();
    alert('Thank you for your review!');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateNavButton();
  displayReviews();
  
  // Close modal when clicking outside
  window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
  
  // Close cart on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('cartSidebar').classList.remove('open');
    }
  });
});

// Show register form
function showRegister() {
  alert('Registration form will open. Please fill your details.');
    }
