
// Re-export all Sheety services
export * from './setoran.service';

// Default export with all services
import * as setoranService from './setoran.service';

export default {
  ...setoranService
};
