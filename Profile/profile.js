import { apiFetch, Logout } from "../Auth/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const localMode = localStorage.getItem('mode');

    if (localMode) {
        if (localMode === 'dark') {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    }
    
    const profile = await loadSubscriberProfile();
    if (!profile) return;

    fillPersonInfo(profile);
    fillAttendance(profile.Attendance || []);
    fillSubscriberInfo(profile);
});
const getCommonHeaders = () => ({
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
});

// ------------- Helpers
async function loadSubscriberProfile() {
    try {
        const res = await apiFetch("Home/GetSubsProfile", {method: 'GET',headers: getCommonHeaders(),});
        if (!res || !res.ok) throw new Error("Failed to load profile");
        return await res.json();
    } catch (err) {
        console.error(err);
        // alert("Error loading data");
        return null;
    }
}

function fillPersonInfo(profile) {
    const container = document.getElementById("person-info");
    container.innerHTML = "";

    const subscriberId = profile.subscriberID === 0 ? "-" : profile.subscriberID;
    const fields = [
        { label: "Player Name", value: profile.name },
        { label: "Subscriber ID", value: subscriberId},
        { label: "Date of Birth", value: profile.dateOfBirth.split("T")[0] },
        { label: "Gender", value: profile.gendor },
        { label: "National ID", value: profile.nationalityNumber },
        { label: "Phone Number", value: profile.phoneNumber }
    ];

    fields.forEach(f => {
        const div = document.createElement("div");
        div.classList.add("info-item");
        div.innerHTML = `<span class="info-label">${f.label}</span><span class="info-value">${f.value}</span>`;
        container.appendChild(div);
    });
}

function fillAttendance(attendanceList) {
    const tbody = document.getElementById("attendance-table-body");
    tbody.innerHTML = "";

    if (!attendanceList.length) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="4">No attendance</td>`;
        tbody.appendChild(tr);
        return;
    }

    attendanceList.forEach(a => {
        const tr = document.createElement("tr");
        const checkin = a.CheckinTime ? new Date(a.CheckinTime).toLocaleTimeString("en-US") : "-";
        const checkout = a.CheckoutTime ? new Date(a.CheckoutTime).toLocaleTimeString("en-US") : "-";
        const statusClass = a.Status === "Present" ? "status-pill present" : a.Status === "Absent" ? "status-pill absent" : "status-pill no-presence";

        tr.innerHTML = `
            <td>${a.CheckinTime ? new Date(a.CheckinTime).toLocaleDateString("en-US") : "-"}</td>
            <td class="badge-entry">${checkin}</td>
            <td class="badge-exit">${checkout}</td>
            <td><span class="${statusClass}">${a.Status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function fillSubscriberInfo(profile) {
    const planTypeEl = document.querySelector(".plan-card .plan-type");
    const planDurationEl = document.querySelector(".plan-card .plan-duration");
    const container = document.getElementById("subscriber-info");

    container.innerHTML = "";

    if (profile.subscriberID === 0) {
        planTypeEl.innerText = "Not Subscribed";
        planDurationEl.innerText = "";
        container.innerHTML = `<div style="padding:8px;">This person is not currently subscribed</div>`;
        return;
    }

    planTypeEl.innerText = profile.packageName || "-";
    planDurationEl.innerText = profile.subscriptionDuration ? `Duration: ${profile.subscriptionDuration} months` : "-";

    // حدد كلاس الحالة
    const statusClass = profile.isActive ? "status-pill present" : "status-pill absent";
    const statusText = profile.isActive ? "Active" : "Inactive";

    let daysLeft = "-";
    if (profile.endSubDate) {
        const today = new Date();
        const endDate = new Date(profile.endSubDate);
        const diffTime = endDate - today; // الفرق بالميلي ثانية
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // تحويل لأيام
        if (daysLeft < 0) daysLeft = 0; // إذا انتهى الاشتراك
    }   

    const fields = [
        { label: "Department", value: profile.departmentName || "-" },
        { label: "Start Date", value: profile.subDate ? new Date(profile.subDate).toLocaleDateString("en-US") : "-" },
        { label: "Days Left", value: daysLeft },
        { label: "End Date", value: profile.endSubDate ? new Date(profile.endSubDate).toLocaleDateString("en-US") : "-" },
        { label: "Status", value: `<span class="${statusClass}">${statusText}</span>` }
    ];

    fields.forEach(f => {
        const div = document.createElement("div");
        div.classList.add("plan-row");
        div.innerHTML = `<span class="info-label">${f.label}</span><span class="info-value">${f.value}</span>`;
        container.appendChild(div);
    });
}

// Theme toggle
const btnText = document.getElementById('theme-text');
const btnIcon = document.getElementById('theme-icon');
const body = document.body;

function toggleTheme() {
    const isDark = body.hasAttribute('data-theme');
    if (isDark) {
        applyLightTheme();
    } else {
        applyDarkTheme();
    }
}

document.getElementById('theme-btn').addEventListener('click', () => toggleTheme());

function applyLightTheme() {
    body.removeAttribute('data-theme');
    if (btnText) btnText.innerText = "Dark Mode";
    if (btnIcon) btnIcon.innerText = "🌙";
    localStorage.setItem('mode', 'light');
}

function applyDarkTheme() {
    body.setAttribute('data-theme', 'dark');
    if (btnText) btnText.innerText = "Light Mode";
    if (btnIcon) btnIcon.innerText = "☀️";
    localStorage.setItem('mode', 'dark');
}

// Upgrade plan button
const upgradePlanBtn = document.getElementById("upgradePlanbtn");

if (upgradePlanBtn) {
    upgradePlanBtn.addEventListener("click", () => {
        const currentUrl = window.location.pathname + window.location.search;
        const targetUrl = `../Subs%20Packages/Subscriptionpackages.html?redirect=${encodeURIComponent(currentUrl)}`;
        window.location.href = targetUrl;
    });
}

document.getElementById("signOutbtn").addEventListener("click", async () => {
   await Logout();
});