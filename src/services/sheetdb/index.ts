
// Re-export all SheetDB services
export * from './santri.service';
export * from './setoran.service';

import * as santriService from './santri.service';
import * as setoranService from './setoran.service';

export default {
  ...santriService,
  ...setoranService
};
