import { apiFetch, UrlBase } from "../Auth/auth.js";

// ============== DOM ELEMENTS ==============
const form = document.getElementById('payment-form');
const methodVisa = document.getElementById('method-visa');
const methodCash = document.getElementById('method-cash');
const cardInputs = document.querySelectorAll('#card-inputs-container input');
const cardPreviewBox = document.getElementById('card-preview-box');
const submitBtn = document.getElementById('submit-btn');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const paymentWrapper = document.getElementById('payment-wrapper');

// Preview Elements
const previewName = document.getElementById('preview-name');
const previewNumber = document.getElementById('preview-number');
const previewExpiry = document.getElementById('preview-expiry');

let subscriptionDuration = 0;
const getCommonHeaders = () => ({
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
});

// ============== Subscribe Object ==============
const subscriberRequest = {
  SubDate: null,
  EndDate: null,
  IsPaid: false,
  SubscriptionInfo: 0,
  PersonId: 0,
  DepartmentID:1,
};

// ============== INITIALIZATION ==============
const todayLocal = new Date();
const yyyy = todayLocal.getFullYear();
const mm = String(todayLocal.getMonth() + 1).padStart(2, '0'); // شهور من 0
const dd = String(todayLocal.getDate()).padStart(2, '0');

startDateInput.min = `${yyyy}-${mm}-${dd}`;

document.addEventListener("DOMContentLoaded", async () => {
    await loadPackageData();
    togglePaymentMethod();
});

// ============== PACKAGE DATA ==============
async function loadPackageData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if (!id) return;
      subscriberRequest.SubscriptionInfo = id;
        const response = await fetch(`${UrlBase}Home/GetPackageById/${id}`,{method: 'GET',headers: getCommonHeaders(),});
        if (!response.ok) console.log(response.statusText);

        const data = await response.json();
        document.querySelector(".package-name").textContent = data.packageName;
        document.querySelector(".total-amount").textContent = data.fees + " jd";
        subscriptionDuration = data.subscriptionDuration;
    } catch (err) {
        console.error(err);
    }
}

// ============== DATE SELECTION ==============
startDateInput.addEventListener('change', () => {
    if (!startDateInput.value) {
        paymentWrapper.style.display = 'none';
        endDateInput.value = "";
        return;
    }

    paymentWrapper.style.display = 'block';
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(startDate);+
    endDate.setMonth(startDate.getMonth() + subscriptionDuration);
    endDateInput.value = endDate.toISOString().split('T')[0];

    subscriberRequest.SubDate = startDateInput.value;
    subscriberRequest.EndDate = endDateInput.value;

    checkFormValidity();
});

// ============== PAYMENT METHOD ==============
methodVisa.addEventListener('change', togglePaymentMethod);
methodCash.addEventListener('change', togglePaymentMethod);

function togglePaymentMethod() {
    const isCash = methodCash.checked;

    cardInputs.forEach(input => {
        input.disabled = isCash;
        if (isCash) {
            input.style.borderColor = '#e5e7eb';
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        }
    });

    if (isCash)
        { 
        cardPreviewBox.classList.add('disabled');
         subscriberRequest.IsPaid = false;
        }
    else 
        {
         cardPreviewBox.classList.remove('disabled');
         subscriberRequest.IsPaid = true;
        }

    submitBtn.textContent = isCash ? "Confirm Enrollment" : "Complete Enrollment";
    checkFormValidity();
}

// ============== CARD INPUT LISTENERS ==============
document.getElementById('card-name').addEventListener('input', handleNameInput);
document.getElementById('card-number').addEventListener('input', handleNumberInput);
document.getElementById('card-expiry').addEventListener('input', handleExpiryInput);
document.getElementById('card-cvc').addEventListener('input', handleCvcInput);

function handleNameInput(e) {
    e.target.value = e.target.value.replace(/[0-9]/g, '');
    previewName.textContent = e.target.value.toUpperCase() || "FULL NAME";
    validateField(e.target, e.target.value.trim().length >= 5, 'error-name');
}

