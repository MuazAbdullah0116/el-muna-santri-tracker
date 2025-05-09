
// This file is now just a re-export of the restructured services
// for backwards compatibility

import supabaseServices from './supabase';

// Re-export everything from the new structure
export * from './supabase';

// Re-export the default export as well
export default supabaseServices;
