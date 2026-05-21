'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { getProfileSettings } from '@/app/actions/settings'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import es from '@/locales/es.json'

type Language = 'English' | 'French' | 'Spanish' | 'German' | 'Arabic'
type Currency = string // ISO Code e.g. 'USD', 'EUR', 'RWF'

interface SettingsContextType {
  language: Language
  currency: Currency
  setLanguage: (lang: Language) => void
  setCurrency: (curr: Currency) => void
  t: (path: string, options?: Record<string, string>) => string
  formatPrice: (amount: number) => string
  exchangeRates: Record<string, number>
  loading: boolean
  isHostMode: boolean
  setHostMode: (mode: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const locales: Record<string, any> = {
  'English': en,
  'French': fr,
  'Spanish': es,
  // Fallbacks for others for now
  'German': en, 
  'Arabic': en
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [language, setLanguageState] = useState<Language>('English')
  const [currency, setCurrencyState] = useState<Currency>('USD')
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 })
  const [loading, setLoading] = useState(true)
  const [isHostMode, setIsHostModeState] = useState(false)

  // 0. Load HostMode from local
  useEffect(() => {
    const saved = localStorage.getItem('urugostay_host_mode')
    if (saved === 'true') setIsHostModeState(true)
  }, [])

  const setHostMode = (mode: boolean) => {
    setIsHostModeState(mode)
    localStorage.setItem('urugostay_host_mode', String(mode))
  }

  // 1. Fetch Profile Settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (status === 'authenticated') {
        const profile = await getProfileSettings()
        if (profile) {
          if (profile.language) setLanguageState(profile.language as Language)
          if (profile.currency) setCurrencyState(profile.currency)
        }
      } else if (status === 'unauthenticated') {
        // Reset host mode on sign out
        setIsHostModeState(false)
        localStorage.removeItem('urugostay_host_mode')
      }
      setLoading(false)
    }
    fetchSettings()
  }, [status])

  // 2. Fetch Exchange Rates (Base USD) with Caching
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const CACHE_KEY = 'urugostay_exchange_rates'
        const CACHE_TIME_KEY = 'urugostay_exchange_rates_timestamp'
        const ONE_DAY = 24 * 60 * 60 * 1000

        const cached = localStorage.getItem(CACHE_KEY)
        const timestamp = localStorage.getItem(CACHE_TIME_KEY)
        const now = Date.now()

        if (cached && timestamp && (now - Number(timestamp) < ONE_DAY)) {
          setExchangeRates(JSON.parse(cached))
          return
        }

        const res = await fetch('https://open.er-api.com/v6/latest/USD')
        const data = await res.json()
        if (data && data.rates) {
          setExchangeRates(data.rates)
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.rates))
          localStorage.setItem(CACHE_TIME_KEY, String(now))
        }
      } catch (err) {
        console.error('Failed to fetch exchange rates:', err)
      }
    }
    fetchRates()
  }, [])

  const setLanguage = (lang: Language) => setLanguageState(lang)
  const setCurrency = (curr: Currency) => setCurrencyState(curr)

  // 3. Translation Helper
  const t = useCallback((path: string, options?: Record<string, string>) => {
    const keys = path.split('.')
    let current = locales[language] || locales['English']
    
    for (const key of keys) {
      if (!current || current[key] === undefined) return path
      current = current[key]
    }
    
    let translation = current as string
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        translation = translation.replace(`{{${key}}}`, value)
      })
    }
    
    return translation
  }, [language])

  // 4. Currency Formatter
  const formatPrice = useCallback((amount: number) => {
    const rate = exchangeRates[currency] || 1
    const converted = amount * rate
    
    return new Intl.NumberFormat(language === 'English' ? 'en-US' : language === 'French' ? 'fr-FR' : 'es-ES', {
      style: 'currency',
      currency: currency,
    }).format(converted)
  }, [currency, exchangeRates, language])

  return (
    <SettingsContext.Provider value={{
      language,
      currency,
      setLanguage,
      setCurrency,
      t,
      formatPrice,
      exchangeRates,
      loading,
      isHostMode,
      setHostMode
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
