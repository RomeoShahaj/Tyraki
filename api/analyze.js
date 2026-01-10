const formidable = require('formidable');
const XLSX = require('xlsx');
const fs = require('fs');

// Disable body parsing, we'll handle it with formidable
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

// Known subscription services with their patterns and categories
const KNOWN_SERVICES = [
  // Streaming
  { pattern: /netflix/i, name: 'Netflix', category: 'streaming', avgCost: 12.99 },
  { pattern: /spotify/i, name: 'Spotify', category: 'streaming', avgCost: 9.99 },
  { pattern: /disney\+|disneyplus/i, name: 'Disney+', category: 'streaming', avgCost: 8.99 },
  { pattern: /hbo\s?max/i, name: 'HBO Max', category: 'streaming', avgCost: 9.99 },
  { pattern: /youtube\s?(premium|music)/i, name: 'YouTube Premium', category: 'streaming', avgCost: 11.99 },
  { pattern: /apple\s?(tv|music)/i, name: 'Apple TV+', category: 'streaming', avgCost: 6.99 },
  { pattern: /amazon\s?prime|prime\s?video/i, name: 'Amazon Prime', category: 'streaming', avgCost: 8.99 },
  { pattern: /ertflix/i, name: 'Ertflix', category: 'streaming', avgCost: 0 },
  { pattern: /cinobo/i, name: 'Cinobo', category: 'streaming', avgCost: 4.99 },

  // Telecom - Greek
  { pattern: /cosmote|κοσμοτε|ote/i, name: 'Cosmote', category: 'telecom', avgCost: 35.00 },
  { pattern: /vodafone|vodaf/i, name: 'Vodafone', category: 'telecom', avgCost: 30.00 },
  { pattern: /wind\s?(hellas)?/i, name: 'Wind', category: 'telecom', avgCost: 25.00 },
  { pattern: /nova|forthnet/i, name: 'Nova', category: 'telecom', avgCost: 40.00 },

  // Software
  { pattern: /microsoft|office\s?365|ms\s?365/i, name: 'Microsoft 365', category: 'software', avgCost: 10.00 },
  { pattern: /adobe|creative\s?cloud/i, name: 'Adobe Creative Cloud', category: 'software', avgCost: 54.99 },
  { pattern: /google\s?(one|storage|workspace)/i, name: 'Google One', category: 'software', avgCost: 2.99 },
  { pattern: /icloud/i, name: 'iCloud+', category: 'software', avgCost: 2.99 },
  { pattern: /dropbox/i, name: 'Dropbox', category: 'software', avgCost: 11.99 },
  { pattern: /linkedin\s?premium/i, name: 'LinkedIn Premium', category: 'software', avgCost: 29.99 },
  { pattern: /notion/i, name: 'Notion', category: 'software', avgCost: 8.00 },
  { pattern: /canva/i, name: 'Canva Pro', category: 'software', avgCost: 12.99 },
  { pattern: /grammarly/i, name: 'Grammarly', category: 'software', avgCost: 12.00 },

  // Gym
  { pattern: /holmes\s?place/i, name: 'Holmes Place', category: 'gym', avgCost: 85.00 },
  { pattern: /mcfit|mc\s?fit/i, name: 'McFit', category: 'gym', avgCost: 24.90 },
  { pattern: /gold'?s?\s?gym/i, name: "Gold's Gym", category: 'gym', avgCost: 45.00 },
  { pattern: /gym|γυμναστ/i, name: 'Γυμναστήριο', category: 'gym', avgCost: 35.00 },

  // Utilities - Greek
  { pattern: /δεη|dei|ppc/i, name: 'ΔΕΗ', category: 'utility', avgCost: 80.00 },
  { pattern: /ευδαπ|eydap/i, name: 'ΕΥΔΑΠ', category: 'utility', avgCost: 25.00 },
  { pattern: /δεπα|depa|φυσικο\s?αεριο/i, name: 'Φυσικό Αέριο', category: 'utility', avgCost: 50.00 },

  // Other services
  { pattern: /playstation|ps\s?(plus|now)/i, name: 'PlayStation Plus', category: 'other', avgCost: 8.99 },
  { pattern: /xbox\s?(live|game\s?pass)/i, name: 'Xbox Game Pass', category: 'other', avgCost: 12.99 },
  { pattern: /nintendo/i, name: 'Nintendo Online', category: 'other', avgCost: 3.99 },
  { pattern: /tinder|bumble|hinge/i, name: 'Dating App', category: 'other', avgCost: 14.99 },
  { pattern: /headspace|calm/i, name: 'Meditation App', category: 'other', avgCost: 12.99 },
  { pattern: /duolingo/i, name: 'Duolingo Plus', category: 'other', avgCost: 6.99 },

  // Insurance - Greek
  { pattern: /interamerican/i, name: 'Interamerican', category: 'other', avgCost: 50.00 },
  { pattern: /eurolife/i, name: 'Eurolife', category: 'other', avgCost: 45.00 },
  { pattern: /generali/i, name: 'Generali', category: 'other', avgCost: 40.00 },
  { pattern: /nn\s?hellas/i, name: 'NN Hellas', category: 'other', avgCost: 55.00 },
];

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the uploaded file
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file?.[0] || files.file;
    if (!file) {
      return res.status(400).json({ error: 'Δεν ανέβηκε αρχείο' });
    }

    // Read and parse the file
    let transactions = [];
    const filePath = file.filepath || file.path;
    const fileName = file.originalFilename || file.name || '';
    const fileExt = fileName.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv') {
      // Parse CSV
      const content = fs.readFileSync(filePath, 'utf-8');
      transactions = parseCSV(content);
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      // Parse Excel
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      transactions = data.map(row => {
        const amount = row['Ποσό'] || row['Amount'] || row['Χρέωση'] || row['Debit'] ||
                       row['ποσό'] || row['amount'] || Object.values(row).find(v => typeof v === 'number');
        const desc = row['Περιγραφή'] || row['Description'] || row['Αιτιολογία'] ||
                     row['περιγραφή'] || row['description'] || Object.values(row).find(v => typeof v === 'string' && v.length > 5);
        const date = row['Ημερομηνία'] || row['Date'] || row['Ημ/νία'] ||
                     row['ημερομηνία'] || row['date'];
        return { date, description: String(desc || ''), amount: parseFloat(amount) || 0 };
      });
    } else {
      return res.status(400).json({
        error: 'Μη υποστηριζόμενος τύπος αρχείου',
        message: 'Υποστηρίζονται μόνο CSV και Excel αρχεία'
      });
    }

    // Filter valid transactions
    transactions = transactions.filter(t => t.description && t.description.length > 2);

    if (transactions.length === 0) {
      return res.status(400).json({
        error: 'Δεν βρέθηκαν συναλλαγές',
        message: 'Το αρχείο δεν περιέχει έγκυρες συναλλαγές'
      });
    }

    // Find subscriptions using pattern matching
    const foundSubscriptions = new Map();

    transactions.forEach(t => {
      const desc = t.description;

      for (const service of KNOWN_SERVICES) {
        if (service.pattern.test(desc)) {
          // Use actual amount if negative (charge), otherwise use average
          let cost = Math.abs(t.amount);
          if (cost === 0 || cost > 500) {
            cost = service.avgCost;
          }

          // Track by service name to avoid duplicates
          if (!foundSubscriptions.has(service.name)) {
            foundSubscriptions.set(service.name, {
              name: service.name,
              monthly_cost: cost,
              category: service.category,
              confidence: 'high'
            });
          } else {
            // Update cost if we found a more accurate one
            const existing = foundSubscriptions.get(service.name);
            if (cost > 0 && cost < existing.monthly_cost) {
              existing.monthly_cost = cost;
            }
          }
          break; // Don't match multiple services for same transaction
        }
      }
    });

    // Convert to array
    const subscriptions = Array.from(foundSubscriptions.values());

    // Calculate totals
    const totalMonthly = subscriptions.reduce((sum, s) => sum + (s.monthly_cost || 0), 0);
    const totalYearly = totalMonthly * 12;

    // Clean up temp file
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      // Ignore cleanup errors
    }

    return res.status(200).json({
      success: true,
      subscriptions,
      total_monthly: Math.round(totalMonthly * 100) / 100,
      total_yearly: Math.round(totalYearly * 100) / 100,
      count: subscriptions.length,
      transactions_analyzed: transactions.length
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: 'Σφάλμα επεξεργασίας',
      message: error.message || 'Υπήρξε πρόβλημα με την ανάλυση του αρχείου'
    });
  }
};

