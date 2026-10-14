// Shared helpers for Stickler Properties marketplace + list view.
// Listing data is fetched from Supabase via supabase-client.js.

var CITIES = {
  atlanta: { label: "Atlanta, GA", lat: 33.7490, lng: -84.3880, zoom: 11 },
  augusta: { label: "Augusta, GA", lat: 33.4735, lng: -81.9748, zoom: 12 }
};

// Maps whatever a person types in the search bar to a known city key.
var CITY_ALIASES = {
  "atlanta": "atlanta",
  "atlanta, ga": "atlanta",
  "augusta": "augusta",
  "augusta, ga": "augusta"
};

// Listings data is now served from Supabase. See supabase-client.js.

function formatPriceK(price) {
  return "$" + Math.round(price / 1000) + "K";
}

function formatStats(listing) {
  return listing.beds + " bd · " + listing.baths + " ba · " + listing.sqft.toLocaleString() + " sqft";
}


function resolveCityFromQuery(query) {
  var key = query.trim().toLowerCase();
  return CITY_ALIASES[key] || null;
}

// Reads ?city= from the current URL; falls back to defaultCity if missing/invalid.
function getCityFromURL(defaultCity) {
  var params = new URLSearchParams(window.location.search);
  var c = params.get("city");
  return (c && CITIES[c]) ? c : defaultCity;
}

// Updates the URL's ?city= param without reloading the page.
function setCityInURL(cityKey) {
  var url = new URL(window.location.href);
  url.searchParams.set("city", cityKey);
  window.history.replaceState(null, "", url);
}

// --- Persistence across separate page loads (Account, Support, etc.) ---

function getStoredCity(defaultCity) {
  var stored = localStorage.getItem("stickler_last_city");
  return (stored && CITIES[stored]) ? stored : defaultCity;
}

function setStoredCity(cityKey) {
  localStorage.setItem("stickler_last_city", cityKey);
}

// Figures out which city should be showing right now: a ?city= in the URL wins
// (so links can force a specific city), otherwise falls back to whatever city
// was last selected anywhere in the app, otherwise defaultCity.
function resolveCurrentCity(defaultCity) {
  var params = new URLSearchParams(window.location.search);
  var urlCity = params.get("city");
  if (urlCity && CITIES[urlCity]) {
    setStoredCity(urlCity);
    return urlCity;
  }
  return getStoredCity(defaultCity);
}

// Call this any time the person changes city via search, so both the URL
// and the persisted value stay in sync.
function updateCurrentCity(cityKey) {
  setCityInURL(cityKey);
  setStoredCity(cityKey);
}

// Remembers whether Map or List was the last marketplace view visited.
function getLastMarketplaceView() {
  return localStorage.getItem("stickler_last_view") || "map";
}

function setLastMarketplaceView(view) {
  localStorage.setItem("stickler_last_view", view);
}

// Used by the bottom nav's "Marketplace" tab on every page (Account, Support,
// etc.) to jump back into whichever marketplace view was last open.
function goToMarketplace() {
  var view = getLastMarketplaceView();
  var page = view === "list" ? "marketplace-list.html" : "marketplace-map.html";
  window.location.href = page;
}

// --- Dynamic "Showing Times" dates ---
// Returns the next `count` upcoming Fridays, always strictly after today
// (so if today is Friday, the first result is next week's Friday, not today).
function getNextFridays(count) {
  var results = [];
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  do {
    d.setDate(d.getDate() + 1);
  } while (d.getDay() !== 5);

  for (var i = 0; i < count; i++) {
    results.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return results;
}

function formatShowingDate(date) {
  var options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// --- Reusable "thanks for registering" notice ---
// This same block shows up in a few places (My Markets today, likely more
// later), so the copy lives here once instead of being duplicated per page.
var REGISTRATION_NOTICE_TEXT = "Thanks for registering! A Stickler agent will contact you shortly to set up a quick onboarding call to get you access to our exclusive marketplace. This verification helps maintain our investor-only marketplace's integrity and ensures you're ready to navigate our process so you don't miss out on the best deals. You can also reach out directly at (404) 555-0182.";

function renderRegistrationNotice() {
  return '<div class="registration-notice"><div class="registration-notice-title">Thanks for registering!</div><div class="registration-notice-text">A Stickler agent will contact you shortly to set up a quick onboarding call to get you access to our exclusive marketplace. This verification helps maintain our investor-only marketplace\'s integrity and ensures you\'re ready to navigate our process so you don\'t miss out on the best deals. You can also reach out directly at <strong>(404) 555-0182</strong>.</div></div>';
}

// --- Photo carousel ---
// Builds a swipeable row of photos. With only one photo, it's a plain image.
function renderPhotoCarousel(photos, alt, imgClass) {
  var list = (photos || []).filter(Boolean);
  if (list.length <= 1) {
    return '<img src="' + (list[0] || '') + '" class="' + imgClass + '" alt="' + alt + '">';
  }
  var imgs = list.map(function(src, i) {
    return '<img src="' + src + '" class="' + imgClass + '" alt="' + alt + '"' + (i > 0 ? ' loading="lazy"' : '') + '>';
  }).join('');
  return '<div class="carousel">' +
      '<div class="carousel-track">' + imgs + '</div>' +
      '<button class="carousel-arrow carousel-prev" onclick="carouselStep(event, this, -1)" aria-label="Previous photo">&#8249;</button>' +
      '<button class="carousel-arrow carousel-next" onclick="carouselStep(event, this, 1)" aria-label="Next photo">&#8250;</button>' +
      '<div class="carousel-count">1 / ' + list.length + '</div>' +
    '</div>';
}

// Arrow buttons: slide one photo left or right.
// stopPropagation stops the tap from also opening the listing.
function carouselStep(e, btn, dir) {
  e.stopPropagation();
  var track = btn.parentElement.querySelector('.carousel-track');
  track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' });
}

// Keeps the "2 / 4" counter in sync when someone swipes.
document.addEventListener('scroll', function(e) {
  var track = e.target;
  if (!track.classList || !track.classList.contains('carousel-track')) return;
  var idx = Math.round(track.scrollLeft / track.clientWidth) + 1;
  var counter = track.parentElement.querySelector('.carousel-count');
  if (counter) counter.textContent = idx + ' / ' + track.children.length;
}, true);