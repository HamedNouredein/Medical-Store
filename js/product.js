// Global variables
let products = []
let product = null
let relatedProducts = []
let quantity = 1

// DOM Elements
const productContainer = document.getElementById("product-container")
const relatedProductsContainer = document.getElementById("related-products")
const productNameBreadcrumb = document.getElementById("product-name")

// Get product ID from URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = Number.parseInt(urlParams.get("id"))
  return id
}

// Fetch products from JSON file
async function fetchProducts() {
  try {
    const response = await fetch("data/data.json")
    products = await response.json()

    const productId = getProductIdFromUrl()
    if (!productId) {
      window.location.href = "index.html"
      return
    }

    product = products.find((p) => p.id === productId)
    if (!product) {
      window.location.href = "index.html"
      return
    }

    displayProductDetails(product)
    getRelatedProducts(product)
  } catch (error) {
    console.error("Error fetching products:", error)
    if (productContainer) {
      productContainer.innerHTML =
        '<p class="error-message">Failed to load product details. Please try again later.</p>'
    }
  }
}

// Display product details
function displayProductDetails(product) {
  if (!productContainer || !productNameBreadcrumb) return;

  // Update breadcrumb
  productNameBreadcrumb.textContent = product.Name.length > 30 ? product.Name.substring(0, 30) + "..." : product.Name;

  // تقسيم الـ Description لنقاط بناءً على النقطة (.)
  const descriptionText = product.Description || "No description available for this product.";
  const descriptionParts = descriptionText.split('.').filter(part => part.trim() !== ''); // بيقسم النص عند النقطة ويتجاهل الفراغات

  // Create product details HTML
  const productHTML = `
    <div class="product-grid">
      <div class="product-gallery">
        <div class="main-image">
          <img src="${product["Image URL"]}" alt="${product.Name}" id="main-product-image">
        </div>
        <div class="product-thumbnails">
          <div class="thumbnail active" data-image="${product["Image URL"]}">
            <img src="${product["Image URL"]}" alt="${product.Name}">
          </div>
        </div>
      </div>
      <div class="product-content">
        <h1>${product.Name}</h1>
        <div class="product-meta">
          <p><i class="fa-solid fa-tag"></i> Product ID: ${product.id}</p>
          ${product["Delivery Info"] ? `<p><i class="fa-solid fa-truck"></i> ${product["Delivery Info"]}</p>` : ""}
        </div>
        <div class="product-price-detail">${product.Price}</div>
        <div class="product-description">
          <h3>Description</h3>
          <ul>
            ${descriptionParts.map(part => `<li>${part.trim()}.</li>`).join('')}
          </ul>
        </div>
        <div class="product-actions">
          <div class="quantity-control">
            <button id="decrease-quantity">-</button>
            <input type="number" id="quantity" value="1" min="1" max="10">
            <button id="increase-quantity">+</button>
          </div>
          <button class="btn add-to-cart-btn" id="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
          <button class="wishlist-btn" id="wishlist-btn" data-id="${product.id}">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
       <div class="product-tabs">
    <div class="tabs-header">
      <button class="tab-btn active" data-tab="description">Description</button>
      <button class="tab-btn" data-tab="details">Details</button>
      <button class="tab-btn" data-tab="shipping">Shipping</button>
    </div>
    <div class="tab-content active" id="description-tab">
      <ul>
        ${descriptionParts.map(part => `<li>${part.trim()}.</li>`).join('')}
      </ul>
    </div>
    <div class="tab-content" id="details-tab">
      <p>Product ID: ${product.id}</p>
      ${product.Color && product.Color !== "N/A" ? `<p>Color: ${product.Color}</p>` : ""}
    </div>
  
  </div>
          <div class="tab-content" id="shipping-tab">
            <p>${product["Delivery Info"] || "Standard shipping applies to this product."}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  productContainer.innerHTML = productHTML;

  // Add event listeners
  setupProductEventListeners();
}

// Get related products
function getRelatedProducts(currentProduct) {
  // Get 4 random products that are not the current product
  const filteredProducts = products.filter((p) => p.id !== currentProduct.id)
  const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random())
  relatedProducts = shuffled.slice(0, 4)

  displayRelatedProducts(relatedProducts)
}

// Display related products
function displayRelatedProducts(products) {
  if (!relatedProductsContainer) return

  relatedProductsContainer.innerHTML = ""

  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product["Image URL"]}" alt="${product.Name}">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.Name}</h3>
        <p class="product-price">${product.Price}</p>
        <div class="product-buttons">
          <button class="btn view-details" data-id="${product.id}">View Details</button>
          <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `

    relatedProductsContainer.appendChild(productCard)
  })

  // Add event listeners to related products
  addRelatedProductListeners()
}

