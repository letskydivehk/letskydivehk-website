import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, ClipboardList, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STATUSES = [
  { value: 'pending', label: '待確認' },
  { value: 'confirmed', label: '已確認' },
  { value: 'cancelled', label: '已取消' },
] as const

const badge: Record<string, string> = {
  pending: 'bg-accent-orange/15 text-accent-orange',
  confirmed: 'bg-primary/15 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
}

export function AdminBookingsPanel() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-bookings'],
    refetchInterval: 60_000,
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, preferred_date, participants, status, payment_status, first_name, last_name, email, phone, created_at, locations(Name), location_services(service_name)')
        .order('preferred_date', { ascending: false })
        .limit(1000)
      if (error) throw error
      return data as any[]
    },
  })

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (data ?? []).filter((b) =>
      (filter === 'all' || b.status === filter) &&
      (!q || `${b.first_name} ${b.last_name} ${b.email} ${b.phone}`.toLowerCase().includes(q)))
  }, [data, filter, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data?.length ?? 0 }
    data?.forEach((b) => { c[b.status] = (c[b.status] ?? 0) + 1 })
    return c
  }, [data])

  const updateStatus = async (id: string, status: string) => {
    setSavingId(id)
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    setSavingId(null)
    if (error) return toast.error(error.message)
    toast.success('狀態已更新')
    qc.invalidateQueries({ queryKey: ['admin-bookings'] })
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">預約管理</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> 重新整理
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[{ value: 'all', label: '全部' }, ...STATUSES].map((s) => (
          <Button key={s.value} size="sm" variant={filter === s.value ? 'default' : 'outline'} onClick={() => setFilter(s.value)}>
            {s.label} ({counts[s.value] ?? 0})
          </Button>
        ))}
        <Input placeholder="搜尋姓名 / 電郵 / 電話" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs h-9" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              {['日期', '人數', '客人', '基地 / 項目', '訂金', '狀態'].map((h) => <th key={h} className="text-left p-3 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">沒有預約</td></tr>}
            {rows.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3 whitespace-nowrap">{b.preferred_date}</td>
                <td className="p-3">{b.participants}</td>
                <td className="p-3">
                  <div className="font-medium text-foreground">{b.first_name} {b.last_name}</div>
                  <div className="text-xs text-muted-foreground">{b.email} · {b.phone}</div>
                </td>
                <td className="p-3">
                  <div>{b.locations?.Name ?? '-'}</div>
                  <div className="text-xs text-muted-foreground">{b.location_services?.service_name ?? ''}</div>
                </td>
                <td className="p-3 text-xs">{b.payment_status === 'succeeded' || b.payment_status === 'paid' ? '已付' : (b.payment_status ?? '未付')}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={b.status}
                      disabled={savingId === b.id}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`rounded-md px-2 py-1 text-xs font-medium border border-border ${badge[b.status] ?? ''}`}
                    >
                      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    {savingId === b.id && <Loader2 className="w-3 h-3 animate-spin" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
