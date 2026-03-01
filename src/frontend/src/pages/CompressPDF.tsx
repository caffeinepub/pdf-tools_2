import { FileDropZone } from "@/components/tools/FileDropZone";
import {
  ProcessButton,
  type ProcessState,
} from "@/components/tools/ProcessButton";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAddHistory, useIncrementToolUsage } from "@/hooks/useQueries";
import {
  downloadBlob,
  formatBytes,
  readFileAsArrayBuffer,
} from "@/utils/pdfUtils";
import { Minimize2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function CompressPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<ProcessState>("idle");
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [sizeBefore, setSizeBefore] = useState(0);
  const [sizeAfter, setSizeAfter] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: incrementUsage } = useIncrementToolUsage();
  const { mutate: addHistory } = useAddHistory();

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setState("processing");
    setErrorMsg("");
    try {
      const file = files[0];
      setSizeBefore(file.size);
      const buf = await readFileAsArrayBuffer(file);
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });

      // Remove metadata to reduce size
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setProducer("");
      doc.setCreator("");

      const bytes = await doc.save({ useObjectStreams: true });
      setSizeAfter(bytes.length);
      setResultBytes(bytes);
      setState("done");
      incrementUsage("compress");
      addHistory({
        toolName: "compress",
        originalFile: file.name,
        resultFile: "compressed.pdf",
      });
      toast.success("PDF compressed successfully!");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to compress PDF";
      setErrorMsg(msg);
      setState("error");
      toast.error(msg);
    }
  }, [files, incrementUsage, addHistory]);

  const handleDownload = useCallback(() => {
    if (resultBytes) downloadBlob(resultBytes, "compressed.pdf");
  }, [resultBytes]);

  const savedPercent =
    sizeBefore > 0
      ? Math.round(((sizeBefore - sizeAfter) / sizeBefore) * 100)
      : 0;

  return (
    <ToolLayout
      toolName="Compress PDF"
      toolPath="/compress"
      description="Reduce PDF file size by removing metadata and optimizing structure."
      icon={Minimize2}
      iconColor="#E27A3B"
    >
      <div className="space-y-6">
        <Card className="border-border shadow-card">
          <CardContent className="pt-6">
            <FileDropZone
              accept=".pdf"
              multiple={false}
              files={files}
              onFilesChange={setFiles}
              label="Drop your PDF here"
              description="Select the PDF you want to compress"
            />
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card className="border-border shadow-card">
            <CardContent className="pt-6 space-y-6">
              {state === "done" && sizeBefore > 0 && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Original
                    </p>
                    <p className="font-display font-bold text-lg">
                      {formatBytes(sizeBefore)}
                    </p>
                  </div>
                  <div className="text-center flex flex-col items-center justify-center">
                    <p className="text-xs text-muted-foreground mb-1">Saved</p>
                    <p className="font-display font-bold text-lg text-primary">
                      {savedPercent}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Compressed
                    </p>
                    <p className="font-display font-bold text-lg">
                      {formatBytes(sizeAfter)}
                    </p>
                  </div>
                </div>
              )}

              <ProcessButton
                state={state}
                onProcess={handleProcess}
                onDownload={handleDownload}
                processLabel="Compress PDF"
                downloadLabel="Download Compressed PDF"
                errorMessage={errorMsg}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
