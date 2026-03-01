import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FileText, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container max-w-5xl flex items-center justify-between h-14">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-foreground text-lg tracking-tight">
            PDF<span className="text-primary">Tools</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-ui">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            All Tools
          </Link>
          <Link
            to="/merge"
            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Merge
          </Link>
          <Link
            to="/compress"
            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Compress
          </Link>
          <Link
            to="/pdf-to-jpg"
            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            PDF to JPG
          </Link>
          <Link
            to="/history"
            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            History
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <nav className="container py-4 flex flex-col gap-1 font-ui text-sm">
              {[
                ["All Tools", "/"],
                ["Merge PDF", "/merge"],
                ["Split PDF", "/split"],
                ["Compress PDF", "/compress"],
                ["Rotate PDF", "/rotate"],
                ["Watermark", "/watermark"],
                ["PDF to JPG", "/pdf-to-jpg"],
                ["JPG to PDF", "/jpg-to-pdf"],
                ["Protect PDF", "/protect"],
                ["Unlock PDF", "/unlock"],
                ["History", "/history"],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
