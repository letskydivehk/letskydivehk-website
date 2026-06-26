
ALTER TABLE public.souvenirs
  ADD COLUMN IF NOT EXISTS original_price numeric,
  ADD COLUMN IF NOT EXISTS bulk_pricing jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS customisation_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS vendor_note_en text,
  ADD COLUMN IF NOT EXISTS vendor_note_zh_tw text,
  ADD COLUMN IF NOT EXISTS vendor_note_zh_cn text;
