import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { GitCompare } from "lucide-react";

export function ComparePDF() {
  return (
    <ComingSoonTool
      toolName="Compare PDF"
      toolPath="/compare"
      description="Compare two PDF documents side-by-side and highlight all differences. Find added, removed, or changed text and images instantly."
      icon={GitCompare}
      iconColor="#3B7AE2"
      note="Deep document comparison with diff highlighting requires server-side semantic analysis."
    />
  );
}
