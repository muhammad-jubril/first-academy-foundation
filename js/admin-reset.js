// ============================================================
// Handles the "set new password" step after clicking the
// reset link from the forgot-password email.
// ============================================================

(async function () {
  const form = document.getElementById("reset-form");
  const errorEl = document.getElementById("reset-error");
  const subEl = document.getElementById("reset-sub");
  const btn = document.getElementById("reset-btn");

  // Supabase automatically reads the recovery token from the URL
  // and creates a temporary session for this page. Give it a moment,
  // then confirm we actually have one before allowing a password change.
  let hasRecoverySession = false;

  supabaseClient.auth.onAuthStateChange(function (event) {
    if (event === "PASSWORD_RECOVERY") hasRecoverySession = true;
  });

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) hasRecoverySession = true;

  if (!hasRecoverySession) {
    subEl.textContent = "This reset link is invalid or has expired.";
    form.style.display = "none";
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorEl.textContent = "";

    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      errorEl.textContent = "Passwords do not match.";
      return;
    }

    btn.textContent = "Updating\u2026";
    btn.disabled = true;

    const { error } = await supabaseClient.auth.updateUser({ password: newPassword });

    btn.textContent = "Update Password";
    btn.disabled = false;

    if (error) {
      errorEl.textContent = "Could not update password. Please request a new reset link.";
      return;
    }

    window.location.href = "admin-dashboard.html";
  });
})();
