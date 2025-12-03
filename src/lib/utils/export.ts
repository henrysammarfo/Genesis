import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { VirtualFileSystem } from '@/lib/agents/orchestrator';

export const exportProject = async (files: VirtualFileSystem) => {
    const zip = new JSZip();

    // Add files to zip
    Object.entries(files).forEach(([path, file]) => {
        // Remove leading slash if present
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        zip.file(cleanPath, file.content);
    });

    // Generate zip
    const content = await zip.generateAsync({ type: 'blob' });

    // Save file
    saveAs(content, 'genesis-project.zip');
};
