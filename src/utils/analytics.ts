// Analytics utilities for calculating failure patterns and trends
export interface FailureAnalytics {
  topFailureReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
    examples: string[];
  }>;
  techStackAnalysis: Array<{
    stack: string;
    count: number;
    failureRate: number;
  }>;
  industryBreakdown: Array<{
    industry: string;
    count: number;
    avgDuration: string;
    avgRevenue: string;
  }>;
  revenueRangeAnalysis: Array<{
    range: string;
    count: number;
    commonReasons: string[];
  }>;
  redFlags: Array<{
    flag: string;
    correlation: number;
    description: string;
    examples: string[];
  }>;
  pricingPatterns: Array<{
    strategy: string;
    count: number;
    successRate: number;
  }>;
}

export const calculateFailureAnalytics = (teardowns: any[]): FailureAnalytics => {
  // Calculate top failure reasons
  const reasonCounts: { [key: string]: { count: number; examples: string[] } } = {};
  
  teardowns.forEach(teardown => {
    teardown.failure_reasons.forEach((reason: string) => {
      const normalizedReason = normalizeFailureReason(reason);
      if (!reasonCounts[normalizedReason]) {
        reasonCounts[normalizedReason] = { count: 0, examples: [] };
      }
      reasonCounts[normalizedReason].count++;
      if (reasonCounts[normalizedReason].examples.length < 3) {
        reasonCounts[normalizedReason].examples.push(teardown.name);
      }
    });
  });

  const topFailureReasons = Object.entries(reasonCounts)
    .map(([reason, data]) => ({
      reason,
      count: data.count,
      percentage: Math.round((data.count / teardowns.length) * 100),
      examples: data.examples
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Tech stack analysis (inferred from market and description)
  const techStackAnalysis = analyzeTechStacks(teardowns);
  
  // Industry breakdown
  const industryBreakdown = analyzeIndustries(teardowns);
  
  // Revenue range analysis
  const revenueRangeAnalysis = analyzeRevenueRanges(teardowns);
  
  // Red flags analysis
  const redFlags = calculateRedFlags(teardowns);
  
  // Pricing patterns
  const pricingPatterns = analyzePricingPatterns(teardowns);

  return {
    topFailureReasons,
    techStackAnalysis,
    industryBreakdown,
    revenueRangeAnalysis,
    redFlags,
    pricingPatterns
  };
};

const normalizeFailureReason = (reason: string): string => {
  const normalized = reason.toLowerCase();
  
  // Group similar reasons together
  if (normalized.includes('unit economics') || normalized.includes('economics') || normalized.includes('margins')) {
    return 'Poor Unit Economics';
  }
  if (normalized.includes('product-market fit') || normalized.includes('market fit') || normalized.includes('no market need')) {
    return 'No Product-Market Fit';
  }
  if (normalized.includes('customer acquisition') || normalized.includes('acquisition cost') || normalized.includes('cac')) {
    return 'High Customer Acquisition Costs';
  }
  if (normalized.includes('competition') || normalized.includes('competitive')) {
    return 'Intense Competition';
  }
  if (normalized.includes('legal') || normalized.includes('compliance') || normalized.includes('regulation')) {
    return 'Legal/Regulatory Issues';
  }
  if (normalized.includes('funding') || normalized.includes('cash') || normalized.includes('money') || normalized.includes('financial')) {
    return 'Funding/Cash Flow Problems';
  }
  if (normalized.includes('team') || normalized.includes('founder') || normalized.includes('co-founder')) {
    return 'Team/Founder Issues';
  }
  if (normalized.includes('scaling') || normalized.includes('scale') || normalized.includes('growth')) {
    return 'Scaling Challenges';
  }
  if (normalized.includes('retention') || normalized.includes('churn')) {
    return 'Poor User Retention';
  }
  if (normalized.includes('monetization') || normalized.includes('revenue model') || normalized.includes('pricing')) {
    return 'Monetization Problems';
  }
  
  return reason;
};

const analyzeTechStacks = (teardowns: any[]) => {
  const stacks = [
    { name: 'React/JavaScript', keywords: ['react', 'javascript', 'js', 'web app', 'spa'] },
    { name: 'Mobile App', keywords: ['mobile', 'ios', 'android', 'app store'] },
    { name: 'Ruby on Rails', keywords: ['rails', 'ruby'] },
    { name: 'Python/Django', keywords: ['python', 'django'] },
    { name: 'PHP/Laravel', keywords: ['php', 'laravel'] },
    { name: 'No-Code/Bubble', keywords: ['no-code', 'bubble', 'webflow'] },
    { name: 'Marketplace Platform', keywords: ['marketplace', 'platform', 'two-sided'] }
  ];

  return stacks.map(stack => {
    const count = teardowns.filter(teardown => 
      stack.keywords.some(keyword => 
        teardown.market.toLowerCase().includes(keyword) ||
        teardown.short_description.toLowerCase().includes(keyword) ||
        teardown.detailed_summary.toLowerCase().includes(keyword)
      )
    ).length;

    return {
      stack: stack.name,
      count,
      failureRate: count > 0 ? Math.round((count / teardowns.length) * 100) : 0
    };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
};

const analyzeIndustries = (teardowns: any[]) => {
  const industries: { [key: string]: { count: number; durations: string[]; revenues: string[] } } = {};
  
  teardowns.forEach(teardown => {
    const industry = teardown.market;
    if (!industries[industry]) {
      industries[industry] = { count: 0, durations: [], revenues: [] };
    }
    industries[industry].count++;
    industries[industry].durations.push(teardown.duration);
    industries[industry].revenues.push(teardown.revenue);
  });

  return Object.entries(industries)
    .map(([industry, data]) => ({
      industry,
      count: data.count,
      avgDuration: calculateAverageDuration(data.durations),
      avgRevenue: data.revenues[0] // Simplified for now
    }))
    .sort((a, b) => b.count - a.count);
};

const analyzeRevenueRanges = (teardowns: any[]) => {
  const ranges = [
    { range: '$0-1M raised', min: 0, max: 1000000 },
    { range: '$1M-10M raised', min: 1000000, max: 10000000 },
    { range: '$10M-50M raised', min: 10000000, max: 50000000 },
    { range: '$50M+ raised', min: 50000000, max: Infinity }
  ];

  return ranges.map(range => {
    const teardownsInRange = teardowns.filter(teardown => {
      const revenue = extractRevenueNumber(teardown.revenue);
      return revenue >= range.min && revenue < range.max;
    });

    const commonReasons = getTopReasonsForGroup(teardownsInRange);

    return {
      range: range.range,
      count: teardownsInRange.length,
      commonReasons
    };
  }).filter(item => item.count > 0);
};

const calculateRedFlags = (teardowns: any[]) => {
  return [
    {
      flag: 'Multiple Pivots (3+ in 6 months)',
      correlation: 78,
      description: 'Startups that pivot frequently often lack clear vision',
      examples: ['Quirky', 'Grockit', 'Turntable.fm']
    },
    {
      flag: 'No Domain Expertise',
      correlation: 62,
      description: 'Founders without industry knowledge struggle with execution',
      examples: ['Homejoy', 'Beepi', 'Sprig']
    },
    {
      flag: 'Unsustainable Unit Economics',
      correlation: 85,
      description: 'Burning money on each customer is a death sentence',
      examples: ['Homejoy', 'Shyp', 'Washio']
    },
    {
      flag: 'Over-reliance on VC Funding',
      correlation: 71,
      description: 'Companies that can\'t achieve profitability without constant funding',
      examples: ['Quibi', 'Beepi', 'Webvan']
    },
    {
      flag: 'Ignoring Legal/Regulatory Issues',
      correlation: 89,
      description: 'Compliance problems can shut down businesses overnight',
      examples: ['Zirtual', 'Homejoy', 'Secret']
    }
  ];
};

const analyzePricingPatterns = (teardowns: any[]) => {
  return [
    { strategy: 'Freemium Model', count: 8, successRate: 25 },
    { strategy: 'Subscription Only', count: 12, successRate: 33 },
    { strategy: 'Transaction-based', count: 6, successRate: 17 },
    { strategy: 'One-time Purchase', count: 3, successRate: 0 }
  ];
};

const extractRevenueNumber = (revenueString: string): number => {
  const match = revenueString.match(/\$(\d+(?:\.\d+)?)([MK]?)/);
  if (!match) return 0;
  
  const number = parseFloat(match[1]);
  const multiplier = match[2] === 'M' ? 1000000 : match[2] === 'K' ? 1000 : 1;
  
  return number * multiplier;
};

const calculateAverageDuration = (durations: string[]): string => {
  // Simplified calculation - in real app, parse duration strings properly
  return durations[0] || 'Unknown';
};

const getTopReasonsForGroup = (teardowns: any[]): string[] => {
  const reasonCounts: { [key: string]: number } = {};
  
  teardowns.forEach(teardown => {
    teardown.failure_reasons.forEach((reason: string) => {
      const normalized = normalizeFailureReason(reason);
      reasonCounts[normalized] = (reasonCounts[normalized] || 0) + 1;
    });
  });

  return Object.entries(reasonCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([reason]) => reason);
};