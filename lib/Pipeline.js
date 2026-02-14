// Pipeline.js

// Integrated orchestration combining template rendering and document composition

class Pipeline {
    constructor(templateRenderer, documentComposer) {
        this.templateRenderer = templateRenderer;
        this.documentComposer = documentComposer;
    }

    async run(templateData, compositionData) {
        try {
            // Step 1: Render template
            const renderedTemplate = await this.templateRenderer.render(templateData);
            
            // Step 2: Compose document
            const finalDocument = await this.documentComposer.compose(renderedTemplate, compositionData);
            
            return finalDocument;
        } catch (error) {
            console.error('Error in pipeline execution:', error);
            throw error;
        }
    }
}

module.exports = Pipeline;