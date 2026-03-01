import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { EyeOff } from "lucide-react";

export function RedactPDF() {
  return (
    <ComingSoonTool
      toolName="Redact PDF"
      toolPath="/redact"
      description="Permanently remove sensitive information from PDFs. Black out text, images, and metadata so redacted content cannot be recovered."
      icon={EyeOff}
      iconColor="#E23B3B"
      note="True redaction requires server-side processing to permanently remove underlying data, not just visually hide it."
    />
  );
}
