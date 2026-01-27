export async function analyzeFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Server error: ${response.status} ${text}`)
  }

  return response.json()
}

export async function createCheckout() {
  const response = await fetch('/api/create-checkout')

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  return response.json()
}

export async function verifyPayment(sessionId) {
  const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)

  if (!response.ok) {
    throw new Error('Failed to verify payment')
  }

  return response.json()
}
