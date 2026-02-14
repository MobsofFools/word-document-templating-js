/**
 * Unit tests for the templating and composition pipeline
 */
const fs = require('fs');
const path = require('path');
const TemplateManager = require('../lib/TemplateManager');
const DocumentComposer = require('../lib/DocumentComposer');
const DocumentPipeline = require('../lib/Pipeline');
const { Document } = require('docx');

// Test setup and teardown
const testDir = './test-output';
const setupTestDir = () => {
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
};

const cleanupTestDir = () => {
  if (fs.existsSync(testDir)) {
    fs.readdirSync(testDir).forEach(file => {
      fs.unlinkSync(path.join(testDir, file));
    });
    fs.rmdirSync(testDir);
  }
};

describe('TemplateManager', () => {
  beforeAll(setupTestDir);
  afterAll(cleanupTestDir);

  test('should load a template without errors', () => {
    // Assuming a test template exists
    const templatePath = './templates/test_template.docx';
    if (fs.existsSync(templatePath)) {
      expect(() => {
        new TemplateManager(templatePath);
      }).not.toThrow();
    }
  });

  test('should throw error for non-existent template', () => {
    expect(() => {
      new TemplateManager('./nonexistent_template.docx');
    }).toThrow('Template file not found');
  });

  test('should render a template with context', async () => {
    const templatePath = './templates/test_template.docx';
    if (fs.existsSync(templatePath)) {
      const templateManager = new TemplateManager(templatePath);
      const context = { name: 'Alice', date: '2026-02-13' };
      const outputPath = path.join(testDir, 'rendered.docx');

      const result = await templateManager.render(context, outputPath);
      expect(fs.existsSync(result)).toBe(true);
    }
  });

  test('should validate template placeholders', () => {
    const templatePath = './templates/test_template.docx';
    if (fs.existsSync(templatePath)) {
      const templateManager = new TemplateManager(templatePath);
      const validation = templateManager.validateTemplate(['name', 'date']);
      
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('missingPlaceholders');
    }
  });
});

describe('DocumentComposer', () => {
  beforeAll(setupTestDir);
  afterAll(cleanupTestDir);

  test('should throw error when no documents provided', async () => {
    const composer = new DocumentComposer();
    await expect(
      composer.merge([], path.join(testDir, 'merged.docx'))
    ).rejects.toThrow();
  });

  test('should throw error for non-existent documents', async () => {
    const composer = new DocumentComposer();
    await expect(
      composer.merge(
        ['./nonexistent1.docx', './nonexistent2.docx'],
        path.join(testDir, 'merged.docx')
      )
    ).rejects.toThrow();
  });
});

describe('DocumentPipeline', () => {
  beforeAll(setupTestDir);
  afterAll(cleanupTestDir);

  test('should initialize with a template path', () => {
    const templatePath = './templates/test_template.docx';
    if (fs.existsSync(templatePath)) {
      expect(() => {
        new DocumentPipeline(templatePath);
      }).not.toThrow();
    }
  });

  test('should generate single document', async () => {
    const templatePath = './templates/test_template.docx';
    if (fs.existsSync(templatePath)) {
      const pipeline = new DocumentPipeline(templatePath);
      const context = { name: 'Bob', date: '2026-02-13' };
      const outputPath = path.join(testDir, 'single.docx');

      const result = await pipeline.generateSingle(context, outputPath);
      expect(fs.existsSync(result)).toBe(true);
    }
  });
});