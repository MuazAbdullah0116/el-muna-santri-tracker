
// Re-export all Google Sheets services
export * from './santri.service';
export * from './setoran.service';
export { googleSheetsService } from './sheets.service';

// Default export with all services
import * as santriService from './santri.service';
import * as setoranService from './setoran.service';

export default {
  ...santriService,
  ...setoranService
};
