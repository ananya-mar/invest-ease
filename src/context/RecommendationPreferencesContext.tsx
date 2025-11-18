import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  RecommendationPreference,
  RecommendationStatus,
  RecommendationStatusUpdatePayload
} from '../types/recommendation'

interface RecommendationPreferencesContextValue {
  preferences: Record<string, RecommendationPreference>
  setStatus: (payload: RecommendationStatusUpdatePayload) => void
  getStatus: (id: string) => RecommendationStatus
}

const RecommendationPreferencesContext =
  createContext<RecommendationPreferencesContextValue | null>(null)

const STORAGE_KEY = 'recommendationPreferences'

/**
 * Persist preferences in localStorage so the profile and recommendation pages
 * share the same source of truth across sessions.
 */
const loadFromStorage = (): Record<string, RecommendationPreference> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as RecommendationPreference[]
    return parsed.reduce<Record<string, RecommendationPreference>>((acc, pref) => {
      acc[pref.id] = pref
      return acc
    }, {})
  } catch {
    return {}
  }
}

const saveToStorage = (prefs: Record<string, RecommendationPreference>) => {
  const list = Object.values(prefs)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const RecommendationPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [preferences, setPreferences] = useState<Record<string, RecommendationPreference>>({})

  // Load from localStorage on first mount
  useEffect(() => {
    const initial = loadFromStorage()
    setPreferences(initial)
  }, [])

  // Keep localStorage in sync whenever preferences change
  useEffect(() => {
    saveToStorage(preferences)
  }, [preferences])

  const value = useMemo<RecommendationPreferencesContextValue>(
    () => ({
      preferences,
      getStatus: (id: string) => preferences[id]?.status ?? null,
      setStatus: ({ id, name, category, status }: RecommendationStatusUpdatePayload) => {
        setPreferences((prev) => {
          if (!status) {
            const { [id]: _removed, ...rest } = prev
            return rest
          }
          return {
            ...prev,
            [id]: {
              id,
              name,
              category,
              status
            }
          }
        })
      }
    }),
    [preferences]
  )

  return (
    <RecommendationPreferencesContext.Provider value={value}>
      {children}
    </RecommendationPreferencesContext.Provider>
  )
}

export const useRecommendationPreferences = (): RecommendationPreferencesContextValue => {
  const ctx = useContext(RecommendationPreferencesContext)
  if (!ctx) {
    throw new Error(
      'useRecommendationPreferences must be used within a RecommendationPreferencesProvider'
    )
  }
  return ctx
}


