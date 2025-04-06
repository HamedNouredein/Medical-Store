// Theme toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    body.classList.add("dark-mode")
  }

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode")

    // Save preference to localStorage
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark")
    } else {
      localStorage.setItem("theme", "light")
    }
  })
})

