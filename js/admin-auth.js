// ============================================================
// Handles the login form on admin-login.html.
// (Session-checking for the dashboard lives in admin.js.)
// ============================================================

(async function () {
  const form = document.getElementById("login-form");
  if (!form) return; // not on the login page

  // If already logged in, skip straight to the dashboard
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    window.location.href = "admin-dashboard.html";
    return;
  }

  const errorEl = document.getElementById("login-error");
  const btn = document.getElementById("login-btn");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorEl.textContent = "";
    btn.textContent = "Signing in\u2026";
    btn.disabled = true;

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      errorEl.textContent = "Incorrect email or password.";
      btn.textContent = "Sign In";
      btn.disabled = false;
      return;
    }

    window.location.href = "admin-dashboard.html";
  });

  // ---------- Forgot password ----------
  const showForgotBtn = document.getElementById("show-forgot");
  const forgotPanel = document.getElementById("forgot-panel");
  const forgotForm = document.getElementById("forgot-form");

  if (showForgotBtn) {
    showForgotBtn.addEventListener("click", function () {
      const isHidden = forgotPanel.style.display === "none";
      forgotPanel.style.display = isHidden ? "block" : "none";
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const errorEl = document.getElementById("forgot-error");
      const successEl = document.getElementById("forgot-success");
      const btn = document.getElementById("forgot-btn");
      errorEl.textContent = "";
      successEl.textContent = "";
      btn.textContent = "Sending\u2026";
      btn.disabled = true;

      const email = document.getElementById("forgot-email").value.trim();
      const resetUrl = window.location.href.replace(/admin-login\.html.*$/, "admin-reset-password.html");

      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });

      btn.textContent = "Send Reset Link";
      btn.disabled = false;

      if (error) {
        errorEl.textContent = "Could not send reset link. Please try again.";
        return;
      }
      successEl.textContent = "Check your email for a reset link.";
      forgotForm.reset();
    });
  }
})();
