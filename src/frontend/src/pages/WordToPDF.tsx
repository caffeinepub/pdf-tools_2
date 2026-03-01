import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { FileText } from "lucide-react";

export function WordToPDF() {
  return (
    <ComingSoonTool
      toolName="Word to PDF"
      toolPath="/word-to-pdf"
      description="Convert Microsoft Word documents (DOC and DOCX) to PDF while preserving fonts, tables, images, and formatting perfectly."
      icon={FileText}
      iconColor="#2B5CE2"
      note="Accurate Word-to-PDF conversion requires server-side Office rendering engines."
    />
  );
}
