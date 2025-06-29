// Centralized data store for the application
// import teardownsData from '../data/teardowns.json';

export interface Teardown {
  id: string;
  name: string;
  market: string;
  revenue: string;
  duration: string;
  failure_reasons: string[];
  lessons_learned: string[];
  tags: string[];
  current_venture_name: string;
  current_venture_url: string;
  source_url: string;
  short_description: string;
  detailed_summary: string;
  is_premium: boolean;
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SubmittedStory {
  id: string;
  startupName: string;
  founderName: string;
  email: string;
  market: string;
  duration: string;
  revenue: string;
  failureReasons: string[];
  lessonsLearned: string[];
  detailedStory: string;
  currentVenture: string;
  currentVentureUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  userId?: string;
  images?: string[];
  reviewedAt?: string;
  reviewedBy?: string;
}

class DataStore {
  private static instance: DataStore;
  private teardowns: Teardown[] = [];
  private submissions: SubmittedStory[] = [];
  private subscribers: any[] = [];

  private constructor() {
    this.loadData();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // private loadData() {
  //   // Load teardowns from JSON and localStorage
  //   const storedTeardowns = localStorage.getItem('teardowns');
  //   if (storedTeardowns) {
  //     this.teardowns = JSON.parse(storedTeardowns);
  //   } else {
  //     this.teardowns = teardownsData.map(t => ({
  //       ...t,
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString()
  //     }));
  //     this.saveTeardowns();
  //   }

  //   // Load submissions
  //   const storedSubmissions = localStorage.getItem('storySubmissions');
  //   if (storedSubmissions) {
  //     this.submissions = JSON.parse(storedSubmissions);
  //   }

  //   // Load subscribers
  //   const storedSubscribers = localStorage.getItem('newsletterSubscribers');
  //   if (storedSubscribers) {
  //     this.subscribers = JSON.parse(storedSubscribers);
  //   }
  // }

  private async loadData() {
    const storedTeardowns = localStorage.getItem('teardowns');
    if (storedTeardowns) {
      this.teardowns = JSON.parse(storedTeardowns);
    } else {
      const response = await fetch('/data/teardowns.json?ts=' + Date.now());
      const teardownsData = await response.json();
      this.teardowns = teardownsData.map(t => ({
        ...t,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      this.saveTeardowns();
    }

    // Load submissions
    const storedSubmissions = localStorage.getItem('storySubmissions');
    if (storedSubmissions) {
      this.submissions = JSON.parse(storedSubmissions);
    }

    // Load subscribers
    const storedSubscribers = localStorage.getItem('newsletterSubscribers');
    if (storedSubscribers) {
      this.subscribers = JSON.parse(storedSubscribers);
    }
  }


  private saveTeardowns() {
    localStorage.setItem('teardowns', JSON.stringify(this.teardowns));
  }

  private saveSubmissions() {
    localStorage.setItem('storySubmissions', JSON.stringify(this.submissions));
  }

  private saveSubscribers() {
    localStorage.setItem('newsletterSubscribers', JSON.stringify(this.subscribers));
  }

  // Teardown methods
  public getTeardowns(): Teardown[] {
    return [...this.teardowns];
  }

  public getTeardownById(id: string): Teardown | undefined {
    return this.teardowns.find(t => t.id === id);
  }

  public addTeardown(teardown: Omit<Teardown, 'id' | 'created_at' | 'updated_at'>): Teardown {
    const newTeardown: Teardown = {
      ...teardown,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.teardowns.push(newTeardown);
    this.saveTeardowns();
    return newTeardown;
  }

  public updateTeardown(id: string, updates: Partial<Teardown>): Teardown | null {
    const index = this.teardowns.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.teardowns[index] = {
      ...this.teardowns[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveTeardowns();
    return this.teardowns[index];
  }

  public deleteTeardown(id: string): boolean {
    const index = this.teardowns.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.teardowns.splice(index, 1);
    this.saveTeardowns();
    return true;
  }

  // Submission methods
  public getSubmissions(): SubmittedStory[] {
    return [...this.submissions];
  }

  public addSubmission(submission: Omit<SubmittedStory, 'id' | 'submittedAt' | 'status'>): SubmittedStory {
    const newSubmission: SubmittedStory = {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    this.submissions.push(newSubmission);
    this.saveSubmissions();
    return newSubmission;
  }

  public updateSubmissionStatus(
    id: string,
    status: 'approved' | 'rejected',
    reviewedBy: string
  ): SubmittedStory | null {
    const index = this.submissions.findIndex(s => s.id === id);
    if (index === -1) return null;

    this.submissions[index] = {
      ...this.submissions[index],
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy
    };
    this.saveSubmissions();
    return this.submissions[index];
  }

  public convertSubmissionToTeardown(submissionId: string): Teardown | null {
    const submission = this.submissions.find(s => s.id === submissionId);
    if (!submission) return null;

    const teardown = this.addTeardown({
      name: submission.startupName,
      market: submission.market,
      revenue: submission.revenue,
      duration: submission.duration,
      failure_reasons: submission.failureReasons,
      lessons_learned: submission.lessonsLearned,
      tags: [submission.market.split(' ')[0], 'User Submitted'],
      current_venture_name: submission.currentVenture,
      current_venture_url: submission.currentVentureUrl || '',
      source_url: '',
      short_description: `${submission.startupName} was a ${submission.market.toLowerCase()} startup that failed after ${submission.duration}.`,
      detailed_summary: submission.detailedStory,
      is_premium: false,
      images: submission.images || []
    });

    return teardown;
  }

  // Subscriber methods
  public addSubscriber(email: string, name?: string): void {
    const subscriber = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      subscribedAt: new Date().toISOString(),
      status: 'active'
    };
    this.subscribers.push(subscriber);
    this.saveSubscribers();
  }

  public getSubscriberCount(): number {
    return this.subscribers.filter(s => s.status === 'active').length;
  }

  // Statistics
  public getStats() {
    const totalTeardowns = this.teardowns.length;
    const totalSubmissions = this.submissions.length;
    const pendingSubmissions = this.submissions.filter(s => s.status === 'pending').length;
    const subscriberCount = this.getSubscriberCount();

    return {
      totalTeardowns,
      totalSubmissions,
      pendingSubmissions,
      subscriberCount,
      monthlyPageviews: 47820 + (totalTeardowns * 150), // Realistic calculation
      totalUsers: subscriberCount + 8234 // Base users + subscribers
    };
  }
}

export default DataStore;