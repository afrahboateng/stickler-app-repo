// supabase-client.js
// Lightweight Supabase REST client — no npm needed, works in plain HTML.

var SUPABASE_URL = 'https://pjqsceuvwswgtzjinlvm.supabase.co';
var SUPABASE_KEY = 'sb_publishable_R_sjrdmjaLBSJ5RUubIkcA_RqjqmfDr';

/**
 * Fetch listings + joined agent data from Supabase for a given city.
 * Uses PostgREST resource embedding to join agents via current_agent_id.
 */
function fetchListingsForCity(cityKey) {
  var url = SUPABASE_URL + '/rest/v1/listings'
    + '?city=eq.' + encodeURIComponent(cityKey)
    + '&is_active=eq.true'
    + '&order=price.asc'
    + '&select=*,agents!current_agent_id(id,first_name,last_name,phone,photo_url,rating,review_count)';

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
      var agent = r.agents || {};
      return {
        city:            r.city,
        lat:             r.lat,
        lng:             r.lng,
        price:           r.price,
        address:         r.address,
        beds:            r.beds,
        baths:           r.baths,
        sqft:            r.sqft,
        photo:           r.photo_url,
        arv:             r.arv,
        gross_margin:    r.gross_margin,
        property_type:   r.property_type,
        parking:         r.parking,
        year_built:      r.year_built,
        lot_size:        r.lot_size,
        market_rent:     r.market_rent,
        overview:        r.overview,
        status:          r.status,
        // Agent fields from joined agents table
        agent_id:        agent.id || r.current_agent_id,
        agent_name:      agent.first_name ? agent.first_name + ' ' + agent.last_name : null,
        agent_phone:     agent.phone,
        agent_photo_url: agent.photo_url,
        agent_rating:    agent.rating,
        agent_reviews:   agent.review_count
      };
    });
  });
}