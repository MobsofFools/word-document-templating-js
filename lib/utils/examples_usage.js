/**
 * Example usage of the templating and stitching solution
 */
const TemplateManager = require('../lib/TemplateManager');
const DocumentComposer = require('../lib/DocumentComposer');
const DocumentPipeline = require('../lib/Pipeline');
const fs = require('fs');

// ==================== Example 1: Single Document ====================
async function example1_singleDocument() {
  console.log('\n=== Example 1: Single Document Rendering ===');
  
  try {
    const templateManager = new TemplateManager('./templates/invoice_template.docx');
    
    const context = {
      customer_name: 'John Doe',
      invoice_number: 'INV-2026-001',
      date: '2026-02-13',
      total_amount: '$1,500.00',
      items: [
        { description: 'Consulting', amount: '$1,000.00' },
        { description: 'Development', amount: '$500.00' }
      ]
    };

    const outputPath = './output/invoice_1.docx';
    await templateManager.render(context, outputPath);
    console.log(`✓ Document rendered: ${outputPath}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ==================== Example 2: Batch Generation & Merge ====================
async function example2_batchAndMerge() {
  console.log('\n=== Example 2: Batch Generation & Merge ===');
  
  try {
    const contexts = [
      {
        customer_name: 'John Doe',
        invoice_number: 'INV-2026-001',
        date: '2026-02-13',
        total_amount: '$1,500.00'
      },
      {
        customer_name: 'Jane Smith',
        invoice_number: 'INV-2026-002',
        date: '2026-02-13',
        total_amount: '$2,200.00'
      },
      {
        customer_name: 'Bob Johnson',
        invoice_number: 'INV-2026-003',
        date: '2026-02-13',
        total_amount: '$950.00'
      }
    ];

    const pipeline = new DocumentPipeline('./templates/invoice_template.docx');
    const mergedDoc = await pipeline.generateAndMerge(
      contexts,
      './output/all_invoices_merged.docx',
      './temp_invoices'
    );
    
    console.log(`✓ Merged document created: ${mergedDoc}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ==================== Example 3: Merge Pre-existing Documents ====================
async function example3_mergeExisting() {
  console.log('\n=== Example 3: Merge Pre-existing Documents ===');
  
  try {
    const documentsToMerge = [
      './output/invoice_1.docx',
      './output/invoice_2.docx',
      './output/invoice_3.docx'
    ];

    const composer = new DocumentComposer();
    const finalDoc = await composer.merge(
      documentsToMerge,
      './output/final_report.docx',
      true // add page breaks
    );
    
    console.log(`✓ Final merged document: ${finalDoc}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ==================== Example 4: Merge with Sections ====================
async function example4_mergeWithSections() {
  console.log('\n=== Example 4: Merge with Sections ===');
  
  try {
    const documentSections = [
      { path: './output/cover.docx', title: 'Cover Page' },
      { path: './output/section1.docx', title: 'Section 1: Overview' },
      { path: './output/section2.docx', title: 'Section 2: Details' }
    ];

    const composer = new DocumentComposer();
    const finalDoc = await composer.mergeWithSections(
      documentSections,
      './output/complete_report.docx'
    );
    
    console.log(`✓ Report with sections created: ${finalDoc}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ==================== Example 5: Template Validation ====================
async function example5_validateTemplate() {
  console.log('\n=== Example 5: Template Validation ===');
  
  try {
    const templateManager = new TemplateManager('./templates/invoice_template.docx');
    
    const requiredPlaceholders = [
      'customer_name',
      'invoice_number',
      'date',
      'total_amount'
    ];

    const validation = templateManager.validateTemplate(requiredPlaceholders);
    
    console.log('Validation Result:', validation);
    if (validation.isValid) {
      console.log('✓ All required placeholders are present');
    } else {
      console.log('✗ Missing placeholders:', validation.missingPlaceholders);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run examples
async function runAll() {
  // Create necessary directories
  if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output', { recursive: true });
  }

  await example1_singleDocument();
  await example2_batchAndMerge();
  await example3_mergeExisting();
  await example4_mergeWithSections();
  await example5_validateTemplate();
}

// Export for testing
module.exports = {
  example1_singleDocument,
  example2_batchAndMerge,
  example3_mergeExisting,
  example4_mergeWithSections,
  example5_validateTemplate
};

// Run if executed directly
if (require.main === module) {
  runAll().catch(console.error);
}