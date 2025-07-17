import { useState, useEffect } from 'react';
import SupabaseDataStore, { Teardown, SubmittedStory } from '../utils/supabaseDataStore';

export const useTeardowns = () => {
  const [teardowns, setTeardowns] = useState<Teardown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTeardowns = async () => {
    try {
      setLoading(true);
      const data = await SupabaseDataStore.getInstance().getTeardowns();
      setTeardowns(data);
      setError(null);
    } catch (err) {
      setError('Failed to load teardowns');
      console.error('Error loading teardowns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTeardowns();
  }, []);

  return { teardowns, loading, error, refreshTeardowns };
};

export const useTeardown = (id: string) => {
  const [teardown, setTeardown] = useState<Teardown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeardown = async () => {
      try {
        setLoading(true);
        const data = await SupabaseDataStore.getInstance().getTeardownById(id);
        setTeardown(data);
        setError(null);
      } catch (err) {
        setError('Failed to load teardown');
        console.error('Error loading teardown:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeardown();
    }
  }, [id]);

  return { teardown, loading, error };
};

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<SubmittedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSubmissions = async () => {
    try {
      setLoading(true);
      const data = await SupabaseDataStore.getInstance().getSubmissions();
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load submissions');
      console.error('Error loading submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubmissions();
  }, []);

  return { submissions, loading, error, refreshSubmissions };
};

export const useStats = () => {
  const [stats, setStats] = useState({
    totalTeardowns: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    subscriberCount: 0,
    monthlyPageviews: 47820,
    totalUsers: 8234
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = async () => {
    try {
      setLoading(true);
      const data = await SupabaseDataStore.getInstance().getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load stats');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return { stats, loading, error, refreshStats };
};