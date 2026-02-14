const { Document, Packer, Paragraph, Header, Footer } = require("docx");

/**
 * Merges multiple documents into a single document.
 * @param {Array} documents - An array of document objects to be merged.
 * @returns {Document} - A new document containing content from all input documents.
 */
function mergeDocuments(documents) {
    const mergedDocument = new Document();

    documents.forEach((doc) => {
        mergedDocument.addSection({
            children: doc.getSections()[0].children,
        });

        // Add a page break after each document, except the last one
        if (doc !== documents[documents.length - 1]) {
            mergedDocument.addSection({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: "\n", // Adding a new line
                    })],
                })],
            });
        }
    });

    return mergedDocument;
}

module.exports = { mergeDocuments };