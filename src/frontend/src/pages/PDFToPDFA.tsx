import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { Archive } from "lucide-react";

export function PDFToPDFA() {
  return (
    <ComingSoonTool
      toolName="PDF to PDF/A"
      toolPath="/pdf-to-pdfa"
      description="Convert PDFs to the ISO-standard PDF/A archival format. Ensures long-term document preservation with embedded fonts and color profiles."
      icon={Archive}
      iconColor="#6B3BE2"
      note="PDF/A compliance validation and conversion requires server-side ISO standards processing."
    />
  );
}
