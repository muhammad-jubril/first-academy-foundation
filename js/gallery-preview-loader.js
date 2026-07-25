// ============================================================
// Loads the 3 most recent published gallery photos into
// #gallery-grid-preview on the Home page. Read-only.
// ============================================================

(async function () {
  const grid = document.getElementById("gallery-grid-preview");
  if (!grid) return;

  const { data: photos, error } = await supabaseClient
    .from("gallery_photos")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Supabase error loading gallery preview:", error);
    return; // leave the existing static fallback photos in place
  }

  if (!photos || photos.length === 0) {
    return; // leave the existing static fallback photos in place
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  grid.innerHTML = photos.map(function (photo) {
    const caption = escapeAttr(photo.caption);
    const url = escapeAttr(photo.image_url);
    return (
      '<button class="gallery-item" data-full="' + url + '" data-caption="' + caption + '">' +
        '<img src="' + url + '" alt="' + caption + '">' +
        '<span class="gallery-caption">' + escapeHtml(photo.caption) + '</span>' +
      '</button>'
    );
  }).join("");

  if (window.IntersectionObserver) {
    requestAnimationFrame(function () {
      const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(grid);
    });
  }
})();
