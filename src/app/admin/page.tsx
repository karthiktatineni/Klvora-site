"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore, OrderStatus } from "@/store/useAdminStore";
import { useCatalogStore } from "@/store/useStore";
import { PRODUCTS, type Product } from "@/lib/products";
import { getProducts } from "@/lib/supabase";
import { Package, TrendingUp, Users, IndianRupee, Search, Edit2, Box, LogOut, Plus, Trash2, X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { uploadProductImage, deleteProductImage, isSupabaseUrl } from "@/lib/supabase";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { subscribeToOrders, updateOrderStatusInDb, subscribeToMessages } from "@/lib/db";

const PRESET_IMAGES = [
  { name: "Default Hoodie", url: "/products/streetwear-hoodie.png" },
  { name: "Obsidian Tote", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFlcn_lCCJ6lQNo2qZ9eGXBUeyTisLDpnbqIi0sgjTFLE_H8pCeTb-Q6ALQY-mYPH7sSt1vIbuik8M1-gufgSbAmyOEJGYZXX0Kdo5r_IAozI3mZGlsnpb2CHqF9vhFuzMBVD6WHlUe0pc87OZTnKnbwZUhflyKLWlQzLi5A0ET76HdlwrRT8SVhDGkVbz_YRzdhEtF_0o8Fmad9usC0-yndjCoJdAfrXOUGppkoHMEBFBsIullNwoMY7HpCv9WCq0s4bIRdlFPgg" },
  { name: "Lumen Coat", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfUaAETtjyJc1c7xIdrniE4LQiaP03LH057GRh-VB9_jEi0FRTQGw3QNoztN-HHEfN_pnP18EVDDB8QVS2OonKhYfVSrZ-Hwy2q8KTO2MHu4I3CrFWRb3BS1MVGiDQ3577qOVbemPIODr2oP-hhjoYeRIbaQyMZ-j7Faeqs4NeKFn673o8TmczqwJO0lkqDY7ymyMnSXxmY5v9XZdWduYBdxoOV7gykywQ81tjBXoFaYdmHf-HP6df-c0NkueTj9T_ek-UU9G26AQ" },
  { name: "Wool Blazer", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9VZkaOJTjK333hl-qPZUNA_zumEgtBVlZxePRf72miUe0VIidt2T46-lw8Gw6aKAqwTvtw5540qHESgsw1bdBcViz01rL-FfeY89GmTEvAppAizsQ7xynS6wqx0mXB1V5cPCVhbezyRFsOIHspQ4do905sRbriG3985Y3Gi6hDgfpFaHQUWwv4vsey3o33XM1xkC1HqDIU22ByF0-C0oPBi-T6_vZCA_qMnNN4uGKxYoj_SUcTiFJbtrmckEcl0BEArWu7C84r8w" },
];

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const { stocks, updateStock } = useProductStore();
  const { products, addProduct, removeProduct, updateProduct } = useCatalogStore();
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "messages">("orders");
  const [searchTerm, setSearchTerm] = useState("");

  // Product Creator Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [prodId, setProdId] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodBrand, setProdBrand] = useState("KLVORA");
  const [prodPrice, setProdPrice] = useState(500);
  const [prodOrigPrice, setProdOrigPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodShortDesc, setProdShortDesc] = useState("");
  const [prodCategory, setProdCategory] = useState("Outerwear");
  const [prodSubcategory, setProdSubcategory] = useState("");
  const [prodMaterial, setProdMaterial] = useState("100% Premium Cotton");
  const [prodGender, setProdGender] = useState<"men" | "women" | "unisex">("unisex");
  const [prodImages, setProdImages] = useState<string[]>(["/products/streetwear-hoodie.png"]);
  const [prodImageInput, setProdImageInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prodColors, setProdColors] = useState<{ name: string; hex: string }[]>([
    { name: "Obsidian Black", hex: "#1b1c1b" }
  ]);
  const [prodColorName, setProdColorName] = useState("");
  const [prodColorHex, setProdColorHex] = useState("#1b1c1b");
  const [prodSizes, setProdSizes] = useState<string[]>(["S", "M", "L", "XL"]);

  // Form Toggles
  const [prodIsNew, setProdIsNew] = useState(true);
  const [prodIsBestseller, setProdIsBestseller] = useState(false);
  const [prodIsTrending, setProdIsTrending] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribeOrders = subscribeToOrders(setOrders);
      const unsubscribeMessages = subscribeToMessages(setMessages);
      return () => {
        unsubscribeOrders();
        unsubscribeMessages();
      };
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Invalid admin credentials");
    }
  };

  const handleLogout = () => signOut(auth);

  const handleCreateClick = () => {
    setEditingProduct(null);
    setProdId("klv-" + Math.random().toString(36).substring(2, 9));
    setProdName("");
    setProdBrand("KLVORA");
    setProdPrice(850);
    setProdOrigPrice("");
    setProdDesc("A carefully designed piece representing KLVORA streetwear tailoring.");
    setProdShortDesc("Oversized street silhouette");
    setProdCategory("Outerwear");
    setProdSubcategory("Hoodies");
    setProdMaterial("100% Organic Heavyweight Cotton");
    setProdGender("unisex");
    setProdImages(["/products/streetwear-hoodie.png"]);
    setProdColors([{ name: "Obsidian Black", hex: "#1b1c1b" }]);
    setProdSizes(["S", "M", "L", "XL"]);
    setProdIsNew(true);
    setProdIsBestseller(false);
    setProdIsTrending(true);
    setShowProductModal(true);
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setProdId(p.id);
    setProdName(p.name);
    setProdBrand(p.brand);
    setProdPrice(p.price);
    setProdOrigPrice(p.originalPrice ? String(p.originalPrice) : "");
    setProdDesc(p.description);
    setProdShortDesc(p.shortDescription);
    setProdCategory(p.category);
    setProdSubcategory(p.subcategory || "");
    setProdMaterial(p.material);
    setProdGender(p.gender);
    setProdImages(p.images);
    setProdColors(p.colors);
    setProdSizes(p.sizes);
    setProdIsNew(p.isNew);
    setProdIsBestseller(p.isBestseller);
    setProdIsTrending(p.isTrending);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodId || !prodName) {
      alert("Product ID and Name are required!");
      return;
    }

    const productData: Product = {
      id: prodId,
      name: prodName,
      brand: prodBrand,
      price: Number(prodPrice),
      originalPrice: prodOrigPrice ? Number(prodOrigPrice) : undefined,
      description: prodDesc,
      shortDescription: prodShortDesc,
      category: prodCategory,
      subcategory: prodSubcategory,
      tags: [prodCategory.toLowerCase(), prodSubcategory.toLowerCase()].filter(Boolean),
      colors: prodColors,
      sizes: prodSizes,
      material: prodMaterial,
      images: prodImages,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      inStock: true,
      isNew: prodIsNew,
      isBestseller: prodIsBestseller,
      isTrending: prodIsTrending,
      collection: "Archive",
      gender: prodGender,
    };

    try {
      if (editingProduct) {
        await updateProduct(productData);
      } else {
        await addProduct(productData);
        updateStock(productData.id, 100); // Set default stock to 100
      }
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm("This will upload local static products into the Supabase database. Are you sure?")) return;
    try {
      // Avoid duplicates by fetching existing first
      const existing = await getProducts();
      const existingIds = existing.map(p => p.id);
      
      let added = 0;
      for (const p of PRODUCTS) {
        if (!existingIds.includes(p.id)) {
          await addProduct(p);
          added++;
        }
      }
      alert(`Successfully seeded ${added} new products to database.`);
    } catch (err: any) {
      alert(`Error seeding database: ${err.message}`);
    }
  };

  const handleAddColor = () => {
    if (!prodColorName.trim()) return;
    setProdColors([...prodColors, { name: prodColorName, hex: prodColorHex }]);
    setProdColorName("");
  };

  const handleRemoveColor = (name: string) => {
    setProdColors(prodColors.filter((c) => c.name !== name));
  };

  const handleToggleSize = (size: string) => {
    if (prodSizes.includes(size)) {
      setProdSizes(prodSizes.filter((s) => s !== size));
    } else {
      setProdSizes([...prodSizes, size]);
    }
  };

  const handleAddImageUrl = () => {
    if (!prodImageInput.trim()) return;
    setProdImages([...prodImages, prodImageInput]);
    setProdImageInput("");
  };

  // Supabase file upload handler
  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (fileArray.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress(`Uploading ${i + 1}/${fileArray.length}: ${file.name}`);
      try {
        const url = await uploadProductImage(file);
        newUrls.push(url);
      } catch (err: any) {
        console.error("Upload failed for", file.name, err);
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    if (newUrls.length > 0) {
      setProdImages((prev) => [...prev, ...newUrls]);
    }
    setIsUploading(false);
    setUploadProgress("");
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle removing an image — delete from Supabase if it's stored there
  const handleRemoveImage = async (url: string, index: number) => {
    setProdImages((prev) => prev.filter((_, i) => i !== index));
    if (isSupabaseUrl(url)) {
      try {
        await deleteProductImage(url);
      } catch (err) {
        console.warn("Could not delete from storage:", err);
      }
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  if (loading) return <div className="pt-28 text-center">Loading...</div>;

  if (!user) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center bg-[#14181f]">
        <div className="glass-card p-8 rounded-2xl w-full max-w-md border border-[#dbdad8]/10 bg-black/40">
          <h1 className="font-serif text-headline-lg text-white mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Admin Email" 
              className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-white outline-none focus:border-white transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-white outline-none focus:border-white transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-white text-black py-4 font-sans font-bold uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const STATUS_COLORS: Record<OrderStatus, string> = {
    Processing: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    Packing: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Shipping: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    Delivered: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-surface-container-low/30">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-serif text-headline-lg text-primary">Admin Control Center</h1>
            <p className="font-sans text-body-md text-on-surface-variant mt-2">Manage orders, inventory, and storefront clothing catalog.</p>
            <p className="text-[10px] text-on-surface-variant/40 mt-1">Authorized Access: admin@klvora.in</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-body-sm text-on-surface-variant/60 hover:text-red-500 transition-colors mb-2"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Revenue", value: formatPrice(totalRevenue), icon: IndianRupee },
            { label: "Active Orders", value: orders.filter(o => o.status !== "Delivered").length, icon: Package },
            { label: "Total Customers", value: new Set(orders.map(o => o.customer?.email)).size, icon: Users },
            { label: "Avg. Order Value", value: orders.length ? formatPrice(totalRevenue / orders.length) : formatPrice(0), icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-6 bg-surface">
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/70">{stat.label}</span>
                <stat.icon size={18} className="text-secondary" />
              </div>
              <p className="font-serif text-headline-md text-primary">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-outline-variant/20 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab("orders")} className={`pb-4 font-sans text-ui-button uppercase tracking-[0.05em] transition-all border-b-2 whitespace-nowrap ${activeTab === "orders" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}>
            Orders Management
          </button>
          <button onClick={() => setActiveTab("inventory")} className={`pb-4 font-sans text-ui-button uppercase tracking-[0.05em] transition-all border-b-2 whitespace-nowrap ${activeTab === "inventory" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}>
            Catalog & Stock
          </button>
          <button onClick={() => setActiveTab("messages")} className={`pb-4 font-sans text-ui-button uppercase tracking-[0.05em] transition-all border-b-2 whitespace-nowrap ${activeTab === "messages" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}>
            Customer Messages
          </button>
        </div>

        {/* Content */}
        {activeTab === "orders" && (
          <div className="glass-card bg-surface rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50">
              <h2 className="font-sans text-headline-sm text-primary">Recent Orders</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..." 
                  className="pl-9 pr-4 py-2 rounded-lg border border-outline-variant/30 bg-surface text-body-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/30">
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Order ID</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Date</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Customer</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Amount</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Status</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => 
                    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((order) => (
                    <tr key={order.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors">
                      <td className="p-4 font-medium text-body-sm text-primary">{order.id.slice(-8).toUpperCase()}</td>
                      <td className="p-4 text-body-sm text-on-surface-variant">
                        {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : "Just now"}
                      </td>
                      <td className="p-4 text-body-sm text-on-surface-variant">
                        {order.customer?.firstName} {order.customer?.lastName}<br/>
                        <span className="text-[12px] opacity-60">{order.customer?.email}</span>
                      </td>
                      <td className="p-4 font-medium text-body-sm text-primary">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${STATUS_COLORS[order.status as OrderStatus] || "bg-gray-100"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatusInDb(order.id, e.target.value)}
                          className="bg-surface border border-outline-variant/30 rounded p-1.5 text-body-sm outline-none cursor-pointer focus:border-primary"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Packing">Packing</option>
                          <option value="Shipping">Shipping</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-on-surface-variant">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="glass-card bg-surface rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50">
              <div>
                <h2 className="font-sans text-headline-sm text-primary">Catalog & Inventory</h2>
                <p className="text-xs text-on-surface-variant/60 mt-1">Manage active garments, adjust pricing, stocks, and edit product listings.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSeedDatabase}
                  className="bg-secondary text-white hover:bg-secondary/90 text-xs font-bold uppercase tracking-widest px-4 py-3 rounded flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  Seed Database
                </button>
                <button
                  onClick={handleCreateClick}
                  className="bg-primary text-on-primary hover:bg-primary/95 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Plus size={14} /> Add Clothing
                </button>
              </div>
            </div>
            
            {/* Catalog list */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/30">
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Image</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Product Details</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Price</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Stock</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Badges</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors">
                      <td className="p-4 shrink-0">
                        <div className="w-12 h-16 rounded overflow-hidden bg-surface-container-low border border-outline-variant/10">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4">
                        <h3 className="font-serif text-body-md text-primary font-bold">{product.name}</h3>
                        <p className="text-[11px] text-on-surface-variant/60 uppercase tracking-wider mt-0.5">
                          ID: <span className="font-mono">{product.id}</span> · {product.category}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-body-sm text-primary">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-[12px] line-through text-on-surface-variant/40 ml-2">{formatPrice(product.originalPrice)}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            min="0"
                            value={stocks[product.id] ?? 0}
                            onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                            className={`w-20 px-2.5 py-1.5 rounded border text-center font-mono text-body-sm outline-none transition-colors ${
                              (stocks[product.id] ?? 0) < 10 ? "border-red-300 text-red-600 bg-red-50" : "border-outline-variant/30 focus:border-primary"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {product.isNew && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] uppercase font-bold rounded">New</span>}
                          {product.isBestseller && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[9px] uppercase font-bold rounded">Best</span>}
                          {product.isTrending && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] uppercase font-bold rounded">Trend</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                try {
                                  await removeProduct(product.id);
                                } catch (err: any) {
                                  alert(`Error deleting product: ${err.message}`);
                                }
                              }
                            }}
                            className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-on-surface-variant/50 font-serif">
                        No clothing items exist in the catalog yet. Click "+ Add Clothing" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="glass-card bg-surface rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="p-6 border-b border-outline-variant/20 bg-surface-container-low/50">
              <h2 className="font-sans text-headline-sm text-primary">Inquiry Inbox</h2>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {messages.map((msg) => (
                <div key={msg.id} className="p-6 hover:bg-surface-container-low/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-sans text-body-lg text-primary font-medium">{msg.name}</h3>
                      <p className="text-[12px] text-on-surface-variant/60">{msg.email} · {msg.phone}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">
                      {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                    </span>
                  </div>
                  <p className="text-body-md text-on-surface-variant leading-relaxed mt-4 bg-surface-container-low/30 p-4 rounded-lg italic">
                    "{msg.message}"
                  </p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="p-12 text-center text-on-surface-variant">No inquiries yet.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Catalog Manager Form Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-zoom-out"
            />

            {/* Form Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#14181f] text-primary dark:text-frost rounded-2xl shadow-cinematic overflow-hidden flex flex-col border border-outline-variant/20 max-h-[90vh] z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-headline-sm text-primary dark:text-white">
                    {editingProduct ? `Edit Listing: ${editingProduct.name}` : "Create New Clothing Item"}
                  </h2>
                  <p className="text-xs text-on-surface-variant/60 dark:text-silver-chrome/40 mt-1">
                    Provide specifications and configure pricing, badges, and variants.
                  </p>
                </div>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 text-on-surface-variant transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                      Product ID (Slug)
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingProduct}
                      value={prodId}
                      onChange={(e) => setProdId(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="e.g. core-drop-hoodie"
                      className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost disabled:opacity-50 text-sm font-mono"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                      Clothing Name
                    </label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. Heavyweight Cargo Pants"
                      className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost text-sm"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      placeholder="KLVORA"
                      className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost text-sm"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                      Price (INR)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost text-sm"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                      Original / Sale Price (INR, Optional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={prodOrigPrice}
                      onChange={(e) => setProdOrigPrice(e.target.value)}
                      placeholder="Leaving blank ignores sale status"
                      className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost text-sm"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                      Category
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost text-sm text-primary dark:text-white"
                    >
                      {["Outerwear", "Bottoms", "Tops", "Shoes", "Bags", "Jewelry", "Accessories", "Dresses"].map((cat) => (
                        <option key={cat} value={cat} className="text-black">{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={prodSubcategory}
                      onChange={(e) => setProdSubcategory(e.target.value)}
                      placeholder="e.g. Hoodies, Pants"
                      className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost text-sm"
                    />
                  </div>

                  {/* Material */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                      Fabric / Material
                    </label>
                    <input
                      type="text"
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value)}
                      placeholder="e.g. 100% French Terry Cotton"
                      className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost text-sm"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                      Target Gender
                    </label>
                    <select
                      value={prodGender}
                      onChange={(e) => setProdGender(e.target.value as any)}
                      className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost text-sm text-primary dark:text-white"
                    >
                      <option value="unisex" className="text-black">Unisex</option>
                      <option value="men" className="text-black">Men</option>
                      <option value="women" className="text-black">Women</option>
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={prodShortDesc}
                    onChange={(e) => setProdShortDesc(e.target.value)}
                    placeholder="e.g. Loose drop-shoulder aesthetic with brushed fleece lining."
                    className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-4 py-2.5 outline-none focus:border-primary dark:focus:border-frost text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                    Full Description
                  </label>
                  <textarea
                    rows={4}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Enter detailed garment craftsmanship information, architecture, and sizing suggestions."
                    className="w-full bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded p-4 outline-none focus:border-primary dark:focus:border-frost text-sm resize-none"
                  />
                </div>

                {/* Badges Toggles */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-3">
                    Storefront Badges
                  </label>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={prodIsNew}
                        onChange={(e) => setProdIsNew(e.target.checked)}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <span>Mark as New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={prodIsBestseller}
                        onChange={(e) => setProdIsBestseller(e.target.checked)}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <span>Mark as Bestseller</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={prodIsTrending}
                        onChange={(e) => setProdIsTrending(e.target.checked)}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <span>Mark as Trending Now</span>
                    </label>
                  </div>
                </div>

                {/* Size Swatches */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-3">
                    Available Sizing
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL", "One Size"].map((sz) => {
                      const selected = prodSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleToggleSize(sz)}
                          className={`px-4 py-2 border rounded font-sans text-xs uppercase transition-all ${
                            selected
                              ? "bg-primary text-on-primary border-primary dark:bg-frost dark:text-black dark:border-frost font-bold"
                              : "border-outline-variant/30 text-on-surface-variant hover:border-primary dark:hover:border-frost"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors Manager */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                    Color Variants
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3 bg-black/5 dark:bg-white/5 border border-outline-variant/10 p-3 rounded">
                    {prodColors.map((c) => (
                      <span
                        key={c.name}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-black/30 border border-outline-variant/20 rounded-full text-xs text-on-surface"
                      >
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                        {c.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(c.name)}
                          className="text-on-surface-variant/60 hover:text-red-500 transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {prodColors.length === 0 && (
                      <p className="text-xs text-on-surface-variant/50 p-1">No color variants added yet.</p>
                    )}
                  </div>
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      placeholder="Color Name (e.g. Charcoal)"
                      value={prodColorName}
                      onChange={(e) => setProdColorName(e.target.value)}
                      className="flex-1 bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                    <input
                      type="color"
                      value={prodColorHex}
                      onChange={(e) => setProdColorHex(e.target.value)}
                      className="w-10 h-8 border border-outline-variant/20 rounded bg-transparent p-0.5 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="bg-primary text-on-primary px-4 py-2 text-xs uppercase tracking-widest font-bold font-sans rounded hover:bg-secondary"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Images Manager */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 dark:text-silver-chrome/50 block mb-2">
                    Product Imagery
                  </label>

                  {/* Drag & Drop Upload Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`relative mb-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      isDragOver
                        ? "border-primary dark:border-frost bg-primary/5 dark:bg-frost/5 scale-[1.01]"
                        : isUploading
                        ? "border-yellow-400/50 bg-yellow-50/5 cursor-wait"
                        : "border-outline-variant/30 hover:border-primary/50 dark:hover:border-frost/50 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 size={28} className="animate-spin text-primary dark:text-frost" />
                        <p className="text-xs text-primary dark:text-frost font-medium">{uploadProgress}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-frost/10 flex items-center justify-center">
                          <Upload size={20} className="text-primary dark:text-frost" />
                        </div>
                        <p className="text-sm font-medium text-on-surface-variant">
                          {isDragOver ? "Drop images here" : "Click or drag images to upload"}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/50">
                          Uploaded to Supabase Storage · PNG, JPG, WebP
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Preset Quick Selectors */}
                  <span className="text-[10px] text-on-surface-variant/50 block mb-2">Preset Streetwear Samples:</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {PRESET_IMAGES.map((img) => {
                      const active = prodImages.includes(img.url);
                      return (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setProdImages(prodImages.filter((url) => url !== img.url));
                            } else {
                              setProdImages([...prodImages, img.url]);
                            }
                          }}
                          className={`flex items-center gap-2 p-1 border rounded text-left transition-all ${
                            active ? "border-primary dark:border-frost bg-primary/5 dark:bg-white/5" : "border-outline-variant/20 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={img.url} alt={img.name} className="w-8 h-10 object-cover rounded bg-white" />
                          <span className="text-[9px] font-medium leading-none truncate">{img.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Current Images Thumbnail Grid */}
                  {prodImages.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                      {prodImages.map((img, i) => (
                        <div
                          key={i}
                          className="group relative rounded-lg overflow-hidden border border-outline-variant/20 bg-black/5 dark:bg-white/5 aspect-[3/4]"
                        >
                          <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                          {/* Badge for Supabase-hosted images */}
                          {isSupabaseUrl(img) && (
                            <span className="absolute top-1 left-1 bg-green-500/90 text-white text-[7px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider">
                              Supabase
                            </span>
                          )}
                          {/* Delete overlay */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img, i)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 size={18} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {prodImages.length === 0 && (
                    <div className="flex items-center gap-2 mb-3 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-outline-variant/10">
                      <ImageIcon size={16} className="text-on-surface-variant/40" />
                      <p className="text-xs text-on-surface-variant/50">No images added yet. Upload files or paste URLs below.</p>
                    </div>
                  )}

                  {/* Manual URL Input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste an external Image URL"
                      value={prodImageInput}
                      onChange={(e) => setProdImageInput(e.target.value)}
                      className="flex-1 bg-black/5 dark:bg-white/5 border border-outline-variant/20 rounded px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-primary text-on-primary px-4 py-2 text-xs uppercase tracking-widest font-bold font-sans rounded hover:bg-secondary"
                    >
                      Insert
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-outline-variant/15 pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="border border-outline-variant/30 text-on-surface px-6 py-3 font-sans text-xs uppercase tracking-widest font-bold rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary dark:bg-frost dark:text-black px-8 py-3 font-sans text-xs uppercase tracking-widest font-bold rounded hover:bg-secondary dark:hover:bg-white transition-all active:scale-[0.97]"
                  >
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
