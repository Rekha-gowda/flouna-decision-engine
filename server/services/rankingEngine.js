/**
 * Mini FLOUNA Food Decision Engine
 * Multi-Criteria Weighted Decision & Ranking Engine
 * 
 * Author: G. Rekha (Rekha-gowda)
 * Assignment: FLOUNA 24-Hour Technical Assessment
 * 
 * Ranks food options using multi-attribute utility theory balancing:
 * 1. Intent Relevance (Dish & Dietary Match)
 * 2. Quality & Trust (Ratings & Review Count)
 * 3. Delivery Speed (SLA & Distance)
 * 4. Value & Affordability (Price, Offers, Budget Compliance)
 * 
 * Crucial Rule: Does NOT naively choose the cheapest option when higher quality
 * and faster delivery yield superior overall utility.
 */

class RankingEngine {
  /**
   * Main ranker function
   */
  static rankOptions(items, userRequirements) {
    if (!Array.isArray(items) || items.length === 0) return [];

    const req = userRequirements || {};
    const scoredItems = [];

    // Determine dynamic weights based on explicitly extracted user preferences
    let wQuality = 0.35;
    let wSpeed = 0.25;
    let wValue = 0.20;
    let wMatch = 0.20;

    if (req.rating_preference === 'HIGH' || (req.explicit_preferences && req.explicit_preferences.includes('highly_rated'))) {
      wQuality = 0.45;
      wValue = 0.15;
    }

    if (req.max_delivery_time && req.max_delivery_time <= 30) {
      wSpeed = 0.35;
      wValue = 0.15;
    }

    if (req.explicit_preferences && req.explicit_preferences.includes('value_focused')) {
      wValue = 0.35;
      wQuality = 0.25;
    }

    // Filter to relevant items if a specific food item was requested and matches exist
    let candidateItems = items;
    if (req.food_item) {
      const foodLower = req.food_item.toLowerCase();
      const relevant = items.filter(item => {
        const dishLower = (item.dishName || '').toLowerCase();
        const catLower = (item.category || '').toLowerCase();
        const cuisineMatch = Array.isArray(item.cuisine) && item.cuisine.some(c => c.toLowerCase().includes(foodLower));
        return dishLower.includes(foodLower) || catLower.includes(foodLower) || cuisineMatch;
      });
      if (relevant.length > 0) {
        candidateItems = relevant;
      }
    }

    for (const item of candidateItems) {
      // 1. Dietary Constraint Hard Filter
      if (req.dietary_preference === 'VEG' && !item.isVeg) {
        // Exclude completely if user strictly wants veg
        continue;
      }
      if (req.dietary_preference === 'NON_VEG' && item.isVeg && req.food_item && /chicken|mutton|meat|fish/i.test(req.raw_query)) {
        continue;
      }

      // 2. Intent & Food Relevance Match Score (0 - 100)
      let matchScore = 70;
      if (req.food_item) {
        const dishLower = item.dishName.toLowerCase();
        const catLower = item.category.toLowerCase();
        const foodLower = req.food_item.toLowerCase();

        if (dishLower.includes(foodLower)) {
          matchScore = 100;
        } else if (catLower.includes(foodLower) || (item.cuisine && item.cuisine.some(c => c.toLowerCase().includes(foodLower)))) {
          matchScore = 85;
        } else {
          matchScore = 40; // low relevance
        }
      }

      // Location match bonus if location specified
      if (req.location) {
        if (item.location && item.location.toLowerCase().includes(req.location.toLowerCase())) {
          matchScore = Math.min(100, matchScore + 10);
        }
      }

      // 3. Quality & Rating Score (0 - 100)
      // Exponential curve rewarding > 4.5 ratings
      const rating = item.rating || 3.5;
      let qualityScore = (rating / 5.0) * 100;
      if (rating >= 4.7) qualityScore = 100;
      else if (rating >= 4.5) qualityScore = 94;
      else if (rating >= 4.0) qualityScore = 82;
      else if (rating >= 3.5) qualityScore = 65;
      else qualityScore = 40;

      // 4. Delivery Speed Score (0 - 100)
      const eta = item.deliveryTimeMinutes || 40;
      let speedScore = 100;
      if (eta <= 20) speedScore = 100;
      else if (eta <= 25) speedScore = 92;
      else if (eta <= 30) speedScore = 84;
      else if (eta <= 40) speedScore = 68;
      else speedScore = Math.max(20, 100 - (eta - 20) * 2.5);

      // Penalty if user specified max_delivery_time and eta exceeds it
      if (req.max_delivery_time && eta > req.max_delivery_time) {
        speedScore = Math.max(10, speedScore - 40);
      }

      // 5. Value & Price Score (0 - 100)
      let valueScore = 70;
      const price = item.price || 250;
      if (req.max_budget) {
        if (price <= req.max_budget) {
          // Affordability ratio within budget
          const savingsRatio = (req.max_budget - price) / req.max_budget;
          valueScore = 75 + Math.min(25, savingsRatio * 30);
        } else {
          // Exceeds budget: penalize proportionally
          const overRatio = (price - req.max_budget) / req.max_budget;
          valueScore = Math.max(10, 60 - overRatio * 100);
        }
      } else {
        // Benchmark against standard food price of ~₹300
        if (price <= 200) valueScore = 95;
        else if (price <= 300) valueScore = 85;
        else if (price <= 450) valueScore = 70;
        else valueScore = 50;
      }

      // Offer / Deal booster (+5)
      if (item.specialOffer || item.discountText) {
        valueScore = Math.min(100, valueScore + 6);
      }

      // Calculate Weighted Composite Score
      const totalScore = (
        qualityScore * wQuality +
        speedScore * wSpeed +
        valueScore * wValue +
        matchScore * wMatch
      );

      scoredItems.push({
        ...item,
        compositeScore: Number(totalScore.toFixed(1)),
        scoreBreakdown: {
          qualityScore: Math.round(qualityScore),
          speedScore: Math.round(speedScore),
          valueScore: Math.round(valueScore),
          matchScore: Math.round(matchScore),
          weightsApplied: {
            quality: wQuality,
            speed: wSpeed,
            value: wValue,
            match: wMatch
          }
        }
      });
    }

    // Sort descending by composite score
    return scoredItems.sort((a, b) => b.compositeScore - a.compositeScore);
  }
}

module.exports = RankingEngine;
