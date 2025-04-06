
document.addEventListener("DOMContentLoaded", () => {
  // Main slider
  const mainSwiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  })

  // Sale products slider
  const saleSwiper = new Swiper(".sale_sec", {
    slidesPerView: 5,
    spaceBetween: 30,
    autoplay: {
      delay: 3000,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
    breakpoints: {
      1600: {
        slidesPerView: 5,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      700: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      0: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    },
  })
})

