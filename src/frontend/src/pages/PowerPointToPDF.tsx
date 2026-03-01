import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { Presentation } from "lucide-react";

export function PowerPointToPDF() {
  return (
    <ComingSoonTool
      toolName="PowerPoint to PDF"
      toolPath="/pptx-to-pdf"
      description="Convert PowerPoint presentations (PPT and PPTX) to PDF. Each slide becomes a page with all animations, transitions, and visuals intact."
      icon={Presentation}
      iconColor="#D94F34"
      note="Converting presentations with embedded media requires server-side Office rendering."
    />
  );
}
