// ============================================================
// Admin dashboard: replace the Nursery / Primary / Secondary
// cover photos. Always exactly 3 rows — this only ever updates
// an existing row, it never inserts or deletes one.
// ============================================================

const SECTION_LABELS = {
  nursery: "Nursery School",
  primary: "Primary School",
  secondary: "Secondary School",
};

async function loadSectionPhotos() {
  const container = document.getElementById("section-photos-list");
  if (!container) return;

  const { data: rows, error } = await supabaseClient
    .from("section_photos")
    .select("*")
    .order("section_key", { ascending: true });

  if (error) {
    container.innerHTML = '<p class="admin-status error">Could not load section photos.</p>';
    console.error(error);
    return;
  }

  if (!rows || rows.length === 0) {
    container.innerHTML = '<p class="admin-note">No section photo rows found. Re-run sql/setup-photos.sql to seed them.</p>';
    return;
  }

  container.innerHTML = rows.map(function (row) {
    const label = SECTION_LABELS[row.section_key] || row.section_key;
    return (
      '<div class="admin-post-row" data-section="' + row.section_key + '">' +
        '<img src="' + row.image_url + '" alt="">' +
        '<div class="admin-post-info" style="flex:1;">' +
          '<h3>' + label + '</h3>' +
          '<input type="file" accept="image/*" id="section-file-' + row.section_key + '" style="margin-top:8px;">' +
        '</div>' +
        '<div class="admin-post-actions">' +
          '<button class="btn" style="padding:10px 18px;font-size:.82rem;" ' +
          'onclick="saveSectionPhoto(\'' + row.section_key + '\')">Save</button>' +
        '</div>' +
      '</div>'
    );
  }).join("");
}

window.saveSectionPhoto = async function (sectionKey) {
  const fileInput = document.getElementById("section-file-" + sectionKey);
  const file = fileInput && fileInput.files[0];

  if (!file) {
    alert("Choose a photo first, then click Save.");
    return;
  }

  const row = fileInput.closest(".admin-post-row");
  const saveBtn = row.querySelector("button");
  const originalText = saveBtn.textContent;
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving\u2026";

  try {
    const path = "sections/" + sectionKey + "-" + Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const { error: uploadError } = await supabaseClient
      .storage.from("gallery-photos")
      .upload(path, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseClient
      .storage.from("gallery-photos")
      .getPublicUrl(path);

    const { error: updateError } = await supabaseClient
      .from("section_photos")
      .update({ image_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() })
      .eq("section_key", sectionKey);

    if (updateError) throw updateError;

    loadSectionPhotos();
  } catch (err) {
    alert("Could not save this photo: " + err.message);
    saveBtn.disabled = false;
    saveBtn.textContent = originalText;
  }
};

// This script tag sits at the end of <body>, so the DOM is
// already fully parsed by the time this line runs.
loadSectionPhotos();
