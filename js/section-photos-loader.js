// ============================================================
// Loads the Nursery / Primary / Secondary cover photos and
// applies them to every [data-section-photo] image found on
// the current page — used on both academics.html and
// index.html, since Home shows the same 3 photos too.
// Read-only. If it fails for any reason, the existing photo
// already in the HTML just stays as-is (safe fallback).
// ============================================================

(async function () {
  const targets = document.querySelectorAll("[data-section-photo]");
  if (targets.length === 0) return;

  const { data: rows, error } = await supabaseClient
    .from("section_photos")
    .select("*");

  if (error || !rows) {
    console.error("Supabase error loading section_photos:", error);
    return;
  }

  const bySection = {};
  rows.forEach(function (row) { bySection[row.section_key] = row.image_url; });

  targets.forEach(function (img) {
    const key = img.getAttribute("data-section-photo");
    if (bySection[key]) img.src = bySection[key];
  });
})();