// Parse CSV content
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  // Detect delimiter
  const firstLine = lines[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';

  // Parse header
  const headers = parseCSVLine(firstLine, delimiter).map(h => h.trim().toLowerCase());

  // Find relevant columns
  const descIndex = headers.findIndex(h =>
    h.includes('περιγραφή') || h.includes('description') || h.includes('αιτιολογία') || h.includes('details')
  );
  const amountIndex = headers.findIndex(h =>
    h.includes('ποσό') || h.includes('amount') || h.includes('χρέωση') || h.includes('debit') || h.includes('value')
  );
  const dateIndex = headers.findIndex(h =>
    h.includes('ημερομηνία') || h.includes('date') || h.includes('ημ/νία')
  );

  // If we can't find columns by name, use position guessing
  const useDesc = descIndex >= 0 ? descIndex : 1;
  const useAmount = amountIndex >= 0 ? amountIndex : 2;

  // Parse rows
  const transactions = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter);
    if (values.length > Math.max(useDesc, useAmount)) {
      const amountStr = values[useAmount] || '0';
      const amount = parseFloat(amountStr.replace(/[€$,]/g, '').replace(',', '.')) || 0;

      transactions.push({
        date: dateIndex >= 0 ? values[dateIndex] : '',
        description: values[useDesc] || '',
        amount: amount
      });
    }
  }

  return transactions;
}

// Parse a single CSV line handling quotes
function parseCSVLine(line, delimiter) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}
