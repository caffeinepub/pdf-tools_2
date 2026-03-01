import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { FileOutput } from "lucide-react";

export function PDFToWord() {
  return (
    <ComingSoonTool
      toolName="PDF to Word"
      toolPath="/pdf-to-word"
      description="Convert PDFs back to fully editable Microsoft Word documents. Preserve layouts, tables, fonts, and formatting for easy editing."
      icon={FileOutput}
      iconColor="#2B5CE2"
      note="High-fidelity PDF-to-Word conversion requires advanced server-side document parsing."
    />
  );
}
