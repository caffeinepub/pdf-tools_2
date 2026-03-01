import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { Camera } from "lucide-react";

export function ScanToPDF() {
  return (
    <ComingSoonTool
      toolName="Scan to PDF"
      toolPath="/scan-to-pdf"
      description="Capture documents using your device camera and convert them to high-quality PDFs instantly. Perfect for receipts, contracts, and notes."
      icon={Camera}
      iconColor="#2DBD6E"
      note="Requires camera access and server-side image processing for optimal scan quality."
    />
  );
}
