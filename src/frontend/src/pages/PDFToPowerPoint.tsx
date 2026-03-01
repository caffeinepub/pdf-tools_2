import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { PresentationIcon } from "lucide-react";

export function PDFToPowerPoint() {
  return (
    <ComingSoonTool
      toolName="PDF to PowerPoint"
      toolPath="/pdf-to-pptx"
      description="Convert PDF files into editable PowerPoint presentations. Each PDF page becomes a slide, ready for editing in PowerPoint or Google Slides."
      icon={PresentationIcon}
      iconColor="#D94F34"
      note="Accurate PDF-to-presentation conversion requires server-side slide layout analysis."
    />
  );
}
