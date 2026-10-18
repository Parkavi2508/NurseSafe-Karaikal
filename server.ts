import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import * as XLSX from 'xlsx';
import { CLINICAL_MODULES, WASTE_ITEMS, PPE_STEPS, PEP_ALGORITHM } from './src/data/clinicalData.js';
import { SessionResult } from './src/types/clinical.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Persistent Database Store with Serverless os.tmpdir() fallback
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const SESSIONS_JSON_FILE = isVercel
  ? path.join(os.tmpdir(), '.sessions_store.json')
  : path.join(__dirname, '.sessions_store.json');
const UPLOADS_DIR = isVercel
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, 'uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Uploads directory creation skipped/failed safely:', err);
}

let sessionsStore: SessionResult[] = [];

// Load existing JSON database
try {
  if (fs.existsSync(SESSIONS_JSON_FILE)) {
    const raw = fs.readFileSync(SESSIONS_JSON_FILE, 'utf-8');
    sessionsStore = JSON.parse(raw);
  }
} catch {
  sessionsStore = [];
}

// Seed sample session only if completely empty
if (sessionsStore.length === 0) {
  const seedSession: SessionResult = {
    id: 'sess-init-001',
    moduleId: 'hand_hygiene',
    moduleTitle: 'WHO Hand Hygiene Lab',
    studentName: 'Anitha R',
    age: 21,
    score: 19,
    totalQuestions: 20,
    percentage: 95,
    points: 210,
    maxStreak: 12,
    timeSpentSeconds: 145,
    wrongQuestionsList: 'hh_8',
    passed: true,
    timestamp: new Date().toISOString()
  };
  sessionsStore.push(seedSession);
  persistJSON();
}

function persistJSON() {
  try {
    fs.writeFileSync(SESSIONS_JSON_FILE, JSON.stringify(sessionsStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write sessions file:', err);
  }
}

// Generate Excel buffer in-memory dynamically on demand
function generateExcelBuffer(sessions: SessionResult[]): Buffer {
  const rows = sessions.map(s => ({
    'Session ID': s.id,
    'Date & Time': s.timestamp,
    'Learner Name': s.studentName,
    'Age': s.age !== undefined ? s.age : 'N/A',
    'Module ID': s.moduleId,
    'Module Title': s.moduleTitle,
    'Marks Scored': s.score,
    'Total Questions': s.totalQuestions,
    'Accuracy (%)': `${s.percentage}%`,
    'Points Earned': s.points || s.score * 10,
    'Max Streak': s.maxStreak || 0,
    'Duration (Seconds)': s.timeSpentSeconds || 0,
    'Status': s.passed ? 'PASS' : 'RETRY',
    'Wrong Questions': s.wrongQuestionsList || 'None'
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  ws['!cols'] = [
    { wch: 18 },
    { wch: 24 },
    { wch: 20 },
    { wch: 8 },
    { wch: 18 },
    { wch: 32 },
    { wch: 14 },
    { wch: 15 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 18 },
    { wch: 10 },
    { wch: 25 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Live Web Dataset');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

// Generate CSV string in-memory dynamically on demand
function generateCSVString(sessions: SessionResult[]): string {
  const header = 'Session_ID,Timestamp_UTC,Learner_Name,Age,Module_ID,Module_Title,Score_Marks,Total_Questions,Accuracy_Percent,Points_Earned,Max_Streak,Time_Spent_Seconds,Result_Status,Wrong_Question_IDs\n';
  const rows = sessions.map(s => [
    s.id,
    s.timestamp,
    `"${(s.studentName || '').replace(/"/g, '""')}"`,
    s.age !== undefined ? s.age : 'N/A',
    s.moduleId,
    `"${(s.moduleTitle || '').replace(/"/g, '""')}"`,
    s.score,
    s.totalQuestions,
    `${s.percentage}%`,
    s.points || s.score * 10,
    s.maxStreak || 0,
    s.timeSpentSeconds || 0,
    s.passed ? 'PASS' : 'RETRY',
    `"${(s.wrongQuestionsList || '').replace(/"/g, '""')}"`
  ].join(',')).join('\n');
  return header + rows;
}

// REST API ROUTES
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    project: 'NurseSafe Karaikal Clinical Safety Project',
    timestamp: new Date().toISOString(),
    activeModulesCount: CLINICAL_MODULES.length,
    totalSessionsRecorded: sessionsStore.length
  });
});

app.get('/api/modules', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: CLINICAL_MODULES
  });
});

app.get('/api/modules/:id', (req: Request, res: Response) => {
  const mod = CLINICAL_MODULES.find(m => m.id === req.params.id);
  if (!mod) {
    res.status(404).json({ success: false, error: 'Module not found' });
    return;
  }
  res.json({
    success: true,
    data: mod
  });
});

app.get('/api/tools/waste-items', (_req: Request, res: Response) => {
  res.json({ success: true, data: WASTE_ITEMS });
});

app.get('/api/tools/ppe-steps', (_req: Request, res: Response) => {
  res.json({ success: true, data: PPE_STEPS });
});

app.get('/api/tools/pep-algorithm', (_req: Request, res: Response) => {
  res.json({ success: true, data: PEP_ALGORITHM });
});

// Dynamic Sessions API
app.get('/api/sessions', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: sessionsStore
  });
});

