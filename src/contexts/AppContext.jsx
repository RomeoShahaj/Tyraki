import { createContext, useContext, useReducer } from 'react'

const AppContext = createContext(null)

const initialState = {
  // Upload state
  uploadState: 'idle', // 'idle' | 'loading' | 'error'
  uploadProgress: { current: 0, total: 0 },

  // Results
  subscriptions: [],
  totalMonthly: 0,
  totalYearly: 0,
  transactionsAnalyzed: 0,

  // Categorization
  subscriptionCategories: {},

  // Modals
  activeModal: null, // 'results' | 'confirmation' | null

  // Unknown charges confirmation
  unknownChargesConfirmation: {},
  pendingResults: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_UPLOAD_STATE':
      return { ...state, uploadState: action.payload }

    case 'SET_UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.payload }

    case 'SET_RESULTS':
      return {
        ...state,
        subscriptions: action.payload.subscriptions,
        totalMonthly: action.payload.totalMonthly,
        totalYearly: action.payload.totalYearly,
        transactionsAnalyzed: action.payload.transactionsAnalyzed,
      }

    case 'SET_SUBSCRIPTION_CATEGORY':
      return {
        ...state,
        subscriptionCategories: {
          ...state.subscriptionCategories,
          [action.payload.name]: action.payload.category
        }
      }

    case 'CLEAR_CATEGORIES':
      return { ...state, subscriptionCategories: {} }

    case 'SET_ACTIVE_MODAL':
      return { ...state, activeModal: action.payload }

    case 'SET_PENDING_RESULTS':
      return { ...state, pendingResults: action.payload }

    case 'SET_UNKNOWN_CHARGE_CONFIRMATION':
      return {
        ...state,
        unknownChargesConfirmation: {
          ...state.unknownChargesConfirmation,
          [action.payload.name]: action.payload.isSubscription
        }
      }

    case 'CLEAR_UNKNOWN_CONFIRMATIONS':
      return { ...state, unknownChargesConfirmation: {} }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = {
    state,
    dispatch,
    // Convenience methods
    setUploadState: (uploadState) => dispatch({ type: 'SET_UPLOAD_STATE', payload: uploadState }),
    setUploadProgress: (progress) => dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress }),
    setResults: (results) => dispatch({ type: 'SET_RESULTS', payload: results }),
    setSubscriptionCategory: (name, category) => dispatch({
      type: 'SET_SUBSCRIPTION_CATEGORY',
      payload: { name, category }
    }),
    clearCategories: () => dispatch({ type: 'CLEAR_CATEGORIES' }),
    openModal: (modal) => dispatch({ type: 'SET_ACTIVE_MODAL', payload: modal }),
    closeModal: () => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null }),
    setPendingResults: (results) => dispatch({ type: 'SET_PENDING_RESULTS', payload: results }),
    setUnknownChargeConfirmation: (name, isSubscription) => dispatch({
      type: 'SET_UNKNOWN_CHARGE_CONFIRMATION',
      payload: { name, isSubscription }
    }),
    clearUnknownConfirmations: () => dispatch({ type: 'CLEAR_UNKNOWN_CONFIRMATIONS' }),
    reset: () => dispatch({ type: 'RESET' }),
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
