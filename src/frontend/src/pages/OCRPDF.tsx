import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { ScanText } from "lucide-react";

export function OCRPDF() {
  return (
    <ComingSoonTool
      toolName="OCR PDF"
      toolPath="/ocr"
      description="Convert scanned PDFs into fully searchable and editable documents using advanced Optical Character Recognition."
      icon={ScanText}
      iconColor="#3B8CE2"
      note="OCR requires server-side ML models to recognize and extract text from images."
    />
  );
}
