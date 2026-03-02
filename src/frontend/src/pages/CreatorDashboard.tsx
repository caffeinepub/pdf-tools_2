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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Check,
  DollarSign,
  Download,
  Loader2,
  LogIn,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CreatorProfile {
  displayName: string;
  bio: string;
  category: string;
  profileType: string;
  socialLinks: string[];
  githubUrl: string;
  contactEmail: string;
  websiteUrl: string;
  profilePicUrl: string;
  createdAt: bigint;
}

interface Product {
  id: bigint;
  title: string;
  description: string;
  category: string;
  price: bigint;
  isFree: boolean;
  tags: string[];
  fileUrl: string;
  paymentLink: string;
  creatorPrincipal: string;
  downloadCount: bigint;
  createdAt: bigint;
}

interface Tip {
  id: bigint;
  fromPrincipal: string;
  toPrincipal: string;
  amount: bigint;
  message: string;
  createdAt: bigint;
}

const CATEGORIES = [
  "Education",
  "Technology",
  "Business",
  "Design",
  "Finance",
  "Other",
];
const PROFILE_TYPES = ["Project Seller", "Service Creator"];

const EMPTY_PROFILE: CreatorProfile = {
  displayName: "",
  bio: "",
  category: "Technology",
  profileType: "Project Seller",
  socialLinks: [],
  githubUrl: "",
  contactEmail: "",
  websiteUrl: "",
  profilePicUrl: "",
  createdAt: BigInt(0),
};

const EMPTY_PRODUCT = {
  title: "",
  description: "",
  category: "Technology",
  price: "",
  isFree: true,
  tags: "",
  fileUrl: "",
  paymentLink: "",
};

