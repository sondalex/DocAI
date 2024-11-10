import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface InputFileProps {
    id: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputFile = ({ id, label, value, onChange }: InputFileProps) => {
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type="file" onChange={onChange} />
            {value && (
                <p className="text-sm text-muted-foreground mt-1">
                    Selected file: {value}
                </p>
            )}
        </div>
    );
};

interface FileUploadProps {
    onFileContentChange: (content: string) => void;
    inputLabel: string;
    inputFileId: string;
}

const FileUpload = ({
    onFileContentChange,
    inputLabel,
    inputFileId,
}: FileUploadProps) => {
    const [fileName, setFileName] = useState<string>("");
    const [fileContent, setFileContent] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setFileContent(content);
            };
            reader.readAsText(file);
        } else {
            setFileName("");
            setFileContent("");
        }
    };

    return (
        <div className="space-y-4">
            <InputFile
                id={inputFileId}
                label={inputLabel}
                value={fileName}
                onChange={handleFileChange}
            />
            <Button
                onClick={() => onFileContentChange(fileContent)}
                disabled={!fileContent}
            >
                View Content
            </Button>
        </div>
    );
};

export { InputFile, FileUpload };
