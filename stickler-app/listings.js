// Shared helpers for Stickler Properties marketplace + list view.
// Listing data is fetched from Supabase via supabase-client.js.

var CITIES = {
  atlanta: { label: "Atlanta, GA", lat: 33.7490, lng: -84.3880, zoom: 9 },
  augusta: { label: "Augusta, GA", lat: 33.4735, lng: -81.9748, zoom: 12 },
  dallas:  { label: "Dallas, TX",  lat: 32.8000, lng: -96.7800, zoom: 11 }
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
    return '<img src="' + src + '" class="' + imgClass + '" alt="' + alt + '">';
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
  var total = track.children.length;
  var slideWidth = track.firstElementChild ? track.firstElementChild.offsetWidth : track.clientWidth;
  var idx = Math.round(track.scrollLeft / slideWidth) + 1;
  idx = Math.max(1, Math.min(idx, total));
  var counter = track.parentElement.querySelector('.carousel-count');
  if (counter) counter.textContent = idx + ' / ' + total;
}, true);

// --- City search dropdown ---
// Turns a search box into a picker: typing filters our cities,
// and you can only pick one from the list.
function setupCitySearch(input, getCurrentCity, onSelect) {
  injectCitySearchStyles();

  var wrap = input.parentElement; // the .search-bar box
  wrap.style.position = 'relative';
  var menu = document.createElement('div');
  menu.className = 'city-dropdown';
  wrap.appendChild(menu);

  // Start with every known city, then narrow to the ones that
  // actually have listings once Supabase answers.
  var available = Object.keys(CITIES);
  if (typeof fetchActiveCityKeys === 'function') {
    fetchActiveCityKeys().then(function(keys) {
      if (keys.length) available = keys;
    }).catch(function(err) {
      console.error(err); // keep showing all cities if this fails
    });
  }

  var matches = [];
  var activeIdx = 0;

  input.value = CITIES[getCurrentCity()].label;
  input.setAttribute('autocomplete', 'off');

  function filter(query) {
    var q = query.trim().toLowerCase();
    return available.filter(function(key) {
      return !q || CITIES[key].label.toLowerCase().indexOf(q) !== -1;
    });
  }

  function draw() {
    if (!matches.length) {
      var all = available.map(function(k) { return CITIES[k].label; }).join(', ');
      menu.innerHTML = '<div class="city-option is-empty">No match. We currently serve ' + all + '.</div>';
    } else {
      menu.innerHTML = matches.map(function(key, i) {
        return '<div class="city-option' + (i === activeIdx ? ' is-active' : '') +
               '" data-key="' + key + '">' + CITIES[key].label + '</div>';
      }).join('');
    }
    menu.classList.add('is-open');
  }

  function choose(key) {
    menu.classList.remove('is-open');
    if (key !== getCurrentCity()) onSelect(key);
    input.blur();
  }

  // Clicking the box shows every available city
  input.addEventListener('focus', function() {
    input.select();
    matches = filter('');
    activeIdx = 0;
    draw();
  });

  // Typing narrows the list
  input.addEventListener('input', function() {
    matches = filter(input.value);
    activeIdx = 0;
    draw();
  });

  // Arrow keys move the highlight, Enter picks it, Escape cancels
  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, matches.length - 1);
      draw();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      draw();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (matches.length) choose(matches[activeIdx]);
    } else if (e.key === 'Escape') {
      input.blur();
    }
  });

  // Clicking a city picks it
  menu.addEventListener('mousedown', function(e) {
    var opt = e.target.closest('.city-option[data-key]');
    if (!opt) return;
    e.preventDefault();
    choose(opt.getAttribute('data-key'));
  });

  // Leaving the box without picking puts the current city back
  input.addEventListener('blur', function() {
    menu.classList.remove('is-open');
    input.value = CITIES[getCurrentCity()].label;
  });
}

// Dropdown styles live here so both marketplace pages share them.
function injectCitySearchStyles() {
  if (document.getElementById('city-search-styles')) return;
  var s = document.createElement('style');
  s.id = 'city-search-styles';
  s.textContent =
    '.city-dropdown { display: none; position: absolute; top: calc(100% + 6px); left: 0; right: 0;' +
    '  background: #FFFFFF; border: 1px solid #000000; border-radius: 10px;' +
    '  box-shadow: 0 6px 20px rgba(0,0,0,0.12); z-index: 1000; overflow: hidden; }' +
    '.city-dropdown.is-open { display: block; }' +
    '.city-option { padding: 12px 14px; font-size: 14px; color: #000000; cursor: pointer;' +
    '  border-bottom: 1px solid rgba(0,0,0,0.08); }' +
    '.city-option:last-child { border-bottom: none; }' +
    '.city-option:hover, .city-option.is-active { background: rgba(0,0,0,0.05); }' +
    '.city-option.is-empty { color: rgba(0,0,0,0.5); font-size: 13px; cursor: default; }';
  document.head.appendChild(s);
}