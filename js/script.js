// Global variables
let products = []
let currentPage = 1
const productsPerPage = 8
let cart = []

// DOM Elements
const productList = document.getElementById("product-list")
const paginationContainer = document.getElementById("pagination")
const cartIcon = document.getElementById("cart-icon")
const cartSidebar = document.getElementById("cart-sidebar")
const closeCartBtn = document.getElementById("close-cart")
const overlay = document.getElementById("overlay")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const cartCount = document.querySelector(".cart-count")
const mobileMenuBtn = document.getElementById("mobile-menu-btn")
const mainNav = document.getElementById("main-nav")
const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const saleProductsContainer = document.getElementById("swiper_items_sale")

// Fetch products from JSON file
async function fetchProducts() {
  try {
    const response = await fetch("data/data.json")
    products = await response.json()
    displayProducts(products, currentPage)
    setupPagination(products)

    // Display sale products if the container exists
    if (saleProductsContainer) {
      displaySaleProducts(products.slice(0, 6))
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    if (productList) {
      productList.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>'
    }
  }
}

// Display products with pagination
function displayProducts(products, page) {
  if (!productList) return

  const start = (page - 1) * productsPerPage
  const end = start + productsPerPage
  const paginatedProducts = products.slice(start, end)

  productList.innerHTML = ""

  if (paginatedProducts.length === 0) {
    productList.innerHTML = '<p class="no-products">No products found.</p>'
    return
  }

  paginatedProducts.forEach((product) => {
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

    productList.appendChild(productCard)
  })

  // Add event listeners to buttons
  addProductButtonListeners()
}

// Display sale products in the swiper
function displaySaleProducts(products) {
  if (!saleProductsContainer) return

  saleProductsContainer.innerHTML = ""

  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card swiper-slide"

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

    saleProductsContainer.appendChild(productCard)
  })

  // Add event listeners to buttons
  addProductButtonListeners()
}

// Setup pagination
function setupPagination(products) {
  if (!paginationContainer) return

  const pageCount = Math.ceil(products.length / productsPerPage)
  paginationContainer.innerHTML = ""

  // Previous button
  const prevBtn = document.createElement("button")
  prevBtn.className = `pagination-btn prev ${currentPage === 1 ? "disabled" : ""}`
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>'
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      displayProducts(products, currentPage)
      setupPagination(products)
    }
  })
  paginationContainer.appendChild(prevBtn)

  // Page numbers
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(pageCount, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button")
    pageBtn.className = `pagination-btn ${i === currentPage ? "active" : ""}`
    pageBtn.textContent = i
    pageBtn.addEventListener("click", () => {
      currentPage = i
      displayProducts(products, currentPage)
      setupPagination(products)
    })
    paginationContainer.appendChild(pageBtn)
  }

  // Next button
  const nextBtn = document.createElement("button")
  nextBtn.className = `pagination-btn next ${currentPage === pageCount ? "disabled" : ""}`
  nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>'
  nextBtn.addEventListener("click", () => {
    if (currentPage < pageCount) {
      currentPage++
      displayProducts(products, currentPage)
      setupPagination(products)
    }
  })
  paginationContainer.appendChild(nextBtn)
}

// Add event listeners to product buttons
function addProductButtonListeners() {
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
      addToCart(productId)
    })
  })
}

// Add to cart function with enhanced notification
function addToCart(id) {
  const product = products.find((product) => product.id === id)
  if (!product) return

  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  updateCart()

  // Animate cart icon
  const cartIconElement = document.querySelector(".cart-icon i")
  cartIconElement.classList.add("cart-bounce")
  setTimeout(() => {
    cartIconElement.classList.remove("cart-bounce")
  }, 500)

  // Show notification
  showCartNotification(product.Name)

  // Open cart sidebar
  openCart()
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id)
  updateCart()
}

// Update quantity
function updateQuantity(id, quantity) {
  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity = quantity
    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      updateCart()
    }
  }
}

