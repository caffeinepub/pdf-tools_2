import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { Sheet } from "lucide-react";

export function ExcelToPDF() {
  return (
    <ComingSoonTool
      toolName="Excel to PDF"
      toolPath="/excel-to-pdf"
      description="Convert Excel spreadsheets (XLS and XLSX) to clean, print-ready PDF documents. Tables, charts, and formulas render perfectly."
      icon={Sheet}
      iconColor="#1D6F42"
      note="Accurate spreadsheet rendering requires server-side Excel processing."
    />
  );
}
