const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'mpp-tests.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err);
  else console.log('✅ Database connected');
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      name TEXT,
      status TEXT,
      challenge TEXT,
      credential TEXT,
      result TEXT,
      error TEXT,
      created_at DATETIME,
      completed_at DATETIME
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS results (
      id TEXT PRIMARY KEY,
      test_id TEXT,
      verification_success BOOLEAN,
      processing_time_ms INTEGER,
      error_details TEXT,
      created_at DATETIME,
      FOREIGN KEY(test_id) REFERENCES tests(id)
    )
  `);
});

// ============ MPP MOCK SERVICE ============
// Simulates real MPP payment processing

class MPPMockService {
  static generateChallenge() {
    const randomId = Math.random().toString(36).substring(2, 15);
    return {
      challenge_id: randomId,
      challenge_text: `Verify ownership of: 0x${Math.random().toString(16).substring(2, 10)}`,
      expires_in: 3600
    };
  }

  static verifyCredential(credential) {
    const startTime = Date.now();
    
    // Simulate some processing
    const random = Math.random();
    
    // 80% success rate
    const success = random < 0.8;
    const processingTime = Math.floor(Math.random() * 1000) + 200; // 200-1200ms
    
    return {
      success,
      credential_id: credential.id,
      verified_at: new Date().toISOString(),
      processing_time_ms: processingTime,
      signer_address: success ? `0x${Math.random().toString(16).substring(2, 42)}` : null,
      error: success ? null : 'Invalid signature'
    };
  }
}

// ============ API ROUTES ============

// Get all tests
app.get('/api/tests', (req, res) => {
  db.all('SELECT * FROM tests ORDER BY created_at DESC LIMIT 100', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Get single test
app.get('/api/tests/:id', (req, res) => {
  db.get('SELECT * FROM tests WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || {});
  });
});

// Create new test
app.post('/api/tests', (req, res) => {
  const testId = uuidv4();
  const { name } = req.body;

  db.run(
    'INSERT INTO tests (id, name, status, created_at) VALUES (?, ?, ?, ?)',
    [testId, name || 'Test ' + testId.substring(0, 8), 'pending', new Date().toISOString()],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: testId, status: 'pending' });
    }
  );
});

// Get MPP challenge
app.post('/api/challenge', (req, res) => {
  const { testId } = req.body;
  const challenge = MPPMockService.generateChallenge();

  db.run(
    'UPDATE tests SET challenge = ?, status = ? WHERE id = ?',
    [JSON.stringify(challenge), 'challenging', testId],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(challenge);
    }
  );
});

// Verify credential
app.post('/api/verify-credential', (req, res) => {
  const { testId, credential } = req.body;
  const verification = MPPMockService.verifyCredential(credential);
  const resultId = uuidv4();

  db.run(
    'INSERT INTO results (id, test_id, verification_success, processing_time_ms, error_details, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [
      resultId,
      testId,
      verification.success ? 1 : 0,
      verification.processing_time_ms,
      verification.error || null,
      new Date().toISOString()
    ],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      db.run(
        'UPDATE tests SET status = ?, credential = ?, result = ?, error = ?, completed_at = ? WHERE id = ?',
        [
          'completed',
          JSON.stringify(credential),
          JSON.stringify(verification),
          verification.error || null,
          new Date().toISOString(),
          testId
        ],
        (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json(verification);
        }
      );
    }
  );
});

// Get test results
app.get('/api/results/:testId', (req, res) => {
  db.all('SELECT * FROM results WHERE test_id = ? ORDER BY created_at DESC', [req.params.testId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Stats
app.get('/api/stats', (req, res) => {
  db.get(
    `SELECT 
      COUNT(*) as total_tests,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      ROUND(AVG(CAST(result LIKE '%"success":true%' AS INTEGER)) * 100, 1) as success_rate
    FROM tests`,
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row || {});
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 MPP Testing Tool Backend Running at http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbPath}\n`);
});
