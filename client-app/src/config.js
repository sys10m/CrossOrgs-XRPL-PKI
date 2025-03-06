import themes from "daisyui/src/theming/themes";

const config = {
  // REQUIRED
  appName: "Key",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Key Dashboard for CA",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "app.revents.club", // tester email - "sandboxd0250427ffc847a6bb22eaa6e7555bd0.mailgun.org",
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
};

export default config;
