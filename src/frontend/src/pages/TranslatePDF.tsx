import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { Languages } from "lucide-react";

export function TranslatePDF() {
  return (
    <ComingSoonTool
      toolName="Translate PDF"
      toolPath="/translate"
      description="AI-powered PDF translation that preserves your document's original layout, formatting, images, and structure while translating to 100+ languages."
      icon={Languages}
      iconColor="#7C3BE2"
      note="AI translation with layout preservation is powered by Gemini and requires server-side rendering. Coming soon to Premium."
    />
  );
}
