// ============================================
// Type Definitions
// ============================================

export type LineEdit = { 
    data: Record<string, string | number | null>; 
    lineNumber: number 
};

export type DeleteOptions = { 
    rowNumber?: number; 
    rowsToDelete?: number; 
    reportToConsole?: boolean 
};

export type ParseOptions = {
    arraySeparator?: string;
    objectSeparator?: string;
    lineAsArray?: boolean;
    fileAsArray?: boolean;
    returnAsString?: string[];
    innerCallbacks?: boolean;
};

export type ParseCallbacks = {
    lineCallback?: (line: unknown) => unknown;
    fileCallback?: (file: unknown) => unknown;
    arrayCallback?: (arr: unknown[]) => unknown;
    objectCallback?: (obj: Record<string, unknown>) => unknown;
    numberCallback?: (num: number) => unknown;
    stringCallback?: (str: string) => unknown;
};

export type ParseResult = Record<string, unknown>[] | Record<string, unknown>;

export type AddRowOptions = { lineNumber?: number };
export type FileOptions = { overwrite?: boolean };
export type CreateFileOptions = { content?: string; overwrite?: boolean };
export type ReadFileOptions = { encoding?: BufferEncoding };
export type FileTreeOptions = { depth?: number; showHidden?: boolean };
export type FileOperationResult = { success: boolean; message: string };

export type ValidationOptions = {
    checkHeaders?: boolean;
    checkTypes?: boolean;
    checkColumns?: boolean;
    expectedHeaders?: string[] | null;
};

export type ValidationResult = {
    valid: boolean;
    errors: string[];
    warnings: string[];
    stats: {
        totalRows: number;
        totalColumns: number;
        headers: string[];
    };
};

export type BatchOperation = {
    type: string;
    file?: string;
    source?: string;
    destination?: string;
    data?: Record<string, unknown>;
    edit?: LineEdit;
    options?: Record<string, unknown>;
};

export type BatchConfig = {
    operations: BatchOperation[];
    stopOnError?: boolean;
};

export type BatchResult = {
    success: Array<{ operation: number; type: string; result: unknown }>;
    failed: Array<{ operation: number; type: string; error: string }>;
    total: number;
};

export type WatchOptions = {
    onChange: (filePath: string, eventType: string) => void;
    debounce?: number;
    recursive?: boolean;
};

export type Watcher = {
    stop: () => void;
};

export type Config = {
    arraySeparator?: string;
    objectSeparator?: string;
    lineAsArray?: boolean;
    fileAsArray?: boolean;
    depth?: number;
    showHidden?: boolean;
    [key: string]: unknown;
};

// ============================================
// Imports
// ============================================

import { addRow as addRowJs } from './lib/rows/addRow.js';
import { deleteRows as deleteRowsJs } from './lib/rows/deleteRow';
import { editRow as editRowJs } from './lib/rows/editRow';
import { parse as parseJs } from './lib/parse';
import { moveFile as moveFileJs } from './lib/files/moveFile';
import { createFile as createFileJs } from './lib/files/createFile';
import { getFileTree as getFileTreeJs } from './lib/files/getFileTree';
import { copyFile as copyFileJs } from './lib/files/copyFile';
import { renameFile as renameFileJs } from './lib/files/renameFile';
import { deleteFile as deleteFileJs } from './lib/files/deleteFile';
import { readFile as readFileJs } from './lib/files/readFile';
import { appendToFile as appendToFileJs } from './lib/files/appendToFile';
import { validateCSV as validateCSVJs } from './lib/validateCSV';
import { batchOperations as batchOperationsJs } from './lib/batchOperations';
import { watchFile as watchFileJs, watchDirectory as watchDirectoryJs } from './lib/watch';
import { loadConfig as loadConfigJs, mergeConfig as mergeConfigJs, getDefaultConfig as getDefaultConfigJs } from './lib/config';

// ============================================
// CSV Operations with Validation
// ============================================