// Update cart UI
function updateCart() {
  // Save to local storage
  localStorage.setItem("cart", JSON.stringify(cart));

  // set to user
  updateUserCart();

  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  } else {
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      // Extract numeric price - handle different price formats
      const priceValue = Number.parseFloat(item.Price.replace(/[^0-9.]/g, ""));
      const itemTotal = priceValue * item.quantity;

      cartItem.innerHTML = `
        <div class="cart-item-img">
          <img src="${item["Image URL"]}" alt="${item.Name}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${
            item.Name.length > 30
              ? item.Name.substring(0, 30) + "..."
              : item.Name
          }</h4>
          <p class="cart-item-price">${item.Price} × ${item.quantity}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease" data-id="${
              item.id
            }">-</button>
            <input type="number" class="quantity-input" value="${
              item.quantity
            }" min="1" data-id="${item.id}">
            <button class="quantity-btn increase" data-id="${
              item.id
            }">+</button>
          </div>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
      `;

      cartItems.appendChild(cartItem);
    });
  }

  // Update cart total - fix the price calculation
  const total = cart.reduce((total, item) => {
    const price = Number.parseFloat(item.Price.replace(/[^0-9.]/g, ""));
    return total + price * item.quantity;
  }, 0);

  if (cartTotal) {
    cartTotal.textContent = total.toFixed(2);
  }

  // Add event listeners to cart items
  addCartItemListeners();
}

function updateUserCart() {
  const users = JSON.parse(localStorage.getItem("users"))
    ? JSON.parse(localStorage.getItem("users"))
    : [];
  const currentEmail = localStorage.getItem("currentEmail");
  const cart = JSON.parse(localStorage.getItem("cart"));
  let index = -1;
  if (currentEmail)
    index = users.findIndex((user) => user.email === currentEmail);
  if (index !== -1) {
    users[index].products = cart;
    localStorage.setItem("users", JSON.stringify(users));
  }
}


// Add event listeners to cart items
function addCartItemListeners() {
  const decreaseButtons = document.querySelectorAll(".decrease")
  const increaseButtons = document.querySelectorAll(".increase")
  const quantityInputs = document.querySelectorAll(".quantity-input")
  const removeButtons = document.querySelectorAll(".remove-item")

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = Number.parseInt(event.target.dataset.id)
      const item = cart.find((item) => item.id === id)
      if (item) {
        updateQuantity(id, item.quantity - 1)
      }
    })
  })

  increaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = Number.parseInt(event.target.dataset.id)
      const item = cart.find((item) => item.id === id)
      if (item) {
        updateQuantity(id, item.quantity + 1)
      }
    })
  })

  quantityInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const id = Number.parseInt(event.target.dataset.id)
      const quantity = Number.parseInt(event.target.value)
      if (quantity > 0) {
        updateQuantity(id, quantity)
      } else {
        event.target.value = 1
        updateQuantity(id, 1)
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

// Show cart notification
function showCartNotification(productName) {
  // Remove existing notification if any
  const existingNotification = document.querySelector(".cart-notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = "cart-notification"
  notification.innerHTML = `
    <i class="fa-solid fa-check-circle"></i>
    <span>${productName.length > 25 ? productName.substring(0, 25) + "..." : productName} added to cart!</span>
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
  cartSidebar.classList.add("active")
  overlay.classList.add("active")

  // Focus trap for accessibility
  setTimeout(() => {
    const closeButton = document.getElementById("close-cart")
    if (closeButton) {
      closeButton.focus()
    }
  }, 300)
}

// Close cart with enhanced animation
function closeCart() {
  cartSidebar.classList.remove("active")

  // Delay overlay removal for smooth animation
  setTimeout(() => {
    overlay.classList.remove("active")
  }, 300)
}

// Load cart from local storage
function loadCart() {
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCart()
  }
}

// Search functionality
function searchProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase()

  if (searchTerm === "") {
    displayProducts(products, 1)
    setupPagination(products)
    return
  }

  const filteredProducts = products.filter(
    (product) =>
      product.Name.toLowerCase().includes(searchTerm) ||
      (product.Description && product.Description.toLowerCase().includes(searchTerm)),
  )

  currentPage = 1
  displayProducts(filteredProducts, 1)
  setupPagination(filteredProducts)
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts()
  loadCart()

  if (cartIcon) {
    cartIcon.addEventListener("click", openCart)
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCart)
  }

  if (overlay) {
    overlay.addEventListener("click", closeCart)
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      mainNav.classList.toggle("active")
    })
  }

  if (searchButton) {
    searchButton.addEventListener("click", searchProducts)
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        searchProducts()
      }
    })
  }

  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length > 0) {
        window.location.href = "checkOut.html"
      } else {
        alert("Your cart is empty. Add some products before checking out.")
      }
    })
  }
})

