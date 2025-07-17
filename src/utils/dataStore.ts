// Legacy DataStore - replaced by SupabaseDataStore
// This file is kept for backward compatibility during migration
import SupabaseDataStore from './supabaseDataStore';

// Re-export types and instance for backward compatibility
export { Teardown, SubmittedStory } from './supabaseDataStore';
export default SupabaseDataStore;