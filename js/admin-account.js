// ============================================================
// Handles the "Account Settings" panel on admin-dashboard.html:
// showing the current email, and letting the admin change
// their own email or password.
// (This file assumes admin.js has already confirmed a valid
// session exists before the page reaches this point.)
// ============================================================

(async function () {
  const emailForm = document.getElementById("email-form");
  const passwordForm = document.getElementById("password-form");
  if (!emailForm && !passwordForm) return;

  const { data: { user } } = await supabaseClient.auth.getUser();
  const currentEmailEl = document.getElementById("current-email");
  if (currentEmailEl && user) currentEmailEl.textContent = user.email;

  if (emailForm) {
    emailForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const statusEl = document.getElementById("email-status");
      const btn = document.getElementById("email-btn");
      statusEl.textContent = "";
      statusEl.className = "admin-status";
      btn.disabled = true;
      btn.textContent = "Updating\u2026";

      const newEmail = document.getElementById("new-email").value.trim();

      const { error } = await supabaseClient.auth.updateUser({ email: newEmail });

      btn.disabled = false;
      btn.textContent = "Update Email";

      if (error) {
        statusEl.textContent = "Could not update email: " + error.message;
        statusEl.classList.add("error");
        return;
      }

      statusEl.textContent = "Check both your old and new email inboxes to confirm the change.";
      statusEl.classList.add("success");
      emailForm.reset();
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const statusEl = document.getElementById("password-status");
      const btn = document.getElementById("password-btn");
      statusEl.textContent = "";
      statusEl.className = "admin-status";

      const newPassword = document.getElementById("new-account-password").value;
      const confirmPassword = document.getElementById("confirm-account-password").value;

      if (newPassword !== confirmPassword) {
        statusEl.textContent = "Passwords do not match.";
        statusEl.classList.add("error");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Updating\u2026";

      const { error } = await supabaseClient.auth.updateUser({ password: newPassword });

      btn.disabled = false;
      btn.textContent = "Update Password";

      if (error) {
        statusEl.textContent = "Could not update password: " + error.message;
        statusEl.classList.add("error");
        return;
      }

      statusEl.textContent = "Password updated.";
      statusEl.classList.add("success");
      passwordForm.reset();
    });
  }
})();
