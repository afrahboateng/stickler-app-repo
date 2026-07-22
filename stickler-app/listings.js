// Shared listings data + helpers for Stickler Properties marketplace + list view.
// Both marketplace.html and list.html load this file so there's one dataset to update.

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

var LISTINGS = [
  // Atlanta
  { city: "atlanta", lat: 33.7530, lng: -84.3897, price: 365000, address: "142 Ponce De Leon Ave, Atlanta, GA", beds: 3, baths: 2, sqft: 1840, photo: "https://images.unsplash.com/photo-1583437624797-0e3348843acd?fm=jpg&q=80&w=800&fit=crop" },
  { city: "atlanta", lat: 33.7701, lng: -84.3733, price: 185000, address: "908 Highland Ave, Atlanta, GA", beds: 2, baths: 1, sqft: 1120, photo: "https://images.unsplash.com/photo-1710055531207-83174a3e0c30?fm=jpg&q=80&w=800&fit=crop" },
  { city: "atlanta", lat: 33.8034, lng: -84.3733, price: 438000, address: "3311 Brookhaven Trce, Atlanta, GA", beds: 4, baths: 3, sqft: 2260, photo: "https://images.unsplash.com/photo-1564122272812-ef0c0790db4f?fm=jpg&q=80&w=800&fit=crop" },
  { city: "atlanta", lat: 33.6796, lng: -84.4394, price: 228000, address: "775 Sylvan Rd, East Point, GA", beds: 3, baths: 2, sqft: 1510, photo: "https://images.unsplash.com/photo-1631574629960-1958e87c9f4e?fm=jpg&q=80&w=800&fit=crop" },
  { city: "atlanta", lat: 33.7748, lng: -84.2963, price: 298000, address: "512 Commerce Dr, Decatur, GA", beds: 3, baths: 2, sqft: 1690, photo: "https://images.unsplash.com/photo-1616098565649-3b2d5e33234c?fm=jpg&q=80&w=800&fit=crop" },
  { city: "atlanta", lat: 33.7834, lng: -84.2900, price: 351000, address: "220 Sycamore St, Decatur, GA", beds: 4, baths: 2, sqft: 2040, photo: "https://images.unsplash.com/photo-1592239658467-35433cdba25f?fm=jpg&q=80&w=800&fit=crop" },
  { city: "atlanta", lat: 33.9526, lng: -84.5499, price: 204000, address: "88 Whitlock Ave, Marietta, GA", beds: 2, baths: 2, sqft: 1340, photo: "https://images.unsplash.com/photo-1688851164809-8b4f12e672c8?fm=jpg&q=80&w=800&fit=crop" },
  { city: "atlanta", lat: 33.9601, lng: -84.5350, price: 276000, address: "1500 Roswell St, Marietta, GA", beds: 3, baths: 2, sqft: 1780, photo: "https://images.unsplash.com/photo-1744603271618-6597a9d392c9?fm=jpg&q=80&w=800&fit=crop" },
  { city: "atlanta", lat: 33.9304, lng: -84.3733, price: 419000, address: "640 Hammond Dr, Sandy Springs, GA", beds: 3, baths: 2, sqft: 1450, photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?fm=jpg&q=80&w=800&fit=crop" },
  { city: "atlanta", lat: 33.9210, lng: -84.3610, price: 258000, address: "3025 Roswell Rd, Sandy Springs, GA", beds: 3, baths: 2, sqft: 1690, photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?fm=jpg&q=80&w=800&fit=crop" },

  // Augusta
  { city: "augusta", lat: 33.4735, lng: -81.9748, price: 175000, address: "215 Broad St, Augusta, GA", beds: 2, baths: 1, sqft: 1080, photo: "https://images.unsplash.com/photo-1617546127542-eb0dd8bdd52f?fm=jpg&q=80&w=800&fit=crop" },
  { city: "augusta", lat: 33.4900, lng: -82.0100, price: 245000, address: "3402 Wheeler Rd, Augusta, GA", beds: 3, baths: 2, sqft: 1620, photo: "https://images.unsplash.com/photo-1541274387095-12117e6099dc?fm=jpg&q=80&w=800&fit=crop" },
  { city: "augusta", lat: 33.5040, lng: -82.0350, price: 198000, address: "1820 Central Ave, Augusta, GA", beds: 2, baths: 2, sqft: 1290, photo: "https://images.unsplash.com/photo-1592658221410-0f5c3615e7fc?fm=jpg&q=80&w=800&fit=crop" },
  { city: "augusta", lat: 33.5190, lng: -82.0800, price: 312000, address: "4110 Columbia Rd, Martinez, GA", beds: 3, baths: 2, sqft: 1940, photo: "https://images.unsplash.com/photo-1596401508552-72263942db7b?fm=jpg&q=80&w=800&fit=crop" },
  { city: "augusta", lat: 33.5450, lng: -82.1350, price: 289000, address: "780 North Belair Rd, Evans, GA", beds: 3, baths: 2, sqft: 1760, photo: "https://images.unsplash.com/photo-1621001278370-30926cc21cc8?fm=jpg&q=80&w=800&fit=crop" },
  { city: "augusta", lat: 33.4600, lng: -81.9500, price: 165000, address: "512 Laney Walker Blvd, Augusta, GA", beds: 2, baths: 1, sqft: 980, photo: "https://images.unsplash.com/photo-1505901889250-5cd7cd813691?fm=jpg&q=80&w=800&fit=crop" },
  { city: "augusta", lat: 33.4300, lng: -81.9200, price: 229000, address: "2245 Milledgeville Rd, Augusta, GA", beds: 3, baths: 2, sqft: 1540, photo: "https://images.unsplash.com/photo-1551354907-80361e454f5a?fm=jpg&q=80&w=800&fit=crop" }
];

function formatPriceK(price) {
  return "$" + Math.round(price / 1000) + "K";
}

function formatStats(listing) {
  return listing.beds + " bd · " + listing.baths + " ba · " + listing.sqft.toLocaleString() + " sqft";
}

function getListingsForCity(cityKey) {
  return LISTINGS.filter(function(l) { return l.city === cityKey; });
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