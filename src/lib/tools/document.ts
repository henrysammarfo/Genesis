

export class DocumentTool {
    async readDocument(fileBuffer: Buffer, mimeType: string): Promise<string> {
        try {
            if (mimeType === 'application/pdf') {
                const pdfParse = (await import('pdf-parse')) as any;
                const pdf = pdfParse.default || pdfParse;
                const data = await pdf(fileBuffer);
                return data.text;
            } else if (mimeType.startsWith('text/')) {
                return fileBuffer.toString('utf-8');
            } else {
                return `Unsupported file type: ${mimeType}`;
            }
        } catch (error) {
            console.error('Document reading error:', error);
            return `Failed to read document: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}

export const documentTool = new DocumentTool();