/**
 * Add a row to a CSV file
 * @param filePath - Path to the CSV file
 * @param dataObject - Object containing column data
 * @param options - Options for adding the row
 * @throws {Error} If filePath is empty or dataObject is invalid
 */
export function addRow(
    filePath: string,
    dataObject: Record<string, string | number | null>,
    options: AddRowOptions = {}
): Promise<void> {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    if (!dataObject || typeof dataObject !== 'object') {
        throw new Error('dataObject must be a valid object');
    }
    const opts = { lineNumber: 0, ...options };
    return Promise.resolve(addRowJs(filePath, dataObject, opts) as any);
}

/**
 * Delete rows from a CSV file
 * @param filePath - Path to the CSV file
 * @param options - Deletion options
 * @throws {Error} If filePath is empty
 */
export function deleteRows(
    filePath: string,
    options: DeleteOptions = {}
): void {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    return deleteRowsJs(filePath, options);
}

/**
 * Edit a specific row in a CSV file
 * @param filePath - Path to the CSV file
 * @param edit - Edit details including line number and data
 * @throws {Error} If filePath is empty or edit is invalid
 */
export function editRow(
    filePath: string,
    edit: LineEdit
): void {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    if (!edit || !edit.data || typeof edit.lineNumber !== 'number') {
        throw new Error('edit must contain data object and lineNumber');
    }
    if (edit.lineNumber < 1) {
        throw new Error('lineNumber must be >= 1');
    }
    return editRowJs(filePath, edit);
}

/**
 * Parse a CSV file
 * @param filePath - Path to the CSV file
 * @param options - Parsing options
 * @param callbacks - Optional callbacks for data transformation
 * @throws {Error} If filePath is empty
 */
export function parse(
    filePath: string,
    options: ParseOptions = {},
    callbacks: ParseCallbacks = {}
): Promise<ParseResult> {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    return parseJs(filePath, options as any, callbacks as any) as Promise<ParseResult>;
}

/**
 * Validate CSV file structure and content
 * @param filePath - Path to the CSV file
 * @param options - Validation options
 * @throws {Error} If filePath is empty
 */
export function validateCSV(
    filePath: string,
    options: ValidationOptions = {}
): Promise<ValidationResult> {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    return validateCSVJs(filePath, options as any) as Promise<ValidationResult>;
}

// ============================================
// File Operations with Validation
// ============================================

/**
 * Move a file from source to destination
 * @param sourcePath - Source file path
 * @param destinationPath - Destination file path
 * @param options - Move options
 * @throws {Error} If paths are empty
 */
export function moveFile(
    sourcePath: string,
    destinationPath: string,
    options: FileOptions = {}
): Promise<FileOperationResult> {
    if (!sourcePath || typeof sourcePath !== 'string') {
        throw new Error('sourcePath must be a non-empty string');
    }
    if (!destinationPath || typeof destinationPath !== 'string') {
        throw new Error('destinationPath must be a non-empty string');
    }
    return moveFileJs(sourcePath, destinationPath, options);
}

/**
 * Copy a file from source to destination
 * @param sourcePath - Source file path
 * @param destinationPath - Destination file path
 * @param options - Copy options
 * @throws {Error} If paths are empty
 */
export function copyFile(
    sourcePath: string,
    destinationPath: string,
    options: FileOptions = {}
): Promise<FileOperationResult> {
    if (!sourcePath || typeof sourcePath !== 'string') {
        throw new Error('sourcePath must be a non-empty string');
    }
    if (!destinationPath || typeof destinationPath !== 'string') {
        throw new Error('destinationPath must be a non-empty string');
    }
    return copyFileJs(sourcePath, destinationPath, options);
}

/**
 * Rename a file
 * @param oldPath - Current file path
 * @param newPath - New file path
 * @param options - Rename options
 * @throws {Error} If paths are empty
 */
export function renameFile(
    oldPath: string,
    newPath: string,
    options: FileOptions = {}
): Promise<FileOperationResult> {
    if (!oldPath || typeof oldPath !== 'string') {
        throw new Error('oldPath must be a non-empty string');
    }
    if (!newPath || typeof newPath !== 'string') {
        throw new Error('newPath must be a non-empty string');
    }
    return renameFileJs(oldPath, newPath, options);
}