// Setup product event listeners
function setupProductEventListeners() {
  const decreaseBtn = document.getElementById("decrease-quantity")
  const increaseBtn = document.getElementById("increase-quantity")
  const quantityInput = document.getElementById("quantity")
  const addToCartBtn = document.getElementById("add-to-cart-btn")
  const wishlistBtn = document.getElementById("wishlist-btn")
  const tabButtons = document.querySelectorAll(".tab-btn")
  const thumbnails = document.querySelectorAll(".thumbnail")

  if (!decreaseBtn || !increaseBtn || !quantityInput || !addToCartBtn || !wishlistBtn) return

  // Quantity controls
  decreaseBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--
      quantityInput.value = quantity
    }
  })

  increaseBtn.addEventListener("click", () => {
    quantity++
    quantityInput.value = quantity
  })

  quantityInput.addEventListener("change", () => {
    const value = Number.parseInt(quantityInput.value)
    if (value < 1) {
      quantity = 1
      quantityInput.value = quantity
    } else {
      quantity = value
    }
  })

  // Add to cart
  addToCartBtn.addEventListener("click", () => {
    const productId = Number.parseInt(addToCartBtn.dataset.id)
    addToCart(productId, quantity)
  })

  // Wishlist
  wishlistBtn.addEventListener("click", () => {
    wishlistBtn.classList.toggle("active")
    const icon = wishlistBtn.querySelector("i")
    if (wishlistBtn.classList.contains("active")) {
      icon.classList.remove("fa-regular")
      icon.classList.add("fa-solid")
      alert("Product added to wishlist!")
    } else {
      icon.classList.remove("fa-solid")
      icon.classList.add("fa-regular")
    }
  })

  // Tabs
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      const tabId = button.dataset.tab
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })

  // Thumbnails
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      thumbnails.forEach((thumb) => thumb.classList.remove("active"))
      thumbnail.classList.add("active")

      const mainImage = document.getElementById("main-product-image")
      mainImage.src = thumbnail.dataset.image
    })
  })
}

// Add event listeners to related products
function addRelatedProductListeners() {
  const viewDetailsButtons = document.querySelectorAll(".view-details")
  const addToCartButtons = document.querySelectorAll(".add-to-cart")

  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = Number.parseInt(event.target.dataset.id)
      window.location.href = `product.html?id=${productId}`
    })
  })

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = Number.parseInt(event.target.dataset.id)
      addToCart(productId, 1)
    })
  })
}

// Add to cart function with enhanced notification
function addToCart(id, quantity) {
  const product = products.find((product) => product.id === id)
  if (!product) return

  let cart = []
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
  }

  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      ...product,
      quantity: quantity,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  updateUserCart();

  // Animate cart icon
  const cartIconElement = document.querySelector(".cart-icon i")
  cartIconElement.classList.add("cart-bounce")
  setTimeout(() => {
    cartIconElement.classList.remove("cart-bounce")
  }, 500)

  // Show notification
  showCartNotification(product.Name, quantity)

  // Load cart items into the sidebar
  loadCartItems()

  // Open the cart
  openCart()
}

// update user cart
function updateUserCart() {
  const users = JSON.parse(localStorage.getItem("users"))
    ? JSON.parse(localStorage.getItem("users"))
    : [];
  const currentEmail = localStorage.getItem("currentEmail");
  
  const cart = JSON.parse(localStorage.getItem("cart"));
  let index=-1;

  if (currentEmail)
    index = users.findIndex((user) => user.email === currentEmail);
  if (index !== -1) {
    users[index].products = cart;
    
    localStorage.setItem("users", JSON.stringify(users));
  }
}



