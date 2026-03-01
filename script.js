// Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize EmailJS
(function() {
    emailjs.init("8Ck-UsXslDfsH9Wt6");
})();

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
  
  // Hide order form when closing cart
  if (!cartSidebar.classList.contains('open')) {
    document.getElementById('cartOrderForm').style.display = 'none';
  }
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
  cartIcon.style.backgroundColor = '#d2691e';
  cartIcon.style.color = 'white';
  setTimeout(() => {
    cartIcon.style.transform = 'scale(1)';
    cartIcon.style.backgroundColor = '#f8f4ee';
    cartIcon.style.color = '#1e3c3c';
  }, 200);
  
  // Auto open cart and show items
  document.getElementById('cartSidebar').classList.add('open');
  displayCartItems();
  
  // Hide order form when adding new items
  document.getElementById('cartOrderForm').style.display = 'none';
}

// Display cart items
function displayCartItems() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p><p style="font-size:0.9rem; color:#999;">Add items to start ordering</p></div>';
    cartTotal.textContent = '₹0';
    document.getElementById('cartOrderForm').style.display = 'none';
    return;
  }
  
  let html = '';
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">₹${item.price}</div>
          <div class="cart-item-quantity">
            <button onclick="updateQuantity(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${index}, 1)">+</button>
          </div>
        </div>
        <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:#ff4444; cursor:pointer; font-size:1.1rem;"></i>
      </div>
    `;
  });
  
  cartItems.innerHTML = html;
  cartTotal.textContent = `₹${total}`;
  updateCartOrderSummary();
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

// Show order form in cart
function showOrderForm() {
  if (cart.length === 0) {
    alert('Your cart is empty! Add some items first.');
    return;
  }
  
  document.getElementById('cartOrderForm').style.display = 'block';
  updateCartOrderSummary();
  
  // Scroll to order form
  setTimeout(() => {
    document.querySelector('.cart-order-form').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// Update order summary inside cart
function updateCartOrderSummary() {
  const summaryDiv = document.getElementById('cartOrderSummary');
  if (!summaryDiv) return;
  
  if (cart.length === 0) {
    summaryDiv.innerHTML = '<p style="color:#999; text-align:center;">No items in cart</p>';
    return;
  }
  
  let itemsHtml = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemsHtml += `
      <div class="cart-order-item">
        <span>${item.name} x${item.quantity}</span>
        <span>₹${itemTotal}</span>
      </div>
    `;
  });
  
  summaryDiv.innerHTML = `
    ${itemsHtml}
    <div class="cart-order-total">
      <span>Total:</span>
      <span>₹${total}</span>
    </div>
  `;
}

// Place order from cart
function placeOrderFromCart(event) {
  event.preventDefault();
  
  const name = document.getElementById('cartName').value;
  const phone = document.getElementById('cartPhone').value;
  const address = document.getElementById('cartAddress').value;
  const time = document.getElementById('cartTime').value;
  
  if (!name || !phone || !address) {
    alert('Please fill all required fields');
    return;
  }
  
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Prepare order message
  let orderItems = '';
  let totalAmount = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    orderItems += `${item.name} x${item.quantity} = ₹${itemTotal}\n`;
  });
  
  const message = `*New Order from Shiv Chat Center*\n\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nDelivery Time: ${time}\n\n*Order Items:*\n${orderItems}\n*Total Amount: ₹${totalAmount}*\n\n*Thank you for ordering!*`;
  
  // WhatsApp URL
  const whatsappURL = `https://wa.me/917828951832?text=${encodeURIComponent(message)}`;
  
  // Send email via EmailJS
  try {
    const templateParams = {
      to_email: 'shivchatcenter@gmail.com',
      customer_name: name,
      customer_phone: phone,
      customer_address: address,
      delivery_time: time,
      order_items: orderItems,
      total_amount: `₹${totalAmount}`,
      reply_to: 'shivchatcenter@gmail.com'
    };
    
    emailjs.send('service_deccs1c', 'template_sta3gch', templateParams)
      .then(function(response) {
        console.log('Email sent successfully!');
      }, function(error) {
        console.log('Email failed to send', error);
      });
  } catch (error) {
    console.log('EmailJS error:', error);
  }
  
  // Open WhatsApp
  window.open(whatsappURL, '_blank');
  
  // Clear cart after order
  setTimeout(() => {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    document.getElementById('cartOrderForm').style.display = 'none';
    document.getElementById('cartCheckoutForm').reset();
    
    // Show success message
    alert('Order placed! Check WhatsApp to confirm.');
  }, 1500);
}

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
  
  // Update dots
  const dots = document.querySelectorAll('.dot');
  if (dots.length) {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  }
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
let slideInterval = setInterval(nextSlide, 5000);

// Pause on hover
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  hero.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
  });
}

// Create slider dots
function createSliderDots() {
  const dotsContainer = document.getElementById('sliderDots');
  if (!dotsContainer) return;
  
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => {
      currentSlide = i;
      showSlide(i);
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    };
    dotsContainer.appendChild(dot);
  }
}

// Reviews System
let reviews = JSON.parse(localStorage.getItem('reviews')) || [
  {
    name: "Rahul Sharma",
    rating: 5,
    date: "2024-03-15",
    text: "Best Aloo Chat in Agara! Fresh ingredients and amazing taste. The owner is very friendly."
  },
  {
    name: "Priya Patel",
    rating: 4,
    date: "2024-03-10",
    text: "Samosa was crispy and delicious. Very reasonable prices. Will visit again!"
  },
  {
    name: "Amit Verma",
    rating: 5,
    date: "2024-03-05",
    text: "Authentic taste, friendly owner. Pani Puri is a must-try! Five stars from me."
  },
  {
    name: "Neha Singh",
    rating: 5,
    date: "2024-03-01",
    text: "The best chaat in Sheopur district. Highly recommended for evening snacks."
  }
];

// Display reviews
function displayReviews() {
  const reviewsGrid = document.getElementById('reviewsGrid');
  if (!reviewsGrid) return;
  
  let html = '';
  reviews.slice(0, 4).forEach(review => {
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
      date: new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      text: text
    };
    
    reviews.unshift(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    displayReviews();
    event.target.reset();
    
    // Show success message
    alert('Thank you for your review! 🙏');
    
    // Scroll to reviews
    document.querySelector('.reviews').scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  displayReviews();
  createSliderDots();
  
  // Close cart when clicking outside
  document.addEventListener('click', (e) => {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartSidebar.classList.contains('open') && 
        !cartSidebar.contains(e.target) && 
        !cartIcon.contains(e.target)) {
      cartSidebar.classList.remove('open');
      document.getElementById('cartOrderForm').style.display = 'none';
    }
  });
  
  // Close cart on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('cartSidebar').classList.remove('open');
      document.getElementById('cartOrderForm').style.display = 'none';
    }
  });
});
