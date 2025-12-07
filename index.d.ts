export type LineEdit = {
    data: Record<string, string | number | null>;
    lineNumber: number;
};
export type DeleteOptions = {
    rowNumber?: number;
    rowsToDelete?: number;
    reportToConsole?: boolean;
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
export type AddRowOptions = {
    lineNumber?: number;
};
export type FileOptions = {
    overwrite?: boolean;
};
export type CreateFileOptions = {
    content?: string;
    overwrite?: boolean;
};
export type ReadFileOptions = {
    encoding?: BufferEncoding;
};
export type FileTreeOptions = {
    depth?: number;
    showHidden?: boolean;
};
export type FileOperationResult = {
    success: boolean;
    message: string;
};
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
    success: Array<{
        operation: number;
        type: string;
        result: unknown;
    }>;
    failed: Array<{
        operation: number;
        type: string;
        error: string;
    }>;
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
/**
 * Add a row to a CSV file
 * @param filePath - Path to the CSV file
 * @param dataObject - Object containing column data
 * @param options - Options for adding the row
 * @throws {Error} If filePath is empty or dataObject is invalid
 */
export declare function addRow(filePath: string, dataObject: Record<string, string | number | null>, options?: AddRowOptions): Promise<void>;
/**
 * Delete rows from a CSV file
 * @param filePath - Path to the CSV file
 * @param options - Deletion options
 * @throws {Error} If filePath is empty
 */
export declare function deleteRows(filePath: string, options?: DeleteOptions): void;
/**
 * Edit a specific row in a CSV file
 * @param filePath - Path to the CSV file
 * @param edit - Edit details including line number and data
 * @throws {Error} If filePath is empty or edit is invalid
 */
export declare function editRow(filePath: string, edit: LineEdit): void;
/**
 * Parse a CSV file
 * @param filePath - Path to the CSV file
 * @param options - Parsing options
 * @param callbacks - Optional callbacks for data transformation
 * @throws {Error} If filePath is empty
 */
export declare function parse(filePath: string, options?: ParseOptions, callbacks?: ParseCallbacks): Promise<ParseResult>;
/**
 * Validate CSV file structure and content
 * @param filePath - Path to the CSV file
 * @param options - Validation options
 * @throws {Error} If filePath is empty
 */
export declare function validateCSV(filePath: string, options?: ValidationOptions): Promise<ValidationResult>;
/**
 * Move a file from source to destination
 * @param sourcePath - Source file path
 * @param destinationPath - Destination file path
 * @param options - Move options
 * @throws {Error} If paths are empty
 */
export declare function moveFile(sourcePath: string, destinationPath: string, options?: FileOptions): Promise<FileOperationResult>;
/**
 * Copy a file from source to destination
 * @param sourcePath - Source file path
 * @param destinationPath - Destination file path
 * @param options - Copy options
 * @throws {Error} If paths are empty
 */
export declare function copyFile(sourcePath: string, destinationPath: string, options?: FileOptions): Promise<FileOperationResult>;
/**
 * Rename a file
 * @param oldPath - Current file path
 * @param newPath - New file path
 * @param options - Rename options
 * @throws {Error} If paths are empty
 */
export declare function renameFile(oldPath: string, newPath: string, options?: FileOptions): Promise<FileOperationResult>;
/**
 * Create a new file
 * @param filePath - Path for the new file
 * @param options - Creation options including content
 * @throws {Error} If filePath is empty
 */
export declare function createFile(filePath: string, options?: CreateFileOptions): Promise<FileOperationResult>;
/**
 * Delete a file
 * @param filePath - Path to the file to delete
 * @throws {Error} If filePath is empty
 */
export declare function deleteFile(filePath: string): Promise<FileOperationResult>;
/**
 * Read file contents
 * @param filePath - Path to the file
 * @param options - Read options including encoding
 * @throws {Error} If filePath is empty
 */
export declare function readFile(filePath: string, options?: ReadFileOptions): Promise<string>;
/**
 * Append content to a file
 * @param filePath - Path to the file
 * @param content - Content to append
 * @throws {Error} If filePath is empty
 */
export declare function appendToFile(filePath: string, content: string): Promise<FileOperationResult>;
/**
 * Get directory tree structure
 * @param targetPath - Path to directory or file
 * @param options - Tree display options
 * @throws {Error} If targetPath is empty
 */
export declare function getFileTree(targetPath: string, options?: FileTreeOptions): Promise<string>;
/**
 * Execute batch operations from configuration
 * @param config - Batch configuration object or path to config file
 * @throws {Error} If config is invalid
 */
export declare function batchOperations(config: BatchConfig | string): Promise<BatchResult>;
/**
 * Watch a file for changes
 * @param filePath - Path to the file to watch
 * @param options - Watch options including onChange callback
 * @throws {Error} If filePath is empty or onChange is not provided
 */
export declare function watchFile(filePath: string, options: WatchOptions): Watcher;
/**
 * Watch a directory for changes
 * @param dirPath - Path to the directory to watch
 * @param options - Watch options including onChange callback
 * @throws {Error} If dirPath is empty or onChange is not provided
 */
export declare function watchDirectory(dirPath: string, options: WatchOptions): Watcher;
/**
 * Load configuration from file
 * @param startDir - Directory to start searching for config (defaults to cwd)
 */
export declare function loadConfig(startDir?: string): Config | null;
/**
 * Merge configuration with options
 * @param config - Configuration from file
 * @param options - Options from command/function call
 */
export declare function mergeConfig(config: Config | null, options: Config): Config;
/**
 * Get default configuration
 */
export declare function getDefaultConfig(): Config;
