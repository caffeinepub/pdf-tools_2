import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { Wrench } from "lucide-react";

export function RepairPDF() {
  return (
    <ComingSoonTool
      toolName="Repair PDF"
      toolPath="/repair"
      description="Fix corrupted or damaged PDF files. Our server-side repair engine can recover text, images, and structure from broken PDFs."
      icon={Wrench}
      iconColor="#E25C3B"
      note="Requires server-side processing to safely reconstruct damaged file structures."
    />
  );
}
