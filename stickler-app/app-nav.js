// app-nav.js — Shared bottom navigation for Stickler Properties app.
// Include this script on every app page after listings.js.

(function () {
  var NAV_ITEMS = [
    {
      id: "search",
      label: "Search",
      pages: ["marketplace-map.html", "marketplace-list.html"],
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
      href: "marketplace-map.html"
    },
    {
      id: "favorites",
      label: "Favorites",
      pages: ["favorites.html"],
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
      href: "favorites.html"
    },
    {
      id: "offers",
      label: "Offers",
      pages: ["offers.html"],
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M8 21h8M12 17v4"></path><path d="M7 8h10M7 12h6"></path></svg>',
      href: "offers.html"
    },
    {
      id: "messages",
      label: "Messages",
      pages: ["messages.html", "ask.html"],
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5H20V16H8L4 19V5Z"></path></svg>',
      href: "messages.html"
    },
    {
      id: "profile",
      label: "Profile",
      pages: ["account.html", "account-details.html", "my-markets.html", "documents.html"],
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"></path></svg>',
      href: "account.html"
    }
  ];

  var CSS = [
    ".app-nav{display:flex;border-top:1px solid #000;background:#000;flex-shrink:0;}",
    ".app-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 0 28px;background:none;border:none;cursor:pointer;color:#fff;opacity:0.4;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Arial,sans-serif;}",
    ".app-nav-item.is-active{opacity:1;}",
    ".app-nav-item:active{opacity:0.7;}",
    ".app-nav-label{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;}"
  ].join("");

  function currentPage() {
    return window.location.pathname.split("/").pop() || "";
  }

  function buildNavElement() {
    var page = currentPage();
    var nav = document.createElement("nav");
    nav.className = "app-nav";
    NAV_ITEMS.forEach(function (item) {
      var isActive = item.pages.indexOf(page) !== -1;
      var a = document.createElement("a");
      a.className = "app-nav-item" + (isActive ? " is-active" : "");
      a.href = item.href;
      a.innerHTML = item.icon + '<span class="app-nav-label">' + item.label + "</span>";
      nav.appendChild(a);
    });
    return nav;
  }

  function injectStyles() {
    if (document.getElementById("app-nav-styles")) return;
    var style = document.createElement("style");
    style.id = "app-nav-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function injectAppNav() {
    injectStyles();
    var nav = buildNavElement();

    // Option 1: replace the mount point div
    var mount = document.getElementById("appNavMount");
    if (mount) {
      mount.parentNode.replaceChild(nav, mount);
      return;
    }

    // Option 2: insert before the support overlay inside .screen
    var overlay = document.querySelector(".screen .support-overlay");
    if (overlay) {
      overlay.parentNode.insertBefore(nav, overlay);
      return;
    }

    // Option 3: append to .screen as last resort
    var screen = document.querySelector(".screen");
    if (screen) {
      screen.appendChild(nav);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectAppNav);
  } else {
    injectAppNav();
  }

  window.goToMarketplace = function () {
    var view = (typeof getLastMarketplaceView === "function") ? getLastMarketplaceView() : "map";
    window.location.href = view === "list" ? "marketplace-list.html" : "marketplace-map.html";
  };
})();