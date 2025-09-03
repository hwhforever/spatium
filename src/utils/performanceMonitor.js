/**
 * Performance monitoring utilities for Spatium V2
 * Tracks key metrics and user interactions for optimization
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoads: 0,
      projectCreations: 0,
      aiGenerations: 0,
      templateUsage: new Map(),
      errorCount: 0,
      userSessions: 0
    };
    
    this.startTime = performance.now();
    this.sessionId = this.generateSessionId();
    
    // Initialize performance observer if available
    if (typeof PerformanceObserver !== 'undefined') {
      this.initPerformanceObserver();
    }
  }

  generateSessionId() {
    return 'spatium_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  initPerformanceObserver() {
    try {
      // Observe navigation timing
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.logNavigationTiming(entry);
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Performance Observer not fully supported:', error);
    }
  }

  logNavigationTiming(entry) {
    const timing = {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      firstContentfulPaint: entry.responseEnd - entry.fetchStart,
      sessionId: this.sessionId,
      timestamp: Date.now()
    };

    // Store locally for development debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Navigation Timing:', timing);
    }

    this.storeMetric('navigation_timing', timing);
  }

  // Track project creation
  trackProjectCreation(projectData) {
    this.metrics.projectCreations++;
    this.storeMetric('project_creation', {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      projectType: projectData.category || 'unknown',
      hasCore: Boolean(projectData.oneSentencePitch)
    });
  }

  // Track AI generation usage
  trackAIGeneration(templateName, success, duration) {
    this.metrics.aiGenerations++;
    
    // Track template usage
    const currentCount = this.metrics.templateUsage.get(templateName) || 0;
    this.metrics.templateUsage.set(templateName, currentCount + 1);

    this.storeMetric('ai_generation', {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      templateName,
      success,
      duration,
      isCustomTemplate: templateName.startsWith('custom_')
    });
  }

  // Track errors
  trackError(error, context = '') {
    this.metrics.errorCount++;
    this.storeMetric('error', {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent
    });
  }

  // Track user interactions
  trackInteraction(action, details = {}) {
    this.storeMetric('user_interaction', {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      action,
      ...details
    });
  }

  // Store metrics locally (replace with analytics service in production)
  storeMetric(type, data) {
    try {
      const key = `spatium_metrics_${type}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(data);
      
      // Keep only last 100 entries per type to prevent storage bloat
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.warn('Failed to store metric:', error);
    }
  }

  // Get performance summary
  getSummary() {
    const sessionDuration = performance.now() - this.startTime;
    
    return {
      sessionId: this.sessionId,
      sessionDuration: Math.round(sessionDuration),
      metrics: {
        ...this.metrics,
        templateUsage: Object.fromEntries(this.metrics.templateUsage)
      },
      timestamp: Date.now()
    };
  }

  // Export metrics for analysis
  exportMetrics() {
    const allMetrics = {};
    const keys = [
      'spatium_metrics_navigation_timing',
      'spatium_metrics_project_creation',
      'spatium_metrics_ai_generation',
      'spatium_metrics_error',
      'spatium_metrics_user_interaction'
    ];

    keys.forEach(key => {
      try {
        allMetrics[key] = JSON.parse(localStorage.getItem(key) || '[]');
      } catch (error) {
        console.warn(`Failed to export ${key}:`, error);
      }
    });

    return {
      summary: this.getSummary(),
      detailed: allMetrics,
      exportedAt: new Date().toISOString()
    };
  }

  // Clear stored metrics
  clearMetrics() {
    const keys = [
      'spatium_metrics_navigation_timing',
      'spatium_metrics_project_creation', 
      'spatium_metrics_ai_generation',
      'spatium_metrics_error',
      'spatium_metrics_user_interaction'
    ];

    keys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Reset current session metrics
    this.metrics = {
      pageLoads: 0,
      projectCreations: 0,
      aiGenerations: 0,
      templateUsage: new Map(),
      errorCount: 0,
      userSessions: 0
    };
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export for use throughout the app
export default performanceMonitor;

// Development helper: expose to window for debugging
if (process.env.NODE_ENV === 'development') {
  window.spatiumPerformance = performanceMonitor;
}
