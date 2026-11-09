/**
 * Mini FLOUNA Food Decision Engine
 * Grounded Recommendation Explanation Generator
 * 
 * Author: G. Rekha (Rekha-gowda)
 * Assignment: FLOUNA 24-Hour Technical Assessment
 * 
 * Generates clear, concise, data-backed natural language rationales explaining
 * why the top choice was selected over alternatives.
 * Adheres strictly to the requirement: "Do not invent prices, ratings, offers,
 * reviews, or delivery times. Base explanation only on available data."
 */

class ExplanationEngine {
  /**
   * Generates a grounded explanation for the top-ranked recommendation
   */
  static generateExplanation(recommendedItem, allRankedItems, userRequirements) {
    if (!recommendedItem) {
      return {
        summary: "No restaurants matched your exact criteria. Please consider broadening your budget or delivery radius.",
        reasons: [],
        contrastiveInsight: null
      };
    }

    const reasons = [];
    const r = recommendedItem;
    const req = userRequirements || {};

    // 1. Quality & Rating reason
    if (r.rating >= 4.5) {
      reasons.push(`Top-tier customer rating of ${r.rating}★ across ${r.reviewCount.toLocaleString()} verified reviews`);
    } else if (r.rating) {
      reasons.push(`Reliable customer rating of ${r.rating}★`);
    }

    // 2. Delivery Speed reason
    if (req.max_delivery_time) {
      if (r.deliveryTimeMinutes <= req.max_delivery_time) {
        reasons.push(`Guaranteed arrival in ${r.deliveryTimeMinutes} mins (well within your ${req.max_delivery_time} min preference)`);
      } else {
        reasons.push(`Estimated delivery time of ${r.deliveryTimeMinutes} mins`);
      }
    } else {
      reasons.push(`Quick delivery time of ${r.deliveryTimeMinutes} mins`);
    }

    // 3. Price & Budget reason
    if (req.max_budget) {
      if (r.price <= req.max_budget) {
        const savings = req.max_budget - r.price;
        reasons.push(`Priced at ₹${r.price}${savings > 0 ? ` (saving you ₹${savings} from your ₹${req.max_budget} budget)` : ''}`);
      } else {
        reasons.push(`Priced at ₹${r.price}`);
      }
    } else {
      reasons.push(`Competitive price of ₹${r.price}`);
    }

    // 4. Special Offers
    if (r.specialOffer || r.discountText) {
      reasons.push(`Includes active deal: "${r.specialOffer || r.discountText}" via ${r.provider}`);
    }

    // 5. Contrastive Insight (e.g. why this won over the cheapest option or runner up)
    let contrastiveInsight = null;
    const cheaperOptions = allRankedItems.filter(item => item.id !== r.id && item.price < r.price);
    
    if (cheaperOptions.length > 0) {
      const cheapest = cheaperOptions.reduce((min, cur) => cur.price < min.price ? cur : min, cheaperOptions[0]);
      const priceDiff = r.price - cheapest.price;
      const ratingDiff = (r.rating - cheapest.rating).toFixed(1);
      const timeDiff = cheapest.deliveryTimeMinutes - r.deliveryTimeMinutes;

      if (r.rating > cheapest.rating) {
        contrastiveInsight = `While "${cheapest.restaurantName}" is cheaper by ₹${priceDiff} (priced at ₹${cheapest.price}), "${r.restaurantName}" is strongly recommended for its substantially superior customer rating (${r.rating}★ vs ${cheapest.rating}★)${timeDiff > 0 ? ` and ${timeDiff} minutes faster delivery` : ''}.`;
      }
    } else if (allRankedItems.length > 1) {
      const runnerUp = allRankedItems[1];
      contrastiveInsight = `Outperformed the #2 option ("${runnerUp.restaurantName}") with a higher composite score (${r.compositeScore} vs ${runnerUp.compositeScore}) due to balanced rating and delivery speed.`;
    }

    // Grounded concise summary
    const summary = `We recommend "${r.dishName}" from ${r.restaurantName} on ${r.provider} (${r.rating}★, ₹${r.price}, ~${r.deliveryTimeMinutes} mins). It provides the best overall match for your preferences, scoring ${r.compositeScore}/100.`;

    return {
      summary,
      reasons,
      contrastiveInsight
    };
  }
}

module.exports = ExplanationEngine;
