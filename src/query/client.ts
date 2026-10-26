import { QueryClient } from '@tanstack/react-query';

// Shared query client. Local SQLite reads are cheap and always fresh after a
// mutation invalidates, so no stale-time tuning is needed for the offline core.
export const queryClient = new QueryClient();