function handleNumberInput(e) {
    let val = e.target.value.replace(/\D/g, '');
    e.target.value = val.match(/.{1,4}/g)?.join(' ') || "";
    previewNumber.textContent = e.target.value || "•••• •••• •••• ••••";
    validateField(e.target, val.length === 16, 'error-number');
}

function handleExpiryInput(e) {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    e.target.value = val;
    previewExpiry.textContent = val || "MM/YY";

    let isValidDate = false;
    if (val.length === 5) {
        const [m, y] = val.split('/').map(num => parseInt(num));
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = parseInt(now.getFullYear().toString().slice(-2));
        if (m >= 1 && m <= 12) {
            if (y > currentYear || (y === currentYear && m >= currentMonth)) isValidDate = true;
        }
    }
    validateField(e.target, isValidDate, 'error-expiry');
}

function handleCvcInput(e) {
    let val = e.target.value.replace(/\D/g, '');
    e.target.value = val;
    validateField(e.target, val.length === 3, 'error-cvc');
}

// ============== VALIDATION HELPER ==============
function validateField(input, condition, errorId) {
    const errorElement = document.getElementById(errorId);
    if (input.value !== "" && !condition) {
        input.style.borderColor = 'var(--error-color)';
        errorElement.style.display = 'block';
    } else {
        input.style.borderColor = '#e5e7eb';
        errorElement.style.display = 'none';
    }
    checkFormValidity();
}

function checkFormValidity() {
    if (!startDateInput.value) {
        submitBtn.disabled = true;
        return;
    }

    if (methodCash.checked) {
        submitBtn.disabled = false;
        return;
    }

    const isNameValid = document.getElementById('card-name').value.trim().length >= 5;
    const isNumberValid = document.getElementById('card-number').value.replace(/\s/g, '').length === 16;

    const expiryVal = document.getElementById('card-expiry').value;
    let isExpiryValid = false;
    if (expiryVal.length === 5) {
        const [m, y] = expiryVal.split('/').map(num => parseInt(num));
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = parseInt(now.getFullYear().toString().slice(-2));
        if (m >= 1 && m <= 12 && (y > currentYear || (y === currentYear && m >= currentMonth))) isExpiryValid = true;
    }

    const isCvcValid = document.getElementById('card-cvc').value.length === 3;
    submitBtn.disabled = !(isNameValid && isNumberValid && isExpiryValid && isCvcValid);
}

// ============== FORM SUBMISSION ==============
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    submitBtn.textContent = "Processing...";
    submitBtn.disabled = true;

        form.style.display = 'none';
        cardPreviewBox.style.display = 'none';
        document.querySelector('.payment-methods').style.display = 'none';
        document.querySelector('.header p').style.display = 'none';
        document.querySelector('.date-selection').style.display = 'none';
        const error_message = document.querySelector('#Error_Message');

        const Success = await FetchAddSubscribe(subscriberRequest);
        if (!Success) {
            error_message.textContent = "Error While Enrolling, Try Again";
            error_message.style.color = "red";
            submitBtn.textContent = "Confirm Enrollment";
            submitBtn.disabled = false;
            return;
        }
        if (methodCash.checked) {
            document.getElementById('success-text').textContent = "Thank You For Joining FitGym! Step Remain Go To FitGym And Pay The Cash";
             document.getElementById('success-modal').style.display = 'block';
             return;
        }
         error_message.textContent = "";
        document.getElementById('success-modal').style.display = 'block';
});

document.getElementById("Enroll-btn").addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirect");
    window.location.href = redirectUrl ? decodeURIComponent(redirectUrl) : "/Gym-System-Web/Profile/Profile.html";
});


// ============== API FETCH ==============
async function FetchAddSubscribe(subscribeRequest){
    try{
        const response = await apiFetch(`Home/AddSubscriber`,{method: 'POST', body: JSON.stringify(subscribeRequest)});
        if(!response.ok)
        {
            const errorData = await response.json().catch(() => ({}));
      console.log("Server responded with:", response.status, errorData);
            return 0;
        }
        const data = await response.json();
        return data;
}
    catch(err){
     console.error(err);
     return 0;
    }
}