export function CreatorDashboard() {
  const { actor, isFetching } = useActor();
  const { identity, login } = useInternetIdentity();
  const [isCreator, setIsCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<CreatorProfile>(EMPTY_PROFILE);
  const [products, setProducts] = useState<Product[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [followers, setFollowers] = useState(0);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [newProduct, setNewProduct] = useState({ ...EMPTY_PRODUCT });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [platformRole, setPlatformRole] = useState("free");

  const principalId = identity?.getPrincipal().toString();

  useEffect(() => {
    async function load() {
      if (!actor || isFetching || !identity) return;
      setIsLoading(true);
      try {
        const role =
          typeof (actor as any).getPlatformRole === "function"
            ? ((await (actor as any).getPlatformRole()) as string)
            : "free";
        setPlatformRole(role || "free");

        const creatorData =
          typeof (actor as any).getCreatorProfile === "function"
            ? await (actor as any).getCreatorProfile(
                identity.getPrincipal().toString(),
              )
            : null;

        if (creatorData) {
          setIsCreator(true);
          setProfile({ ...EMPTY_PROFILE, ...creatorData });

          const [prods, tipsData, followerList] = await Promise.all([
            typeof (actor as any).getProductsByCreator === "function"
              ? (actor as any).getProductsByCreator(
                  identity.getPrincipal().toString(),
                )
              : Promise.resolve([]),
            typeof (actor as any).getTipsReceived === "function"
              ? (actor as any).getTipsReceived(
                  identity.getPrincipal().toString(),
                )
              : Promise.resolve([]),
            typeof (actor as any).getFollowers === "function"
              ? (actor as any).getFollowers(identity.getPrincipal().toString())
              : Promise.resolve([]),
          ]);

          setProducts(prods || []);
          setTips(tipsData || []);
          setFollowers((followerList || []).length);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [actor, isFetching, identity]);

  const handleClaimCreator = async () => {
    if (!actor || !identity) return;
    try {
      if (typeof (actor as any).claimCreatorRole === "function") {
        await (actor as any).claimCreatorRole();
      }
      setIsCreator(true);
      toast.success("Welcome! You're now a creator.");
    } catch {
      toast.error("Failed to claim creator role");
    }
  };

  const handleSaveProfile = async () => {
    if (!actor || !identity) return;
    setIsSavingProfile(true);
    try {
      if (typeof (actor as any).saveCreatorProfile === "function") {
        await (actor as any).saveCreatorProfile({
          displayName: profile.displayName,
          bio: profile.bio,
          category: profile.category,
          profileType: profile.profileType,
          socialLinks: profile.socialLinks,
          githubUrl: profile.githubUrl,
          contactEmail: profile.contactEmail,
          websiteUrl: profile.websiteUrl,
          profilePicUrl: profile.profilePicUrl,
          createdAt: profile.createdAt || BigInt(Date.now()),
        });
      }
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddProduct = async () => {
    if (!actor || !identity || !newProduct.title.trim()) return;
    setIsAddingProduct(true);
    try {
      const price = newProduct.isFree
        ? BigInt(0)
        : BigInt(Math.round(Number.parseFloat(newProduct.price || "0") * 100));
      const tags = newProduct.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (typeof (actor as any).createProduct === "function") {
        await (actor as any).createProduct(
          newProduct.title.trim(),
          newProduct.description.trim(),
          newProduct.category,
          price,
          newProduct.isFree,
          tags,
          newProduct.fileUrl.trim(),
          newProduct.paymentLink.trim(),
        );
        toast.success("Product created!");
        setNewProduct({ ...EMPTY_PRODUCT });

        // Refresh products
        if (typeof (actor as any).getProductsByCreator === "function") {
          const prods = await (actor as any).getProductsByCreator(
            identity.getPrincipal().toString(),
          );
          setProducts(prods || []);
        }
      }
    } catch {
      toast.error("Failed to create product");
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: bigint) => {
    if (!actor) return;
    try {
      if (typeof (actor as any).deleteProduct === "function") {
        await (actor as any).deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Product deleted");
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const totalDownloads = products.reduce(
    (sum, p) => sum + Number(p.downloadCount),
    0,
  );
  const totalTips = tips.reduce((sum, t) => sum + Number(t.amount), 0) / 100;

  if (!identity) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-sm border-border">
          <CardHeader className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <User className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="font-display">Sign In Required</CardTitle>
            <CardDescription className="font-ui">
              Please sign in to access your Creator Dashboard
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!isCreator) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <Card className="border-border">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                Become a Creator
              </CardTitle>
              <CardDescription className="font-ui">
                Start selling your projects, resumes, templates, and more to a
                global audience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: ShoppingBag,
                    label: "Sell products",
                    color: "#E25C3B",
                  },
                  { icon: Users, label: "Build followers", color: "#3B8CE2" },
                  { icon: Zap, label: "Receive tips", color: "#E2A83B" },
                  {
                    icon: BarChart3,
                    label: "Track analytics",
                    color: "#2DBD6E",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}18` }}
                    >
                      <item.icon
                        className="w-4 h-4"
                        style={{ color: item.color }}
                      />
                    </div>
                    <span className="font-ui text-sm text-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full font-ui gap-2"
                onClick={handleClaimCreator}
              >
                <Check className="w-4 h-4" />
                Start as Creator — It's Free
              </Button>
            </CardContent>
          </Card>
        </motion.div>
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
                Creator Dashboard
              </h1>
              <p className="text-xs text-muted-foreground font-ui">
                Manage your products and profile
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className="font-ui text-xs"
                style={{
                  backgroundColor:
                    platformRole === "admin" ? "#E25C3B18" : "#3B8CE218",
                  color: platformRole === "admin" ? "#E25C3B" : "#3B8CE2",
                  border: `1px solid ${platformRole === "admin" ? "#E25C3B30" : "#3B8CE230"}`,
                }}
              >
                {platformRole.charAt(0).toUpperCase() + platformRole.slice(1)}
              </Badge>
              {principalId && (
                <a href={`/creator/${principalId}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-ui gap-1.5 text-xs"
                  >
                    View Profile
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              label: "Products",
              value: products.length,
              icon: ShoppingBag,
              color: "#E25C3B",
            },
            {
              label: "Downloads",
              value: totalDownloads.toLocaleString(),
              icon: Download,
              color: "#3B8CE2",
            },
            {
              label: "Followers",
              value: followers,
              icon: Users,
              color: "#2DBD6E",
            },
            {
              label: "Tips Earned",
              value: `$${totalTips.toFixed(2)}`,
              icon: DollarSign,
              color: "#E2A83B",
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
                    <p className="font-display font-bold text-lg text-foreground">
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

        <Tabs defaultValue="products">
          <TabsList className="font-ui mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="profile">Edit Profile</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Add Product Form */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  Add New Product
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">Title *</Label>
                    <Input
                      value={newProduct.title}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="My Awesome Project"
                      className="font-ui"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(v) =>
                        setNewProduct((p) => ({ ...p, category: v }))
                      }
                    >
                      <SelectTrigger className="font-ui">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c} className="font-ui">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-ui text-sm">Description</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your product..."
                    className="font-ui text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isFree"
                      checked={newProduct.isFree}
                      onCheckedChange={(v) =>
                        setNewProduct((p) => ({ ...p, isFree: !!v }))
                      }
                    />
                    <Label htmlFor="isFree" className="font-ui text-sm">
                      Free product
                    </Label>
                  </div>
                  {!newProduct.isFree && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-ui text-sm">
                        $
                      </span>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct((p) => ({
                            ...p,
                            price: e.target.value,
                          }))
                        }
                        placeholder="9.99"
                        className="font-ui w-24"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">
                      {newProduct.isFree ? "File URL" : "Payment Link"}
                    </Label>
                    <Input
                      value={
                        newProduct.isFree
                          ? newProduct.fileUrl
                          : newProduct.paymentLink
                      }
                      onChange={(e) =>
                        setNewProduct((p) =>
                          newProduct.isFree
                            ? { ...p, fileUrl: e.target.value }
                            : { ...p, paymentLink: e.target.value },
                        )
                      }
                      placeholder={
                        newProduct.isFree
                          ? "https://..."
                          : "https://buy.stripe.com/..."
                      }
                      className="font-ui"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">
                      Tags (comma separated)
                    </Label>
                    <Input
                      value={newProduct.tags}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, tags: e.target.value }))
                      }
                      placeholder="React, TypeScript, Web Dev"
                      className="font-ui"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddProduct}
                  disabled={!newProduct.title.trim() || isAddingProduct}
                  className="font-ui gap-2"
                >
                  {isAddingProduct ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add Product
                </Button>
              </CardContent>
            </Card>

            {/* Products List */}
            {products.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-display font-semibold text-muted-foreground">
                  No products yet
                </p>
                <p className="text-sm text-muted-foreground font-ui mt-1">
                  Add your first product above
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <Card key={product.id.toString()} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-display font-semibold text-sm text-foreground">
                              {product.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="font-ui text-xs"
                            >
                              {product.category}
                            </Badge>
                            <span
                              className={`text-sm font-bold font-display ${product.isFree ? "text-green-600" : "text-primary"}`}
                            >
                              {product.isFree
                                ? "Free"
                                : `$${(Number(product.price) / 100).toFixed(2)}`}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-ui line-clamp-1">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-ui">
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {Number(product.downloadCount).toLocaleString()}
                            </span>
                            {product.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="font-ui text-xs h-4"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <a href={`/product/${product.id.toString()}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-ui h-8 text-xs"
                            >
                              View
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="font-ui h-8 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Creator Profile
                </CardTitle>
                <CardDescription className="font-ui text-sm">
                  This information will be shown on your public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">Display Name *</Label>
                    <Input
                      value={profile.displayName}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          displayName: e.target.value,
                        }))
                      }
                      placeholder="Your name"
                      className="font-ui"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">
                      Profile Picture URL
                    </Label>
                    <Input
                      value={profile.profilePicUrl}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          profilePicUrl: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                      className="font-ui"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-ui text-sm">Bio</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, bio: e.target.value }))
                    }
                    placeholder="Tell the world about yourself..."
                    className="font-ui text-sm"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">Category</Label>
                    <Select
                      value={profile.category}
                      onValueChange={(v) =>
                        setProfile((p) => ({ ...p, category: v }))
                      }
                    >
                      <SelectTrigger className="font-ui">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c} className="font-ui">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">Profile Type</Label>
                    <Select
                      value={profile.profileType}
                      onValueChange={(v) =>
                        setProfile((p) => ({ ...p, profileType: v }))
                      }
                    >
                      <SelectTrigger className="font-ui">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROFILE_TYPES.map((t) => (
                          <SelectItem key={t} value={t} className="font-ui">
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">GitHub URL</Label>
                    <Input
                      value={profile.githubUrl}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, githubUrl: e.target.value }))
                      }
                      placeholder="https://github.com/..."
                      className="font-ui"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">Website URL</Label>
                    <Input
                      value={profile.websiteUrl}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          websiteUrl: e.target.value,
                        }))
                      }
                      placeholder="https://yoursite.com"
                      className="font-ui"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-ui text-sm">Contact Email</Label>
                    <Input
                      type="email"
                      value={profile.contactEmail}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          contactEmail: e.target.value,
                        }))
                      }
                      placeholder="you@example.com"
                      className="font-ui"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={!profile.displayName.trim() || isSavingProfile}
                  className="font-ui gap-2"
                >
                  {isSavingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <p className="font-display font-bold text-2xl text-foreground">
                    ${totalTips.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground font-ui mt-1">
                    Total tips received
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-6">
                  <p className="font-display font-bold text-2xl text-foreground">
                    {tips.length}
                  </p>
                  <p className="text-xs text-muted-foreground font-ui mt-1">
                    Tips sent to you
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-6">
                  <p className="font-display font-bold text-2xl text-foreground">
                    {totalDownloads.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground font-ui mt-1">
                    Total downloads
                  </p>
                </CardContent>
              </Card>
            </div>

            {tips.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Recent Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tips.slice(0, 10).map((tip) => (
                      <div
                        key={tip.id.toString()}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="font-ui text-sm text-foreground">
                            {tip.fromPrincipal.slice(0, 12)}…
                          </p>
                          {tip.message && (
                            <p className="text-xs text-muted-foreground font-ui">
                              {tip.message}
                            </p>
                          )}
                        </div>
                        <span className="font-display font-bold text-green-600 text-sm">
                          +${(Number(tip.amount) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
