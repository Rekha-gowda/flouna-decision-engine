/**
 * Mini FLOUNA Food Decision Engine
 * Resilient Multi-Provider Data Aggregator
 * 
 * Author: G. Rekha (Rekha-gowda)
 * Assignment: FLOUNA 24-Hour Technical Assessment
 * 
 * Aggregates across at least 3 distinct provider data sources using Promise.allSettled.
 * Resilient against provider timeouts, 500 errors, and partial outages.
 */

const fs = require('fs');
const path = require('path');
const NormalizerService = require('./normalizer');

class ProviderAggregator {
  constructor() {
    this.zestyDataPath = path.join(__dirname, '../data/zestyBitesData.json');
    this.quickFeastDataPath = path.join(__dirname, '../data/quickFeastData.json');
    this.urbanKitchenDataPath = path.join(__dirname, '../data/urbanKitchenData.json');
  }

  /**
   * Mock fetch for ZestyBites
   */
  async fetchZestyBites(options = {}) {
    if (options.failProvider === 'ZestyBites') {
      throw new Error('ZestyBites API Gateway 503 Service Unavailable');
    }
    if (options.timeoutProvider === 'ZestyBites') {
      await new Promise(r => setTimeout(r, 3000));
      throw new Error('ZestyBites API Connection Timed Out (3000ms)');
    }
    const raw = fs.readFileSync(this.zestyDataPath, 'utf8');
    const data = JSON.parse(raw);
    return NormalizerService.normalizeZestyBites(data);
  }

  /**
   * Mock fetch for QuickFeast
   */
  async fetchQuickFeast(options = {}) {
    if (options.failProvider === 'QuickFeast') {
      throw new Error('QuickFeast HTTP 500 Internal Server Error');
    }
    if (options.timeoutProvider === 'QuickFeast') {
      await new Promise(r => setTimeout(r, 3000));
      throw new Error('QuickFeast Socket Timeout after 3000ms');
    }
    const raw = fs.readFileSync(this.quickFeastDataPath, 'utf8');
    const data = JSON.parse(raw);

    // Simulate incomplete data if requested
    if (options.incompleteData || options.corruptProvider === 'QuickFeast') {
      data.forEach(item => {
        if (item.sku_id === 'qf-904') {
          item.customer_score = null; // missing rating
          item.travel_time_min = null; // missing travel time
        }
      });
    }

    return NormalizerService.normalizeQuickFeast(data);
  }

  /**
   * Mock fetch for UrbanKitchen (ONDC)
   */
  async fetchUrbanKitchen(options = {}) {
    if (options.failProvider === 'UrbanKitchen') {
      throw new Error('UrbanKitchen ONDC Network Protocol 504 Gateway Timeout');
    }
    if (options.timeoutProvider === 'UrbanKitchen') {
      await new Promise(r => setTimeout(r, 3000));
      throw new Error('UrbanKitchen Network Latency Exceeded 3000ms threshold');
    }
    const raw = fs.readFileSync(this.urbanKitchenDataPath, 'utf8');
    const data = JSON.parse(raw);
    return NormalizerService.normalizeUrbanKitchen(data);
  }

  /**
   * Aggregates all 3 providers with resilient Promise.allSettled and timeout boundary
   */
  async aggregateAll(simulationOptions = {}) {
    const startTime = Date.now();
    const TIMEOUT_LIMIT = 2500; // 2.5s maximum wait per provider

    const wrapWithTimeout = (promise, name) => {
      let timer;
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`${name} request exceeded SLA deadline of ${TIMEOUT_LIMIT}ms`));
        }, TIMEOUT_LIMIT);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
    };

    const fetchTasks = [
      { name: 'ZestyBites', task: wrapWithTimeout(this.fetchZestyBites(simulationOptions), 'ZestyBites') },
      { name: 'QuickFeast', task: wrapWithTimeout(this.fetchQuickFeast(simulationOptions), 'QuickFeast') },
      { name: 'UrbanKitchen', task: wrapWithTimeout(this.fetchUrbanKitchen(simulationOptions), 'UrbanKitchen') }
    ];

    const results = await Promise.allSettled(fetchTasks.map(f => f.task));

    const allItems = [];
    const providerStatuses = [];

    results.forEach((res, index) => {
      const providerName = fetchTasks[index].name;
      if (res.status === 'fulfilled') {
        allItems.push(...res.value);
        providerStatuses.push({
          provider: providerName,
          status: 'SUCCESS',
          count: res.value.length,
          latencyMs: Date.now() - startTime
        });
      } else {
        providerStatuses.push({
          provider: providerName,
          status: 'FAILED',
          error: res.reason ? res.reason.message : 'Unknown Network Error',
          count: 0,
          latencyMs: Date.now() - startTime
        });
      }
    });

    return {
      items: allItems,
      telemetry: {
        totalItemsRetrieved: allItems.length,
        executionTimeMs: Date.now() - startTime,
        providers: providerStatuses,
        healthyProvidersCount: providerStatuses.filter(p => p.status === 'SUCCESS').length,
        failedProvidersCount: providerStatuses.filter(p => p.status === 'FAILED').length
      }
    };
  }
}

module.exports = new ProviderAggregator();
