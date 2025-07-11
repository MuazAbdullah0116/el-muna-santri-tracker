import React from 'react';
import Layout from '@/components/Layout';
import GoogleSheetsSetup from '@/components/archive/GoogleSheetsSetup';

export default function SetupGoogleSheets() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Setup Google Sheets Database</h1>
          <p className="text-muted-foreground mt-2">
            Konfigurasi Google Sheets sebagai database arsip untuk sistem migrasi otomatis
          </p>
        </div>
        
        <GoogleSheetsSetup />
      </div>
    </Layout>
  );
}