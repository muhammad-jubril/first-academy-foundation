// ============================================================
// Admin dashboard: add / edit / delete gallery photos.
// Mirrors the same pattern used for news posts in admin.js.
// ============================================================

let editingGalleryId = null; // null = "add" mode

// This script tag sits at the end of <body>, so the DOM is
// already fully parsed by the time this line runs.
loadGalleryPhotos();

function escapeHtmlGallery(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

async function loadGalleryPhotos() {
  const list = document.getElementById("gallery-list");
  if (!list) return;

  const { data: photos, error } = await supabaseClient
    .from("gallery_photos")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = '<p class="admin-status error">Could not load gallery photos.</p>';
    console.error(error);
    return;
  }

  if (!photos || photos.length === 0) {
    list.innerHTML = '<p class="admin-note">No gallery photos yet — add your first one above.</p>';
    return;
  }

  window.galleryPhotosCache = photos;

  list.innerHTML = photos.map(function (photo) {
    const badge = photo.is_published
      ? '<span class="admin-badge published">Published</span>'
      : '<span class="admin-badge draft">Draft</span>';
    return (
      '<div class="admin-post-row" data-id="' + photo.id + '">' +
        '<img src="' + photo.image_url + '" alt="">' +
        '<div class="admin-post-info">' +
          '<h3>' + escapeHtmlGallery(photo.caption) + '</h3>' +
          '<p>' + badge + '</p>' +
        '</div>' +
        '<div class="admin-post-actions">' +
          '<button class="admin-icon-btn" title="Edit" onclick="startGalleryEdit(\'' + photo.id + '\')">' + ICON_EDIT + '</button>' +
          '<button class="admin-icon-btn danger" title="Delete" onclick="deleteGalleryPhoto(\'' + photo.id + '\')">' + ICON_DELETE + '</button>' +
        '</div>' +
      '</div>'
    );
  }).join("");
}

window.startGalleryEdit = function (id) {
  const photo = (window.galleryPhotosCache || []).find(function (p) { return p.id === id; });
  if (!photo) return;

  editingGalleryId = id;
  document.getElementById("gallery-form-heading").textContent = "Edit Gallery Photo";
  document.getElementById("gallery-caption").value = photo.caption;
  document.getElementById("gallery-is-published").checked = photo.is_published;
  document.getElementById("gallery-save-btn").textContent = "Update Photo";
  document.getElementById("gallery-cancel-edit").style.display = "inline-flex";
  document.getElementById("gallery-image-hint").style.display = "block";
  document.getElementById("gallery-form").scrollIntoView({ behavior: "smooth", block: "start" });
};

const galleryCancelBtn = document.getElementById("gallery-cancel-edit");
if (galleryCancelBtn) {
  galleryCancelBtn.addEventListener("click", function () {
    resetGalleryForm();
  });
}

function resetGalleryForm() {
  editingGalleryId = null;
  const form = document.getElementById("gallery-form");
  if (form) form.reset();
  document.getElementById("gallery-is-published").checked = true;
  document.getElementById("gallery-form-heading").textContent = "Add a Gallery Photo";
  document.getElementById("gallery-save-btn").textContent = "Save Photo";
  document.getElementById("gallery-cancel-edit").style.display = "none";
  document.getElementById("gallery-image-hint").style.display = "none";
}

window.deleteGalleryPhoto = async function (id) {
  if (!confirm("Delete this photo? This cannot be undone.")) return;
  const { error } = await supabaseClient.from("gallery_photos").delete().eq("id", id);
  if (error) {
    alert("Could not delete photo: " + error.message);
    return;
  }
  loadGalleryPhotos();
};

const galleryForm = document.getElementById("gallery-form");
if (galleryForm) {
  galleryForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const statusEl = document.getElementById("gallery-form-status");
    const saveBtn = document.getElementById("gallery-save-btn");
    statusEl.textContent = "";
    statusEl.className = "admin-status";
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving\u2026";

    try {
      const caption = document.getElementById("gallery-caption").value.trim();
      const isPublished = document.getElementById("gallery-is-published").checked;
      const fileInput = document.getElementById("gallery-image");
      const file = fileInput.files[0];

      if (!editingGalleryId && !file) {
        throw new Error("Please choose a photo to upload.");
      }

      let imageUrl = null;

      if (file) {
        const path = "gallery/" + Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const { error: uploadError } = await supabaseClient
          .storage.from("gallery-photos")
          .upload(path, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseClient
          .storage.from("gallery-photos")
          .getPublicUrl(path);
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = { caption: caption, is_published: isPublished };
      if (imageUrl) payload.image_url = imageUrl;

      let error;
      if (editingGalleryId) {
        ({ error } = await supabaseClient.from("gallery_photos").update(payload).eq("id", editingGalleryId));
      } else {
        ({ error } = await supabaseClient.from("gallery_photos").insert(payload));
      }

      if (error) throw error;

      statusEl.textContent = editingGalleryId ? "Photo updated." : "Photo added.";
      statusEl.classList.add("success");
      resetGalleryForm();
      loadGalleryPhotos();
    } catch (err) {
      statusEl.textContent = "Something went wrong: " + err.message;
      statusEl.classList.add("error");
      console.error(err);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = editingGalleryId ? "Update Photo" : "Save Photo";
    }
  });
}
