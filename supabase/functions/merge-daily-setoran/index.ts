import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Setoran {
  id: string
  santri_id: string
  tanggal: string
  surat: string
  juz: number
  awal_ayat: number
  akhir_ayat: number
  kelancaran: number
  tajwid: number
  tahsin: number
  diuji_oleh: string
  catatan: string | null
  created_at: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    console.log(`🔄 Starting daily setoran merge for date: ${today}`)

    // Find all setoran for today grouped by santri
    const { data: todaySetoran, error: fetchError } = await supabaseClient
      .from('setoran')
      .select('*')
      .eq('tanggal', today)
      .order('santri_id')
      .order('created_at')

    if (fetchError) {
      console.error('❌ Error fetching setoran:', fetchError)
      throw fetchError
    }

    if (!todaySetoran || todaySetoran.length === 0) {
      console.log('✅ No setoran found for today')
      return new Response(
        JSON.stringify({ success: true, message: 'No setoran found for today' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Group setoran by santri_id
    const groupedSetoran = todaySetoran.reduce((acc: Record<string, Setoran[]>, setoran) => {
      if (!acc[setoran.santri_id]) {
        acc[setoran.santri_id] = []
      }
      acc[setoran.santri_id].push(setoran as Setoran)
      return acc
    }, {})

    let mergedCount = 0
    let deletedCount = 0

    // Process each santri's setoran
    for (const [santriId, setoranList] of Object.entries(groupedSetoran)) {
      if (setoranList.length <= 1) {
        console.log(`ℹ️ Santri ${santriId} has only ${setoranList.length} setoran, skipping`)
        continue
      }

      console.log(`🔄 Merging ${setoranList.length} setoran for santri ${santriId}`)

      // Sort by created_at to get the earliest one as base
      setoranList.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      
      const baseSetoran = setoranList[0]
      const additionalSetoran = setoranList.slice(1)

      // Calculate merged data
      const allAyat = setoranList.flatMap(s => 
        Array.from({ length: s.akhir_ayat - s.awal_ayat + 1 }, (_, i) => s.awal_ayat + i)
      )
      const uniqueAyat = [...new Set(allAyat)].sort((a, b) => a - b)
      
      const avgKelancaran = Math.round(setoranList.reduce((sum, s) => sum + s.kelancaran, 0) / setoranList.length)
      const avgTajwid = Math.round(setoranList.reduce((sum, s) => sum + s.tajwid, 0) / setoranList.length)
      const avgTahsin = Math.round(setoranList.reduce((sum, s) => sum + s.tahsin, 0) / setoranList.length)

      // Combine notes
      const allNotes = setoranList
        .map(s => s.catatan)
        .filter(note => note && note.trim())
        .join('; ')

      // Update the base setoran with merged data
      const { error: updateError } = await supabaseClient
        .from('setoran')
        .update({
          awal_ayat: uniqueAyat[0],
          akhir_ayat: uniqueAyat[uniqueAyat.length - 1],
          kelancaran: avgKelancaran,
          tajwid: avgTajwid,
          tahsin: avgTahsin,
          catatan: allNotes || null
        })
        .eq('id', baseSetoran.id)

      if (updateError) {
        console.error(`❌ Error updating base setoran for santri ${santriId}:`, updateError)
        continue
      }

      // Delete additional setoran
      const idsToDelete = additionalSetoran.map(s => s.id)
      const { error: deleteError } = await supabaseClient
        .from('setoran')
        .delete()
        .in('id', idsToDelete)

      if (deleteError) {
        console.error(`❌ Error deleting additional setoran for santri ${santriId}:`, deleteError)
        continue
      }

      mergedCount++
      deletedCount += idsToDelete.length
      
      console.log(`✅ Successfully merged ${setoranList.length} setoran into 1 for santri ${santriId}`)
    }

    const result = {
      success: true,
      message: `Daily merge completed. Merged ${mergedCount} santri records, deleted ${deletedCount} duplicate records`,
      date: today,
      mergedSantri: mergedCount,
      deletedRecords: deletedCount
    }

    console.log('✅ Daily merge completed:', result)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('❌ Error in merge function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})