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
    const rankResult = RankingEngine.rankOptions(deduplicatedItems, userRequirements);
    const rankedOptions = Array.isArray(rankResult) ? rankResult : (rankResult.items || []);
    const hasExactMatch = rankResult.hasExactMatch !== undefined ? rankResult.hasExactMatch : true;
    const exactMatchCount = rankResult.exactMatchCount !== undefined ? rankResult.exactMatchCount : rankedOptions.length;

    // Step 6: Explain recommendation (grounded in data)
    const recommended = rankedOptions.length > 0 ? rankedOptions[0] : null;
    const explanation = ExplanationEngine.generateExplanation(recommended, rankedOptions, userRequirements, hasExactMatch);

    res.json({
      success: true,
      query,
      hasExactMatch,
      exactMatchCount,
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

const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const OFFERS_FILE = path.join(__dirname, '../data/offersData.json');
const RESTAURANTS_FILE = path.join(__dirname, '../data/restaurantsData.json');

// Helper to read JSON files safely
function readJsonSafe(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error(`Failed to read ${filePath}:`, e);
  }
  return fallback;
}

// Helper to write JSON files
function writeJsonSafe(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`Failed to write ${filePath}:`, e);
    return false;
  }
}

/**
 * User Registration Endpoint
 */
router.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide name, email, and password.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = readJsonSafe(USERS_FILE, []);

  // Check duplicate
  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(400).json({ success: false, error: 'An account with this email already exists. Please login.' });
  }

  // Determine role: if name or email contains Rekha, assign admin, else customer
  const isAdmin = /rekha/i.test(name) || /rekha/i.test(normalizedEmail);
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password: password.trim(),
    role: isAdmin ? 'admin' : 'customer',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  users.push(newUser);
  writeJsonSafe(USERS_FILE, users);

  res.json({
    success: true,
    message: 'Account created successfully!',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

/**
 * User Login Endpoint
 */
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide both email and password.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  const users = readJsonSafe(USERS_FILE, []);

  // Match email and password
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === trimmedPassword);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password. Please try again.' });
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  writeJsonSafe(USERS_FILE, users);

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Get All Registered Users (Admin only)
 */
router.get('/auth/users', (req, res) => {
  const users = readJsonSafe(USERS_FILE, []);
  // Return users with passwords masked/omitted for clean security
  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password, // Provided so Admin can audit account access
    role: u.role,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin
  }));

  res.json({
    success: true,
    totalUsers: safeUsers.length,
    users: safeUsers
  });
});

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');

/**
 * Top Offers & Deals Endpoint
 */
router.get('/offers', (req, res) => {
  const offers = readJsonSafe(OFFERS_FILE, []);
  res.json({
    success: true,
    offers
  });
});

/**
 * Create a New Food Order
 */
router.post('/orders', (req, res) => {
  const { items, userEmail, userName, subtotal, discount, deliveryFee, total, deliveryAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Your cart is empty. Please add items to order.' });
  }

  const orders = readJsonSafe(ORDERS_FILE, []);
  const newOrder = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    userEmail: userEmail || 'guest@flouna.com',
    userName: userName || 'Customer',
    items: items,
    subtotal: subtotal || 0,
    discount: discount || 0,
    deliveryFee: deliveryFee !== undefined ? deliveryFee : 25,
    total: total || 0,
    deliveryAddress: deliveryAddress || 'Koramangala, Bengaluru',
    status: 'Confirmed - Preparing in Kitchen',
    estimatedDeliveryTime: '25-30 mins',
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder); // newest first
  writeJsonSafe(ORDERS_FILE, orders);

  res.json({
    success: true,
    message: 'Order placed successfully! The kitchen is preparing your food.',
    order: newOrder
  });
});

/**
 * Get Orders (Filtered by user email or all for admin)
 */
router.get('/orders', (req, res) => {
  const { email, role } = req.query;
  const orders = readJsonSafe(ORDERS_FILE, []);

  if (role === 'admin' || !email) {
    return res.json({ success: true, total: orders.length, orders });
  }

  const userOrders = orders.filter(o => o.userEmail && o.userEmail.toLowerCase() === email.toLowerCase());
  res.json({
    success: true,
    total: userOrders.length,
    orders: userOrders
  });
});

/**
 * Featured Partner Restaurants Endpoint
 */
router.get('/restaurants', (req, res) => {
  const restaurants = readJsonSafe(RESTAURANTS_FILE, []);
  res.json({
    success: true,
    total: restaurants.length,
    restaurants
  });
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
