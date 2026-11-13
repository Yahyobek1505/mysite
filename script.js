// Mavzu (yorug' / qorong'i)
// Bu fayl <head> ichida ulanadi, shuning uchun mavzu sahifa chizilishidan oldin o'rnatiladi
// va sahifa ochilganda "miltillash" bo'lmaydi.

(function () {
  var root = document.documentElement;
  var KEY = "theme";

  function getSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) { /* saqlab bo'lmasa ham ishlayveradi */ }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
  }

  // 1. Avval saqlangan tanlov, bo'lmasa qurilma sozlamasi
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  apply(getSaved() || (systemDark.matches ? "dark" : "light"));

  // 2. Foydalanuvchi o'zi tanlamagan bo'lsa, qurilma sozlamasi o'zgarganda kuzatib boramiz
  systemDark.addEventListener("change", function (e) {
    if (!getSaved()) apply(e.matches ? "dark" : "light");
  });

  // 3. Tugma bosilganda mavzuni almashtiramiz
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    function updateLabel() {
      var dark = root.getAttribute("data-theme") === "dark";
      btn.setAttribute("aria-label", dark ? "Yorug' mavzuga o'tish" : "Qorong'i mavzuga o'tish");
      btn.title = btn.getAttribute("aria-label");
    }

    updateLabel();
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      save(next);
      updateLabel();
    });
  });
})();

// Menyu: telefonda ☰ tugmasi va hozirgi bo'limni belgilash
document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("menu-toggle");
  var links = document.querySelectorAll(".menu a");

  function setOpen(open) {
    header.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Menyuni yopish" : "Menyuni ochish");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("open"));
    });
    // Havola bosilganda, tashqariga bosilganda yoki Esc bosilganda yopiladi
    links.forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Ekranda turgan bo'limning havolasini rangli qilish
  if (!("IntersectionObserver" in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove("active"); });
      var link = byId[entry.target.id];
      if (link) link.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  document.querySelectorAll("section[id]").forEach(function (s) { observer.observe(s); });
});
