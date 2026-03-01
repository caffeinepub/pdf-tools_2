import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { TableProperties } from "lucide-react";

export function PDFToExcel() {
  return (
    <ComingSoonTool
      toolName="PDF to Excel"
      toolPath="/pdf-to-excel"
      description="Extract tables and data from PDFs into editable Excel spreadsheets. Perfect for financial reports, data extraction, and analysis."
      icon={TableProperties}
      iconColor="#1D6F42"
      note="Table extraction and spreadsheet generation requires server-side AI-based parsing."
    />
  );
}
