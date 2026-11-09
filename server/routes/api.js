/**
 * Mini FLOUNA Food Decision Engine
 * Core Decision API Routes
 * 
 * Author: G. Rekha (Rekha-gowda)
 * Assignment: FLOUNA 24-Hour Technical Assessment
 */

const express = require('express');
const router = express.Router();

const { extractFoodRequirements } = require('../services/nlpExtractor');
const providerAggregator = require('../services/providerAggregator');
const DeduplicationEngine = require('../services/deduplicator');
const RankingEngine = require('../services/rankingEngine');
const ExplanationEngine = require('../services/explainEngine');

/**
 * Health check endpoint for Render / monitoring
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Mini FLOUNA Food Decision Engine',
    author: 'G. Rekha (Rekha-gowda)',
    timestamp: new Date().toISOString()
  });
});

/**
 * Query extraction testing endpoint
 */
router.post('/extract', (req, res) => {
  const { query } = req.body;
  const extracted = extractFoodRequirements(query);
  res.json({
    success: true,
    query,
    extracted
  });
});

/**
 * Main Food Decision Endpoint
 */
router.post('/decision', async (req, res) => {
  try {
    const { query, simulationOptions = {} } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a natural language food query string.'
      });
    }

    // Step 1: Understand user's request (Entity & Intent Extraction)
    const userRequirements = extractFoodRequirements(query);

    // Step 2 & 3: Search multiple providers & Normalize (with fault tolerance)
    const aggregationResult = await providerAggregator.aggregateAll(simulationOptions);

    // Step 4: Deduplicate cross-provider items & generate savings comparison
    const deduplicatedItems = DeduplicationEngine.processDuplicates(aggregationResult.items);

    // Step 5: Rank options based on user requirements & multi-criteria utility
    const rankedOptions = RankingEngine.rankOptions(deduplicatedItems, userRequirements);

    // Step 6: Explain recommendation (grounded in data)
    const recommended = rankedOptions.length > 0 ? rankedOptions[0] : null;
    const explanation = ExplanationEngine.generateExplanation(recommended, rankedOptions, userRequirements);

    res.json({
      success: true,
      query,
      userRequirements,
      recommendation: recommended ? {
        item: recommended,
        explanation: explanation
      } : null,
      totalMatched: rankedOptions.length,
      allOptions: rankedOptions,
      telemetry: aggregationResult.telemetry
    });

  } catch (error) {
    console.error('Error in /api/decision:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing the decision engine flow.',
      details: error.message
    });
  }
});

/**
 * Provider information endpoint
 */
router.get('/providers', (req, res) => {
  res.json({
    providers: [
      {
        id: 'zesty_bites',
        name: 'ZestyBites API',
        format: 'Nested restaurant & menu schema with promotional percentages',
        coverage: 'Indiranagar, Koramangala, BTM, HSR',
        type: 'Mock Delivery Platform API'
      },
      {
        id: 'quick_feast',
        name: 'QuickFeast Express',
        format: 'Flat quick-commerce SKU inventory with travel time minutes',
        coverage: 'Bengaluru Metro Superfast (10-25 min delivery)',
        type: 'Mock Instant Delivery Service'
      },
      {
        id: 'urban_kitchen',
        name: 'UrbanKitchen Network',
        format: 'ONDC Open Network protocol schema with cloud kitchen listings',
        coverage: 'Bengaluru Distributed Kitchens',
        type: 'Mock ONDC / Cloud Network API'
      }
    ]
  });
});

module.exports = router;
