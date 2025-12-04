'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
    onFilesSelected: (files: { name: string; type: string; content: string }[]) => void;
}

export function FileUpload({ onFilesSelected }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);

        // Convert files to base64
        const processedFiles = await Promise.all(
            selectedFiles.map(async (file) => {
                const buffer = await file.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                return {
                    name: file.name,
                    type: file.type,
                    content: base64
                };
            })
        );

        onFilesSelected(processedFiles);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Input
                    type="file"
                    accept=".pdf,.txt"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        asChild
                    >
                        <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Docs
                        </span>
                    </Button>
                </label>
            </div>

            {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-sm"
                        >
                            <FileText className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-white/70">{file.name}</span>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-white/50 hover:text-white"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
