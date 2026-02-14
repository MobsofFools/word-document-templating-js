/**
 * Express API Server for Document Templating and Stitching
 */
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const TemplateManager = require('./lib/TemplateManager');
const DocumentComposer = require('./lib/DocumentComposer');
const DocumentPipeline = require('./lib/Pipeline');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ==================== Routes ====================

/**
 * POST /api/render
 * Render a template with a single context
 */
app.post('/api/render', upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No template file provided' });
    }

    const context = JSON.parse(req.body.context || '{}');
    const templateManager = new TemplateManager(req.file.path);

    const outputDir = 'outputs';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `rendered_${Date.now()}.docx`);
    await templateManager.render(context, outputPath);

    res.download(outputPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/render-batch
 * Render template multiple times with different contexts
 */
app.post('/api/render-batch', upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No template file provided' });
    }

    const contexts = JSON.parse(req.body.contexts || '[]');
    if (!Array.isArray(contexts) || contexts.length === 0) {
      return res.status(400).json({ error: 'Invalid contexts array' });
    }

    const templateManager = new TemplateManager(req.file.path);
    const tempDir = `temp_${Date.now()}`;
    const outputDir = 'outputs';

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const renderedDocs = await templateManager.renderBatch(contexts, tempDir);

    res.json({
      success: true,
      documentCount: renderedDocs.length,
      documents: renderedDocs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/merge
 * Merge multiple DOCX files
 */
app.post('/api/merge', upload.array('documents'), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'At least 2 documents required' });
    }

    const documentPaths = req.files.map(f => f.path);
    const composer = new DocumentComposer();

    const outputDir = 'outputs';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `merged_${Date.now()}.docx`);
    await composer.merge(documentPaths, outputPath);

    // Cleanup uploaded files
    documentPaths.forEach(p => fs.unlinkSync(p));

    res.download(outputPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/pipeline
 * Full pipeline: render templates and merge
 */
app.post('/api/pipeline', upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No template file provided' });
    }

    const contexts = JSON.parse(req.body.contexts || '[]');
    if (!Array.isArray(contexts) || contexts.length === 0) {
      return res.status(400).json({ error: 'Invalid contexts array' });
    }

    const pipeline = new DocumentPipeline(req.file.path);
    const outputDir = 'outputs';

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `final_${Date.now()}.docx`);
    await pipeline.generateAndMerge(contexts, outputPath);

    // Cleanup uploaded template
    fs.unlinkSync(req.file.path);

    res.download(outputPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/validate-template
 * Validate template placeholders
 */
app.post('/api/validate-template', upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No template file provided' });
    }

    const requiredPlaceholders = JSON.parse(req.body.placeholders || '[]');
    const templateManager = new TemplateManager(req.file.path);
    const validation = templateManager.validateTemplate(requiredPlaceholders);

    // Cleanup
    fs.unlinkSync(req.file.path);

    res.json(validation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Error Handling ====================

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== Start Server ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;