
/**
 * Google Apps Script for Santri & Setoran management
 * Ganti SPREADSHEET_ID dengan ID Spreadsheet kamu!
 */

const SPREADSHEET_ID = '1FZgqf_Kc_R8MBDaGHMwrQef1KT4-PUWWRR41_L5xmxA'; // GANTI DENGAN MILIKMU

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const action = e.parameter.action;
    switch (action) {
      case 'getAllSantri':
        return getAllSantri();
      case 'getSantriById':
        return getSantriById(e.parameter.id);
      case 'createSantri':
        return createSantri(JSON.parse(e.parameter.data));
      case 'deleteSantri':
        return deleteSantri(e.parameter.id);
      case 'searchSantri':
        return searchSantri(e.parameter.query);
      case 'getSantriByClass':
        return getSantriByClass(e.parameter.kelas);
      case 'getAllSetoran':
        return getAllSetoran();
      case 'getSetoranBySantri':
        return getSetoranBySantri(e.parameter.santriId);
      case 'createSetoran':
        return createSetoran(JSON.parse(e.parameter.data));
      case 'deleteSetoran':
        return deleteSetoran(e.parameter.id);
      default:
        return createResponse({error: 'Invalid action'}, 400);
    }
  } catch (error) {
    Logger.log(error); // Untuk debug di log eksekusi
    return createResponse({error: error.toString()}, 500);
  }
}

function createResponse(data, code = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// --------------------- SANTRI FUNCTIONS ---------------------
function getAllSantri() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Santri');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return createResponse([]);
  const headers = data[0];
  const rows = data.slice(1);
  const santris = rows.map(row => {
    const santri = {};
    headers.forEach((header, i) => { santri[header.toLowerCase()] = row[i]; });
    return santri;
  });
  return createResponse(santris);
}

function getSantriById(id) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Santri');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return createResponse(null);
  const headers = data[0];
  const rows = data.slice(1);
  const santriRow = rows.find(row => row[0] === id);
  if (!santriRow) return createResponse(null);
  const santri = {};
  headers.forEach((header, i) => { santri[header.toLowerCase()] = santriRow[i]; });
  return createResponse(santri);
}

function createSantri(santriData) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Santri');
  const id = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  const newRow = [
    id,
    santriData.nama,
    santriData.kelas,
    santriData.jenis_kelamin,
    0, // total_hafalan default
    timestamp
  ];
  sheet.appendRow(newRow);
  const createdSantri = {
    id: id,
    nama: santriData.nama,
    kelas: santriData.kelas,
    jenis_kelamin: santriData.jenis_kelamin,
    total_hafalan: 0,
    created_at: timestamp
  };
  return createResponse(createdSantri);
}

function deleteSantri(id) {
  const santriSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Santri');
  const setoranSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Setoran');
  
  // First, delete all setoran records for this santri
  deleteAllSetoranBySantriId(id);
  
  // Then delete the santri record
  const santriData = santriSheet.getDataRange().getValues();
  for (let i = 1; i < santriData.length; i++) {
    if (santriData[i][0] === id) {
      santriSheet.deleteRow(i + 1);
      return createResponse({success: true, message: 'Santri dan semua riwayat setoran berhasil dihapus'});
    }
  }
  return createResponse({error: 'Santri not found'}, 404);
}

function searchSantri(query) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Santri');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return createResponse([]);
  const headers = data[0];
  const rows = data.slice(1);
  const filteredRows = rows.filter(row => 
    String(row[1]).toLowerCase().includes(String(query).toLowerCase())
  );
  const santris = filteredRows.map(row => {
    const santri = {};
    headers.forEach((header, i) => { santri[header.toLowerCase()] = row[i]; });
    return santri;
  });
  return createResponse(santris);
}

function getSantriByClass(kelas) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Santri');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return createResponse([]);
  const headers = data[0];
  const rows = data.slice(1);
  const filteredRows = rows.filter(row => String(row[2]) === String(kelas));
  const santris = filteredRows.map(row => {
    const santri = {};
    headers.forEach((header, i) => { santri[header.toLowerCase()] = row[i]; });
    return santri;
  });
  return createResponse(santris);
}

