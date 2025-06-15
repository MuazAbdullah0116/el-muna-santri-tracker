
import { Setoran } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const SantriProfileSetoranTable = ({ 
  setorans, 
  isLoading 
}: { 
  setorans: Setoran[];
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">
        Memuat data setoran...
      </div>
    );
  }

  if (!setorans.length) {
    return (
      <div className="text-muted-foreground text-sm">
        Belum ada riwayat setoran.
      </div>
    );
  }

  return (
    <div>
      <div className="font-semibold mb-2">Riwayat Setoran Terbaru</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Surat</TableHead>
            <TableHead>Juz</TableHead>
            <TableHead>Ayat</TableHead>
            <TableHead>Kelancaran</TableHead>
            <TableHead>Tajwid</TableHead>
            <TableHead>Tahsin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {setorans.slice(0, 15).map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.tanggal}</TableCell>
              <TableCell>{s.surat}</TableCell>
              <TableCell>{s.juz}</TableCell>
              <TableCell>
                {s.awal_ayat}-{s.akhir_ayat}
              </TableCell>
              <TableCell>{s.kelancaran}</TableCell>
              <TableCell>{s.tajwid}</TableCell>
              <TableCell>{s.tahsin}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SantriProfileSetoranTable;
