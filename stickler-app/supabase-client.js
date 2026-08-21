// supabase-client.js
// Lightweight Supabase REST client — no npm needed, works in plain HTML.

var SUPABASE_URL = 'https://pjqsceuvwswgtzjinlvm.supabase.co';
var SUPABASE_KEY = 'sb_publishable_R_sjrdmjaLBSJ5RUubIkcA_RqjqmfDr';

/**
 * Fetch listings from Supabase for a given city.
 * Returns a promise that resolves to an array of listing objects
 * shaped the same way as the old LISTINGS array in listings.js,
 * so the rest of the code works without changes.
 */
function fetchListingsForCity(cityKey) {
  var url = SUPABASE_URL + '/rest/v1/listings'
    + '?city=eq.' + encodeURIComponent(cityKey)
    + '&is_active=eq.true'
    + '&order=price.asc'
    + '&select=*';

  return fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json'
    }
  })
  .then(function(res) {
    if (!res.ok) throw new Error('Supabase fetch failed: ' + res.status);
    return res.json();
  })
  .then(function(rows) {
    return rows.map(function(r) {
      return {
        city:          r.city,
        lat:           r.lat,
        lng:           r.lng,
        price:         r.price,
        address:       r.address,
        beds:          r.beds,
        baths:         r.baths,
        sqft:          r.sqft,
        photo:         r.photo_url,
        arv:           r.arv,
        gross_margin:  r.gross_margin,
        property_type: r.property_type,
        parking:       r.parking,
        year_built:    r.year_built,
        lot_size:      r.lot_size,
        market_rent:   r.market_rent,
        overview:      r.overview,
        status:        r.status
      };
    });
  });
}