// --------------------- SETORAN FUNCTIONS ---------------------
function getAllSetoran() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Setoran');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return createResponse([]);
  const headers = data[0];
  const rows = data.slice(1);
  const setorans = rows.map(row => {
    const setoran = {};
    headers.forEach((header, i) => { setoran[header.toLowerCase()] = row[i]; });
    return setoran;
  });
  return createResponse(setorans);
}

function getSetoranBySantri(santriId) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Setoran');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return createResponse([]);
  const headers = data[0];
  const rows = data.slice(1);
  const filteredRows = rows.filter(row => row[1] === santriId);
  const setorans = filteredRows.map(row => {
    const setoran = {};
    headers.forEach((header, i) => { setoran[header.toLowerCase()] = row[i]; });
    return setoran;
  });
  return createResponse(setorans);
}

function createSetoran(setoranData) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Setoran');
  const id = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  const newRow = [
    id,
    setoranData.santri_id,
    setoranData.tanggal,
    setoranData.juz,
    setoranData.surat,
    setoranData.awal_ayat,
    setoranData.akhir_ayat,
    setoranData.kelancaran,
    setoranData.tajwid,
    setoranData.tahsin,
    setoranData.catatan || '',
    setoranData.diuji_oleh,
    timestamp
  ];
  sheet.appendRow(newRow);
  updateTotalHafalan(setoranData.santri_id);
  const createdSetoran = {
    id: id,
    santri_id: setoranData.santri_id,
    tanggal: setoranData.tanggal,
    juz: setoranData.juz,
    surat: setoranData.surat,
    awal_ayat: setoranData.awal_ayat,
    akhir_ayat: setoranData.akhir_ayat,
    kelancaran: setoranData.kelancaran,
    tajwid: setoranData.tajwid,
    tahsin: setoranData.tahsin,
    catatan: setoranData.catatan || '',
    diuji_oleh: setoranData.diuji_oleh,
    created_at: timestamp
  };
  return createResponse(createdSetoran);
}

function deleteSetoran(id) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Setoran');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      const santriId = data[i][1];
      sheet.deleteRow(i + 1);
      updateTotalHafalan(santriId);
      return createResponse({success: true});
    }
  }
  return createResponse({error: 'Setoran not found'}, 404);
}

/**
 * Helper function to delete all setoran records for a specific santri
 * Called when a santri is deleted to maintain data consistency
 */
function deleteAllSetoranBySantriId(santriId) {
  const setoranSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Setoran');
  const data = setoranSheet.getDataRange().getValues();
  
  if (data.length <= 1) return; // No data to delete
  
  // Start from the bottom to avoid index shifting issues when deleting rows
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][1] === santriId) { // santri_id is in column B (index 1)
      setoranSheet.deleteRow(i + 1);
      Logger.log(`Deleted setoran record at row ${i + 1} for santri ${santriId}`);
    }
  }
  
  Logger.log(`All setoran records deleted for santri ${santriId}`);
}

function updateTotalHafalan(santriId) {
  const setoranSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Setoran');
  const santriSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Santri');
  const setoranData = setoranSheet.getDataRange().getValues();
  let totalAyat = 0;
  if (setoranData.length > 1) {
    const setoranRows = setoranData.slice(1);
    const santriSetorans = setoranRows.filter(row => row[1] === santriId);
    totalAyat = santriSetorans.reduce((sum, row) => {
      const awalAyat = Number(row[5]);
      const akhirAyat = Number(row[6]);
      return sum + (akhirAyat - awalAyat + 1);
    }, 0);
  }
  const santriData = santriSheet.getDataRange().getValues();
  for (let i = 1; i < santriData.length; i++) {
    if (santriData[i][0] === santriId) {
      santriSheet.getRange(i + 1, 5).setValue(totalAyat); // kolom E = total_hafalan
      break;
    }
  }
}
