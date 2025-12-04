import React from 'react';
import { Folder, FileCode, FileJson, FileType, ChevronRight, ChevronDown } from 'lucide-react';
import styles from './FileExplorer.module.css';

interface VirtualFile {
    content: string;
    language: string;
}

interface VirtualFileSystem {
    [path: string]: VirtualFile;
}

interface FileExplorerProps {
    files: VirtualFileSystem;
    activeFile: string;
    onFileSelect: (path: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
    files,
    activeFile,
    onFileSelect
}) => {
    const fileList = Object.keys(files).sort();

    const getIcon = (fileName: string) => {
        if (fileName.endsWith('.css')) return <FileType size={14} className={styles.iconCss} />;
        if (fileName.endsWith('.json')) return <FileJson size={14} className={styles.iconJson} />;
        return <FileCode size={14} className={styles.iconJs} />;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.projectName}>genesis-project</span>
            </div>
            <div className={styles.fileList}>
                {fileList.map((path) => (
                    <div
                        key={path}
                        className={`${styles.fileItem} ${activeFile === path ? styles.active : ''}`}
                        onClick={() => onFileSelect(path)}
                    >
                        {getIcon(path)}
                        <span className={styles.fileName}>{path.replace('/', '')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
