/**
 * Mini FLOUNA Food Decision Engine
 * Cross-Provider Deduplication & Price Comparison Engine
 * 
 * Author: G. Rekha (Rekha-gowda)
 * Assignment: FLOUNA 24-Hour Technical Assessment
 * 
 * Identifies duplicate or identical restaurant & dish listings across different providers.
 * Merges redundant items while surfacing cross-platform price comparisons and best deals.
 */

class DeduplicationEngine {
  /**
   * Cleans text for fuzzy token matching
   */
  static cleanString(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculates Jaccard token similarity (0.0 to 1.0)
   */
  static tokenSimilarity(a, b) {
    const tokensA = new Set(this.cleanString(a).split(' ').filter(t => t.length > 2));
    const tokensB = new Set(this.cleanString(b).split(' ').filter(t => t.length > 2));
    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    let intersection = 0;
    for (const t of tokensA) {
      if (tokensB.has(t)) intersection++;
    }
    const union = new Set([...tokensA, ...tokensB]).size;
    return union === 0 ? 0 : intersection / union;
  }

  /**
   * Checks if two items represent the same restaurant & dish across providers
   */
  static isDuplicate(itemA, itemB) {
    if (itemA.id === itemB.id) return true;

    const resSim = this.tokenSimilarity(itemA.restaurantName, itemB.restaurantName);
    const dishSim = this.tokenSimilarity(itemA.dishName, itemB.dishName);

    // High restaurant similarity (e.g. "Behrouz Biryani" and "Behrouz Biryani - Royal Kitchen")
    // AND high dish similarity (e.g. "Subz-e-Biryani (Veg)")
    return resSim >= 0.5 && dishSim >= 0.5;
  }

  /**
   * Deduplicates list of items and generates cross-platform comparison insights
   */
  static processDuplicates(items) {
    const uniqueGroups = [];

    for (const item of items) {
      let matchedGroup = null;

      for (const group of uniqueGroups) {
        if (this.isDuplicate(group.primary, item)) {
          matchedGroup = group;
          break;
        }
      }

      if (matchedGroup) {
        matchedGroup.sources.push(item);
        // Choose primary as the one with better price or higher rating
        if (item.price < matchedGroup.primary.price || (item.price === matchedGroup.primary.price && item.rating > matchedGroup.primary.rating)) {
          matchedGroup.primary = item;
        }
      } else {
        uniqueGroups.push({
          primary: item,
          sources: [item]
        });
      }
    }

    // Transform back to unified items with duplicate metadata attached
    return uniqueGroups.map(group => {
      const isMultiProvider = group.sources.length > 1;
      const sortedByPrice = [...group.sources].sort((a, b) => a.price - b.price);
      const cheapestSource = sortedByPrice[0];
      const highestPrice = sortedByPrice[sortedByPrice.length - 1].price;
      const priceDifference = highestPrice - cheapestSource.price;

      return {
        ...group.primary,
        isDeduplicated: isMultiProvider,
        duplicateCount: group.sources.length,
        crossPlatformDeals: isMultiProvider ? {
          cheapestProvider: cheapestSource.provider,
          cheapestPrice: cheapestSource.price,
          potentialSavingsInr: priceDifference,
          allProviders: group.sources.map(s => ({
            provider: s.provider,
            price: s.price,
            rating: s.rating,
            deliveryTimeMinutes: s.deliveryTimeMinutes
          }))
        } : null
      };
    });
  }
}

module.exports = DeduplicationEngine;
