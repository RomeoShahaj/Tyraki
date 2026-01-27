import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../contexts/AppContext'
import { analyzeFile } from '../services/api'
import {
  detectSubscriptionsFromTransactions,
  mergeDuplicateSubscriptions
} from '../utils/subscriptionDetection'

export function useFileUpload() {
  const { t } = useTranslation()
  const {
    setUploadState,
    setUploadProgress,
    setResults,
    setPendingResults,
    openModal,
    clearCategories
  } = useApp()

  const handleFiles = useCallback(async (files) => {
    if (files.length === 0) return

    setUploadState('loading')
    clearCategories()

    try {
      const allSubscriptions = []
      const allTransactions = []
      let totalTransactions = 0

      // Upload each file and collect subscriptions AND transactions
      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total: files.length })

        const data = await analyzeFile(files[i])

        if (data.success) {
          if (data.subscriptions) {
            allSubscriptions.push(...data.subscriptions)
          }
          if (data.transactions) {
            allTransactions.push(...data.transactions)
          }
          totalTransactions += data.transactions_analyzed || 0
        }
      }

      // For multiple files: detect subscriptions from merged transactions
      let recurringSubscriptions
      if (files.length > 1 && allTransactions.length > 0) {
        recurringSubscriptions = detectSubscriptionsFromTransactions(allTransactions)
      } else {
        // Single file: use server-detected subscriptions
        const mergedSubscriptions = mergeDuplicateSubscriptions(allSubscriptions)
        recurringSubscriptions = mergedSubscriptions.filter(sub => {
          return (sub.occurrences || 1) >= 2
        })
      }

      // Check if there are unknown charges that need confirmation
      const unknowns = recurringSubscriptions.filter(sub => sub.needsConfirmation)
      const known = recurringSubscriptions.filter(sub => !sub.needsConfirmation)

      if (unknowns.length > 0) {
        // Show confirmation modal FIRST
        setPendingResults({
          known,
          unknowns,
          totalMonthly: recurringSubscriptions.reduce((sum, s) => sum + (s.monthly_cost || 0), 0),
          totalYearly: recurringSubscriptions.reduce((sum, s) => sum + (s.monthly_cost || 0), 0) * 12,
          transactionsAnalyzed: totalTransactions
        })
        openModal('confirmation')
      } else {
        // No unknowns, show results directly
        const totalMonthly = known.reduce((sum, s) => sum + (s.monthly_cost || 0), 0)
        const totalYearly = totalMonthly * 12

        setResults({
          subscriptions: known,
          totalMonthly: Math.round(totalMonthly * 100) / 100,
          totalYearly: Math.round(totalYearly * 100) / 100,
          transactionsAnalyzed: totalTransactions
        })
        openModal('results')
      }

      setUploadState('idle')
    } catch (error) {
      console.error('Error:', error)
      setUploadState('error')
      // You might want to show an error modal here
    }
  }, [
    setUploadState,
    setUploadProgress,
    setResults,
    setPendingResults,
    openModal,
    clearCategories
  ])

  return { handleFiles }
}
