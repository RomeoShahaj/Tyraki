const { IncomingForm } = require('formidable');
const XLSX = require('xlsx');
const fs = require('fs');
const pdfParse = require('pdf-parse').PDFParse;

// Known subscription services with their patterns and categories
const KNOWN_SERVICES = [
  // Streaming
  { pattern: /netflix/i, name: 'Netflix', category: 'streaming', avgCost: 12.99 },
  { pattern: /spotify/i, name: 'Spotify', category: 'streaming', avgCost: 9.99 },
  { pattern: /disney\+|disneyplus/i, name: 'Disney+', category: 'streaming', avgCost: 8.99 },
  { pattern: /hbo\s?max/i, name: 'HBO Max', category: 'streaming', avgCost: 9.99 },
  { pattern: /youtube\s?(premium|music)/i, name: 'YouTube Premium', category: 'streaming', avgCost: 11.99 },
  { pattern: /youtube\s?tv/i, name: 'YouTube TV', category: 'streaming', avgCost: 72.99 },
  { pattern: /hulu/i, name: 'Hulu', category: 'streaming', avgCost: 14.99 },
  { pattern: /apple\s?(tv|music)/i, name: 'Apple TV+', category: 'streaming', avgCost: 6.99 },
  { pattern: /amazon\s?prime|prime\s?video/i, name: 'Amazon Prime', category: 'streaming', avgCost: 8.99 },
  { pattern: /paramount\+|paramountplus/i, name: 'Paramount+', category: 'streaming', avgCost: 9.99 },
  { pattern: /peacock/i, name: 'Peacock', category: 'streaming', avgCost: 5.99 },
  { pattern: /ertflix/i, name: 'Ertflix', category: 'streaming', avgCost: 0 },
  { pattern: /cinobo/i, name: 'Cinobo', category: 'streaming', avgCost: 4.99 },
  { pattern: /siriusxm|sirius/i, name: 'SiriusXM', category: 'streaming', avgCost: 15.99 },

  // Telecom - Greek
  { pattern: /cosmote|κοσμοτε|ote/i, name: 'Cosmote', category: 'telecom', avgCost: 35.00 },
  { pattern: /vodafone|vodaf/i, name: 'Vodafone', category: 'telecom', avgCost: 30.00 },
  { pattern: /wind\s?(hellas)?/i, name: 'Wind', category: 'telecom', avgCost: 25.00 },
  { pattern: /nova|forthnet/i, name: 'Nova', category: 'telecom', avgCost: 40.00 },

  // AI & Developer Tools
  { pattern: /chatgpt|openai|gpt\s?plus/i, name: 'ChatGPT Plus', category: 'software', avgCost: 20.00 },
  { pattern: /claude\s?pro|anthropic/i, name: 'Claude Pro', category: 'software', avgCost: 20.00 },
  { pattern: /midjourney/i, name: 'Midjourney', category: 'software', avgCost: 30.00 },
  { pattern: /github\s?copilot/i, name: 'GitHub Copilot', category: 'software', avgCost: 10.00 },
  { pattern: /replit/i, name: 'Replit', category: 'software', avgCost: 20.00 },
  { pattern: /cursor/i, name: 'Cursor', category: 'software', avgCost: 20.00 },
  { pattern: /elevenlabs/i, name: 'ElevenLabs', category: 'software', avgCost: 22.00 },
  { pattern: /railway/i, name: 'Railway', category: 'software', avgCost: 5.00 },
  { pattern: /vercel/i, name: 'Vercel', category: 'software', avgCost: 20.00 },

  // Productivity Software
  { pattern: /microsoft|office\s?365|ms\s?365/i, name: 'Microsoft 365', category: 'software', avgCost: 10.00 },
  { pattern: /adobe|creative\s?cloud/i, name: 'Adobe Creative Cloud', category: 'software', avgCost: 54.99 },
  { pattern: /google\s?(one|storage|workspace)/i, name: 'Google One', category: 'software', avgCost: 2.99 },
  { pattern: /icloud/i, name: 'iCloud+', category: 'software', avgCost: 2.99 },
  { pattern: /dropbox/i, name: 'Dropbox', category: 'software', avgCost: 11.99 },
  { pattern: /notion/i, name: 'Notion', category: 'software', avgCost: 8.00 },
  { pattern: /canva/i, name: 'Canva Pro', category: 'software', avgCost: 12.99 },
  { pattern: /grammarly/i, name: 'Grammarly', category: 'software', avgCost: 12.00 },
  { pattern: /superhuman/i, name: 'Superhuman', category: 'software', avgCost: 30.00 },
  { pattern: /1password/i, name: '1Password', category: 'software', avgCost: 7.99 },
  { pattern: /todoist/i, name: 'Todoist', category: 'software', avgCost: 4.00 },
  { pattern: /evernote/i, name: 'Evernote', category: 'software', avgCost: 10.83 },

  // Social & Communication
  { pattern: /linkedin\s?premium/i, name: 'LinkedIn Premium', category: 'software', avgCost: 29.99 },
  { pattern: /x\s?premium|twitter\s?blue/i, name: 'X Premium', category: 'software', avgCost: 8.00 },
  { pattern: /discord\s?nitro/i, name: 'Discord Nitro', category: 'software', avgCost: 9.99 },
  { pattern: /slack/i, name: 'Slack', category: 'software', avgCost: 7.25 },

  // News & Media
  { pattern: /ny\s?times|nytimes/i, name: 'New York Times', category: 'news', avgCost: 17.00 },
  { pattern: /wsj|wall\s?street\s?journal/i, name: 'Wall Street Journal', category: 'news', avgCost: 38.99 },
  { pattern: /washington\s?post|wapo/i, name: 'Washington Post', category: 'news', avgCost: 12.00 },
  { pattern: /athletic/i, name: 'The Athletic', category: 'news', avgCost: 7.99 },
  { pattern: /substack/i, name: 'Substack', category: 'news', avgCost: 5.00 },
  { pattern: /medium/i, name: 'Medium', category: 'news', avgCost: 5.00 },

  // Fitness & Gym
  { pattern: /equinox/i, name: 'Equinox', category: 'gym', avgCost: 200.00 },
  { pattern: /24\s?hour\s?fitness/i, name: '24 Hour Fitness', category: 'gym', avgCost: 49.99 },
  { pattern: /planet\s?fitness/i, name: 'Planet Fitness', category: 'gym', avgCost: 24.99 },
  { pattern: /la\s?fitness/i, name: 'LA Fitness', category: 'gym', avgCost: 34.99 },
  { pattern: /anytime\s?fitness/i, name: 'Anytime Fitness', category: 'gym', avgCost: 41.99 },
  { pattern: /classpass/i, name: 'ClassPass', category: 'gym', avgCost: 79.00 },
  { pattern: /peloton/i, name: 'Peloton', category: 'gym', avgCost: 44.00 },
  { pattern: /holmes\s?place/i, name: 'Holmes Place', category: 'gym', avgCost: 85.00 },
  { pattern: /mcfit|mc\s?fit/i, name: 'McFit', category: 'gym', avgCost: 24.90 },
  { pattern: /gold'?s?\s?gym/i, name: "Gold's Gym", category: 'gym', avgCost: 45.00 },
  { pattern: /gym|γυμναστ/i, name: 'Γυμναστήριο', category: 'gym', avgCost: 35.00 },

  // Utilities - Greek
  { pattern: /δεη|dei|ppc/i, name: 'ΔΕΗ', category: 'utility', avgCost: 80.00 },
  { pattern: /ευδαπ|eydap/i, name: 'ΕΥΔΑΠ', category: 'utility', avgCost: 25.00 },
  { pattern: /δεπα|depa|φυσικο\s?αεριο/i, name: 'Φυσικό Αέριο', category: 'utility', avgCost: 50.00 },

  // Food Delivery & Transportation (Note: These match subscription passes only, not individual orders)
  // Removed generic patterns that match individual orders (wolt, uber, efood, etc.)
  // The price consistency check will filter out variable-price services anyway
  { pattern: /uber\s?one/i, name: 'Uber One', category: 'transportation', avgCost: 9.99 },
  { pattern: /uber\s?eats\s?pass/i, name: 'Uber Eats Pass', category: 'food', avgCost: 9.99 },
  { pattern: /wolt\+|wolt\s?plus/i, name: 'Wolt+', category: 'food', avgCost: 5.99 },
  { pattern: /efood\s?plus/i, name: 'efood Plus', category: 'food', avgCost: 3.99 },
  { pattern: /doordash\s?pass/i, name: 'DoorDash DashPass', category: 'food', avgCost: 9.99 },
  { pattern: /grubhub\+|grubhub\s?plus/i, name: 'Grubhub+', category: 'food', avgCost: 9.99 },
  { pattern: /lyft\s?pink/i, name: 'Lyft Pink', category: 'transportation', avgCost: 9.99 },
  { pattern: /deliveroo\s?plus/i, name: 'Deliveroo Plus', category: 'food', avgCost: 7.99 },

  // Gaming & Entertainment
  { pattern: /playstation|ps\s?(plus|now)/i, name: 'PlayStation Plus', category: 'other', avgCost: 8.99 },
  { pattern: /xbox\s?(live|game\s?pass)/i, name: 'Xbox Game Pass', category: 'other', avgCost: 12.99 },
  { pattern: /nintendo/i, name: 'Nintendo Online', category: 'other', avgCost: 3.99 },
  { pattern: /steam/i, name: 'Steam', category: 'gaming', avgCost: 0 },
  { pattern: /epic\s?games/i, name: 'Epic Games', category: 'gaming', avgCost: 0 },
  { pattern: /twitch/i, name: 'Twitch', category: 'streaming', avgCost: 4.99 },
  { pattern: /patreon/i, name: 'Patreon', category: 'other', avgCost: 10.00 },
  { pattern: /onlyfans/i, name: 'OnlyFans', category: 'other', avgCost: 15.00 },

  // Dating & Social
  { pattern: /tinder/i, name: 'Tinder Plus', category: 'dating', avgCost: 14.99 },
  { pattern: /bumble/i, name: 'Bumble Premium', category: 'dating', avgCost: 12.99 },
  { pattern: /hinge/i, name: 'Hinge+', category: 'dating', avgCost: 14.99 },
  { pattern: /match\.com/i, name: 'Match.com', category: 'dating', avgCost: 20.99 },

  // Health & Wellness
  { pattern: /headspace/i, name: 'Headspace', category: 'wellness', avgCost: 12.99 },
  { pattern: /calm/i, name: 'Calm', category: 'wellness', avgCost: 14.99 },
  { pattern: /duolingo/i, name: 'Duolingo Plus', category: 'education', avgCost: 6.99 },
  { pattern: /audible/i, name: 'Audible', category: 'entertainment', avgCost: 14.95 },
  { pattern: /kindle\s?unlimited/i, name: 'Kindle Unlimited', category: 'entertainment', avgCost: 9.99 },

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
    const form = new IncomingForm({
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

      // DEBUG: Log CSV structure
      console.log('=== CSV PARSING DEBUG ===');
      console.log('First 500 chars:', content.substring(0, 500));
      const lines = content.split('\n').filter(l => l.trim());
      console.log('Total lines:', lines.length);
      console.log('First line (headers):', lines[0]);

      transactions = parseCSV(content);

      console.log('Total transactions parsed:', transactions.length);
      console.log('First 10 transactions:', transactions.slice(0, 10));
      console.log('Last 10 transactions:', transactions.slice(-10));
      console.log('Date range:', transactions[0]?.date, 'to', transactions[transactions.length - 1]?.date);
      console.log('=== END CSV DEBUG ===');
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
    } else if (fileExt === 'pdf') {
      // Parse PDF
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new pdfParse({ data: dataBuffer });
      const result = await parser.getText();
      const text = result.text;
      await parser.destroy();

      // Try to parse as CSV-like text (bank statements often have structured text)
      transactions = parsePDFText(text);
    } else {
      return res.status(400).json({
        error: 'Μη υποστηριζόμενος τύπος αρχείου',
        message: 'Υποστηρίζονται CSV, Excel και PDF αρχεία'
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

    // Find subscriptions using frequency-based detection
    // First pass: Track all occurrences of each service
    const serviceOccurrences = new Map(); // service.name → [transactions]

    transactions.forEach(t => {
      const desc = t.description;

      for (const service of KNOWN_SERVICES) {
        if (service.pattern.test(desc)) {
          if (!serviceOccurrences.has(service.name)) {
            serviceOccurrences.set(service.name, []);
          }
          serviceOccurrences.get(service.name).push(t);
          break; // Don't match multiple services for same transaction
        }
      }
    });

    console.log('Service occurrences:', Array.from(serviceOccurrences.entries()).map(([name, txs]) =>
      `${name}: ${txs.length} times`
    ));

    // Second pass: Group by month and check for recurring subscriptions
    const foundSubscriptions = new Map();

    serviceOccurrences.forEach((occurrences, serviceName) => {
      const service = KNOWN_SERVICES.find(s => s.name === serviceName);

      // Group occurrences by month
      const monthGroups = new Map(); // YYYY-MM → [transactions]

      occurrences.forEach(t => {
        const month = extractMonth(t.date);
        if (month) {
          if (!monthGroups.has(month)) {
            monthGroups.set(month, []);
          }
          monthGroups.get(month).push(t);
        }
      });

      // Check if it appears in 2+ different months
      const uniqueMonths = monthGroups.size;

      console.log(`${serviceName}: appears in ${uniqueMonths} different months`);

      if (uniqueMonths < 2) {
        console.log(`  ✗ ${serviceName}: only appears in 1 month - not a subscription`);
        return; // Skip - must appear in at least 2 different months
      }

      // Get all non-zero costs
      const costs = occurrences.map(t => Math.abs(t.amount)).filter(c => c > 0 && c < 500);

      if (costs.length === 0) return; // Skip if no valid costs

      // Calculate average cost
      const avgCost = costs.reduce((sum, c) => sum + c, 0) / costs.length;

      // Check price consistency for subscriptions
      let confidence = 'high';
      let isSubscription = true;

      if (costs.length >= 2) {
        // Calculate price variance (coefficient of variation)
        const variance = costs.reduce((sum, c) => sum + Math.pow(c - avgCost, 2), 0) / costs.length;
        const stdDev = Math.sqrt(variance);
        const coefficientOfVariation = (stdDev / avgCost) * 100; // Percentage

        console.log(`  → avg=€${avgCost.toFixed(2)}, CV=${coefficientOfVariation.toFixed(1)}%`);

        // If price varies by more than 10%, it's probably NOT a subscription
        if (coefficientOfVariation > 10) {
          console.log(`  ✗ ${serviceName}: price varies too much (${coefficientOfVariation.toFixed(1)}%) - not a subscription`);
          isSubscription = false;
        } else {
          console.log(`  ✓ ${serviceName}: consistent price - IS a subscription`);
        }
      }

      // Only add if it's a true subscription (appears in 2+ months + consistent price)
      if (isSubscription) {
        foundSubscriptions.set(serviceName, {
          name: serviceName,
          monthly_cost: Math.round(avgCost * 100) / 100,
          category: service.category,
          confidence: confidence,
          occurrences: uniqueMonths // Use unique months instead of total occurrences
        });
      }
    });

    // Detect unknown recurring charges
    console.log('\n🔍 Looking for unknown recurring charges...');

    // Group ALL transactions by description (normalize text)
    const unknownCharges = new Map();

    transactions.forEach(t => {
      const desc = t.description.trim().toUpperCase(); // Normalize

      // Skip if already matched by known services
      const alreadyMatched = Array.from(serviceOccurrences.keys()).some(serviceName => {
        return serviceOccurrences.get(serviceName).some(knownTx =>
          knownTx.description === t.description
        );
      });

      if (alreadyMatched) return; // Skip known services

      // Skip very small amounts (< €1) or very large (> €500)
      if (Math.abs(t.amount) < 1 || Math.abs(t.amount) > 500) return;

      // Group by description
      if (!unknownCharges.has(desc)) {
        unknownCharges.set(desc, []);
      }
      unknownCharges.get(desc).push(t);
    });

    // Check for recurring + consistent pricing (with month grouping)
    unknownCharges.forEach((occurrences, description) => {
      // Group occurrences by month
      const monthGroups = new Map(); // YYYY-MM → [transactions]

      occurrences.forEach(t => {
        const month = extractMonth(t.date);
        if (month) {
          if (!monthGroups.has(month)) {
            monthGroups.set(month, []);
          }
          monthGroups.get(month).push(t);
        }
      });

      // Check if it appears in 2+ different months
      const uniqueMonths = monthGroups.size;

      console.log(`Unknown: "${description.substring(0, 50)}..." - appears in ${uniqueMonths} different months`);

      if (uniqueMonths < 2) {
        console.log(`  ✗ Only appears in 1 month - skipping`);
        return; // Skip - must appear in at least 2 different months
      }

      // Get costs
      const costs = occurrences.map(t => Math.abs(t.amount));
      const avgCost = costs.reduce((sum, c) => sum + c, 0) / costs.length;

      // Calculate price variance
      const variance = costs.reduce((sum, c) =>
        sum + Math.pow(c - avgCost, 2), 0) / costs.length;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = (stdDev / avgCost) * 100;

      console.log(`  → avg €${avgCost.toFixed(2)}, CV=${coefficientOfVariation.toFixed(1)}%`);

      // If price is consistent (<10% variance) → likely subscription
      if (coefficientOfVariation < 10) {
        console.log(`  ✓ Consistent price - flagging as potential subscription`);

        // Add to found subscriptions with special "unknown" flag
        foundSubscriptions.set(description, {
          name: description, // Raw description
          monthly_cost: Math.round(avgCost * 100) / 100,
          category: 'unknown', // Special category
          confidence: 'medium',
          occurrences: uniqueMonths, // Use unique months
          needsConfirmation: true // Flag for frontend
        });
      } else {
        console.log(`  ✗ Price varies too much (${coefficientOfVariation.toFixed(1)}%) - skipping`);
      }
    });

    const unknownCount = Array.from(foundSubscriptions.values()).filter(s => s.needsConfirmation).length;
    console.log(`\nFound ${unknownCount} unknown recurring charges`);

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

  // Detect delimiter (check for tab, semicolon, or comma)
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes('\t')) {
    delimiter = '\t';
  } else if (firstLine.includes(';')) {
    delimiter = ';';
  }

  console.log('Detected delimiter:', delimiter === '\t' ? 'TAB' : delimiter);

  // Parse header
  const headers = parseCSVLine(firstLine, delimiter).map(h => h.trim().toLowerCase());

  console.log('CSV Headers:', headers);

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

  console.log('Column mapping: Date:', dateIndex, 'Description:', descIndex, 'Amount:', amountIndex);
  console.log('Using: Description column', useDesc, ', Amount column', useAmount);

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

// Month name to number mapping
const MONTH_NAMES = {
  // English abbreviations
  'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
  'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
  'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12',

  // Full English names
  'january': '01', 'february': '02', 'march': '03', 'april': '04',
  'june': '06', 'july': '07', 'august': '08',
  'september': '09', 'october': '10', 'november': '11', 'december': '12',

  // Greek abbreviations
  'ιαν': '01', 'φεβ': '02', 'μαρ': '03', 'απρ': '04',
  'μαϊ': '05', 'ιουν': '06', 'ιουλ': '07', 'αυγ': '08',
  'σεπ': '09', 'οκτ': '10', 'νοε': '11', 'δεκ': '12'
};

// Helper function to extract YYYY-MM from various date formats
function extractMonth(dateStr) {
  if (!dateStr) return null;

  // Normalize whitespace
  dateStr = dateStr.trim();

  // Pattern 1: "Jul 13, 2025" or "July 13, 2025" (Revolut format)
  const monthNamePattern1 = /([a-zα-ω]+)\s+(\d{1,2}),?\s+(\d{4})/i;
  const match1 = dateStr.match(monthNamePattern1);
  if (match1) {
    const monthName = match1[1].toLowerCase();
    const year = match1[3];
    const month = MONTH_NAMES[monthName];

    if (month) {
      console.log(`  Parsed "${dateStr}" → ${year}-${month}`);
      return `${year}-${month}`;
    }
  }

  // Pattern 2: "13 Jul 2025" or "13 July 2025"
  const monthNamePattern2 = /(\d{1,2})\s+([a-zα-ω]+)\s+(\d{4})/i;
  const match2 = dateStr.match(monthNamePattern2);
  if (match2) {
    const monthName = match2[2].toLowerCase();
    const year = match2[3];
    const month = MONTH_NAMES[monthName];

    if (month) {
      console.log(`  Parsed "${dateStr}" → ${year}-${month}`);
      return `${year}-${month}`;
    }
  }

  // Pattern 3: DD/MM/YYYY or MM/DD/YYYY (numeric)
  const numericPattern1 = /(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})/;
  const match3 = dateStr.match(numericPattern1);
  if (match3) {
    const year = match3[3];
    // Assume MM/DD/YYYY format (US/international)
    const month = match3[1].padStart(2, '0');
    console.log(`  Parsed "${dateStr}" → ${year}-${month}`);
    return `${year}-${month}`;
  }

  // Pattern 4: YYYY/MM/DD or YYYY-MM-DD (ISO format)
  const isoPattern = /(\d{4})[-\/\.](\d{1,2})[-\/\.](\d{1,2})/;
  const match4 = dateStr.match(isoPattern);
  if (match4) {
    const year = match4[1];
    const month = match4[2].padStart(2, '0');
    console.log(`  Parsed "${dateStr}" → ${year}-${month}`);
    return `${year}-${month}`;
  }

  console.log(`  ⚠️ Could not parse date: "${dateStr}"`);
  return null;
}

// Parse PDF text content
function parsePDFText(text) {
  const transactions = [];
  const lines = text.split('\n').filter(line => line.trim());

  // DEBUG logging
  console.log('=== PDF PARSING DEBUG ===');
  console.log('Total lines:', lines.length);
  console.log('First 20 lines:', lines.slice(0, 20));

  // Try to find lines that look like transactions
  // Pattern: date + description + amount
  // Example: "15/01/2024 NETFLIX 12.99" or "01-15-2024 Spotify Premium €9.99"

  for (const line of lines) {
    // Skip header lines
    if (line.toLowerCase().includes('ημερομηνία') ||
        line.toLowerCase().includes('date') ||
        line.toLowerCase().includes('περιγραφή') ||
        line.toLowerCase().includes('description') ||
        line.toLowerCase().includes('balance') ||
        line.toLowerCase().includes('υπόλοιπο')) {
      continue;
    }

    // Try multiple amount patterns - PRIORITIZE transaction amounts over balances
    // Transaction amounts usually have $ or - sign, balance is just a number at the end
    const amountPatterns = [
      // Negative amounts with $ sign (most common for debits) - HIGHEST PRIORITY
      /-\s*\$\s*([\d,]+\.\d{2})/,           // -$29.99
      /\$\s*-\s*([\d,]+\.\d{2})/,           // $-29.99

      // Negative amounts with € sign
      /-\s*€\s*([\d.]+,\d{2})/,             // -€29,99
      /€\s*-\s*([\d.]+,\d{2})/,             // €-29,99

      // Generic negative amounts (no currency symbol)
      /-\s*([\d,]+\.\d{2})\s+\$?[\d,]+/,    // -29.99 followed by balance
      /-\s*([\d.]+,\d{2})\s+€?[\d.]+/,      // -29,99 followed by balance

      // Positive amounts with $ or € (for deposits)
      /\$\s*([\d,]+\.\d{2})\s+\$?[\d,]+/,   // $29.99 followed by balance
      /€\s*([\d.]+,\d{2})\s+€?[\d.]+/,      // €29,99 followed by balance

      // Greek format with comma decimal separator
      /[-−]?\s*€?\s*([\d.]+,\d{2})/,        // €1.234,56 or 1.234,56 or -1.234,56
      /[-−]?\s*([\d.]+,\d{2})\s*€/,         // 1.234,56 € or -1.234,56 €

      // International format with dot decimal separator (but NOT at end of line to avoid balance)
      /[-−]?\s*[€$]\s*([\d,]+\.?\d{2})\s/,  // €11.99 or $11.99 (must have space after)

      // Last resort: any amount at line end (this catches balances, so lowest priority)
      /([\d,]+\.\d{2})\s*[€$]?\s*$/,        // 11.99€ or 11.99 at line end
      /([\d.]+,\d{2})\s*$/                  // 1.234,56 at end of line
    ];

    let amountMatch = null;
    let matchedPattern = null;

    for (const pattern of amountPatterns) {
      const match = line.match(pattern);
      if (match) {
        amountMatch = match;
        matchedPattern = pattern;
        break;
      }
    }

    if (!amountMatch) continue;

    // Parse amount - handle both comma and dot as decimal separator
    const amountStr = amountMatch[1];
    let amount;

    // Check if it's Greek format (comma decimal) or international (dot decimal)
    if (amountStr.includes(',')) {
      // Greek format: 1.234,56 → remove dots, replace comma with dot
      amount = parseFloat(amountStr.replace(/\./g, '').replace(',', '.')) || 0;
    } else {
      // International format: 1,234.56 → remove commas
      amount = parseFloat(amountStr.replace(/,/g, '')) || 0;
    }

    console.log('Found amount in line:', line);
    console.log('  Matched:', amountStr, '→ Parsed:', amount);

    // Skip invalid amounts - be more permissive for NBG
    if (amount > 10000 || amount < 0.1) {
      console.log('  Skipped (out of range)');
      continue;
    }

    // Extract date (various formats)
    const dateMatch = line.match(/(\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4})/);
    const date = dateMatch ? dateMatch[1] : '';

    // Description is everything between date and amount
    let description = line;
    if (dateMatch) {
      description = description.replace(dateMatch[0], '');
    }
    if (amountMatch) {
      description = description.replace(amountMatch[0], '');
    }
    description = description.trim();

    if (description.length > 2) {
      transactions.push({
        date,
        description,
        amount: Math.abs(amount)
      });
      console.log('  Added transaction:', { date, description: description.substring(0, 30), amount: Math.abs(amount) });
    } else {
      console.log('  Skipped (description too short)');
    }
  }

  console.log('Total transactions found:', transactions.length);
  console.log('First 5 transactions:', transactions.slice(0, 5));
  console.log('=== END PDF PARSING DEBUG ===');

  return transactions;
}
