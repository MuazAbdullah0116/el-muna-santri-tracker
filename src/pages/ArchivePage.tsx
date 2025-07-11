import React from 'react';
import Layout from '@/components/Layout';
import ArchiveManagement from '@/components/archive/ArchiveManagement';

export default function ArchivePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Manajemen Arsip Data</h1>
          <p className="text-muted-foreground mt-2">
            Kelola migrasi otomatis data setoran ke Google Sheets
          </p>
        </div>
        
        <ArchiveManagement />
      </div>
    </Layout>
  );
}