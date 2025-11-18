import React, { useState } from 'react'
import { useRecommendationPreferences } from '../context/RecommendationPreferencesContext'
import { RecommendationStatus } from '../types/recommendation'

type RecommendationCardProps = {
  id: string
  name: string
  category: string
  score?: number | string | null
  explanation?: string
}

const statusLabelMap: Record<Exclude<RecommendationStatus, null>, string> = {
  INTERESTED: 'Interested',
  NOT_INTERESTED: 'Not Interested',
  ALREADY_INVESTED: 'Already Invested'
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  id,
  name,
  category,
  score,
  explanation
}) => {
  const { getStatus, setStatus } = useRecommendationPreferences()
  const currentStatus = getStatus(id)
  const [lastMessage, setLastMessage] = useState<string | null>(null)

  const hasScore = score !== undefined && score !== null && score !== ''
  const displayScore =
    typeof score === 'number'
      ? score.toFixed(1)
      : typeof score === 'string'
      ? score
      : null

  const handleStatusChange = (status: RecommendationStatus) => {
    setStatus({
      id,
      name,
      category,
      status
    })

    if (status && statusLabelMap[status]) {
      setLastMessage(`Marked as ${statusLabelMap[status]}.`)
    } else {
      setLastMessage('Preference cleared.')
    }

    // Clear the inline message after a short delay
    window.setTimeout(() => setLastMessage(null), 2500)
  }

  const buildButtonClasses = (status: RecommendationStatus, baseClasses: string) => {
    const isActive = currentStatus === status
    if (!isActive) return baseClasses
    return `${baseClasses} border-primary-600 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-100`
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {category}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
        </div>
        {hasScore && displayScore && (
          <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
            Score: {displayScore}
          </span>
        )}
      </div>

      {explanation && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{explanation}</p>
      )}

      {/* Status action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleStatusChange('INTERESTED')}
          className={buildButtonClasses(
            'INTERESTED',
            'text-xs sm:text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
          )}
        >
          Interested
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange('NOT_INTERESTED')}
          className={buildButtonClasses(
            'NOT_INTERESTED',
            'text-xs sm:text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
          )}
        >
          Not Interested
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange('ALREADY_INVESTED')}
          className={buildButtonClasses(
            'ALREADY_INVESTED',
            'text-xs sm:text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
          )}
        >
          Already Invested
        </button>
      </div>

      {lastMessage && (
        <p className="mt-2 text-xs text-green-700 dark:text-green-300">{lastMessage}</p>
      )}
    </div>
  )
}

