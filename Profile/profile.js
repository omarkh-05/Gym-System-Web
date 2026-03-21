const btnText = document.getElementById('theme-text');
const btnIcon = document.getElementById('theme-icon');
const body = document.body;

function toggleTheme() {
const isDark = body.hasAttribute('data-theme');

if (isDark) {
    ApplyLightTheme();
} else {
    ApplyDarkTheme();
}
}
function ApplyLightTheme() {
 body.removeAttribute('data-theme');
 btnText.innerText = "الوضع الداكن";
 btnIcon.innerText = "🌙";
 localStorage.setItem('mode', 'light');
}
function ApplyDarkTheme() {
 body.setAttribute('data-theme', 'dark');
 btnText.innerText = "الوضع الفاتح";
 btnIcon.innerText = "☀️";
 localStorage.setItem('mode', 'dark');
}

document.addEventListener("DOMContentLoaded", function () {
const LocalMode = localStorage.getItem('mode');

if (LocalMode) {
    if (LocalMode === 'dark') {
        ApplyDarkTheme();
    } else {
        ApplyLightTheme();
    }
}
});