/**
 * Create a new file
 * @param filePath - Path for the new file
 * @param options - Creation options including content
 * @throws {Error} If filePath is empty
 */
export function createFile(
    filePath: string,
    options: CreateFileOptions = {}
): Promise<FileOperationResult> {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    return createFileJs(filePath, options);
}

/**
 * Delete a file
 * @param filePath - Path to the file to delete
 * @throws {Error} If filePath is empty
 */
export function deleteFile(
    filePath: string
): Promise<FileOperationResult> {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    return deleteFileJs(filePath);
}

/**
 * Read file contents
 * @param filePath - Path to the file
 * @param options - Read options including encoding
 * @throws {Error} If filePath is empty
 */
export function readFile(
    filePath: string,
    options: ReadFileOptions = {}
): Promise<string> {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    return readFileJs(filePath, options);
}

/**
 * Append content to a file
 * @param filePath - Path to the file
 * @param content - Content to append
 * @throws {Error} If filePath is empty
 */
export function appendToFile(
    filePath: string,
    content: string
): Promise<FileOperationResult> {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    if (typeof content !== 'string') {
        throw new Error('content must be a string');
    }
    return appendToFileJs(filePath, content);
}

/**
 * Get directory tree structure
 * @param targetPath - Path to directory or file
 * @param options - Tree display options
 * @throws {Error} If targetPath is empty
 */
export function getFileTree(
    targetPath: string,
    options: FileTreeOptions = {}
): Promise<string> {
    if (!targetPath || typeof targetPath !== 'string') {
        throw new Error('targetPath must be a non-empty string');
    }
    return getFileTreeJs(targetPath, options);
}

// ============================================
// Advanced Operations
// ============================================

/**
 * Execute batch operations from configuration
 * @param config - Batch configuration object or path to config file
 * @throws {Error} If config is invalid
 */
export function batchOperations(
    config: BatchConfig | string
): Promise<BatchResult> {
    if (!config) {
        throw new Error('config is required');
    }
    return batchOperationsJs(config as any) as Promise<BatchResult>;
}

/**
 * Watch a file for changes
 * @param filePath - Path to the file to watch
 * @param options - Watch options including onChange callback
 * @throws {Error} If filePath is empty or onChange is not provided
 */
export function watchFile(
    filePath: string,
    options: WatchOptions
): Watcher {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('filePath must be a non-empty string');
    }
    if (!options.onChange || typeof options.onChange !== 'function') {
        throw new Error('onChange callback is required');
    }
    const opts = { debounce: 100, ...options };
    return watchFileJs(filePath, opts as any) as Watcher;
}

/**
 * Watch a directory for changes
 * @param dirPath - Path to the directory to watch
 * @param options - Watch options including onChange callback
 * @throws {Error} If dirPath is empty or onChange is not provided
 */
export function watchDirectory(
    dirPath: string,
    options: WatchOptions
): Watcher {
    if (!dirPath || typeof dirPath !== 'string') {
        throw new Error('dirPath must be a non-empty string');
    }
    if (!options.onChange || typeof options.onChange !== 'function') {
        throw new Error('onChange callback is required');
    }
    const opts = { recursive: true, debounce: 100, ...options };
    return watchDirectoryJs(dirPath, opts as any) as Watcher;
}

// ============================================
// Configuration
// ============================================

/**
 * Load configuration from file
 * @param startDir - Directory to start searching for config (defaults to cwd)
 */
export function loadConfig(startDir?: string): Config | null {
    return loadConfigJs(startDir) as Config | null;
}

/**
 * Merge configuration with options
 * @param config - Configuration from file
 * @param options - Options from command/function call
 */
export function mergeConfig(config: Config | null, options: Config): Config {
    return mergeConfigJs(config as any, options as any) as Config;
}

/**
 * Get default configuration
 */
export function getDefaultConfig(): Config {
    return getDefaultConfigJs() as Config;
}
