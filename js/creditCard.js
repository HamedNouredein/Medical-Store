document.getElementById("payment-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const cardNumber = document.getElementById("card-number").value;
  const expiryDate = document.getElementById("expiry-date").value;
  const cvv = document.getElementById("cvv").value;
  const message = document.getElementById("message");

  if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(cardNumber)) {
    message.textContent = "Invalid Card Number (e.g., 1234 5678 9012 3456)";
    return;
  }
  if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiryDate)) {
    message.textContent = "Invalid Expiry Date (e.g., MM/YY)";
    return;
  }
  if (cvv.length !== 3 || isNaN(cvv)) {
    message.textContent = "Invalid CVV (e.g., 123)";
    return;
  }

  const order = JSON.parse(localStorage.getItem("pendingOrder"));
  if (!order) {
    message.textContent = "No pending order found.";
    return;
  }

  localStorage.removeItem("pendingOrder");
  localStorage.setItem("cart", JSON.stringify([])); // Clear cart
  updateUserCart(); // Sync with user's data
  message.style.color = "green";
  message.textContent = "Payment Succeeded! Order placed.";
  setTimeout(() => location.href = "index.html", 2000); // Redirect to home
});

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