app.post('/api/sessions', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.moduleId || body.score === undefined || !body.totalQuestions) {
    res.status(400).json({ success: false, error: 'Invalid session payload' });
    return;
  }

  const mod = CLINICAL_MODULES.find(m => m.id === body.moduleId);
  const percentage = Math.round((body.score / body.totalQuestions) * 100);
  const passed = percentage >= 80;

  const newSession: SessionResult = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    moduleId: body.moduleId,
    moduleTitle: mod ? mod.title.en : 'Clinical Safety Lab',
    studentName: (body.studentName || 'Learner').trim(),
    age: body.age ? parseInt(String(body.age)) : undefined,
    score: body.score,
    totalQuestions: body.totalQuestions,
    percentage,
    points: body.points || body.score * 10,
    maxStreak: body.maxStreak || 0,
    timeSpentSeconds: body.timeSpentSeconds || 0,
    wrongQuestionsList: body.wrongQuestionsList || '',
    passed,
    timestamp: new Date().toISOString()
  };

  sessionsStore.unshift(newSession);
  persistJSON();

  res.status(201).json({
    success: true,
    data: newSession
  });
});

// Download dynamically generated Excel Spreadsheet (.xlsx)
app.get('/api/download/excel', (_req: Request, res: Response) => {
  try {
    const buffer = generateExcelBuffer(sessionsStore);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="live_web_dataset.xlsx"');
    res.send(buffer);
  } catch (err) {
    console.error('Failed to generate Excel download:', err);
    res.status(500).json({ success: false, error: 'Failed to generate Excel file' });
  }
});

// Download dynamically generated CSV Dataset (.csv)
app.get('/api/download/csv', (_req: Request, res: Response) => {
  try {
    const csvContent = generateCSVString(sessionsStore);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="live_web_dataset.csv"');
    res.send(csvContent);
  } catch (err) {
    console.error('Failed to generate CSV download:', err);
    res.status(500).json({ success: false, error: 'Failed to generate CSV file' });
  }
});

// Download JSON Dataset
app.get('/api/download/json', (_req: Request, res: Response) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="live_web_dataset.json"');
    res.send(JSON.stringify(sessionsStore, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to generate JSON file' });
  }
});

// Dataset API Info & Metadata
app.get('/api/dataset', (_req: Request, res: Response) => {
  res.json({
    success: true,
    totalRecords: sessionsStore.length,
    downloadUrls: {
      excel: '/api/download/excel',
      csv: '/api/download/csv',
      json: '/api/download/json'
    },
    records: sessionsStore
  });
});

