import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  Check,
  ExternalLink,
  Loader2,
  LogIn,
  Megaphone,
  MousePointerClick,
  Plus,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Ad {
  id: bigint;
  title: string;
  imageUrl: string;
  linkUrl: string;
  coupon: string;
  isBoosted: boolean;
  clicks: bigint;
  sponsorPrincipal: string;
  isActive: boolean;
}

const EMPTY_AD = {
  title: "",
  imageUrl: "",
  linkUrl: "",
  coupon: "",
  isBoosted: false,
};

export function SponsorDashboard() {
  const { actor, isFetching } = useActor();
  const { identity, login } = useInternetIdentity();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAd, setNewAd] = useState({ ...EMPTY_AD });
  const [isCreatingAd, setIsCreatingAd] = useState(false);

  useEffect(() => {
    async function load() {
      if (!actor || isFetching || !identity) return;
      setIsLoading(true);
      try {
        if (typeof (actor as any).getAdsBySponsor === "function") {
          const adsData = await (actor as any).getAdsBySponsor(
            identity.getPrincipal().toString(),
          );
          setAds(adsData || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [actor, isFetching, identity]);

  const handleCreateAd = async () => {
    if (!actor || !identity || !newAd.title.trim() || !newAd.linkUrl.trim())
      return;
    setIsCreatingAd(true);
    try {
      if (typeof (actor as any).createAd === "function") {
        await (actor as any).createAd(
          newAd.title.trim(),
          newAd.imageUrl.trim(),
          newAd.linkUrl.trim(),
          newAd.coupon.trim(),
          newAd.isBoosted,
        );
        toast.success("Ad created and now live!");
        setNewAd({ ...EMPTY_AD });

        // Refresh
        if (typeof (actor as any).getAdsBySponsor === "function") {
          const adsData = await (actor as any).getAdsBySponsor(
            identity.getPrincipal().toString(),
          );
          setAds(adsData || []);
        }
      }
    } catch {
      toast.error("Failed to create ad");
    } finally {
      setIsCreatingAd(false);
    }
  };

  const handleDeleteAd = async (id: bigint) => {
    if (!actor) return;
    try {
      if (typeof (actor as any).deleteAd === "function") {
        await (actor as any).deleteAd(id);
        setAds((prev) => prev.filter((a) => a.id !== id));
        toast.success("Ad deleted");
      }
    } catch {
      toast.error("Failed to delete ad");
    }
  };

  const totalClicks = ads.reduce((sum, ad) => sum + Number(ad.clicks), 0);
  const activeAds = ads.filter((a) => a.isActive).length;

  if (!identity) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-sm border-border">
          <CardHeader className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <User className="w-7 h-7 text-amber-600" />
            </div>
            <CardTitle className="font-display">Sign In Required</CardTitle>
            <CardDescription className="font-ui">
              Please sign in to access the Sponsor Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full font-ui gap-2" onClick={login}>
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container max-w-5xl py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                Sponsor Dashboard
              </h1>
              <p className="text-xs text-muted-foreground font-ui">
                Manage your ad campaigns
              </p>
            </div>
            <Badge className="font-ui text-xs bg-amber-100 text-amber-700 border-amber-200">
              <Megaphone className="w-3 h-3 mr-1" />
              Sponsor
            </Badge>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              label: "Total Ads",
              value: ads.length,
              icon: Megaphone,
              color: "#E2A83B",
            },
            {
              label: "Active Ads",
              value: activeAds,
              icon: TrendingUp,
              color: "#2DBD6E",
            },
            {
              label: "Total Clicks",
              value: totalClicks.toLocaleString(),
              icon: MousePointerClick,
              color: "#3B8CE2",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}18` }}
                  >
                    <stat.icon
                      className="w-4 h-4"
                      style={{ color: stat.color }}
                    />
                  </div>
                  <div>
                    <p className="font-display font-bold text-xl text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground font-ui">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Create Ad Form */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              Create New Ad
            </CardTitle>
            <CardDescription className="font-ui text-sm">
              Ads appear on the Marketplace and Home pages as sponsored content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-ui text-sm">Ad Title *</Label>
                <Input
                  value={newAd.title}
                  onChange={(e) =>
                    setNewAd((a) => ({ ...a, title: e.target.value }))
                  }
                  placeholder="50% off on PDFTools Pro"
                  className="font-ui"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-ui text-sm">Destination URL *</Label>
                <Input
                  value={newAd.linkUrl}
                  onChange={(e) =>
                    setNewAd((a) => ({ ...a, linkUrl: e.target.value }))
                  }
                  placeholder="https://yoursite.com/offer"
                  className="font-ui"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-ui text-sm">Banner Image URL</Label>
                <Input
                  value={newAd.imageUrl}
                  onChange={(e) =>
                    setNewAd((a) => ({ ...a, imageUrl: e.target.value }))
                  }
                  placeholder="https://... (optional)"
                  className="font-ui"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-ui text-sm">
                  Coupon Code (optional)
                </Label>
                <Input
                  value={newAd.coupon}
                  onChange={(e) =>
                    setNewAd((a) => ({ ...a, coupon: e.target.value }))
                  }
                  placeholder="SAVE50"
                  className="font-ui"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isBoosted"
                checked={newAd.isBoosted}
                onCheckedChange={(v) =>
                  setNewAd((a) => ({ ...a, isBoosted: !!v }))
                }
              />
              <Label htmlFor="isBoosted" className="font-ui text-sm">
                Boost this ad (appears first in all carousels)
              </Label>
            </div>

            <Button
              onClick={handleCreateAd}
              disabled={
                !newAd.title.trim() || !newAd.linkUrl.trim() || isCreatingAd
              }
              className="font-ui gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0"
            >
              {isCreatingAd ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Launch Ad Campaign
            </Button>
          </CardContent>
        </Card>

        {/* Ads List */}
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-4">
            My Campaigns
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : ads.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border rounded-xl">
              <Megaphone className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display font-semibold text-muted-foreground">
                No ads yet
              </p>
              <p className="text-sm text-muted-foreground font-ui mt-1">
                Create your first ad campaign above
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ads.map((ad) => (
                <Card key={ad.id.toString()} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {ad.imageUrl && (
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-16 h-12 object-cover rounded-lg flex-shrink-0 border border-border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-display font-semibold text-sm text-foreground">
                            {ad.title}
                          </h3>
                          <Badge
                            className={`font-ui text-xs ${ad.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}
                          >
                            {ad.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {ad.isBoosted && (
                            <Badge className="font-ui text-xs bg-amber-100 text-amber-700 border-amber-200">
                              Boosted
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-ui">
                          <span className="flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3" />
                            {Number(ad.clicks).toLocaleString()} clicks
                          </span>
                          {ad.coupon && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                              🎟 {ad.coupon}
                            </span>
                          )}
                          <a
                            href={ad.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-foreground transition-colors truncate max-w-[120px]"
                          >
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            {ad.linkUrl}
                          </a>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-ui h-8 text-xs text-destructive hover:text-destructive flex-shrink-0"
                        onClick={() => handleDeleteAd(ad.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
