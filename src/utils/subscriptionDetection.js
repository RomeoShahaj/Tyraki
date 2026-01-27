// Extract month from date string
function extractMonth(dateStr) {
  if (!dateStr) return null

  // Handle "Apr 16, 2025" format
  const monthNames = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  }

  const match1 = dateStr.match(/([a-z]+)\s+(\d+),?\s+(\d{4})/i)
  if (match1) {
    const month = monthNames[match1[1].toLowerCase().substring(0, 3)]
    return month ? `${match1[3]}-${month}` : null
  }

  // Handle "16/04/2025" format
  const match2 = dateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/)
  if (match2) {
    return `${match2[3]}-${match2[2].padStart(2, '0')}`
  }

  return null
}

// Detect subscriptions from merged transactions (for multi-file uploads)
export function detectSubscriptionsFromTransactions(transactions) {
  const subscriptions = []
  const chargeGroups = new Map()

  // Group transactions by normalized description
  transactions.forEach(t => {
    const desc = t.description.trim().toUpperCase()
    if (!chargeGroups.has(desc)) {
      chargeGroups.set(desc, [])
    }
    chargeGroups.get(desc).push(t)
  })

  // Analyze each group
  chargeGroups.forEach((txns, desc) => {
    // Get unique months
    const months = new Set()
    txns.forEach(t => {
      const month = extractMonth(t.date)
      if (month) months.add(month)
    })

    // Must appear in 2+ different months
    if (months.size < 2) return

    // Get costs and check consistency
    const costs = txns.map(t => Math.abs(t.amount)).filter(c => c > 0 && c < 500)
    if (costs.length === 0) return

    const avgCost = costs.reduce((sum, c) => sum + c, 0) / costs.length
    const variance = costs.reduce((sum, c) => sum + Math.pow(c - avgCost, 2), 0) / costs.length
    const stdDev = Math.sqrt(variance)
    const cv = (stdDev / avgCost) * 100

    // Price must be consistent (< 10% variation)
    if (cv > 10) return

    subscriptions.push({
      name: desc.substring(0, 30),
      monthly_cost: Math.round(avgCost * 100) / 100,
      occurrences: months.size,
      confidence: 'medium',
      needsConfirmation: true // Unknown charges need confirmation
    })
  })

  return subscriptions
}

// Merge duplicate subscriptions
export function mergeDuplicateSubscriptions(subscriptions) {
  const map = new Map()

  subscriptions.forEach(sub => {
    if (!map.has(sub.name)) {
      map.set(sub.name, { ...sub })
    } else {
      const existing = map.get(sub.name)
      // Average the costs
      const totalCost = existing.monthly_cost + sub.monthly_cost
      existing.monthly_cost = Math.round((totalCost / 2) * 100) / 100
      // SUM the occurrences (CRITICAL!)
      existing.occurrences = (existing.occurrences || 1) + (sub.occurrences || 1)
      // Update confidence if now recurring
      if (existing.occurrences >= 2) {
        existing.confidence = 'high'
      }
    }
  })

  return Array.from(map.values())
}
