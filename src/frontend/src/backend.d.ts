import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface HistoryEntry {
    originalFile: string;
    timestamp: Time;
    resultFile: string;
    toolName: string;
}
export interface backendInterface {
    addFileReference(_blob: ExternalBlob): Promise<void>;
    addHistoryEntry(toolName: string, originalFile: string, resultFile: string): Promise<void>;
    getAllUserHistories(): Promise<Array<[Principal, Array<HistoryEntry>]>>;
    getHistory(): Promise<Array<HistoryEntry>>;
    getToolUsage(): Promise<Array<[string, bigint]>>;
    incrementToolUsage(toolName: string): Promise<bigint>;
    submitTask(_tool: string, _input: string): Promise<bigint>;
    updateTaskStatus(_taskId: bigint, _output: string): Promise<void>;
}
