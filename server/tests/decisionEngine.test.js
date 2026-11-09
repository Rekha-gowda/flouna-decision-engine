/**
 * Mini FLOUNA Food Decision Engine - Automated Test Suite
 * 
 * Author: G. Rekha (Rekha-gowda)
 * Assignment: FLOUNA 24-Hour Technical Assessment
 * 
 * Verifies all 6 mandatory evaluation criteria outlined in the assessment brief:
 * 1. Normal request containing clear preferences
 * 2. Request with missing information (no invented info)
 * 3. Provider failure or timeout resilience
 * 4. Incomplete data handling without crash
 * 5. Cross-platform duplicate restaurant deduplication & deal finding
 * 6. Case where cheapest option is NOT the best overall recommendation
 */

const assert = require('assert');
const { extractFoodRequirements } = require('../services/nlpExtractor');
const providerAggregator = require('../services/providerAggregator');
const DeduplicationEngine = require('../services/deduplicator');
const RankingEngine = require('../services/rankingEngine');
const ExplanationEngine = require('../services/explainEngine');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function runAllTests() {
  console.log(`\n===============================================================`);
  console.log(`🧪 Running Mini FLOUNA Decision Engine Test Suite`);
  console.log(`👤 Evaluated by: G. Rekha (Rekha-gowda) | Algorithic Assessment`);
  console.log(`===============================================================\n`);

  // SCENARIO 1: Normal request containing clear preferences
  await runAsyncTest('Scenario 1: Extract and recommend with clear preferences', async () => {
    const query = "Find me a vegetarian biryani under ₹300 that can arrive within 30 minutes. I prefer highly rated restaurants.";
    const req = extractFoodRequirements(query);

    assert.strictEqual(req.food_item, 'biryani');
    assert.strictEqual(req.dietary_preference, 'VEG');
    assert.strictEqual(req.max_budget, 300);
    assert.strictEqual(req.max_delivery_time, 30);
    assert.strictEqual(req.rating_preference, 'HIGH');

    const agg = await providerAggregator.aggregateAll();
    const dedup = DeduplicationEngine.processDuplicates(agg.items);
    const ranked = RankingEngine.rankOptions(dedup, req);

    assert(ranked.length > 0, "Should return matching restaurants");
    assert(ranked[0].isVeg === true, "Top recommendation must be vegetarian");
    assert(ranked[0].price <= 300, "Top recommendation must be within budget");
    assert(ranked[0].deliveryTimeMinutes <= 30, "Top recommendation delivery must be <= 30 mins");
    assert(ranked[0].rating >= 4.3, "Top recommendation must be highly rated");

    const explanation = ExplanationEngine.generateExplanation(ranked[0], ranked, req);
    assert(explanation.summary.length > 10, "Should generate grounded explanation");
  });

  // SCENARIO 2: Request with missing information (no invented info)
  await runAsyncTest('Scenario 2: Handle missing information without inventing data', async () => {
    const query = "I want pizza in Koramangala";
    const req = extractFoodRequirements(query);

    assert.strictEqual(req.food_item, 'pizza');
    assert.strictEqual(req.location, 'Koramangala');
    // Ensure missing information is null and NOT invented
    assert.strictEqual(req.max_budget, null, "Budget must not be invented");
    assert.strictEqual(req.max_delivery_time, null, "Delivery time must not be invented");
    assert.strictEqual(req.dietary_preference, null, "Diet preference must not be invented");
    assert.strictEqual(req.min_rating, null, "Rating must not be invented");

    const agg = await providerAggregator.aggregateAll();
    const dedup = DeduplicationEngine.processDuplicates(agg.items);
    const ranked = RankingEngine.rankOptions(dedup, req);

    assert(ranked.length > 0, "Should gracefully return pizza options despite missing parameters");
    assert(ranked[0].dishName.toLowerCase().includes('pizza'), "Recommendation should match food item");
  });

  // SCENARIO 3: Provider that fails or times out
  await runAsyncTest('Scenario 3: Resilient handling of provider failure or timeout', async () => {
    // Simulate UrbanKitchen failing with 504 Gateway Timeout
    const agg = await providerAggregator.aggregateAll({ failProvider: 'UrbanKitchen' });

    assert.strictEqual(agg.telemetry.failedProvidersCount, 1, "Should record 1 failed provider");
    assert.strictEqual(agg.telemetry.healthyProvidersCount, 2, "Should have 2 healthy providers");
    assert(agg.items.length > 0, "Should still return items from healthy providers");

    const urbanKitchenStatus = agg.telemetry.providers.find(p => p.provider === 'UrbanKitchen');
    assert.strictEqual(urbanKitchenStatus.status, 'FAILED');
    assert(urbanKitchenStatus.error.includes('504'), "Should capture provider error message");

    // Decision flow still succeeds without crash
    const dedup = DeduplicationEngine.processDuplicates(agg.items);
    const ranked = RankingEngine.rankOptions(dedup, { food_item: 'biryani' });
    assert(ranked.length > 0, "Decision engine should succeed despite provider failure");
  });

  // SCENARIO 4: Provider returning incomplete data
  await runAsyncTest('Scenario 4: Gracefully handle incomplete or missing fields', async () => {
    // Incomplete data flag simulates null ratings and null travel times
    const agg = await providerAggregator.aggregateAll({ corruptProvider: 'QuickFeast' });
    const incompleteItem = agg.items.find(i => i.hasIncompleteData);

    assert(incompleteItem !== undefined, "Should detect items with incomplete data");
    assert(incompleteItem.missingFields.length > 0, "Should record missing fields list");

    // Deduplication and Ranking must not throw NaN or crash
    const dedup = DeduplicationEngine.processDuplicates(agg.items);
    const ranked = RankingEngine.rankOptions(dedup, { food_item: 'burger' });

    assert(ranked.length > 0, "Should rank successfully without NaN errors");
    assert(!isNaN(ranked[0].compositeScore), "Composite score must be a valid number");
  });

  // SCENARIO 5: Duplicate or similar restaurant listings
  await runAsyncTest('Scenario 5: Cross-platform deduplication & price savings detection', async () => {
    const agg = await providerAggregator.aggregateAll();
    const dedup = DeduplicationEngine.processDuplicates(agg.items);

    // Behrouz Biryani is listed on both ZestyBites and UrbanKitchen
    const behrouzGroup = dedup.find(item => item.restaurantName.toLowerCase().includes('behrouz'));

    assert(behrouzGroup !== undefined, "Behrouz Biryani should exist in dataset");
    assert.strictEqual(behrouzGroup.isDeduplicated, true, "Should flag as cross-platform duplicate");
    assert(behrouzGroup.duplicateCount >= 2, "Should aggregate at least 2 provider listings");
    assert(behrouzGroup.crossPlatformDeals !== null, "Should produce cross-platform deal comparison");
    assert(behrouzGroup.crossPlatformDeals.cheapestPrice <= behrouzGroup.price, "Should identify cheapest source");
  });

  // SCENARIO 6: Cheapest option is NOT the best overall recommendation
  await runAsyncTest('Scenario 6: Quality and speed outweigh naive cheapest option', async () => {
    const query = "Hyderabadi chicken biryani within 45 mins";
    const req = extractFoodRequirements(query);

    const agg = await providerAggregator.aggregateAll();
    const dedup = DeduplicationEngine.processDuplicates(agg.items);
    const ranked = RankingEngine.rankOptions(dedup, req);

    // Find the cheapest chicken biryani (Street Corner at ₹140, 3.4 rating, 45 mins)
    const cheapOption = ranked.find(item => item.restaurantName.includes('Street Corner'));
    const topRecommendation = ranked[0];

    assert(cheapOption !== undefined, "Cheap Street Corner option should exist");
    assert.strictEqual(cheapOption.price, 140, "Street Corner is the cheapest at ₹140");

    // Top recommended should NOT be the cheap 3.4★ Street Corner!
    assert.notStrictEqual(topRecommendation.id, cheapOption.id, "Cheapest option should NOT be #1 recommendation");
    assert(topRecommendation.rating >= 4.5, "Top recommendation should have superior rating");
    assert(topRecommendation.deliveryTimeMinutes < cheapOption.deliveryTimeMinutes, "Top recommendation should be faster");
    assert(topRecommendation.compositeScore > cheapOption.compositeScore, "Composite score of superior item must beat cheap item");

    // Check explanation acknowledges why the cheaper option wasn't picked
    const explanation = ExplanationEngine.generateExplanation(topRecommendation, ranked, req);
    assert(explanation.contrastiveInsight !== null, "Should generate contrastive insight comparing with cheaper option");
    assert(explanation.contrastiveInsight.includes(cheapOption.restaurantName) || explanation.contrastiveInsight.includes('cheaper'),
      "Explanation must specifically contrast with the cheaper option");
  });

  console.log(`\n---------------------------------------------------------------`);
  console.log(`Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log(`===============================================================\n`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAllTests();
