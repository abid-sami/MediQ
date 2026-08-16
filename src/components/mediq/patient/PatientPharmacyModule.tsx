import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  ShoppingCart,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Package,
  Pill,
  ArrowRight,
  Filter,
  CreditCard,
  Building2,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { PatientPharmacyOrder, PatientBill } from "@/data/patient-data";
import { PharmacyMedicine } from "@/data/pharmacy-data";
import {
  getDynamicMedicines,
  getDynamicPharmacyOrders,
  createDynamicPharmacyOrder,
  getDynamicPharmacyCategories,
  uploadPrescriptionSubmission,
} from "@/data/pharmacy-store";

interface CartItem {
  medicine: PharmacyMedicine;
  quantity: number;
}

interface PatientPharmacyModuleProps {
  orders: PatientPharmacyOrder[];
  onNewOrder: (order: PatientPharmacyOrder) => void;
  onAddBill?: (bill: PatientBill) => void;
  patientName?: string;
}

export function PatientPharmacyModule({
  orders: initialPropOrders,
  onNewOrder,
  onAddBill,
  patientName = "Patient",
}: PatientPharmacyModuleProps) {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<"catalog" | "orders">("catalog");

  // Dynamic Catalog State
  const [medicines, setMedicines] = useState<PharmacyMedicine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [deliveryType, setDeliveryType] = useState<"Home Delivery" | "Store Pickup">("Home Delivery");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("House 14, Road 5, Dhanmondi, Dhaka");
  const [patientPhone, setPatientPhone] = useState<string>("+1 (555) 234-5678");
  const [prescriptionNote, setPrescriptionNote] = useState<string>("");
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Live Orders
  const [orders, setOrders] = useState<PatientPharmacyOrder[]>(initialPropOrders);

  // Load medicines and orders from dynamic store
  const loadData = async () => {
    try {
      setLoading(true);
      const [meds, categoryData] = await Promise.all([getDynamicMedicines(), getDynamicPharmacyCategories()]);
      setMedicines(meds);
      setCategories(categoryData.map((category) => category.name));

      const dynamicOrders = await getDynamicPharmacyOrders();
      if (dynamicOrders && dynamicOrders.length > 0) {
        const transformed: PatientPharmacyOrder[] = dynamicOrders.map((o) => ({
          id: o.id,
          orderNo: o.orderId,
          date: o.orderTime,
          items: o.medicines.map((it) => ({
            name: it.medicineName,
            qty: it.quantity,
            price: it.unitPrice,
          })),
          totalPrice: o.totalAmount,
          prescriptionRequired: o.prescriptionRequired,
          prescriptionVerified: o.prescriptionStatus === "Verified",
          status: o.orderStatus as any,
          deliveryAddress: o.deliveryType,
        }));
        setOrders(transformed);
      }
    } catch (e) {
      console.warn("Error loading pharmacy catalog:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Categories loaded from Supabase
  const categoryFilters = ["All", ...categories];

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Cart operations
  const addToCart = (med: PharmacyMedicine, qty: number = 1) => {
    if (med.stock <= 0) {
      toast.error(`${med.name} is currently out of stock.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === med.id);
      if (existing) {
        const newQty = Math.min(med.stock, existing.quantity + qty);
        return prev.map((item) =>
          item.medicine.id === med.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { medicine: med, quantity: qty }];
    });

    toast.success(`Added ${med.name} to cart`);
  };

  const updateCartQty = (medId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.medicine.id === medId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.medicine.stock) {
              toast.error(`Only ${item.medicine.stock} units available in stock`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (medId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medId));
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const deliveryFee = deliveryType === "Home Delivery" && cart.length > 0 ? 2.5 : 0;
  const cartTotal = cartSubtotal + deliveryFee;
  const totalCartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasRxItem = cart.some((item) => item.medicine.prescriptionRequired);

  // Handle Checkout & Billing Generation
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (deliveryType === "Home Delivery" && !deliveryAddress.trim()) {
      toast.error("Please provide a delivery address.");
      return;
    }

    if (hasRxItem && !prescriptionFile) {
      toast.error("Upload a prescription file before ordering prescription medicines.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNo = `ORD-PH-2026-${Math.floor(1000 + Math.random() * 8999)}`;
      const orderId = `ph-ord-${Date.now()}`;
      const todayDate = new Date().toISOString().split("T")[0];

      // 1. Create Patient Pharmacy Order
      const newPatientOrder: PatientPharmacyOrder = {
        id: orderId,
        orderNo,
        date: todayDate,
        items: cart.map((it) => ({
          name: `${it.medicine.name} (${it.medicine.strength})`,
          qty: it.quantity,
          price: it.medicine.price,
        })),
        totalPrice: cartTotal,
        prescriptionRequired: hasRxItem,
        prescriptionVerified: !hasRxItem,
        status: hasRxItem ? "Processing" : "Processing",
        deliveryAddress: deliveryType === "Home Delivery" ? deliveryAddress : "Hospital Pharmacy Store Pickup",
      };

      // 2. Sync to Pharmacist Orders Store & Decrement Stock
      await createDynamicPharmacyOrder({
        id: orderId,
        orderId: orderNo,
        patientName,
        patientContact: patientPhone,
        medicines: cart.map((it) => ({
          medicineName: `${it.medicine.name} (${it.medicine.strength})`,
          strength: it.medicine.strength,
          quantity: it.quantity,
          unitPrice: it.medicine.price,
        })),
        orderTime: todayDate,
        totalAmount: cartTotal,
        prescriptionRequired: hasRxItem,
        prescriptionStatus: hasRxItem ? "Pending Verification" : "Verified",
        orderStatus: "Processing",
        deliveryType,
      });

      if (hasRxItem && prescriptionFile) {
        await uploadPrescriptionSubmission({
          file: prescriptionFile,
          patientName,
          orderReference: orderNo,
          notes: prescriptionNote,
        });
      }

      // 3. Automatically Generate Invoice in Patient's Billing!
      if (onAddBill) {
        const newBillInvoice: PatientBill = {
          id: `bill-ph-${Date.now()}`,
          invoiceNo: `INV-${orderNo.replace("ORD-", "")}`,
          serviceName: `Pharmacy Order: ${cart.map((it) => `${it.medicine.name} x${it.quantity}`).join(", ")}`,
          category: "Pharmacy",
          date: todayDate,
          amount: cartTotal,
          status: "Unpaid",
        };
        onAddBill(newBillInvoice);
      }

      // 4. Update local state & notify
      onNewOrder(newPatientOrder);
      setOrders((prev) => [newPatientOrder, ...prev]);

      // Reload fresh stock
      const freshMeds = await getDynamicMedicines();
      setMedicines(freshMeds);

      // Clear cart
      setCart([]);
      setPrescriptionFile(null);
      setPrescriptionNote("");
      setCartOpen(false);

      toast.success(`Pharmacy Order ${orderNo} Confirmed!`, {
        description: `Total $${cartTotal.toFixed(2)} has been added to your Billing invoices. Pharmacist is preparing your order.`,
      });

      // Switch to orders tab
      setActiveTab("orders");
    } catch (e: any) {
      toast.error(e?.message || "Failed to process pharmacy order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" /> MediQ Pharmacy & Medicine Store
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Order authentic prescription medicines and health essentials with direct billing integration.
          </p>
        </div>

        {/* View Switcher & Cart Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("catalog")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === "catalog"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Browse Medicines
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "orders"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>My Orders</span>
              {orders.length > 0 && (
                <span className="h-5 min-w-[20px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {orders.length}
                </span>
              )}
            </button>
          </div>

          <Button
            onClick={() => setCartOpen(true)}
            className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-soft h-10 px-4 gap-2 relative"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
            {totalCartItemCount > 0 && (
              <Badge className="bg-white text-primary font-black text-[10px] px-1.5 py-0 rounded-full shadow-xs">
                {totalCartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {activeTab === "catalog" ? (
        /* Medicine Store Catalog View */
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="bg-card border border-border p-4 rounded-2xl shadow-xs space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by brand name, generic formulation, or health condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-xs rounded-xl"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categoryFilters.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                      active
                        ? "gradient-primary text-primary-foreground shadow-soft"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Medicines Grid */}
          {loading ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              <Pill className="h-8 w-8 mx-auto mb-2 animate-bounce text-primary" />
              <p className="font-semibold">Loading real-time pharmacy inventory...</p>
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="p-12 text-center bg-card border border-border rounded-3xl text-muted-foreground space-y-2">
              <Package className="h-10 w-10 mx-auto opacity-30 text-primary" />
              <p className="font-bold text-foreground text-sm">No medicines found</p>
              <p className="text-xs">Try adjusting your search query or selecting a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredMedicines.map((med) => {
                const cartMatch = cart.find((it) => it.medicine.id === med.id);
                const isOutOfStock = med.stock <= 0;

                return (
                  <div
                    key={med.id}
                    className="bg-card border border-border rounded-3xl p-5 hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5">
                        <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground truncate">
                          {med.category}
                        </Badge>
                        <Badge
                          className={
                            isOutOfStock
                              ? "bg-red-500/20 text-red-600 dark:text-red-400 text-[9px] font-bold"
                              : med.stock < 25
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-bold"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold"
                          }
                        >
                          {isOutOfStock ? "Out of Stock" : `${med.stock} in stock`}
                        </Badge>
                      </div>

                      <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                        {med.name}
                      </h3>
                      <p className="text-xs text-primary font-semibold mt-0.5">{med.strength}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                        Generic: <strong className="text-foreground">{med.genericName}</strong>
                      </p>
                      <p className="text-[10px] text-muted-foreground">Mfg: {med.brand}</p>

                      {med.prescriptionRequired && (
                        <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md w-fit">
                          <ShieldAlert className="h-3 w-3" /> Rx Required
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase font-bold block">Unit Price</span>
                        <span className="text-lg font-black text-foreground">${med.price.toFixed(2)}</span>
                      </div>

                      {cartMatch ? (
                        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border">
                          <button
                            type="button"
                            onClick={() => updateCartQty(med.id, -1)}
                            className="h-7 w-7 rounded-lg bg-card text-foreground flex items-center justify-center hover:bg-muted font-bold text-xs"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-xs">{cartMatch.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(med.id, 1)}
                            className="h-7 w-7 rounded-lg bg-card text-foreground flex items-center justify-center hover:bg-muted font-bold text-xs"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          disabled={isOutOfStock}
                          onClick={() => addToCart(med, 1)}
                          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-soft h-9 px-3.5 gap-1.5 disabled:opacity-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add to Cart</span>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* My Pharmacy Orders View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Truck className="h-5 w-5 text-teal" /> My Pharmacy Orders ({orders.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("catalog")}
              className="rounded-xl text-xs font-semibold"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Order More Medicines
            </Button>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center bg-card border border-border rounded-3xl text-muted-foreground space-y-3">
              <ShoppingBag className="h-10 w-10 mx-auto opacity-30 text-primary" />
              <p className="font-bold text-foreground text-sm">No pharmacy orders yet</p>
              <p className="text-xs">Browse the medicine catalogue and checkout your cart to place your first order.</p>
              <Button
                onClick={() => setActiveTab("catalog")}
                className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl py-4 shadow-soft"
              >
                Browse Medicines
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-card border border-border rounded-3xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {ord.orderNo}
                      </span>
                      <Badge
                        className={
                          ord.status === "Delivered" || ord.status === "Ready"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                            : ord.status === "Cancelled"
                            ? "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                            : "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold"
                        }
                      >
                        {ord.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs border-y border-border/70 py-2.5">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex justify-between items-center py-0.5">
                          <span className="font-semibold text-foreground">
                            {it.name} <span className="text-muted-foreground font-mono">x{it.qty}</span>
                          </span>
                          <span className="font-bold text-foreground">${(it.price * it.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-muted-foreground space-y-1">
                      <p>
                        Delivery: <strong className="text-foreground">{ord.deliveryAddress || "Home Delivery"}</strong>
                      </p>
                      <p>Order Date: {ord.date}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="h-4 w-4" /> Added to Billing
                    </div>

                    <span className="text-base font-black text-foreground">
                      Total: ${ord.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cart Drawer / Modal */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-lg p-6 rounded-3xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" /> Shopping Cart ({totalCartItemCount} items)
              </span>
            </DialogTitle>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
              <ShoppingBag className="h-10 w-10 mx-auto opacity-30 text-primary" />
              <p className="font-bold text-foreground text-sm">Your cart is empty</p>
              <p>Add medicines from the catalog to proceed to checkout.</p>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {/* Cart Items List */}
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 divide-y divide-border">
                {cart.map((item) => (
                  <div key={item.medicine.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-foreground truncate">{item.medicine.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{item.medicine.strength} • ${item.medicine.price.toFixed(2)} each</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.medicine.id, -1)}
                        className="h-6 w-6 rounded-lg bg-card text-foreground flex items-center justify-center hover:bg-muted font-bold text-xs"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.medicine.id, 1)}
                        className="h-6 w-6 rounded-lg bg-card text-foreground flex items-center justify-center hover:bg-muted font-bold text-xs"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="font-bold text-foreground w-16 text-right">
                      ${(item.medicine.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.medicine.id)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-lg"
                      title="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery Options */}
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-2.5 text-xs">
                <span className="font-bold text-foreground block uppercase text-[10px]">Delivery Method</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("Home Delivery")}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      deliveryType === "Home Delivery"
                        ? "bg-card border-primary text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Truck className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span>Home Delivery</span>
                      <span className="text-[10px] text-muted-foreground block font-normal">+$2.50 fee</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType("Store Pickup")}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      deliveryType === "Store Pickup"
                        ? "bg-card border-primary text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Building2 className="h-4 w-4 text-teal shrink-0" />
                    <div>
                      <span>Store Pickup</span>
                      <span className="text-[10px] text-muted-foreground block font-normal">Free ($0.00)</span>
                    </div>
                  </button>
                </div>

                {deliveryType === "Home Delivery" && (
                  <div>
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">Delivery Address</Label>
                    <Input
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter street, apartment, and city..."
                      className="mt-1 h-8 text-xs rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Rx Warning */}
              {hasRxItem && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Prescription Items in Cart</strong>
                    <span className="text-[11px]">
                      Our pharmacist will verify your active doctor prescription before dispensing.
                    </span>
                  </div>
                </div>
              )}

              {hasRxItem && (
                <div className="p-3 rounded-xl bg-card border border-primary/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-foreground"><Upload className="h-4 w-4 text-primary" /> Upload prescription for pharmacist review</div>
                  <Input type="file" accept="image/*,.pdf" onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)} className="h-9 rounded-xl text-xs" />
                  {prescriptionFile && <p className="text-[11px] text-emerald-600 font-semibold">Selected: {prescriptionFile.name}</p>}
                  <Input value={prescriptionNote} onChange={(e) => setPrescriptionNote(e.target.value)} placeholder="Optional note for the pharmacist" className="h-9 rounded-xl text-xs" />
                  <p className="text-[10px] text-muted-foreground">Accepted formats: PDF, JPG, PNG. Your pharmacist will verify it before dispensing.</p>
                </div>
              )}

              {/* Order Summary Breakdown */}
              <div className="space-y-1.5 border-t border-border pt-3 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-foreground pt-1 border-t border-border">
                  <span>Total Order Amount</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full gradient-primary text-primary-foreground font-bold rounded-2xl py-5 shadow-lift text-xs gap-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>{isSubmitting ? "Processing Checkout..." : `Confirm Order & Add to Billing ($${cartTotal.toFixed(2)})`}</span>
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                Invoice will be added to your Billing records. You can pay online or upon delivery.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
