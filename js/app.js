// Enhanced smooth scroll navigation
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-links");
  if (!toggle || !nav) return;

  // Handle all navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the target element
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Close mobile menu if open
        nav.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");

        // Calculate header height for offset
        const headerHeight =
          document.querySelector(".site-header").offsetHeight;

        // Get element position
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerHeight;

        // Smooth scroll with offset
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  toggle.addEventListener("click", function () {
    const expanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("show");
  });

  // Close nav on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("show")) {
      nav.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".imgslide");
  const dots = document.querySelectorAll(".dot");
  const thumbs = document.querySelectorAll(".work-thumb");
  let current = 0;

  const slideWidth = thumbs[0].offsetWidth + 100; // 20 هو الـ gap

  function goToSlide(index) {
    current = index;
    slider.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });
    dots.forEach((d) => d.classList.remove("active"));
    dots[index].classList.add("active");
  }

  // التحكم بالدوتس فقط
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  // اختيارياً: تحديث الدوتس أثناء السحب باللمس
  slider.addEventListener("scroll", () => {
    const index = Math.round(slider.scrollLeft / slideWidth);
    dots.forEach((d) => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  });
});

//    Form Validation

const form = document.getElementById("form");
const toast = document.getElementById("toast");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Create FormData
  const formData = new FormData(form);

  // Convert to plain object
  const data = Object.fromEntries(formData.entries());

  const { name, email, text } = data;

  // Validation
  if (!name || !email || !text) {
    showToast("Please fill in all fields", "error");
    return;
  }

  console.log("FormData Object:", data);

  showToast("Message Sent Successfully", "success");
});

function showToast(message, type) {
  toast.textContent = message;
  toast.style.backgroundColor = type === "success" ? "green" : "red";
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 2200);
}
