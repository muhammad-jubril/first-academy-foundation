// ============================================================
// Loads ALL published gallery photos into #gallery-grid on
// gallery.html. Read-only — can never write to the database.
// ============================================================

(async function () {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const { data: photos, error } = await supabaseClient
    .from("gallery_photos")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = '<p class="news-placeholder-note">Could not load the gallery right now — please refresh the page.</p>';
    console.error("Supabase error loading gallery_photos:", error);
    return;
  }

  if (!photos || photos.length === 0) {
    grid.innerHTML = '<p class="news-placeholder-note">No photos yet — check back soon.</p>';
    return;
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

  // Re-run scroll reveal for the freshly injected grid
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
