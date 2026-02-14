const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');

class TemplateManager {
    constructor(templatePath) {
        this.templatePath = templatePath;
    }

    loadTemplate() {
        const content = fs.readFileSync(this.templatePath, 'binary');
        const zip = new PizZip(content);
        return new Docxtemplater(zip);
    }

    render(data) {
        const template = this.loadTemplate();
        template.render(data);
        return template.getZip().generate({ type: 'nodebuffer' });  // returns a buffer with the final document
    }
}

// Example usage
// const manager = new TemplateManager(path.resolve(__dirname, 'path/to/your/template.docx'));
// const outputBuffer = manager.render({ placeholder1: 'value1', placeholder2: 'value2' });

module.exports = TemplateManager;