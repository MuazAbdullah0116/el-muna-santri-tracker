import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/services/supabase/client';

interface SpreadsheetTestResult {
  success: boolean;
  records?: any[];
  error?: string;
}

const SpreadsheetTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SpreadsheetTestResult | null>(null);
  
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1VqZv8EtcB3AWMOANiDNw4xFqD4AyonJemPgBRJ8Moys/edit?usp=sharing';
  const sheetId = '1VqZv8EtcB3AWMOANiDNw4xFqD4AyonJemPgBRJ8Moys';

  const testSpreadsheetAccess = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🔍 Testing spreadsheet access for:', sheetUrl);
      
      const { data, error } = await supabase.functions.invoke('fetch-sheets-data', {
        method: 'POST',
        body: { 
          spreadsheetId: sheetId,
          sheetUrl: sheetUrl 
        }
      });

      if (error) {
        console.error('❌ Error calling edge function:', error);
        setResult({
          success: false,
          error: `Edge function error: ${error.message}`
        });
        return;
      }

      console.log('📄 Spreadsheet response:', data);
      
      if (data?.success) {
        setResult({
          success: true,
          records: data.records || []
        });
      } else {
        setResult({
          success: false,
          error: data?.error || 'Unknown error'
        });
      }
    } catch (error) {
      console.error('❌ Test error:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Test Akses Google Sheets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Spreadsheet URL:
          </p>
          <p className="text-xs font-mono bg-muted p-2 rounded break-all">
            {sheetUrl}
          </p>
        </div>

        <Button 
          onClick={testSpreadsheetAccess}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Akses Spreadsheet'
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <h3 className="font-medium">
                {result.success ? 'Berhasil!' : 'Gagal!'}
              </h3>
            </div>
            
            {result.success ? (
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                  Berhasil mengakses spreadsheet. Ditemukan {result.records?.length || 0} record.
                </p>
                
                {result.records && result.records.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Sample Data (3 record pertama):</h4>
                    <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded border overflow-x-auto">
                      {JSON.stringify(result.records.slice(0, 3), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                  Error: {result.error}
                </p>
                <div className="text-xs text-red-600 dark:text-red-500">
                  <p>Kemungkinan penyebab:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Spreadsheet tidak dapat diakses publik</li>
                    <li>URL spreadsheet tidak valid</li>
                    <li>Spreadsheet kosong</li>
                    <li>Format data tidak sesuai</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpreadsheetTest;