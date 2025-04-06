// DOM button
const loginForm = document.querySelector(".login-form");
const signUpForm = document.querySelector(".sign-form");

//loading listenier
document.addEventListener("DOMContentLoaded", function () {
  loginActions();
});

function loginActions() {
  console.log('login actions')
  const current = localStorage.getItem("currentName");
  if (current) {
    const loginIcon = document.getElementById("login-icon");
    const signIcon = document.getElementById("signup-icon");
    const userActions = document.querySelector(".user-actions");
    loginIcon.classList.add("active");
    signIcon.classList.add("active");
    const span = `<span>Hi, ${current} <i class="fa-solid fa-right-from-bracket" id="logoutIcon"></i></span>`;
    userActions.innerHTML += span;
    const out = document.getElementById("logoutIcon");
    out.addEventListener("click", doLogOut);

  }
}



// Toggle Password Visibility
const togglePasswordButtons = document.querySelectorAll(".toggle-password");
if (togglePasswordButtons) {
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);

      // Toggle eye icon
      const icon = this.querySelector("i");
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  });
}


function doLogOut() {
  console.log("out");
  localStorage.setItem("currentName", "");
  localStorage.setItem("currentEmail", "");
  localStorage.setItem("cart", "");
  location.href = "index.html";
  loginActions()
}

//add eventListener

if (signUpForm) {
  signUpForm.addEventListener("submit", doSignUp);
}
if (loginForm) {
  loginForm.addEventListener("submit", dologin);
}


//signup function

function doSignUp() {
  event.preventDefault();
  //dom elements
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cnPass = document.getElementById("cn-password").value;
  const form = document.querySelector(".sign-form");
    const error = document.getElementById("signup-error");
    let users = JSON.parse(localStorage.getItem("users")) || [];


  // check password

  if (!isValidPassword(password, cnPass)) {
   showError(
     error,
     `
Password invalid<br>
Password must : <br>
  1) be at least 8 characters long.<br>
  2) contain at least one uppercase letter (A-Z).<br>
  3) contain at least one lowercase letter (a-z)<br>
  4) contain at least one number (0-9)<br>
  5) contain at least one special character (!@#$%^&)<br>
  6) match confirmation password.<br>
Please try again`
   );
    return;
  }

  //check duplicates

  if (
    users.some((user) => {
      return user.email === email;
    })
  ) {
   showError(
     error,
     "This email is already registered. Please log in or use a different email."
   );
    form.reset();
    return;
  }

  users.push({
    username,
    email,
    password,
    products: [],
  });
  localStorage.setItem("currentName", username);
  localStorage.setItem("currentEmail", email);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("cart", '');

  loginActions();
  form.reset();
  location.href='index.html'
}

function showError(element, message) {
  if (element) {
    console.log("here");
    const inPre = document.getElementById("error-pre");
    console.log(inPre);
    inPre.innerHTML = message;

    element.style.display = "block";
  }
}


// login function

function dologin() {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const form = document.querySelector(".login-form");

   const error = document.getElementById("login-error");
   let users = JSON.parse(localStorage.getItem("users")) || [];

 
  
 if (!form.reportValidity()) {
     return; // Stop if HTML5 validation fails (shows browser popups)
  }
  
 let current = users.find((user) => {
   return user.email === email && user.password === password;
 });
  if (current) {
    localStorage.setItem("currentName", current.username);
    localStorage.setItem("currentEmail", current.email);
    localStorage.setItem("cart",JSON.stringify(current.products));

    location.href = "index.html";
  } else showError(error,"Wrong email or password");
  form.reset();
}



// password validation function

function isValidPassword(password, rePass) {
  const letterPattern = /[a-zA-Z]/;
  const numberPattern = /[0-9]/;
  const specialCharPattern = /[!@#$%-._]/;

  if (password.length < 8 && password !== rePass) return false;
  if (
    !letterPattern.test(password) ||
    !numberPattern.test(password) ||
    !specialCharPattern.test(password)
  )
    return false;

  return true;
}
