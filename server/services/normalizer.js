/**
 * Mini FLOUNA Food Decision Engine
 * Multi-Provider Schema Normalization Layer
 * 
 * Author: G. Rekha (Rekha-gowda)
 * Assignment: FLOUNA 24-Hour Technical Assessment
 * 
 * Ingests divergent payloads from Provider A (ZestyBites), Provider B (QuickFeast),
 * and Provider C (UrbanKitchen), transforming them into a unified canonical schema
 * while preserving provider provenance and handling missing/corrupt values gracefully.
 */

class NormalizerService {
  /**
   * Normalizes Provider A: ZestyBites (Nested restaurant & menu structure)
   */
  static normalizeZestyBites(rawRestaurants) {
    if (!Array.isArray(rawRestaurants)) return [];
    const normalized = [];

    for (const res of rawRestaurants) {
      if (!res || !res.res_info) continue;
      const resInfo = res.res_info;
      const delivery = res.delivery || {};
      const promo = res.promotions || {};
      const menu = Array.isArray(res.menu) ? res.menu : [];

      for (const item of menu) {
        const missingFields = [];
        const price = typeof item.price === 'number' ? item.price : null;
        if (price === null) missingFields.push('price');

        const rating = (item.item_rating) || (resInfo.rating && resInfo.rating.aggregate_rating) || null;
        if (rating === null) missingFields.push('rating');

        const eta = delivery.eta_mins || null;
        if (eta === null) missingFields.push('delivery_time');

        let discountText = null;
        let effectivePrice = price;
        if (promo && promo.discount_text && price) {
          discountText = promo.discount_text;
          if (promo.discount_percent) {
            const disc = Math.min((price * promo.discount_percent) / 100, 50);
            effectivePrice = Math.max(0, Math.round(price - disc));
          } else if (promo.discount_amount) {
            effectivePrice = Math.max(0, price - promo.discount_amount);
          }
        }

        normalized.push({
          id: `zb_${res.res_id}_${item.item_id}`,
          restaurantName: resInfo.name || 'Unknown Restaurant',
          dishName: item.dish_name || 'House Special',
          category: item.category || 'General',
          provider: 'ZestyBites',
          providerTag: 'ZestyBites API',
          price: effectivePrice || price || 0,
          originalPrice: price,
          discountText: discountText,
          rating: rating !== null ? Number(rating) : 3.5, // sensible default if missing
          rawRating: rating,
          reviewCount: (resInfo.rating && resInfo.rating.votes) || 100,
          deliveryTimeMinutes: eta || 35,
          distanceKm: delivery.distance_km || 3.0,
          isVeg: !!item.is_veg,
          dietTag: item.is_veg ? 'VEG' : 'NON_VEG',
          cuisine: resInfo.cuisines || [item.category || 'Multi-Cuisine'],
          location: resInfo.locality || resInfo.city || 'Bengaluru',
          specialOffer: promo.discount_text || null,
          hasIncompleteData: missingFields.length > 0,
          missingFields: missingFields,
          rawProviderData: item
        });
      }
    }
    return normalized;
  }

  /**
   * Normalizes Provider B: QuickFeast (Flat quick-commerce / Zepto format)
   */
  static normalizeQuickFeast(rawItems) {
    if (!Array.isArray(rawItems)) return [];
    const normalized = [];

    for (const item of rawItems) {
      if (!item) continue;
      const missingFields = [];

      const price = typeof item.cost_inr === 'number' ? item.cost_inr : null;
      if (price === null) missingFields.push('price');

      const rating = typeof item.customer_score === 'number' ? item.customer_score : null;
      if (rating === null) missingFields.push('rating');

      const travelTime = typeof item.travel_time_min === 'number' ? item.travel_time_min : null;
      if (travelTime === null) missingFields.push('delivery_time');

      let discountText = null;
      let effectivePrice = price;
      if (item.active_coupon && item.active_coupon.flat_discount && price) {
        discountText = `₹${item.active_coupon.flat_discount} OFF (${item.active_coupon.code})`;
        effectivePrice = Math.max(0, price - item.active_coupon.flat_discount);
      }

      const isVeg = item.diet_tag === 'VEG';
      const distanceKm = item.distance_meters ? Number((item.distance_meters / 1000).toFixed(1)) : 2.5;

      normalized.push({
        id: `qf_${item.sku_id}`,
        restaurantName: item.store_name || 'QuickFeast Partner',
        dishName: item.item_title || 'Selected Item',
        category: item.food_category || 'General',
        provider: 'QuickFeast',
        providerTag: 'QuickFeast Express',
        price: effectivePrice || price || 0,
        originalPrice: price,
        discountText: discountText,
        rating: rating !== null ? Number(rating) : 3.8, // safe fallback with flag
        rawRating: rating,
        reviewCount: item.total_reviews || 50,
        deliveryTimeMinutes: travelTime || 30,
        distanceKm: distanceKm,
        isVeg: isVeg,
        dietTag: isVeg ? 'VEG' : 'NON_VEG',
        cuisine: [item.food_category || 'Fast Food'],
        location: item.branch || 'Bengaluru',
        specialOffer: discountText,
        hasIncompleteData: missingFields.length > 0,
        missingFields: missingFields,
        rawProviderData: item
      });
    }
    return normalized;
  }

  /**
   * Normalizes Provider C: UrbanKitchen Network (ONDC / Cloud kitchen format)
   */
  static normalizeUrbanKitchen(rawListings) {
    if (!Array.isArray(rawListings)) return [];
    const normalized = [];

    for (const listing of rawListings) {
      if (!listing) continue;
      const missingFields = [];
      const itemDetails = listing.item_details || {};
      const pricing = listing.pricing || {};
      const userRating = listing.user_rating || {};

      const price = typeof pricing.amount === 'number' ? pricing.amount : null;
      if (price === null) missingFields.push('price');

      const rating = typeof userRating.stars === 'number' ? userRating.stars : null;
      if (rating === null) missingFields.push('rating');

      const prepTime = typeof listing.prep_and_delivery_time === 'number' ? listing.prep_and_delivery_time : null;
      if (prepTime === null) missingFields.push('delivery_time');

      const isVeg = !!itemDetails.is_pure_vegetarian;

      normalized.push({
        id: `uk_${listing.listing_id}`,
        restaurantName: listing.vendor_title || 'Urban Cloud Kitchen',
        dishName: itemDetails.dish || 'Chef Special',
        category: (itemDetails.cuisine_tags && itemDetails.cuisine_tags[0]) || 'Cloud Specials',
        provider: 'UrbanKitchen',
        providerTag: 'UrbanKitchen (ONDC)',
        price: price || 0,
        originalPrice: price,
        discountText: listing.promotional_deal || null,
        rating: rating !== null ? Number(rating) : 4.0,
        rawRating: rating,
        reviewCount: userRating.count || 200,
        deliveryTimeMinutes: prepTime || 35,
        distanceKm: 2.8,
        isVeg: isVeg,
        dietTag: isVeg ? 'VEG' : 'NON_VEG',
        cuisine: itemDetails.cuisine_tags || ['North Indian'],
        location: listing.area || listing.city || 'Bengaluru',
        specialOffer: listing.promotional_deal || null,
        hasIncompleteData: missingFields.length > 0,
        missingFields: missingFields,
        rawProviderData: listing
      });
    }
    return normalized;
  }
}

module.exports = NormalizerService;
