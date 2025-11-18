import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { UserCircle2 } from 'lucide-react'
import { useRecommendationPreferences } from '../context/RecommendationPreferencesContext'
import { RecommendationStatus } from '../types/recommendation'

const getDisplayStatusLabel = (status: RecommendationStatus) => {
  switch (status) {
    case 'INTERESTED':
      return 'Interested'
    case 'NOT_INTERESTED':
      return 'Not Interested'
    case 'ALREADY_INVESTED':
      return 'Already Invested'
    default:
      return ''
  }
}

/**
 * ProfilePage
 * Shows basic user details (from onboarding) and groups recommendations
 * by the status the user has selected on the recommendation cards.
 */
export const ProfilePage: React.FC = () => {
  const { preferences } = useRecommendationPreferences()

  // Load user details from existing localStorage entries used during onboarding
  const userDetails = useMemo(() => {
    const mandatoryRaw = localStorage.getItem('mandatoryDetails')
    const optionalRaw = localStorage.getItem('optionalDetails')
    const mandatory = mandatoryRaw ? JSON.parse(mandatoryRaw) : null
    const optional = optionalRaw ? JSON.parse(optionalRaw) : null

    const phone = localStorage.getItem('userPhone')

    if (!mandatory && !optional && !phone) return null

    return {
      phone: phone ? `+91 ${phone}` : undefined,
      age: mandatory?.age,
      investmentAmount: mandatory?.investmentAmount,
      riskPreference: mandatory?.riskPreference,
      monthlyIncome: optional?.monthlyIncome,
      savings: optional?.savings,
      timeHorizon: optional?.timeHorizon,
      investmentExperience: optional?.investmentExperience,
      financialGoals: optional?.financialGoals,
      monthlyExpenses: optional?.monthlyExpenses
    }
  }, [])

  const interested = Object.values(preferences).filter(
    (pref) => pref.status === 'INTERESTED'
  )
  const notInterested = Object.values(preferences).filter(
    (pref) => pref.status === 'NOT_INTERESTED'
  )
  const alreadyInvested = Object.values(preferences).filter(
    (pref) => pref.status === 'ALREADY_INVESTED'
  )

  const hasAnyPreferences = interested.length + notInterested.length + alreadyInvested.length > 0

  const renderPreferenceList = (items: typeof interested) => {
    if (!items.length) {
      return (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No recommendations here yet.
        </p>
      )
    }

    return (
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm dark:border-gray-700"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
              <p className="text-xs text-primary-600 dark:text-primary-300 uppercase tracking-wide">
                {item.category}
              </p>
            </div>
            <span className="ml-4 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {getDisplayStatusLabel(item.status)}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserCircle2 className="h-10 w-10 text-primary-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Your Profile
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review your details and track your investment interests.
              </p>
            </div>
          </div>
          <Link
            to="/details"
            className="hidden sm:inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Edit Details
          </Link>
        </div>

        {/* User details */}
        <section className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              User Details
            </h2>
            <Link
              to="/details"
              className="sm:hidden inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Edit Details
            </Link>
          </div>

          {userDetails ? (
            <div className="grid gap-4 md:grid-cols-2">
              {userDetails.phone && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userDetails.phone}
                  </p>
                </div>
              )}
              {userDetails.age && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Age
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userDetails.age} years
                  </p>
                </div>
              )}
              {userDetails.investmentAmount && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Investment Amount
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{parseInt(userDetails.investmentAmount, 10).toLocaleString()}
                  </p>
                </div>
              )}
              {userDetails.riskPreference && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Risk Appetite
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userDetails.riskPreference}
                  </p>
                </div>
              )}
              {userDetails.monthlyIncome && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Monthly Income
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{parseInt(userDetails.monthlyIncome, 10).toLocaleString()}
                  </p>
                </div>
              )}
              {userDetails.savings && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Current Savings
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{parseInt(userDetails.savings, 10).toLocaleString()}
                  </p>
                </div>
              )}
              {userDetails.timeHorizon && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Time Horizon
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userDetails.timeHorizon}
                  </p>
                </div>
              )}
              {userDetails.investmentExperience && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Investment Experience
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userDetails.investmentExperience}
                  </p>
                </div>
              )}
              {userDetails.financialGoals && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Primary Financial Goal
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userDetails.financialGoals}
                  </p>
                </div>
              )}
              {userDetails.monthlyExpenses && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Monthly Expenses
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{parseInt(userDetails.monthlyExpenses, 10).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <p>
                Complete your profile to get better recommendations and a more personalized
                experience.
              </p>
              <Link
                to="/details"
                className="mt-3 inline-flex text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Go to details
              </Link>
            </div>
          )}
        </section>

        {/* Recommendation status sections */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Interested
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Ideas you want to keep an eye on.
            </p>
            {renderPreferenceList(interested)}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Not Interested
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Options that are not a fit for you right now.
            </p>
            {renderPreferenceList(notInterested)}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Already Invested
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Products you have already invested in.
            </p>
            {renderPreferenceList(alreadyInvested)}
          </div>
        </section>

        {!hasAnyPreferences && (
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-100">
            Start marking recommendations as Interested, Not Interested, or Already Invested to see
            them organized here.
          </div>
        )}
      </div>
    </div>
  )
}


