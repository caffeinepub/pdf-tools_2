import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Crown,
  Download,
  History,
  Settings,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface ImgHistoryEntry {
  tool: string;
  file: string;
  output: string;
  date: string;
}

function getUserPlan(): "free" | "plus" {
  return (localStorage.getItem("userPlan") as "free" | "plus") || "free";
}

function getDailyUsage(): number {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("dailyUsageDate");
  if (savedDate !== today) {
    localStorage.setItem("dailyUsageDate", today);
    localStorage.setItem("dailyUsage", "0");
    return 0;
  }
  return Number.parseInt(localStorage.getItem("dailyUsage") || "0");
}

function getImgHistory(): ImgHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem("imgHistory") || "[]");
  } catch {
    return [];
  }
}

function downloadCSV(history: ImgHistoryEntry[]) {
  const header = "Tool,Input File,Output File,Date";
  const rows = history.map(
    (h) => `"${h.tool}","${h.file}","${h.output}","${h.date}"`,
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "processing_history.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function UserDashboard() {
  const plan = getUserPlan();
  const dailyUsage = getDailyUsage();
  const dailyLimit = plan === "plus" ? Number.POSITIVE_INFINITY : 20;
  const history = getImgHistory();

  const toolCounts: Record<string, number> = {};
  for (const h of history) {
    toolCounts[h.tool] = (toolCounts[h.tool] || 0) + 1;
  }
  const topTools = Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="container max-w-5xl py-3">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-1">/</span>
            <span className="text-foreground font-medium">Dashboard</span>
          </nav>
        </div>
      </div>

      <div className="container max-w-5xl py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                My Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your usage, history, and plan status
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/profile">
                <Button variant="outline" className="font-ui gap-2" size="sm">
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              </Link>
              {plan === "free" && (
                <Link to="/upgrade">
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 text-white font-ui gap-2"
                    size="sm"
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade to Plus
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Plan Card */}
            <Card
              className={`border-border ${plan === "plus" ? "border-amber-300 bg-amber-50/50" : ""}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan === "plus" ? "bg-amber-100" : "bg-muted"}`}
                  >
                    <Crown
                      className={`w-5 h-5 ${plan === "plus" ? "text-amber-500" : "text-muted-foreground"}`}
                    />
                  </div>
                  <Badge
                    className={`font-ui text-xs ${plan === "plus" ? "bg-amber-500 text-white border-0" : ""}`}
                    variant={plan === "free" ? "secondary" : "default"}
                  >
                    {plan === "plus" ? "Plus" : "Free"}
                  </Badge>
                </div>
                <p className="font-display font-bold text-2xl text-foreground">
                  {plan === "plus" ? "Plus Plan" : "Free Plan"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-ui">
                  {plan === "plus"
                    ? "All features unlocked"
                    : "Limited to 20 ops/day"}
                </p>
                {plan === "free" && (
                  <Link to="/upgrade" className="block mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full font-ui text-xs border-amber-300 text-amber-600 hover:bg-amber-50"
                    >
                      Upgrade for $9.99/mo
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Daily Usage */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <p className="font-display font-bold text-2xl text-foreground">
                  {dailyUsage}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-ui">
                  {plan === "plus"
                    ? "Unlimited today"
                    : `of ${dailyLimit} today`}
                </p>
                {plan === "free" && (
                  <div className="mt-3">
                    <Progress
                      value={(dailyUsage / dailyLimit) * 100}
                      className="h-1.5"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total Operations */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <p className="font-display font-bold text-2xl text-foreground">
                  {history.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-ui">
                  Total operations
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-ui">
                  All time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Compress",
                    path: "/img-compress",
                    color: "#E25C3B",
                  },
                  { label: "Resize", path: "/img-resize", color: "#3B8CE2" },
                  { label: "Convert", path: "/img-convert", color: "#9B3BE2" },
                  { label: "Editor", path: "/img-editor", color: "#2DBD6E" },
                ].map((item) => (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="outline"
                      className="w-full font-ui text-sm"
                      style={{ borderColor: `${item.color}30` }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tool Usage Breakdown */}
          {topTools.length > 0 && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Most Used Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topTools.map(([tool, count]) => (
                  <div key={tool} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-ui text-foreground">{tool}</span>
                      <span className="font-bold text-primary">{count}</span>
                    </div>
                    <Progress
                      value={(count / topTools[0][1]) * 100}
                      className="h-1.5"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* History Table */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Processing History
                </CardTitle>
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-ui text-xs gap-1.5"
                    onClick={() => downloadCSV(history)}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="py-10 text-center">
                  <History className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-ui text-sm">
                    No processing history yet. Use any image tool to see your
                    history here.
                  </p>
                  <Link to="/img-compress">
                    <Button
                      variant="outline"
                      className="mt-4 font-ui text-sm"
                      size="sm"
                    >
                      Try Compress Image
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2.5 px-3 font-ui font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                          Tool
                        </th>
                        <th className="text-left py-2.5 px-3 font-ui font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                          Input File
                        </th>
                        <th className="text-left py-2.5 px-3 font-ui font-semibold text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                          Output
                        </th>
                        <th className="text-left py-2.5 px-3 font-ui font-semibold text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {history
                        .slice()
                        .reverse()
                        .map((h, i) => (
                          <tr
                            key={`${h.tool}-${h.date}-${i}`}
                            className="border-b border-border last:border-0 hover:bg-muted/20"
                          >
                            <td className="py-2.5 px-3">
                              <Badge
                                variant="secondary"
                                className="font-ui text-xs"
                              >
                                {h.tool}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 font-ui text-sm text-foreground max-w-[150px] truncate">
                              {h.file}
                            </td>
                            <td className="py-2.5 px-3 font-ui text-sm text-muted-foreground hidden sm:table-cell">
                              {h.output}
                            </td>
                            <td className="py-2.5 px-3 font-ui text-xs text-muted-foreground hidden sm:table-cell">
                              {h.date}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-ui">
              <Settings className="w-4 h-4" />
              <Link
                to="/profile"
                className="hover:text-foreground transition-colors"
              >
                Manage Profile
              </Link>
            </div>
            <Link
              to="/img-compress"
              className="font-ui hover:text-foreground transition-colors"
            >
              Back to Image Tools →
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
