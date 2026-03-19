

# Polish Blog Post Content (3 articles)

The three blog posts to update are:
1. **First Time Skydiving: Everything You Need to Know**
2. **What to Wear Skydiving: A Complete Guide**
3. **Tandem vs AFF: Which Course is Right for You?**

The "Skydiving Safety FAQ" is excluded per your request.

---

## What Will Be Improved

Each article will get significantly richer, more engaging content in all three languages (EN, zh-TW, zh-CN):

### 1. First Time Skydiving Guide
- Add an engaging intro paragraph with emotional hook
- Expand "Before the Jump" with arrival, paperwork, weather briefing details
- Add a "Day of Your Jump — Step by Step" timeline section
- Expand freefall and canopy sections with sensory descriptions
- Add "After You Land" section (celebrations, media collection)
- Expand tips section with more practical advice (camera policy, glasses, medical notes)
- Add a closing CTA paragraph

### 2. What to Wear Skydiving
- Add intro explaining why clothing matters for comfort and safety
- Expand "The Basics" with seasonal advice (summer vs winter)
- Add "What About Glasses / Contact Lenses?" section
- Add "What We Provide" section (jumpsuit, goggles, helmet, harness)
- Expand "Pro Tips" with GoPro/camera mount considerations and post-jump outfit suggestions
- Add weather-specific dressing advice

### 3. Tandem vs AFF
- Add intro explaining the two paths more narratively
- Expand Tandem section with duration, cost expectations, what's included
- Expand AFF section with level breakdown, time commitment, progression details
- Add a comparison table in markdown (Training Time, Solo Flight, Cost, Duration, Certification)
- Add "Still Not Sure?" section with personality-based recommendation
- Stronger closing CTA

---

## Technical Approach

- Create a new SQL migration that uses `UPDATE` statements to replace the `content`, `content_zh_tw`, `content_zh_cn`, `excerpt`, `excerpt_zh_tw`, and `excerpt_zh_cn` columns for the 3 slugs
- No frontend code changes needed — the existing `react-markdown` renderer will handle the richer content automatically

### File Changes

| File | Action |
|------|--------|
| `supabase/migrations/new_migration.sql` | UPDATE 3 blog posts with polished content |

