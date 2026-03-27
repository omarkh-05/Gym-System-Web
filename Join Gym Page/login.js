import { loginHelper, registerHelper } from "../Auth/auth.js";

const container = document.getElementById("container"),
  pwShowHide = document.querySelectorAll(".showHidePw"),
  pwFields = document.querySelectorAll(".password"),
  flipToggle = document.getElementById("flip1");

// ------------------- Password Show/Hide -------------------
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach((pwField) => {
      if (pwField.type === "password") {
        pwField.type = "text";
        pwShowHide.forEach((icon) => icon.classList.replace("uil-eye-slash", "uil-eye"));
      } else {
        pwField.type = "password";
        pwShowHide.forEach((icon) => icon.classList.replace("uil-eye", "uil-eye-slash"));
      }
    });
  });
});

// ------------------- Flip between forms -------------------
flipToggle.addEventListener("change", () => {
  clearInputContainer();
  hideValidateErrorMessage("Login");
  hideValidateErrorMessage("Register");
});

// ------------------- Set date range for DOB -------------------
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

  dateInput.setAttribute("min", formatDate(minDateObj));
  dateInput.setAttribute("max", formatDate(maxDateObj));
  dateInput.value = formatDate(maxDateObj);
}
setDateRange("DateOfBirth");

// ------------------- Validation -------------------
function checkFormFields(formId, errorDivId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  const inputs = form.querySelectorAll("input, select");
  for (let input of inputs) {
    if (!input.checkValidity()) {
      printValidateErrorMessage(errorDivId, "*All fields are required and must be valid.");
      return false;
    }
  }
  hideValidateErrorMessage(errorDivId);
  return true;
}

function printValidateErrorMessage(errorDivId, message) {
  const errorDiv = document.getElementById(errorDivId + "_ErrorMessage");
  if (errorDiv) {
    errorDiv.style.display = "block";
    if(message === "Registered successfully")
      errorDiv.style.color = "green";
    else
    errorDiv.style.color = "red";
    errorDiv.textContent = message;
  }
}

function hideValidateErrorMessage(errorDivId) {
  const errorDiv = document.getElementById(errorDivId + "_ErrorMessage");
  if (errorDiv) {
    errorDiv.style.display = "none";
    errorDiv.textContent = "";
  }
}

function clearInputContainer() {
  const inputs = container.querySelectorAll("input[type='text'], input[type='email'], input[type='password'], input[type='tel']");
  inputs.forEach(input => input.value = "");
  const select = container.querySelector("select");
  if (select) select.selectedIndex = 0;
}

// ------------------- Loading Spinner -------------------
function setLoading(isLoading) {
  const loading = document.getElementById("loading");
  const submitButtons = container.querySelectorAll("input[type='submit']");
  if (isLoading) {
    loading.style.display = "flex";
    submitButtons.forEach(button => button.disabled = true);
  } else {
    loading.style.display = "none";
    submitButtons.forEach(button => button.disabled = false);
  }
}

// ------------------- Login Form -------------------
const signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkFormFields("signInForm", "Login")) return;

  const credentials = {
    PhoneNumber: document.getElementById("loginPhoneNumber").value.trim(),
    Password: document.getElementById("loginPassword").value.trim()
  };

  setLoading(true);
  const success = await loginHelper(credentials);
  setLoading(false);

  if (success) {
    window.location.href = "../index.html"; // redirect بعد تسجيل الدخول
  } else {
    printValidateErrorMessage("Login", "Invalid credentials");
  }
});

// ------------------- Register Form -------------------
const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkFormFields("signUpForm", "Register")) return;

  const password = document.getElementById("Password").value.trim();
  const confirmPassword = document.getElementById("ConfirmPassword").value.trim();

  if (password.length < 10) {
    printValidateErrorMessage("Register", "*Password must be at least 10 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    printValidateErrorMessage("Register", "*Passwords do not match.");
    return;
  }
  const nationalitySelect = document.getElementById("Nationality");

 const regInfoObject = {
    FullName: document.getElementById("FullName").value.trim(),
    PhoneNumber: document.getElementById("PhoneNumber").value.trim(),
    DateOfBirth: new Date(document.getElementById("DateOfBirth").value),
    NationalNo: document.getElementById("NationalNumber").value.trim(),
    NationalityID: +nationalitySelect.selectedOptions[0].dataset.id,
    Address: document.getElementById("Address").value.trim(),
    Gender: document.querySelector("input[name='gender']:checked").value,
    HasDisease: document.querySelector("input[name='disease']:checked").value === "true",
    PersonType: "Subscriber",
    Password: confirmPassword
};

  setLoading(true);
   console.log(regInfoObject);
  const reg = await registerHelper(regInfoObject);
  setLoading(false);

  if (reg) {
    printValidateErrorMessage("Register", "Registered successfully");
    setTimeout(() => {
      document.getElementById("flip1").checked = false;
       window.scrollTo({ top: 0, behavior: "smooth" });
    } , 1200);
   
  } else {
    printValidateErrorMessage("Register", "Registration failed");
  }
});