// Interactive Live Web Dataset Viewer (/dataset)
app.get('/dataset', (_req: Request, res: Response) => {
  const totalRecords = sessionsStore.length;
  const passedCount = sessionsStore.filter(s => s.passed).length;
  const passRate = totalRecords > 0 ? Math.round((passedCount / totalRecords) * 100) : 0;
  const avgScore = totalRecords > 0
    ? Math.round((sessionsStore.reduce((acc, s) => acc + s.percentage, 0) / totalRecords))
    : 0;

  const rowsHtml = sessionsStore.map((s, idx) => `
    <tr class="dataset-row" style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      <td style="padding: 12px 14px; font-family: monospace; font-size: 11px; color: #64748b;">${s.id}</td>
      <td style="padding: 12px 14px; font-size: 12px; color: #475569;">${new Date(s.timestamp).toLocaleString()}</td>
      <td style="padding: 12px 14px; font-weight: 700; color: #0f172a;" class="learner-name">${s.studentName}</td>
      <td style="padding: 12px 14px; color: #334155;">${s.age !== undefined ? s.age : 'N/A'}</td>
      <td style="padding: 12px 14px; color: #0369a1; font-weight: 600;" class="module-title">${s.moduleTitle}</td>
      <td style="padding: 12px 14px; font-weight: bold; color: #0f172a;">${s.score} / ${s.totalQuestions}</td>
      <td style="padding: 12px 14px; font-weight: bold; color: ${s.passed ? '#15803d' : '#b45309'};">${s.percentage}%</td>
      <td style="padding: 12px 14px; color: #334155;">${s.points || s.score * 10} pts</td>
      <td style="padding: 12px 14px;"><span style="display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; background: ${s.passed ? '#dcfce7' : '#fef3c7'}; color: ${s.passed ? '#166534' : '#92400e'};">${s.passed ? 'PASSED' : 'RETRY'}</span></td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Web Dataset · NurseSafe Clinical Safety</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
    .container { max-width: 1300px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); border: 1px solid #cbd5e1; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); color: #ffffff; padding: 26px 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .btn { display: inline-flex; align-items: center; gap: 6px; background: #0284c7; color: white; padding: 9px 16px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.15s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .btn-green { background: #16a34a; }
    .btn-green:hover { background: #15803d; }
    .btn-sky { background: #0284c7; }
    .btn-sky:hover { background: #0369a1; }
    .btn-amber { background: #d97706; }
    .btn-amber:hover { background: #b45309; }
    .btn-outline { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); }
    .btn-outline:hover { background: rgba(255,255,255,0.28); }
    .stats-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; padding: 18px 32px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .stat-card { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; }
    .stat-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
    .stat-val { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px; font-mono; }
    .search-bar { padding: 14px 32px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
    .search-input { width: 100%; max-width: 380px; padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none; }
    .search-input:focus { border-color: #0284c7; box-shadow: 0 0 0 3px rgba(2,132,199,0.15); }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background: #f8fafc; padding: 12px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; border-bottom: 2px solid #cbd5e1; }
    @media print {
      body { background: white; padding: 0; }
      .actions, .search-bar { display: none !important; }
      .container { border: none; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 style="margin: 0 0 4px 0; font-size: 22px; letter-spacing: -0.01em;">Live Web Dataset · Clinical Safety Lab</h1>
        <p style="margin: 0; font-size: 13px; opacity: 0.9;">Real-time dataset synchronized dynamically from nurse trainee assessments</p>
      </div>
      <div class="actions">
        <a href="/api/download/excel" class="btn btn-green">⬇ Download Excel (.xlsx)</a>
        <a href="/api/download/csv" class="btn btn-sky">⬇ Download CSV (.csv)</a>
        <a href="/api/download/json" class="btn btn-amber">⬇ Download JSON</a>
        <button onclick="window.print()" class="btn btn-outline">🖨 Print / PDF</button>
        <a href="/" class="btn btn-outline">← Back to App</a>
      </div>
    </div>

    <!-- Real-Time Metrics Strip -->
    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-label">Total Completed Records</div>
        <div class="stat-val" id="totalCount">${totalRecords}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Average Score</div>
        <div class="stat-val">${avgScore}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Competency Pass Rate</div>
        <div class="stat-val" style="color: #15803d;">${passRate}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Passed / Retry</div>
        <div class="stat-val" style="font-size: 18px;">${passedCount} Passed · ${totalRecords - passedCount} Retry</div>
      </div>
    </div>

    <!-- Live Search & Filter -->
    <div class="search-bar">
      <input type="text" id="searchInput" class="search-input" placeholder="🔍 Search by learner name, module, or status..." onkeyup="filterTable()">
      <div style="font-size: 12px; color: #64748b;">
        Showing <strong id="visibleCount">${totalRecords}</strong> of ${totalRecords} records
      </div>
    </div>

    <div style="overflow-x: auto;">
      <table id="datasetTable">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Date & Time</th>
            <th>Learner Name</th>
            <th>Age</th>
            <th>Module</th>
            <th>Score</th>
            <th>Accuracy</th>
            <th>Points</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${totalRecords === 0
            ? '<tr><td colspan="9" style="text-align: center; padding: 48px; color: #94a3b8; font-size: 14px;">No sessions recorded yet. Complete any module in the app to record data in real time.</td></tr>'
            : rowsHtml}
        </tbody>
      </table>
    </div>
  </div>

  <script>
    function filterTable() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      const rows = document.querySelectorAll('.dataset-row');
      let visible = 0;
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        if (text.includes(q)) {
          r.style.display = '';
          visible++;
        } else {
          r.style.display = 'none';
        }
      });
      document.getElementById('visibleCount').innerText = visible;
    }
  </script>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.delete('/api/sessions', (_req: Request, res: Response) => {
  sessionsStore = [];
  persistJSON();
  res.json({ success: true, message: 'All session marks cleared' });
});

// VITE OR STATIC SERVING
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  // Serve static assets fallback
  app.use('/src/assets', express.static(path.resolve(__dirname, 'src/assets')));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // SPA fallback for development mode
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const htmlPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(htmlPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const candidates = [
      path.resolve(__dirname, 'dist'),
      path.resolve(process.cwd(), 'dist'),
      path.resolve(__dirname, '../dist'),
      path.resolve(process.cwd(), '../dist'),
      path.resolve(__dirname, '../../dist'),
      path.resolve('/var/task/dist'),
    ];
    const actualDist = candidates.find(p => fs.existsSync(path.resolve(p, 'index.html'))) || candidates[0];

    if (fs.existsSync(actualDist)) {
      app.use(express.static(actualDist));
    }

    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api') || req.path === '/dataset') {
        return next();
      }
      const indexPath = path.resolve(actualDist, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Frontend static bundle (dist/index.html) not found. Please ensure build completed successfully.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NurseSafe] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
