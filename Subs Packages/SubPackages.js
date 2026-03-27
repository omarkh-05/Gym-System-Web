import { UrlBase , apiFetch } from "../Auth/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await FillPackagesInfo();
        const IsLoggedIn = localStorage.getItem("isLoggedIn");
    if (IsLoggedIn){
        const AuthUser = await FetchUserFrofile();
        if (AuthUser) {
            restrictPackages(AuthUser.packageName);
        }
       } else {
            const buttons = document.querySelectorAll(".card a");
            buttons.forEach(btn => btn.style.display = "none");
        }
        attachCardListeners();
        const LocalMode = localStorage.getItem('mode');
        if (LocalMode) {
            if (LocalMode === 'dark') ApplyDarkTheme();
            else ApplyLightTheme();
        }
    } catch (error) {
        console.error("Error initializing page:", error);
    }
});

const body = document.body;
const btnText = document.getElementById('theme-text');
const btnIcon = document.getElementById('theme-icon');
const themeBtn = document.getElementById('theme-btn');

themeBtn.addEventListener('click', () => toggleTheme());
function toggleTheme() {
    if (body.classList.contains('dark')) {
        ApplyLightTheme();
    } else {
        ApplyDarkTheme();
    }
}
function ApplyLightTheme() {
    body.classList.remove('dark');
    btnText.innerText = "Dark Mode";
    btnIcon.innerText = "🌙";
    localStorage.setItem('mode', 'light');
}
function ApplyDarkTheme() {
    body.classList.add('dark');
    btnText.innerText = "Light Mode";
    btnIcon.innerText = "☀️";
    localStorage.setItem('mode', 'dark');
}

// ============== HELPER ==============
async function FillPackagesInfo() {
    try {
        const packages = await FetchGymPackages();
        populateCards(packages);
    } catch (error) {
        console.error("Error loading packages:", error);
    }
}
function populateCards(data) {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        if (!data[index]) return; // لو ما فيه بيانات كافية

        const pkg = data[index];
        const title = card.querySelector("h3");
        const price = card.querySelector("h1");

        title.textContent = pkg.packageName;
        price.innerHTML = `${pkg.fees} jd <span>/${getDurationText(pkg.subscriptionDuration)}</span>`;

        card.setAttribute("data-id", pkg.subTimeID);
        card.setAttribute("data-fees", pkg.fees);
    });
}
function getDurationText(duration) {
    switch (duration) {
        case 1: return "1 Month";
        case 3: return "3 Month";
        case 6: return "6 Month";
        case 12: return "1 Year";
        default: return duration + " Month";
    }
}
 async function restrictPackages(userPackageName) {
    const cards = document.querySelectorAll(".card");

        const packageFeesForSubscriber = await GetPackageFeesFromSubscriber(userPackageName);
        console.log(packageFeesForSubscriber);

    cards.forEach(card => {
        const packageFeesForCard = parseFloat(card.getAttribute("data-fees"));

        if (packageFeesForCard <= packageFeesForSubscriber) {
            const button = card.querySelector("a");
            if (button) 
                button.style.display = "none"
        }
    });
}
// تحويل النص الموجود في <span> إلى رقم شهور
async function GetPackageFeesFromSubscriber(userPackageName) {
    const packageFees = await FetchGymPackageByPackageName(userPackageName);
    return parseFloat(packageFees);
}
function attachCardListeners() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const button = card.querySelector("a");
        if (!button) return;
        button.addEventListener("click", (event) => {
            event.preventDefault(); // لمنع الرابط الافتراضي
            const id = card.getAttribute("data-id");
            window.location.href = `../Payment/Payment.html?id=${id}&=redirect=${encodeURIComponent("../Profile/Profile.html")}`;
        });
    });
}

// ============== API FETCH HELPER ==============
async function FetchGymPackages() {
    try
    {
    const response = await fetch(`${UrlBase}Home/GetGymSubPackages`);
    if (!response.ok) throw new Error("Failed to fetch packages");
    const data = await response.json();
    return data;
    }catch(err)
    {
        console.log(err);
        return [];
    }
}
async function FetchUserFrofile() {
    try
    {
    const response = await apiFetch(`Home/GetSubsProfile`,{method: "GET"});
    if (!response.ok) throw new Error("Failed to fetch Profile");
    const data = await response.json();
    return data;
    }catch(err)
    {
        console.log(err);
        return null;
    }
}
async function FetchGymPackageByPackageName(packageName) {
    try
    {
        const response = await fetch(`${UrlBase}Home/GetPackageByPackageName/${packageName}`);
        if (!response.ok)
            {
              console.log(response.statusText);
              return null;
            }
            const data = await response.json();
            return data;
    }catch(err)
    {
        console.log(err);
        return null;
    }
}