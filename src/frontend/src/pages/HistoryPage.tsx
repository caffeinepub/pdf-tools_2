import type { HistoryEntry } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistory } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  Archive,
  ChevronRight,
  Clock,
  FileImage,
  FileText,
  GitMerge,
  Hash,
  Home,
  Image,
  LayoutGrid,
  Lock,
  RotateCcw,
  Scissors,
  Stamp,
  Unlock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

// Tool metadata map
interface ToolMeta {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  path: string;
}

const TOOL_MAP: Record<string, ToolMeta> = {
  merge: {
    label: "Merge PDF",
    icon: GitMerge,
    color: "#E25C3B",
    bgColor: "#FFF0EC",
    path: "/merge",
  },
  split: {
    label: "Split PDF",
    icon: Scissors,
    color: "#F4A261",
    bgColor: "#FFF8EC",
    path: "/split",
  },
  compress: {
    label: "Compress PDF",
    icon: Archive,
    color: "#2EC4B6",
    bgColor: "#EBFBFA",
    path: "/compress",
  },
  rotate: {
    label: "Rotate PDF",
    icon: RotateCcw,
    color: "#8338EC",
    bgColor: "#F5EBFF",
    path: "/rotate",
  },
  watermark: {
    label: "Watermark PDF",
    icon: Stamp,
    color: "#FF6B6B",
    bgColor: "#FFF0F0",
    path: "/watermark",
  },
  protect: {
    label: "Protect PDF",
    icon: Lock,
    color: "#06D6A0",
    bgColor: "#EBFFF8",
    path: "/protect",
  },
  unlock: {
    label: "Unlock PDF",
    icon: Unlock,
    color: "#FFB703",
    bgColor: "#FFFAEB",
    path: "/unlock",
  },
  "pdf-to-jpg": {
    label: "PDF to JPG",
    icon: FileImage,
    color: "#4CC9F0",
    bgColor: "#EBF9FF",
    path: "/pdf-to-jpg",
  },
  pdfToJpg: {
    label: "PDF to JPG",
    icon: FileImage,
    color: "#4CC9F0",
    bgColor: "#EBF9FF",
    path: "/pdf-to-jpg",
  },
  "jpg-to-pdf": {
    label: "JPG to PDF",
    icon: Image,
    color: "#F72585",
    bgColor: "#FFF0F8",
    path: "/jpg-to-pdf",
  },
  jpgToPdf: {
    label: "JPG to PDF",
    icon: Image,
    color: "#F72585",
    bgColor: "#FFF0F8",
    path: "/jpg-to-pdf",
  },
  "page-numbers": {
    label: "Page Numbers",
    icon: Hash,
    color: "#3A86FF",
    bgColor: "#EBF3FF",
    path: "/page-numbers",
  },
  pageNumbers: {
    label: "Page Numbers",
    icon: Hash,
    color: "#3A86FF",
    bgColor: "#EBF3FF",
    path: "/page-numbers",
  },
  organize: {
    label: "Organize PDF",
    icon: LayoutGrid,
    color: "#3BC4E2",
    bgColor: "#EBF9FD",
    path: "/organize",
  },
};

function getToolMeta(toolName: string): ToolMeta {
  return (
    TOOL_MAP[toolName] ?? {
      label: toolName,
      icon: FileText,
      color: "#6B7280",
      bgColor: "#F3F4F6",
      path: "/",
    }
  );
}

function formatRelativeTime(timestampNs: bigint): string {
  const ms = Number(timestampNs / 1_000_000n);
  const now = Date.now();
  const diffMs = now - ms;

  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function HistoryCard({
  entry,
  index,
}: {
  entry: HistoryEntry;
  index: number;
}) {
  const meta = getToolMeta(entry.toolName);
  const Icon = meta.icon;
  const relativeTime = formatRelativeTime(entry.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className="border-border shadow-card hover:shadow-card-hover transition-shadow duration-200">
        <CardContent className="py-4 px-5">
          <div className="flex items-center gap-4">
            {/* Tool icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: meta.bgColor }}
            >
              <Icon className="w-5 h-5" style={{ color: meta.color }} />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <Badge
                  variant="secondary"
                  className="text-xs font-ui px-2 py-0 h-5"
                  style={{
                    backgroundColor: `${meta.color}18`,
                    color: meta.color,
                    border: `1px solid ${meta.color}30`,
                  }}
                >
                  {meta.label}
                </Badge>
                <span className="text-xs text-muted-foreground font-ui flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {relativeTime}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm font-ui min-w-0">
                <span
                  className="text-foreground truncate max-w-[180px] sm:max-w-[260px]"
                  title={entry.originalFile}
                >
                  {entry.originalFile}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span
                  className="text-primary truncate max-w-[180px] sm:max-w-[260px]"
                  title={entry.resultFile}
                >
                  {entry.resultFile}
                </span>
              </div>
            </div>

            {/* Link to tool */}
            <Link
              to={meta.path}
              className="hidden sm:flex items-center gap-1 text-xs font-ui text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              Use again
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <Card className="border-border shadow-card">
      <CardContent className="py-4 px-5">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "oklch(0.95 0.008 60)" }}
      >
        <Clock className="w-9 h-9 text-muted-foreground" />
      </div>
      <h2 className="font-display font-bold text-xl text-foreground mb-2">
        No history yet
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
        Files you process will appear here. Try one of the tools to get started.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-ui font-medium hover:opacity-90 transition-opacity"
      >
        Browse all tools
        <ChevronRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

export function HistoryPage() {
  const { data: entries, isLoading } = useHistory();

  const sorted = entries
    ? [...entries].sort((a, b) =>
        b.timestamp > a.timestamp ? 1 : b.timestamp < a.timestamp ? -1 : 0,
      )
    : [];

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/50">
        <div className="container max-w-4xl py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-sm text-muted-foreground"
          >
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">History</span>
          </nav>
        </div>
      </div>

      <div className="container max-w-4xl py-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start gap-4 mb-10"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "oklch(0.94 0.025 55)" }}
          >
            <Clock className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Processing History
            </h1>
            <p className="text-muted-foreground text-base">
              A log of all your recent PDF operations, sorted newest first.
            </p>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {(["sk-a", "sk-b", "sk-c", "sk-d"] as const).map((id) => (
              <SkeletonCard key={id} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground font-ui">
                {sorted.length} operation{sorted.length === 1 ? "" : "s"}{" "}
                recorded
              </p>
            </div>
            <div className="space-y-3">
              {sorted.map((entry, i) => (
                <HistoryCard
                  key={`${entry.timestamp}-${i}`}
                  entry={entry}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
