import { useQuery } from '@tanstack/react-query'

export interface WeatherData {
  temperature: number
  windSpeed: number
  weatherCode: number
  isDay: boolean
  precipitation: number
}

const weatherDescriptions: Record<number, { en: string; 'zh-TW': string; 'zh-CN': string }> = {
  0: { en: 'Clear sky', 'zh-TW': '晴朗', 'zh-CN': '晴朗' },
  1: { en: 'Mainly clear', 'zh-TW': '大致晴朗', 'zh-CN': '大致晴朗' },
  2: { en: 'Partly cloudy', 'zh-TW': '局部多雲', 'zh-CN': '局部多云' },
  3: { en: 'Overcast', 'zh-TW': '陰天', 'zh-CN': '阴天' },
  45: { en: 'Foggy', 'zh-TW': '有霧', 'zh-CN': '有雾' },
  48: { en: 'Foggy', 'zh-TW': '有霧', 'zh-CN': '有雾' },
  51: { en: 'Light drizzle', 'zh-TW': '小毛毛雨', 'zh-CN': '小毛毛雨' },
  53: { en: 'Drizzle', 'zh-TW': '毛毛雨', 'zh-CN': '毛毛雨' },
  55: { en: 'Heavy drizzle', 'zh-TW': '大毛毛雨', 'zh-CN': '大毛毛雨' },
  61: { en: 'Light rain', 'zh-TW': '小雨', 'zh-CN': '小雨' },
  63: { en: 'Rain', 'zh-TW': '雨', 'zh-CN': '雨' },
  65: { en: 'Heavy rain', 'zh-TW': '大雨', 'zh-CN': '大雨' },
  71: { en: 'Light snow', 'zh-TW': '小雪', 'zh-CN': '小雪' },
  73: { en: 'Snow', 'zh-TW': '雪', 'zh-CN': '雪' },
  75: { en: 'Heavy snow', 'zh-TW': '大雪', 'zh-CN': '大雪' },
  80: { en: 'Showers', 'zh-TW': '陣雨', 'zh-CN': '阵雨' },
  81: { en: 'Heavy showers', 'zh-TW': '大陣雨', 'zh-CN': '大阵雨' },
  82: { en: 'Violent showers', 'zh-TW': '強陣雨', 'zh-CN': '强阵雨' },
  95: { en: 'Thunderstorm', 'zh-TW': '雷暴', 'zh-CN': '雷暴' },
  96: { en: 'Thunderstorm with hail', 'zh-TW': '雷暴夾冰雹', 'zh-CN': '雷暴夹冰雹' },
  99: { en: 'Thunderstorm with hail', 'zh-TW': '雷暴夾冰雹', 'zh-CN': '雷暴夹冰雹' },
}

export function describeWeather(code: number, lang: 'en' | 'zh-TW' | 'zh-CN' = 'en'): string {
  return weatherDescriptions[code]?.[lang] ?? '—'
}

const ONE_DAY = 1000 * 60 * 60 * 24

const cacheKey = (lat: number, lon: number) => `weather:${lat}:${lon}`

interface CachedWeather {
  data: WeatherData
  updatedAt: number
}

export function readCachedWeather(lat: number | null | undefined, lon: number | null | undefined): CachedWeather | null {
  if (lat == null || lon == null || typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(cacheKey(lat, lon))
    if (!raw) return null
    return JSON.parse(raw) as CachedWeather
  } catch {
    return null
  }
}

export function useWeather(lat: number | null | undefined, lon: number | null | undefined) {
  return useQuery({
    queryKey: ['weather', lat, lon],
    enabled: lat != null && lon != null,
    staleTime: ONE_DAY,
    gcTime: ONE_DAY * 7,
    refetchInterval: ONE_DAY,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: 2,
    queryFn: async (): Promise<WeatherData> => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,is_day,precipitation`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Weather fetch failed')
      const json = await res.json()
      const data: WeatherData = {
        temperature: Math.round(json.current.temperature_2m),
        windSpeed: Math.round(json.current.wind_speed_10m),
        weatherCode: json.current.weather_code,
        isDay: json.current.is_day === 1,
        precipitation: Math.round((json.current.precipitation ?? 0) * 10) / 10,
      }
      if (typeof window !== 'undefined' && lat != null && lon != null) {
        try {
          window.localStorage.setItem(cacheKey(lat, lon), JSON.stringify({ data, updatedAt: Date.now() }))
        } catch {
          /* ignore quota */
        }
      }
      return data
    },
  })
}
