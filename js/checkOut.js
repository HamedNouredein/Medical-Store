document.addEventListener("DOMContentLoaded", loadOrderSummary);

function loadOrderSummary() {
  const itemsContainer = document.querySelector(".order-samary .items");
  const totalSpan = document.querySelector(".order-samary .total span");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  itemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item_cart");
    itemDiv.innerHTML = `
      <div class="cart-item-img">
        <img src="${item["Image URL"]}" alt="${item.Name}">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.Name.length > 30 ? item.Name.substring(0, 30) + "..." : item.Name}</h4>
        <p class="cart-item-price">${item.Price} × ${item.quantity}</p>
        <button class="remove-item" data-id="${item.id}">Remove</button>
      </div>
    `;
    itemsContainer.appendChild(itemDiv);
    const cleanedPrice = parseFloat(item.Price.replace(/[^0-9.]/g, ""));
    total += cleanedPrice * item.quantity;
  });

  totalSpan.textContent = `$${total.toFixed(2)}`;

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", e => {
      const id = Number.parseInt(e.target.dataset.id);
      removeFromCart(id);
      loadOrderSummary();
    });
  });
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateUserCart(); // Sync with user's data
}

function placeOrder() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const couponCode = document.getElementById("couponCode").value.trim();

  if (!name || !email || !address || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  const currentEmail = localStorage.getItem("currentEmail");
  if (!currentEmail) {
    alert("Please log in to place an order.");
    location.href = "login.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }

  let total = cart.reduce((sum, item) => sum + parseFloat(item.Price.replace(/[^0-9.]/g, "")) * item.quantity, 0);
  if (couponCode === "DISCOUNT10") total *= 0.9; // Apply 10% discount

  const order = {
    customer: { name, email, address, phone },
    items: cart,
    total: total.toFixed(2),
    date: new Date().toISOString()
  };

  localStorage.setItem("pendingOrder", JSON.stringify(order));
  alert("✅ Order Submitted! Proceed to payment.");
  localStorage.removeItem("cart");
  location.href = "creditCard.html";
}

// Sync cart with user's data (imported from login.js)
function updateUserCart() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentEmail = localStorage.getItem("currentEmail");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = users.findIndex(user => user.email === currentEmail);
  if (index !== -1) {
    users[index].products = cart;
    localStorage.setItem("users", JSON.stringify(users));
  }
}
