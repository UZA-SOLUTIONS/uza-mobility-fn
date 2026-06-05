'use client';

import { useId, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaymentProofFileInputProps = {
  id?: string;
  label?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
};

/** Hidden native input + button trigger — reliable on Windows after the OS file dialog closes. */
export function PaymentProofFileInput({
  id,
  label = 'Payment proof (images or PDF)',
  files,
  onFilesChange,
  disabled = false,
  className,
}: PaymentProofFileInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFiles = (fileList: FileList | null) => {
    const next = Array.from(fileList ?? []);
    onFilesChange(next);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={openPicker}
        >
          Choose files
        </Button>
        {files.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => {
              onFilesChange([]);
              if (inputRef.current) {
                inputRef.current.value = '';
              }
            }}
          >
            Clear
          </Button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*,.pdf,application/pdf"
        multiple
        className="sr-only"
        disabled={disabled}
        onChange={(event) => pickFiles(event.target.files)}
      />
      {files.length > 0 ? (
        <ul className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
          {files.map((file) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`}>
              {file.name}{' '}
              <span className="text-muted-foreground">
                ({Math.max(1, Math.round(file.size / 1024))} KB)
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">
          Attach at least one bank transfer receipt or screenshot (JPEG, PNG, or
          PDF).
        </p>
      )}
    </div>
  );
}
