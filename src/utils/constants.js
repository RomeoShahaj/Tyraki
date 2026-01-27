export const categoryIcons = {
  streaming: '🎬',
  telecom: '📱',
  software: '💻',
  gym: '🏋️',
  utility: '⚡',
  other: '📦',
  unknown: '❓'
}

export const CANCEL_URLS = {
  // Streaming & Entertainment
  'Netflix': {
    url: 'https://www.netflix.com/cancelplan',
    notes: 'Εύκολη ακύρωση μέσω ρυθμίσεων λογαριασμού. Αμέση εφαρμογή.'
  },
  'Spotify': {
    url: 'https://www.spotify.com/account',
    notes: 'Μετάβαση στο "Change plan" και επιλογή "Cancel Premium".'
  },
  'Spotify Premium': {
    url: 'https://www.spotify.com/account',
    notes: 'Μετάβαση στο "Change plan" και επιλογή "Cancel Premium".'
  },
  'YouTube Premium': {
    url: 'https://www.youtube.com/paid_memberships',
    notes: 'Στην ενότητα Subscriptions, επιλέξτε Deactivate.'
  },
  'YouTube TV': {
    url: 'https://tv.youtube.com/settings',
    notes: 'Πρέπει πρώτα να κάνετε pause ή να ακυρώσετε.'
  },
  'Hulu': {
    url: 'https://account.hulu.com',
    notes: 'Αναζητήστε το κουμπί "Cancel".'
  },
  'Disney+': {
    url: 'https://www.disneyplus.com/account',
    notes: 'Στο Account, επιλέξτε "Billing details" > "Cancel subscription".'
  },
  'HBO Max': {
    url: 'https://account.hbomax.com',
    notes: 'Εξαρτάται από την πηγή χρέωσης (direct vs third-party).'
  },
  'Apple TV+': {
    url: 'https://appleid.apple.com',
    notes: 'Μετάβαση στις Subscriptions.'
  },
  'Amazon Prime': {
    url: 'https://www.amazon.com/primecentral',
    notes: 'Προσοχή: Θα προσπαθήσουν να σας κρατήσουν με προσφορές retention.'
  },
  'Paramount+': {
    url: 'https://www.paramountplus.com/account',
    notes: 'Εύκολη ακύρωση.'
  },
  'Peacock': {
    url: 'https://www.peacocktv.com/account',
    notes: 'Στα Plan Details.'
  },

  // AI & Developer Tools
  'ChatGPT Plus': {
    url: 'https://chat.openai.com/settings',
    notes: 'Στην ενότητα Subscription.'
  },
  'Claude Pro': {
    url: 'https://claude.ai/settings',
    notes: 'Στην ενότητα Subscription.'
  },
  'Midjourney': {
    url: 'https://www.midjourney.com/account',
    notes: 'Κάτω από Manage Sub.'
  },
  'GitHub Copilot': {
    url: 'https://github.com/settings/copilot',
    notes: 'Στην ενότητα Subscription.'
  },
  'Replit': {
    url: 'https://replit.com/account',
    notes: 'Στην ενότητα Subscription.'
  },
  'Cursor': {
    url: 'https://cursor.sh/settings',
    notes: 'Στην ενότητα Subscription.'
  },
  'ElevenLabs': {
    url: 'https://elevenlabs.io/subscription',
    notes: 'Στο προφίλ σας.'
  },
  'Railway': {
    url: 'https://railway.app/account/billing',
    notes: 'Ελέγξτε πρώτα τη χρήση σας.'
  },
  'Vercel': {
    url: 'https://vercel.com/account',
    notes: 'Διαφορετική διαδικασία για Team vs Personal.'
  },

  // Productivity
  'Notion': {
    url: 'https://www.notion.so/my-account',
    notes: 'Κάτω από Plans.'
  },
  'Superhuman': {
    url: 'https://superhuman.com/settings',
    notes: 'Απαιτείται email.'
  },
  'Dropbox': {
    url: 'https://www.dropbox.com/account/plan',
    notes: 'Προσοχή: Προσφορές retention.'
  },
  '1Password': {
    url: 'https://1password.com/account',
    notes: 'Ελέγξτε αν είναι Family ή Individual.'
  },
  'Todoist': {
    url: 'https://todoist.com/app/settings/subscription',
    notes: 'Εύκολη ακύρωση.'
  },
  'Evernote': {
    url: 'https://www.evernote.com/account',
    notes: 'Προσοχή: Dark patterns (δύσκολη ακύρωση).'
  },

  // Social & Communication
  'X Premium': {
    url: 'https://twitter.com/settings/subscriptions',
    notes: 'Κάτω από Monetization.'
  },
  'Discord Nitro': {
    url: 'https://discord.com/settings/subscriptions',
    notes: 'Εύκολη ακύρωση.'
  },
  'LinkedIn Premium': {
    url: 'https://www.linkedin.com/premium/cancel',
    notes: 'Προσοχή: Πολλές οθόνες retention.'
  },
  'Slack': {
    url: 'https://slack.com/account/settings',
    notes: 'Μόνο ο Workspace Admin μπορεί να ακυρώσει.'
  },

  // News & Media
  'NYTimes': {
    url: 'https://www.nytimes.com/subscription',
    notes: '⚠️ Ορισμένα πλάνα απαιτούν τηλεφωνική επικοινωνία: 1-800-591-9233'
  },
  'WSJ': {
    url: 'https://www.wsj.com/account',
    notes: '⚠️ Ενδέχεται να απαιτείται τηλεφωνική επικοινωνία.'
  },
  'Washington Post': {
    url: 'https://www.washingtonpost.com/my-account',
    notes: 'Κάτω από Subscription.'
  },
  'The Athletic': {
    url: 'https://theathletic.com/account',
    notes: 'Κάτω από Membership.'
  },
  'Substack': {
    url: 'https://substack.com/account/settings',
    notes: 'Ξεχωριστή ακύρωση ανά publication.'
  },

  // Music & Audio
  'Apple Music': {
    url: 'https://music.apple.com/account/subscriptions',
    notes: 'Ή από Settings > [Your Name] > Subscriptions > Apple Music.'
  },
  'Tidal': {
    url: 'https://listen.tidal.com/settings/subscription',
    notes: 'Στις ρυθμίσεις λογαριασμού.'
  },

  // Cloud Storage
  'iCloud': {
    url: 'https://www.icloud.com/settings',
    notes: 'Settings > [Your Name] > iCloud > Manage Storage > Change Storage Plan.'
  },
  'Google One': {
    url: 'https://one.google.com/settings',
    notes: 'Επιλέξτε "Cancel membership" στις ρυθμίσεις.'
  },
  'Google Drive': {
    url: 'https://one.google.com/settings',
    notes: 'Η Google Drive χρησιμοποιεί Google One για συνδρομές.'
  },

  // Fitness (Dark Pattern Warnings)
  'ClassPass': {
    url: 'https://classpass.com/account',
    notes: 'Προσοχή: Τα credits λήγουν μετά την ακύρωση.'
  },
  'Peloton': {
    url: 'https://www.onepeloton.com/membership',
    notes: 'Διαφορετική διαδικασία για App vs Equipment συνδρομές.'
  },
  'Planet Fitness': {
    url: null,
    notes: '⚠️ Απαιτείται προσωπική επίσκεψη στο home club σας. Δεν γίνεται online ακύρωση.'
  },
  'LA Fitness': {
    url: null,
    notes: '⚠️ Απαιτείται προσωπική επίσκεψη ή συστημένη επιστολή με 30ήμερη προειδοποίηση.'
  },
  '24 Hour Fitness': {
    url: null,
    notes: '⚠️ Τηλέφωνο: 1-800-432-6348. Προσοχή: Retention scripts.'
  },
  'Equinox': {
    url: null,
    notes: '⚠️ Απαιτείται συστημένη επιστολή με 45ήμερη προειδοποίηση. Contract trap!'
  },
  'Anytime Fitness': {
    url: null,
    notes: '⚠️ Διαφέρει ανά franchise. Ελέγξτε το συμβόλαιό σας.'
  }
}

export const FREE_LIMIT = 5
