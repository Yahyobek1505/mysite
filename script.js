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
