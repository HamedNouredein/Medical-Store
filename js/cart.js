// DOM Elements
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const cartCount = document.querySelector(".cart-count")
const checkoutBtn = document.getElementById("checkout-btn")
const cartIcon = document.getElementById("cart-icon")
const closeCartBtn = document.getElementById("close-cart")
const overlay = document.getElementById("overlay")

// Load cart from local storage
function loadCart() {
  let cart = []
  const savedCart = localStorage.getItem("cart")

  if (savedCart) {
    cart = JSON.parse(savedCart)
  }

  return cart
}

// Update cart UI
function updateCart() {
  const cart = loadCart()

  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  cartCount.textContent = totalItems

  // Update cart items
  if (!cartItems) return

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

  if (cartTotal) {
    cartTotal.textContent = total.toFixed(2)
  }

  // Add event listeners to cart items
  addCartItemListeners()
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
    updateCart()
    updateUserCart(); 
  }
}

// Remove from cart
function removeFromCart(id) {
  let cart = loadCart()
  cart = cart.filter((item) => item.id !== id)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCart()
  updateUserCart(); 
}

// Open cart with enhanced animation
function openCart() {
  const cartSidebar = document.getElementById("cart-sidebar")
  const overlay = document.getElementById("overlay")

  if (cartSidebar && overlay) {
    cartSidebar.classList.add("active")
    overlay.classList.add("active")
  }
}

// Close cart with enhanced animation
function closeCart() {
  const cartSidebar = document.getElementById("cart-sidebar")
  const overlay = document.getElementById("overlay")

  if (cartSidebar && overlay) {
    cartSidebar.classList.remove("active")
    setTimeout(() => {
      overlay.classList.remove("active")
    }, 300)
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  updateCart()

  if (cartIcon) {
    cartIcon.addEventListener("click", openCart)
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCart)
  }

  if (overlay) {
    overlay.addEventListener("click", closeCart)
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = loadCart()
      if (cart.length > 0) {
        window.location.href = "checkOut.html"
      } else {
        alert("Your cart is empty. Add some products before checking out.")
      }
    })
  }
})

