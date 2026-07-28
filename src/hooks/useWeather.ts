import { useQuery } from '@tanstack/react-query'

export interface HourlyPoint {
  time: string
  temperature: number
  windSpeed: number
  precipitation: number
  weatherCode: number
  isDay: boolean
}

export interface WeatherData {
  temperature: number
  windSpeed: number
  weatherCode: number
  isDay: boolean
  precipitation: number
  hourly: HourlyPoint[]
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
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,is_day,precipitation&hourly=temperature_2m,weather_code,wind_speed_10m,precipitation,is_day`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Weather fetch failed')
      const json = await res.json()
      const now = new Date()
      const currentHourIndex = json.hourly.time.findIndex((t: string) => new Date(t) >= now)
      const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0
      const hourly: HourlyPoint[] = json.hourly.time
        .slice(startIndex, startIndex + 24)
        .map((time: string, i: number) => ({
          time,
          temperature: Math.round(json.hourly.temperature_2m[startIndex + i]),
          windSpeed: Math.round(json.hourly.wind_speed_10m[startIndex + i]),
          precipitation: Math.round((json.hourly.precipitation[startIndex + i] ?? 0) * 10) / 10,
          weatherCode: json.hourly.weather_code[startIndex + i],
          isDay: json.hourly.is_day[startIndex + i] === 1,
        }))
      const data: WeatherData = {
        temperature: Math.round(json.current.temperature_2m),
        windSpeed: Math.round(json.current.wind_speed_10m),
        weatherCode: json.current.weather_code,
        isDay: json.current.is_day === 1,
        precipitation: Math.round((json.current.precipitation ?? 0) * 10) / 10,
        hourly,
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

export type JumpScoreLevel = 'excellent' | 'good' | 'moderate' | 'poor' | 'noJump'

export interface JumpScore {
  score: number
  level: JumpScoreLevel
  labelKey: string
  adviceKey: string
}

export function calculateJumpScore(weather: WeatherData | null | undefined): JumpScore {
  if (!weather) return { score: 0, level: 'noJump', labelKey: 'weather.noJump', adviceKey: 'weather.scoreNoJump' }

  const { windSpeed, precipitation, weatherCode } = weather
  let score = 100

  // Wind penalties
  if (windSpeed > 25) score -= 60
  else if (windSpeed > 18) score -= 35
  else if (windSpeed > 12) score -= 15
  else if (windSpeed > 8) score -= 5

  // Precipitation penalties
  if (precipitation > 5) score -= 50
  else if (precipitation > 2) score -= 30
  else if (precipitation > 0.5) score -= 15
  else if (precipitation > 0) score -= 5

  // Weather code penalties
  if (weatherCode >= 95) score -= 80
  else if (weatherCode >= 71) score -= 50
  else if (weatherCode >= 61 || weatherCode >= 80) score -= 40
  else if (weatherCode >= 51) score -= 20
  else if (weatherCode >= 45) score -= 15
  else if (weatherCode === 3) score -= 5

  score = Math.max(0, Math.min(100, score))

  let level: JumpScoreLevel
  if (score >= 85) level = 'excellent'
  else if (score >= 65) level = 'good'
  else if (score >= 45) level = 'moderate'
  else if (score >= 20) level = 'poor'
  else level = 'noJump'

  const labelKey = `weather.${level}`
  const adviceKey = `weather.score${level.charAt(0).toUpperCase() + level.slice(1)}`

  return { score, level, labelKey, adviceKey }
}

export function getWeatherTipKey(weather: WeatherData | null | undefined): string {
  if (!weather) return 'weather.perfectTip'
  if (weather.weatherCode >= 95 || weather.weatherCode >= 71) return 'weather.rainTip'
  if (weather.precipitation > 0.5) return 'weather.rainTip'
  if (weather.windSpeed > 18) return 'weather.windyTip'
  if (weather.temperature > 32) return 'weather.hotTip'
  return 'weather.perfectTip'
}
