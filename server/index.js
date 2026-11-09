/**
 * Mini FLOUNA Food Decision Engine - Backend Server
 * 
 * Author: G. Rekha (Rekha-gowda)
 * Assignment: FLOUNA 24-Hour Technical Assessment
 * Company: Algorithic Private Limited
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Serve Frontend in Production / Render deployment
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // In development or when client is not yet built
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Mini FLOUNA Decision Engine</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center; }
              .card { background: #1e293b; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #334155; }
              a { color: #f97316; }
              code { background: #334155; padding: 4px 8px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1 style="color: #f97316;">Mini FLOUNA Food Decision Engine</h1>
              <p>Engineered by <strong>G. Rekha</strong> (GitHub: <a href="https://github.com/Rekha-gowda" target="_blank">Rekha-gowda</a>)</p>
              <p>Backend API is running on port <code>${PORT}</code>.</p>
              <p>Try the decision endpoint: <code>POST /api/decision</code></p>
              <p><a href="/api/health">Check API Health</a> | <a href="/api/providers">View Mock Providers</a></p>
            </div>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Mini FLOUNA Food Decision Engine Server Started`);
  console.log(`👤 Author: G. Rekha (Rekha-gowda)`);
  console.log(`📍 Port: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/decision`);
  console.log(`=======================================================`);
});
