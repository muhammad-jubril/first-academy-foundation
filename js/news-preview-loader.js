// ============================================================
// Loads the 3 most recent published news posts into
// #news-grid-preview on the Home page. Read-only.
// If it fails or there's no data, the existing static
// fallback cards already in the HTML are left in place.
// ============================================================

(async function () {
  const grid = document.getElementById("news-grid-preview");
  if (!grid) return;

  const { data: posts, error } = await supabaseClient
    .from("news_posts")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Supabase error loading news preview:", error);
    return; // leave the existing static fallback cards in place
  }

  if (!posts || posts.length === 0) {
    return; // leave the existing static fallback cards in place
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  grid.innerHTML = posts.map(function (post) {
    const img = post.image_url
      ? '<img src="' + post.image_url + '" alt="' + escapeHtml(post.title) + '">'
      : '<img src="images/graduation.jpg" alt="' + escapeHtml(post.title) + '">';
    return (
      '<article class="news-card">' +
        img +
        '<div class="news-card-body">' +
          '<span class="news-date">' + escapeHtml(formatDate(post.event_date)) + '</span>' +
          '<h3>' + escapeHtml(post.title) + '</h3>' +
          '<p>' + escapeHtml(post.description) + '</p>' +
        '</div>' +
      '</article>'
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
