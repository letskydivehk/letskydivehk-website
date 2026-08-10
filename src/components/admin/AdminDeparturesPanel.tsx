import { useState } from 'react'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, CalendarDays, Save } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import { useIndoorService, useServiceDepartures } from '@/hooks/useServiceDepartures'

const STATUSES = ['open', 'closed', 'cancelled'] as const

export function AdminDeparturesPanel() {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const { data: indoor } = useIndoorService()
  const { data: departures, isLoading } = useServiceDepartures(indoor?.service.id)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, { capacity: number; status: string }>>({})

  const save = async (id: string) => {
    const draft = drafts[id]
    if (!draft) return
    setSavingId(id)
    const { error } = await supabase
      .from('service_departures')
      .update({ capacity: draft.capacity, status: draft.status })
      .eq('id', id)
    setSavingId(null)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(t('admin.departures.save'))
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    queryClient.invalidateQueries({ queryKey: ['service-departures'] })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-accent-orange" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-accent-orange" />
        <h2 className="text-xl font-bold text-foreground">{t('admin.departures.title')}</h2>
      </div>

      {(!departures || departures.length === 0) && (
        <p className="text-sm text-muted-foreground">{t('departures.none')}</p>
      )}

      <div className="space-y-3">
        {departures?.map((d) => {
          const draft = drafts[d.id] ?? { capacity: d.capacity, status: d.status }
          const dirty = !!drafts[d.id]
          return (
            <div
              key={d.id}
              className="rounded-xl border border-border bg-card/60 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {format(new Date(d.departure_date), 'yyyy-MM-dd (EEE)')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('admin.departures.booked')}: {d.seats_taken} / {d.capacity}
                </p>
              </div>

              <label className="text-xs text-muted-foreground flex items-center gap-2">
                {t('admin.departures.capacity')}
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={draft.capacity}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [d.id]: { ...draft, capacity: Number(e.target.value) },
                    }))
                  }
                  className="w-20 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm"
                />
              </label>

              <label className="text-xs text-muted-foreground flex items-center gap-2">
                {t('admin.departures.status')}
                <select
                  value={draft.status}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [d.id]: { ...draft, status: e.target.value },
                    }))
                  }
                  className="px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={() => save(d.id)}
                disabled={!dirty || savingId === d.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-orange text-white text-sm font-semibold disabled:opacity-40 cursor-pointer"
              >
                {savingId === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t('admin.departures.save')}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
