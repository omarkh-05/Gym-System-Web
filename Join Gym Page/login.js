function setDateRange(dateInputId) {
  const dateInput = document.getElementById(dateInputId);
  if (!dateInput) return;

  const today = new Date();
  const maxDateObj = new Date(today);
  maxDateObj.setFullYear(today.getFullYear() - 18);
  const minDateObj = new Date(today);
  minDateObj.setFullYear(today.getFullYear() - 100);

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  dateInput.setAttribute("min", formatDate(minDateObj)); // 100 سنة
  dateInput.setAttribute("max", formatDate(maxDateObj)); // 18 سنة
  dateInput.value = formatDate(maxDateObj);
}
setDateRange("DateOfBirth");

const pwShowHide = document.querySelectorAll(".showHidePw");
const pwFields = document.querySelectorAll(".password");

pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach((pwField) => {
      if (pwField.type === "password") {
        pwField.type = "text";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye-slash", "uil-eye");
        });
      } else {
        pwField.type = "password";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye", "uil-eye-slash");
        });
      }
    });
  });
});