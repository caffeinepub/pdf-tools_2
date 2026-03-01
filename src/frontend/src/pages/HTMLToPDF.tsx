import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { Globe } from "lucide-react";

export function HTMLToPDF() {
  return (
    <ComingSoonTool
      toolName="HTML to PDF"
      toolPath="/html-to-pdf"
      description="Convert web pages and HTML files to PDF. Enter a URL or upload an HTML file and get a pixel-perfect PDF version."
      icon={Globe}
      iconColor="#E27A3B"
      note="Full HTML rendering with CSS and JavaScript requires server-side headless browser execution."
    />
  );
}
