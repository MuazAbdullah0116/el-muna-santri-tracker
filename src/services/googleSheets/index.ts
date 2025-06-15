
// Re-export all Google Sheets services (tidak akan digunakan lagi)
// Dipertahankan agar import lama tidak error, namun seluruh aplikasi kini pakai Supabase!
export * from './santri.service';
export * from './setoran.service';
export { googleSheetsService } from './sheets.service';

import * as santriService from './santri.service';
import * as setoranService from './setoran.service';

export default {
  ...santriService,
  ...setoranService
};
