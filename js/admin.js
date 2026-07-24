// ============================================================
// Admin dashboard logic: session guard, list/add/edit/delete
// news posts, and photo upload to Supabase Storage.
// ============================================================

let editingPostId = null; // null = "add" mode, otherwise "edit" mode

(async function guardPage() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "admin-login.html";
    return;
  }
  loadPosts();
})();

document.getElementById("logout-btn").addEventListener("click", async function () {
  await supabaseClient.auth.signOut();
  window.location.href = "admin-login.html";
});

async function loadPosts() {
  const list = document.getElementById("post-list");
  const { data: posts, error } = await supabaseClient
    .from("news_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = '<p class="admin-status error">Could not load posts.</p>';
    console.error(error);
    return;
  }

  if (!posts || posts.length === 0) {
    list.innerHTML = '<p class="admin-note">No posts yet — add your first one above.</p>';
    return;
  }

  list.innerHTML = posts.map(function (post) {
    const thumb = post.image_url
      ? '<img src="' + post.image_url + '" alt="">'
      : '<div style="width:64px;height:64px;border-radius:8px;background:var(--surface);flex-shrink:0;"></div>';
    const badge = post.is_published
      ? '<span class="admin-badge published">Published</span>'
      : '<span class="admin-badge draft">Draft</span>';
    return (
      '<div class="admin-post-row" data-id="' + post.id + '">' +
        thumb +
        '<div class="admin-post-info">' +
          '<h3>' + escapeHtml(post.title) + '</h3>' +
          '<p>' + (post.event_date || "No date") + ' &middot; ' + badge + '</p>' +
        '</div>' +
        '<div class="admin-post-actions">' +
          '<button class="admin-icon-btn" title="Edit" onclick="startEdit(\'' + post.id + '\')">' + ICON_EDIT + '</button>' +
          '<button class="admin-icon-btn danger" title="Delete" onclick="deletePost(\'' + post.id + '\')">' + ICON_DELETE + '</button>' +
        '</div>' +
      '</div>'
    );
  }).join("");
}

const ICON_EDIT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
const ICON_DELETE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>';

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

let allPostsCache = [];
async function refreshCache() {
  const { data } = await supabaseClient.from("news_posts").select("*");
  allPostsCache = data || [];
}

window.startEdit = async function (id) {
  await refreshCache();
  const post = allPostsCache.find(function (p) { return p.id === id; });
  if (!post) return;

  editingPostId = id;
  document.getElementById("form-heading").textContent = "Edit News Post";
  document.getElementById("title").value = post.title;
  document.getElementById("description").value = post.description;
  document.getElementById("event_date").value = post.event_date || "";
  document.getElementById("is_published").checked = post.is_published;
  document.getElementById("save-btn").textContent = "Update Post";
  document.getElementById("cancel-edit").style.display = "inline-flex";
  window.scrollTo({ top: 0, behavior: "smooth" });
};

document.getElementById("cancel-edit").addEventListener("click", function () {
  resetForm();
});

function resetForm() {
  editingPostId = null;
  document.getElementById("post-form").reset();
  document.getElementById("is_published").checked = true;
  document.getElementById("form-heading").textContent = "Add a News Post";
  document.getElementById("save-btn").textContent = "Save Post";
  document.getElementById("cancel-edit").style.display = "none";
}

window.deletePost = async function (id) {
  if (!confirm("Delete this post? This cannot be undone.")) return;
  const { error } = await supabaseClient.from("news_posts").delete().eq("id", id);
  if (error) {
    alert("Could not delete post: " + error.message);
    return;
  }
  loadPosts();
};

document.getElementById("post-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const statusEl = document.getElementById("form-status");
  const saveBtn = document.getElementById("save-btn");
  statusEl.textContent = "";
  statusEl.className = "admin-status";
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving\u2026";

  try {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const eventDate = document.getElementById("event_date").value || null;
    const isPublished = document.getElementById("is_published").checked;
    const fileInput = document.getElementById("image");
    const file = fileInput.files[0];

    let imageUrl = null;

    if (file) {
      const path = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      const { error: uploadError } = await supabaseClient
        .storage.from("news-photos")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseClient
        .storage.from("news-photos")
        .getPublicUrl(path);
      imageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      title: title,
      description: description,
      event_date: eventDate,
      is_published: isPublished,
    };
    if (imageUrl) payload.image_url = imageUrl;

    let error;
    if (editingPostId) {
      ({ error } = await supabaseClient.from("news_posts").update(payload).eq("id", editingPostId));
    } else {
      ({ error } = await supabaseClient.from("news_posts").insert(payload));
    }

    if (error) throw error;

    statusEl.textContent = editingPostId ? "Post updated." : "Post added.";
    statusEl.classList.add("success");
    resetForm();
    loadPosts();
  } catch (err) {
    statusEl.textContent = "Something went wrong: " + err.message;
    statusEl.classList.add("error");
    console.error(err);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = editingPostId ? "Update Post" : "Save Post";
  }
});
