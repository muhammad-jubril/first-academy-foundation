// ============================================================
// Loads published news posts from Supabase and renders them
// into the #news-grid container on news.html.
// This file has no admin powers — it can only ever read posts
// where is_published = true (enforced by the database itself).
// ============================================================

(async function () {
  const grid = document.getElementById("news-grid");
  if (!grid) return;

  const { data: posts, error } = await supabaseClient
    .from("news_posts")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = '<p class="news-placeholder-note">Could not load news right now — please refresh the page.</p>';
    console.error("Supabase error loading news_posts:", error);
    return;
  }

  if (!posts || posts.length === 0) {
    grid.innerHTML = '<p class="news-placeholder-note">No news posted yet — check back soon.</p>';
    return;
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

  // Re-run the site's scroll-reveal so freshly injected cards fade in too
  if (window.IntersectionObserver) {
    const el = grid;
    el.classList.remove("is-visible");
    requestAnimationFrame(function () {
      const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(el);
    });
  }
})();
