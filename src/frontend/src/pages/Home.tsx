import { Badge } from "@/components/ui/badge";
import { useToolUsage } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileImage,
  FileText,
  Hash,
  Image,
  LayoutGrid,
  Lock,
  Merge,
  Minimize2,
  RotateCw,
  Scissors,
  Stamp,
  Unlock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface Tool {
  name: string;
  path: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface Category {
  label: string;
  tools: Tool[];
}

const CATEGORIES: Category[] = [
  {
    label: "Organize PDF",
    tools: [
      {
        name: "Merge PDF",
        path: "/merge",
        description: "Combine multiple PDFs into one document",
        icon: Merge,
        color: "#E25C3B",
        bgColor: "#FFF0EC",
      },
      {
        name: "Split PDF",
        path: "/split",
        description: "Extract pages or split into multiple files",
        icon: Scissors,
        color: "#D64E4E",
        bgColor: "#FFF0F0",
      },
      {
        name: "Organize PDF",
        path: "/organize",
        description: "Reorder and delete pages with drag & drop",
        icon: LayoutGrid,
        color: "#3BC4E2",
        bgColor: "#EBF9FD",
      },
    ],
  },
  {
    label: "Optimize PDF",
    tools: [
      {
        name: "Compress PDF",
        path: "/compress",
        description: "Reduce file size without losing quality",
        icon: Minimize2,
        color: "#E27A3B",
        bgColor: "#FFF5EC",
      },
    ],
  },
  {
    label: "Edit PDF",
    tools: [
      {
        name: "Rotate PDF",
        path: "/rotate",
        description: "Rotate pages 90, 180, or 270 degrees",
        icon: RotateCw,
        color: "#3B8CE2",
        bgColor: "#EBF3FF",
      },
      {
        name: "Watermark",
        path: "/watermark",
        description: "Add diagonal text watermark to all pages",
        icon: Stamp,
        color: "#9B3BE2",
        bgColor: "#F5EBFF",
      },
      {
        name: "Add Page Numbers",
        path: "/page-numbers",
        description: "Insert customizable page numbers",
        icon: Hash,
        color: "#E2823B",
        bgColor: "#FFF8EC",
      },
    ],
  },
  {
    label: "Convert PDF",
    tools: [
      {
        name: "PDF to JPG",
        path: "/pdf-to-jpg",
        description: "Convert every page to a JPG image",
        icon: FileImage,
        color: "#3B7AE2",
        bgColor: "#EBF2FF",
      },
      {
        name: "JPG to PDF",
        path: "/jpg-to-pdf",
        description: "Turn images into a PDF document",
        icon: Image,
        color: "#3BE28A",
        bgColor: "#EBFFF4",
      },
    ],
  },
  {
    label: "PDF Security",
    tools: [
      {
        name: "Protect PDF",
        path: "/protect",
        description: "Encrypt your PDF with a password",
        icon: Lock,
        color: "#2DBD6E",
        bgColor: "#EBFFF4",
      },
      {
        name: "Unlock PDF",
        path: "/unlock",
        description: "Remove password from a PDF you own",
        icon: Unlock,
        color: "#E2C43B",
        bgColor: "#FFFBEB",
      },
    ],
  },
];

function ToolCard({ tool, usageCount }: { tool: Tool; usageCount?: number }) {
  const Icon = tool.icon;
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
    >
      <Link
        to={tool.path}
        className="group block bg-card border border-border rounded-xl p-5 tool-card-shadow transition-all duration-200 hover:border-primary/30 relative overflow-hidden"
      >
        {/* Subtle top gradient on hover */}
        <div
          className="absolute inset-x-0 top-0 h-1 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, ${tool.color}88, ${tool.color})`,
          }}
        />

        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
            style={{ backgroundColor: tool.bgColor }}
          >
            <Icon className="w-5 h-5" style={{ color: tool.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-sm text-foreground">
                {tool.name}
              </h3>
              {usageCount !== undefined && usageCount > 0 && (
                <Badge variant="secondary" className="text-xs py-0 h-4 font-ui">
                  {usageCount.toLocaleString()}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tool.description}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
        </div>
      </Link>
    </motion.div>
  );
}

export function Home() {
  const { data: usageData } = useToolUsage();

  const usageMap = usageData
    ? Object.fromEntries(
        usageData.map(([name, count]) => [name, Number(count)]),
      )
    : {};

  const toolNameToKey: Record<string, string> = {
    "Merge PDF": "merge",
    "Split PDF": "split",
    "Organize PDF": "organize",
    "Compress PDF": "compress",
    "Rotate PDF": "rotate",
    Watermark: "watermark",
    "Add Page Numbers": "page-numbers",
    "PDF to JPG": "pdf-to-jpg",
    "JPG to PDF": "jpg-to-pdf",
    "Protect PDF": "protect",
    "Unlock PDF": "unlock",
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="gradient-hero absolute inset-0 pointer-events-none" />
        <div className="container max-w-5xl py-20 md:py-28 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-ui font-medium mb-6">
              <FileText className="w-3.5 h-3.5" />
              100% browser-based — your files never leave your device
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-foreground mb-4 leading-tight tracking-tight">
              Every tool you need
              <br />
              <span className="text-primary">to work with PDFs</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Merge, split, compress, convert, and edit PDFs instantly in your
              browser. Fast, secure, and completely free.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
          >
            {[
              ["11", "PDF Tools"],
              ["100%", "Free"],
              ["0", "Files Uploaded to Server"],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-2xl text-foreground">
                  {num}
                </div>
                <div className="text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container max-w-5xl py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {CATEGORIES.map((category) => (
            <motion.div key={category.label} variants={itemVariants}>
              <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-primary inline-block" />
                {category.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <ToolCard
                    key={tool.path}
                    tool={tool}
                    usageCount={usageMap[toolNameToKey[tool.name]]}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
