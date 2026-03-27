export const UrlBase = "https://professionally-overjocular-chelsie.ngrok-free.dev/api/";

const getCommonHeaders = () => ({
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
});

// ---------------------- Register
export async function registerHelper(regInfoObject) {
  try {
    const response = await fetch(`${UrlBase}Auth/Register`, {
      method: "POST",
      headers: getCommonHeaders(),
      body: JSON.stringify(regInfoObject)
    });

    const data = await response.json();
    if (!response.ok)
      {
         console.log(response.statusText);
        return null;
      }
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// ---------------------- Login
export async function loginHelper(Credentials) {
  try {
    const response = await fetch(`${UrlBase}Auth/Login`, {
      method: "POST",
      headers: getCommonHeaders(),
      credentials: "include",
      body: JSON.stringify(Credentials)
    });

    if (!response.ok) throw new Error("Login failed");

    localStorage.setItem("isLoggedIn", "true");
    return true; // ما عاد في توكن
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// ---------------------- Refresh
export async function refreshAccessToken() {
  try {
    const response = await fetch(`${UrlBase}Auth/Refresh`, {
      method: "POST",
      credentials: "include"
    });

    if (!response.ok) {
     console.log(response.statusText);
     localStorage.removeItem("isLoggedIn");
     return false;
    }

    return true;

  } catch (error) {
    console.error(error.message);
    localStorage.removeItem("isLoggedIn");
    return false;
  }
}

// ---------------------- Check Auth
export async function checkAuth() {
  try {
   // const res = await fetch(`${UrlBase}Auth/CheckAuth`, { method: "GET", credentials: "include"});

   // if (!res || !res.ok) {  
   //   showGuestUI();  // لو مش مصادق
   //   return false;
   // }

   const IsLoggedIn = localStorage.getItem("isLoggedIn");
   if (!IsLoggedIn) {
    showGuestUI();
    localStorage.removeItem("isLoggedIn"); // تأكيد المسح
    return false;
   }
    // مصادق
    showUserUI();
    return true;

  } catch (err) {
    showGuestUI();
    console.error(err);
    localStorage.removeItem("isLoggedIn");
    return false;
  }
}
function showUserUI() {
    const btnLoginHerolink = document.getElementById("btnLoginHero-link");
    const btnLoginHeaderlink = document.getElementById("btnLoginHeader-link");
    
    if (btnLoginHerolink && btnLoginHeaderlink) {
      btnLoginHerolink.href = "Profile/profile.html"; 
      btnLoginHerolink.textContent = "My Profile";
      btnLoginHeaderlink.href = "Profile/profile.html"; 
      btnLoginHeaderlink.textContent = "My Profile";
    }
}
export function showGuestUI() {
   const btnLoginHerolink = document.getElementById("btnLoginHero-link");
  const btnLoginHeaderlink = document.getElementById("btnLoginHeader-link");
    
    if (btnLoginHerolink && btnLoginHeaderlink) {
      btnLoginHerolink.href = "Join%20Gym%20Page/JoiningToGym.html"; 
      btnLoginHerolink.textContent = "Join Now";
      btnLoginHeaderlink.href = "Join%20Gym%20Page/JoiningToGym.html"; 
      btnLoginHeaderlink.textContent = "Join Now";
    }
}


// ---------------------- Logout
export async function Logout() {
  try {
   const res = await apiFetch("Auth/Logout", { method: "POST" });
   if (!res || !res.ok)
    {
      console.log(res.statusText);
      return;
    }
   forceLogout();
    return;
  } catch (err) {
    console.error("Logout request failed", err);
    return;
  }
}

// ---------------------- API wrapper
export async function apiFetch(url, options = {}) {
  try {
    options.headers = { ...getCommonHeaders(), ...options.headers };
    options.credentials = "include";

    let response = await fetch(`${UrlBase}${url}`, options);

    if (response.status === 401 && !url.includes("Auth/Refresh")) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) { forceLogout(); return response; }

      response = await fetch(`${UrlBase}${url}`, options);
    }

    return response;

  } catch (ex) {
    console.error(ex);
    return null;
  }
}

// ---------------------- Force Logout
function forceLogout() {
  localStorage.removeItem("isLoggedIn");
  const isSubPage = window.location.pathname.includes("/html/");
  window.location.href = isSubPage ? "../index.html" : "../index.html";
}