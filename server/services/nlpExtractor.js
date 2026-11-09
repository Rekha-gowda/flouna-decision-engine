/**
 * Mini FLOUNA Food Decision Engine
 * Natural Language Requirement Extractor
 * 
 * Author: G. Rekha (Rekha-gowda)
 * Assignment: FLOUNA 24-Hour Technical Assessment
 * 
 * Extracts structured intent and preferences from free-form natural language.
 * Adheres strictly to the requirement: "Do not invent missing information".
 */

function extractFoodRequirements(queryText) {
  if (!queryText || typeof queryText !== 'string' || queryText.trim() === '') {
    return {
      intent: 'order_food',
      food_item: null,
      cuisines: [],
      dietary_preference: null,
      max_budget: null,
      max_delivery_time: null,
      min_rating: null,
      rating_preference: null,
      location: null,
      explicit_preferences: [],
      raw_query: queryText || ''
    };
  }

  const text = queryText.trim();
  const lower = text.toLowerCase();
  const explicitPreferences = [];

  // 1. Dietary Preference
  let dietaryPreference = null;
  if (/\b(pure veg|strictly veg|vegetarian|veg)\b/i.test(lower) && !/\b(non-veg|non veg)\b/i.test(lower)) {
    dietaryPreference = 'VEG';
    explicitPreferences.push('vegetarian');
  } else if (/\b(non-veg|non veg|chicken|mutton|meat|fish|egg)\b/i.test(lower)) {
    dietaryPreference = 'NON_VEG';
    explicitPreferences.push('non-vegetarian');
  } else if (/\b(vegan)\b/i.test(lower)) {
    dietaryPreference = 'VEGAN';
    explicitPreferences.push('vegan');
  }

  // 2. Budget extraction (under / below / within / sub / <= / max Rs / ₹ / INR)
  let maxBudget = null;
  const budgetRegexes = [
    /(?:under|below|less than|within|sub|budget of|max(?:imum)?)\s*(?:rs\.?|inr|₹)?\s*(\d{2,5})/i,
    /(?:rs\.?|inr|₹)\s*(\d{2,5})\s*(?:budget|or less|max|under)/i,
    /(?:₹|rs\.?|inr)\s*(\d{2,5})/i,
    /(\d{2,5})\s*(?:rs|rupees|bucks)\s*(?:budget|or less|max|under)?/i
  ];

  for (const regex of budgetRegexes) {
    const match = lower.match(regex);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      // Ensure it's a realistic price budget, not a delivery time like 30 minutes
      if (parsed >= 50 && parsed <= 5000) {
        maxBudget = parsed;
        explicitPreferences.push(`budget <= ₹${maxBudget}`);
        break;
      }
    }
  }

  // 3. Delivery Time extraction (within / under X mins / minutes)
  let maxDeliveryTime = null;
  const timeRegexes = [
    /(?:within|in|under|less than|fast delivery within)\s*(\d{1,3})\s*(?:mins?|minutes?)/i,
    /(\d{1,3})\s*(?:mins?|minutes?)\s*(?:delivery|eta|max)?/i
  ];

  for (const regex of timeRegexes) {
    const match = lower.match(regex);
    if (match && match[1]) {
      const parsedTime = parseInt(match[1], 10);
      if (parsedTime >= 5 && parsedTime <= 180) {
        maxDeliveryTime = parsedTime;
        explicitPreferences.push(`delivery <= ${maxDeliveryTime} mins`);
        break;
      }
    }
  }

  // Check for general speed requirement if no specific minutes
  if (!maxDeliveryTime && /\b(quick|fast|asap|fastest|speedy)\b/i.test(lower)) {
    explicitPreferences.push('fast_delivery');
  }

  // 4. Rating Preference (e.g. "highly rated", "rating > 4", "top rated")
  let minRating = null;
  let ratingPreference = null;
  const ratingNumericMatch = lower.match(/(?:rating(?:s)?|stars?)\s*(?:above|over|>=|>|at least)\s*([0-5](?:\.\d)?)/i) ||
                             lower.match(/([0-5](?:\.\d)?)\s*(?:\+|stars?|rating)/i);

  if (ratingNumericMatch && ratingNumericMatch[1]) {
    minRating = parseFloat(ratingNumericMatch[1]);
    ratingPreference = 'NUMERIC_THRESHOLD';
    explicitPreferences.push(`rating >= ${minRating}`);
  } else if (/\b(highly rated|top rated|best rated|great reviews|high rating|good rating)\b/i.test(lower)) {
    minRating = 4.3; // Pragmatic baseline for "highly rated"
    ratingPreference = 'HIGH';
    explicitPreferences.push('highly_rated');
  }

  // 5. Food item / Dish & Cuisines
  const knownDishes = [
    'biryani', 'pizza', 'burger', 'thali', 'pasta', 'dosa', 'paneer', 'roll',
    'sandwich', 'noodles', 'shawarma', 'momos', 'paratha', 'curry'
  ];
  let foodItem = null;
  for (const dish of knownDishes) {
    if (new RegExp(`\\b${dish}\\b`, 'i').test(lower)) {
      foodItem = dish;
      break;
    }
  }

  const knownCuisines = [
    { name: 'Biryani', pattern: /\bbiryani\b/i },
    { name: 'North Indian', pattern: /\b(north indian|thali|paneer|dal makhani|roti)\b/i },
    { name: 'South Indian', pattern: /\b(south indian|dosa|idli|andhra)\b/i },
    { name: 'Italian', pattern: /\b(italian|pizza|pasta)\b/i },
    { name: 'Fast Food', pattern: /\b(burger|fries|fast food)\b/i },
    { name: 'Mughlai', pattern: /\b(mughlai|royal|kebab)\b/i },
    { name: 'Chinese', pattern: /\b(chinese|noodles|fried rice|manchurian)\b/i }
  ];

  const matchedCuisines = [];
  for (const c of knownCuisines) {
    if (c.pattern.test(lower)) {
      matchedCuisines.push(c.name);
    }
  }

  // 6. Location detection (Bangalore key localities)
  const knownLocations = [
    'koramangala', 'indiranagar', 'hsr layout', 'btm layout', 'whitefield',
    'jayanagar', 'jp nagar', 'electronic city', 'bellandur', 'mg road'
  ];
  let location = null;
  for (const loc of knownLocations) {
    if (new RegExp(`\\b${loc}\\b`, 'i').test(lower)) {
      // capitalize nicely
      location = loc.replace(/\b\w/g, char => char.toUpperCase());
      explicitPreferences.push(`location: ${location}`);
      break;
    }
  }

  // Check for discount / offer seekers
  if (/\b(discount|offer|deal|cheap|cheapest|budget friendly|low cost|pocket friendly)\b/i.test(lower)) {
    explicitPreferences.push('value_focused');
  }

  return {
    intent: 'order_food',
    food_item: foodItem,
    cuisines: matchedCuisines,
    dietary_preference: dietaryPreference,
    max_budget: maxBudget,
    max_delivery_time: maxDeliveryTime,
    min_rating: minRating,
    rating_preference: ratingPreference,
    location: location,
    explicit_preferences: explicitPreferences,
    raw_query: text
  };
}

module.exports = {
  extractFoodRequirements
};
