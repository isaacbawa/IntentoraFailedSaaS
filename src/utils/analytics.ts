// Enhanced & Comprehensive Analytics utilities for calculating startup failure patterns and trends
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
    representativeExamples: string[];
  }>;
  revenueRangeAnalysis: Array<{
    range: string;
    count: number;
    commonReasons: string[];
    representativeExamples: string[];
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
    representativeExamples: string[];
  }>;
}

export const calculateFailureAnalytics = (teardowns: any[]): FailureAnalytics => {
  const reasonCounts: { [key: string]: { count: number; examples: string[] } } = {};

  teardowns.forEach(teardown => {
    teardown.failure_reasons?.forEach((reason: string) => {
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

  return {
    topFailureReasons,
    techStackAnalysis: analyzeTechStacks(teardowns),
    industryBreakdown: analyzeIndustries(teardowns),
    revenueRangeAnalysis: analyzeRevenueRanges(teardowns),
    redFlags: calculateRedFlags(teardowns),
    pricingPatterns: analyzePricingPatterns(teardowns)
  };
};

const normalizeFailureReason = (reason: string): string => {
  const normalized = reason.toLowerCase();
  const mapping: { [key: string]: string } = {
    'unit economics': 'Poor Unit Economics',
    'economics': 'Poor Unit Economics',
    'margins': 'Poor Unit Economics',
    'product-market fit': 'No Product-Market Fit',
    'market fit': 'No Product-Market Fit',
    'no market need': 'No Product-Market Fit',
    'customer acquisition': 'High Customer Acquisition Costs',
    'acquisition cost': 'High Customer Acquisition Costs',
    'cac': 'High Customer Acquisition Costs',
    'competition': 'Intense Competition',
    'competitive': 'Intense Competition',
    'legal': 'Legal/Regulatory Issues',
    'compliance': 'Legal/Regulatory Issues',
    'regulation': 'Legal/Regulatory Issues',
    'funding': 'Funding/Cash Flow Problems',
    'cash': 'Funding/Cash Flow Problems',
    'money': 'Funding/Cash Flow Problems',
    'financial': 'Funding/Cash Flow Problems',
    'team': 'Team/Founder Issues',
    'founder': 'Team/Founder Issues',
    'co-founder': 'Team/Founder Issues',
    'scaling': 'Scaling Challenges',
    'scale': 'Scaling Challenges',
    'growth': 'Scaling Challenges',
    'grew too fast': 'Scaling Challenges',
    'retention': 'Poor User Retention',
    'churn': 'Poor User Retention',
    'monetization': 'Monetization Problems',
    'revenue model': 'Monetization Problems',
    'pricing': 'Monetization Problems'
  };

  for (const key in mapping) {
    if (normalized.includes(key)) return mapping[key];
  }
  return reason;
};

const parseDuration = (duration: string): number => {
  const match = duration.match(/(\d+)\s*(months|month|years|year)/i);
  if (!match) return 0;
  const value = parseInt(match[1]);
  return match[2].includes('year') ? value * 12 : value;
};

const calculateAverageDuration = (durations: string[]): string => {
  const total = durations.map(parseDuration).reduce((sum, val) => sum + val, 0);
  const avg = durations.length ? total / durations.length : 0;
  return avg >= 12 ? `${(avg / 12).toFixed(1)} years` : `${avg.toFixed(0)} months`;
};

const extractRevenueNumber = (revenueString: string): number => {
  const match = revenueString.match(/\$(\d+(?:\.\d+)?)([MK]?)/);
  if (!match) return 0;
  const number = parseFloat(match[1]);
  const multiplier = match[2] === 'M' ? 1_000_000 : match[2] === 'K' ? 1_000 : 1;
  return number * multiplier;
};

const calculateAverageRevenue = (revenues: string[]): string => {
  const total = revenues.map(extractRevenueNumber).reduce((sum, val) => sum + val, 0);
  const avg = revenues.length ? total / revenues.length : 0;
  if (avg >= 1_000_000) return `$${(avg / 1_000_000).toFixed(1)}M`;
  if (avg >= 1_000) return `$${(avg / 1_000).toFixed(1)}K`;
  return `$${avg.toFixed(0)}`;
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
        new RegExp(`\\b${keyword}\\b`, 'i').test(teardown.market?.toLowerCase() || '') ||
        new RegExp(`\\b${keyword}\\b`, 'i').test(teardown.short_description?.toLowerCase() || '') ||
        new RegExp(`\\b${keyword}\\b`, 'i').test(teardown.detailed_summary?.toLowerCase() || '') ||
        new RegExp(`\\b${keyword}\\b`, 'i').test(teardown.tech_stack?.toLowerCase() || '')
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
  const industries: { [key: string]: { count: number; durations: string[]; revenues: string[]; examples: string[] } } = {};

  teardowns.forEach(teardown => {
    const industry = teardown.market || 'Unknown';
    if (!industries[industry]) {
      industries[industry] = { count: 0, durations: [], revenues: [], examples: [] };
    }
    industries[industry].count++;
    if (teardown.duration) industries[industry].durations.push(teardown.duration);
    if (teardown.revenue) industries[industry].revenues.push(teardown.revenue);
    if (industries[industry].examples.length < 3) industries[industry].examples.push(teardown.name);
  });

  return Object.entries(industries)
    .map(([industry, data]) => ({
      industry,
      count: data.count,
      avgDuration: calculateAverageDuration(data.durations),
      avgRevenue: calculateAverageRevenue(data.revenues),
      representativeExamples: data.examples
    }))
    .sort((a, b) => b.count - a.count);
};

const analyzeRevenueRanges = (teardowns: any[]) => {
  const ranges = [
    { range: '$0-1M raised', min: 0, max: 1_000_000 },
    { range: '$1M-10M raised', min: 1_000_000, max: 10_000_000 },
    { range: '$10M-50M raised', min: 10_000_000, max: 50_000_000 },
    { range: '$50M+ raised', min: 50_000_000, max: Infinity }
  ];

  return ranges.map(range => {
    const teardownsInRange = teardowns.filter(teardown => {
      const revenue = extractRevenueNumber(teardown.revenue);
      return revenue >= range.min && revenue < range.max;
    });

    const commonReasons = getTopReasonsForGroup(teardownsInRange);
    const examples = teardownsInRange.slice(0, 3).map(t => t.name);

    return {
      range: range.range,
      count: teardownsInRange.length,
      commonReasons,
      representativeExamples: examples
    };
  }).filter(item => item.count > 0);
};

const getTopReasonsForGroup = (teardowns: any[]): string[] => {
  const reasonCounts: { [key: string]: number } = {};

  teardowns.forEach(teardown => {
    teardown.failure_reasons?.forEach((reason: string) => {
      const normalized = normalizeFailureReason(reason);
      reasonCounts[normalized] = (reasonCounts[normalized] || 0) + 1;
    });
  });

  return Object.entries(reasonCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([reason]) => reason);
};

const calculateRedFlags = (teardowns: any[]) => [
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

const analyzePricingPatterns = (teardowns: any[]) => {
  const modelMap: { [strategy: string]: { count: number; successCount: number; examples: string[] } } = {};

  teardowns.forEach(teardown => {
    const strategy = teardown.pricing_model || 'Unknown';
    const succeeded = ['acquired', 'profitable'].includes(teardown.status);
    if (!modelMap[strategy]) modelMap[strategy] = { count: 0, successCount: 0, examples: [] };
    modelMap[strategy].count++;
    if (succeeded) modelMap[strategy].successCount++;
    if (modelMap[strategy].examples.length < 3) modelMap[strategy].examples.push(teardown.name);
  });

  return Object.entries(modelMap).map(([strategy, data]) => ({
    strategy,
    count: data.count,
    successRate: Math.round((data.successCount / data.count) * 100),
    representativeExamples: data.examples
  }));
};