// Show cart notification
function showCartNotification(productName, quantity) {
  // Remove existing notification if any
  const existingNotification = document.querySelector(".cart-notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = "cart-notification"

  // Adjust text length based on screen size
  const isMobile = window.innerWidth < 768
  const maxLength = isMobile ? 15 : 25

  notification.innerHTML = `
        <i class="fa-solid fa-check-circle"></i>
        <span>${quantity > 1 ? quantity + " × " : ""}${productName.length > maxLength ? productName.substring(0, maxLength) + "..." : productName} added to cart!</span>
    `

  // Add to body
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}

// Open cart with enhanced animation
function openCart() {
  const cartSidebar = document.getElementById("cart-sidebar")
  const overlay = document.getElementById("overlay")

  cartSidebar.classList.add("active")
  overlay.classList.add("active")

  // Prevent body scrolling when cart is open
  document.body.style.overflow = "hidden"

  // Focus trap for accessibility
  setTimeout(() => {
    const closeButton = document.getElementById("close-cart")
    if (closeButton) {
      closeButton.focus()
    }
  }, 300)
}

// New function to load cart items
function loadCartItems() {
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")
  const cart = loadCart()

  // Update cart items
  cartItems.innerHTML = ""

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>'
  } else {
    cart.forEach((item) => {
      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"

      // Extract numeric price - handle different price formats
      const priceValue = Number.parseFloat(item.Price.replace(/[^0-9.]/g, ""))
      const itemTotal = priceValue * item.quantity

      cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item["Image URL"]}" alt="${item.Name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.Name.length > 30 ? item.Name.substring(0, 30) + "..." : item.Name}</h4>
                    <p class="cart-item-price">${item.Price} × ${item.quantity}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `

      cartItems.appendChild(cartItem)
    })
  }

  // Update cart total - fix the price calculation
  const total = cart.reduce((total, item) => {
    const price = Number.parseFloat(item.Price.replace(/[^0-9.]/g, ""))
    return total + price * item.quantity
  }, 0)

  cartTotal.textContent = total.toFixed(2)

  // Add event listeners to cart items
  const decreaseButtons = document.querySelectorAll(".decrease")
  const increaseButtons = document.querySelectorAll(".increase")
  const quantityInputs = document.querySelectorAll(".quantity-input")
  const removeButtons = document.querySelectorAll(".remove-item")

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = Number.parseInt(event.target.dataset.id)
      updateItemQuantity(id, "decrease")
    })
  })

  increaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = Number.parseInt(event.target.dataset.id)
      updateItemQuantity(id, "increase")
    })
  })

  quantityInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const id = Number.parseInt(event.target.dataset.id)
      const quantity = Number.parseInt(event.target.value)
      if (quantity > 0) {
        updateItemQuantity(id, "set", quantity)
      } else {
        event.target.value = 1
        updateItemQuantity(id, "set", 1)
      }
    })
  })

  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = Number.parseInt(event.target.dataset.id)
      removeFromCart(id)
    })
  })
}

// Update item quantity
function updateItemQuantity(id, action, value = null) {
  const cart = loadCart()
  const item = cart.find((item) => item.id === id)

  if (item) {
    if (action === "increase") {
      item.quantity++
    } else if (action === "decrease") {
      item.quantity--
    } else if (action === "set") {
      item.quantity = value
    }

    if (item.quantity <= 0) {
      removeFromCart(id)
      return
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    loadCartItems()
    updateCartCount()
    updateUserCart();
  }
}

// Remove from cart
function removeFromCart(id) {
  let cart = loadCart()
  cart = cart.filter((item) => item.id !== id)
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCartItems()
  updateCartCount()
  updateUserCart();
}

// Load cart function
function loadCart() {
  const savedCart = localStorage.getItem("cart")
  return savedCart ? JSON.parse(savedCart) : []
}

// Update cart count
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count")
  let count = 0

  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    const cart = JSON.parse(savedCart)
    count = cart.reduce((total, item) => total + item.quantity, 0)
  }

  cartCount.textContent = count
}

// Add a closeCart function that restores scrolling
function closeCart() {
  const cartSidebar = document.getElementById("cart-sidebar")
  const overlay = document.getElementById("overlay")

  cartSidebar.classList.remove("active")

  // Restore body scrolling
  document.body.style.overflow = ""

  // Delay overlay removal for smooth animation
  setTimeout(() => {
    overlay.classList.remove("active")
  }, 300)
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts()
  updateCartCount()
  loadCartItems()

  // Cart toggle
  const cartIcon = document.getElementById("cart-icon")
  const closeCartBtn = document.getElementById("close-cart")
  const overlay = document.getElementById("overlay")

  cartIcon.addEventListener("click", openCart)
  closeCartBtn.addEventListener("click", closeCart)
  overlay.addEventListener("click", closeCart)

  // Mobile menu
  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const mainNav = document.getElementById("main-nav")

  mobileMenuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("active")
  })
})

