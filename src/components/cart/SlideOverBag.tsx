'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudioStore } from '@/store/useStudioStore';
import { SCARVES } from '@/data/scarves';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Award,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export function SlideOverBag() {
  const router = useRouter();
  const isBagOpen = useStudioStore((state) => state.isBagOpen);
  const closeBag = useStudioStore((state) => state.closeBag);
  const cart = useStudioStore((state) => state.cart);
  const updateBagQuantity = useStudioStore((state) => state.updateBagQuantity);
  const removeFromBag = useStudioStore((state) => state.removeFromBag);
  const settings = useStudioStore((state) => state.settings);
  const activePassportData = useStudioStore((state) => state.activePassportData);
  const hydratePassports = useStudioStore((state) => state.hydratePassports);
  const mintEcoPassport = useStudioStore((state) => state.mintEcoPassport);

  useEffect(() => {
    hydratePassports();
  }, [hydratePassports]);

  // Checkout modal / step state
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Simulated Shipping Form state
  const [shippingForm, setShippingForm] = useState({
    fullName: settings.realName || 'Atelier Guest',
    email: 'guest@orchine.studio',
    address: '42 Orchid Way, Suite 11B',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    country: 'United States',
  });

  const [orderReceipt, setOrderReceipt] = useState<{
    orderId: string;
    date: string;
    batchNumber: string;
    coordinates: string;
    recipientName: string;
    shippingAddress: string;
    items: typeof cart;
    subtotal: number;
    shipping: string;
    total: number;
  } | null>(null);

  if (!isBagOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOpenCheckoutForm = () => {
    setIsCheckoutFormOpen(true);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);

    setTimeout(() => {
      const orderId = `ORC-${Math.floor(100000 + Math.random() * 900000)}`;
      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const firstScarf = cart[0] ? SCARVES[cart[0].scarfId] : undefined;
      const scarfSummary =
        cart.length > 1
          ? `${firstScarf?.name || 'Botanical Silk'} +${cart.length - 1}`
          : firstScarf?.name || 'Botanical Eco-Print Silk';

      const minted = mintEcoPassport({
        orderId,
        recipientName: shippingForm.fullName,
        date: formattedDate,
        coordinates: `45°31'12"N 122°40'55"W (Forest Reserve)`,
        scarfName: scarfSummary,
        totalPaidUSD: subtotal,
      });

      setOrderReceipt({
        orderId,
        date: formattedDate,
        batchNumber: minted.batchNumber,
        coordinates: minted.coordinates,
        recipientName: shippingForm.fullName,
        shippingAddress: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.postalCode}`,
        items: [...cart],
        subtotal,
        shipping: 'Complimentary Express',
        total: subtotal,
      });

      setIsCheckingOut(false);
      setIsCheckoutFormOpen(false);
      closeBag();
      router.push('/passport');
    }, 900);
  };

  const handleDownloadCertificate = () => {
    if (!orderReceipt) return;

    const certificatePayload = {
      title: 'Orchiné Studio • Certificate of Authenticity',
      orderId: orderReceipt.orderId,
      issueDate: orderReceipt.date,
      editionBatch: orderReceipt.batchNumber,
      harvestCoordinates: orderReceipt.coordinates,
      curator: 'Master Dyer Sign-off #04',
      recipient: orderReceipt.recipientName,
      deliveryDestination: orderReceipt.shippingAddress,
      totalPaidUSD: orderReceipt.total,
      items: orderReceipt.items.map((i) => {
        const s = SCARVES[i.scarfId];
        return {
          id: i.scarfId,
          name: s ? s.name : i.scarfId,
          quantity: i.quantity,
          unitPriceUSD: i.price,
          material: s ? s.material : '100% Organic Silk Habotai',
          dimensions: s ? s.dimensions : '110cm × 110cm',
        };
      }),
      authenticityGuarantee:
        'Each scarf is contact-steamed with 100% organic leaves and living indigo reduction vats. Zero synthetic dyes, chemical mordants, or artificial additives.',
    };

    const blob = new Blob([JSON.stringify(certificatePayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Orchine-EcoPassport-${orderReceipt.orderId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopyOrderId = () => {
    if (!orderReceipt) return;
    navigator.clipboard.writeText(orderReceipt.orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleDismissReceipt = () => {
    setOrderReceipt(null);
    closeBag();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeBag}
      />

      {/* Slide-over Drawer (Nike-Inspired E-Commerce Bag Layout in #221D63) */}
      <div className="relative w-full max-w-md bg-[#221D63]/95 border-l border-[#BB9AEF]/20 h-full p-6 flex flex-col justify-between shadow-2xl z-10 select-none backdrop-blur-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#BB9AEF]" />
            <h2 className="font-serif text-lg tracking-luxury uppercase text-[#FFF2B1]">
              Bag {totalItems > 0 && <span className="text-sm font-mono text-[#BB9AEF]">({totalItems})</span>}
            </h2>
          </div>
          <button
            onClick={closeBag}
            className="p-1.5 rounded-full text-brand-sand/60 hover:text-brand-ecru hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Incentive Banner (Nike E-Commerce Pattern) */}
        {cart.length > 0 && (
          <div className="mt-3 py-2 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center space-x-2.5 text-xs text-brand-sand/80">
            <Truck className="w-4 h-4 text-botanical-marigold flex-shrink-0" />
            <span>
              Complimentary Standard Delivery & Botanical Packaging included on this order.
            </span>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-brand-sand/50">
              <ShoppingBag className="w-12 h-12 mb-3 opacity-30 text-botanical-marigold" />
              <p className="font-serif text-base text-brand-ecru">Your bag is empty.</p>
              <p className="text-xs text-brand-sand/60 mt-1 max-w-xs">
                Explore our Autumn Equinox botanical eco-print collection to add handcrafted scarves to your order.
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const scarf = SCARVES[item.scarfId];
              if (!scarf) return null;
              return (
                <div
                  key={item.scarfId}
                  className="glass-panel p-4 rounded-2xl flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3.5">
                      {/* Square Thumbnail with Palette Sheen */}
                      <div
                        className="w-16 h-16 rounded-xl border border-white/15 flex items-center justify-center relative overflow-hidden flex-shrink-0"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${scarf.palette.sheen}33, ${scarf.palette.background} 90%)`,
                        }}
                      >
                        <span className="font-serif text-lg italic" style={{ color: scarf.palette.sheen }}>
                          {scarf.name.charAt(0)}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <h4 className="font-serif text-base text-brand-ecru leading-tight">
                          {scarf.name}
                        </h4>
                        <span className="text-[11px] text-brand-sand/70 mt-0.5">
                          {scarf.material}
                        </span>
                        <span className="text-[10px] text-brand-sand/50 font-mono">
                          {scarf.dimensions} • Limited #{scarf.currentEdition}/{scarf.editionLimit}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-sm text-botanical-marigold font-medium">
                      ${scarf.price}
                    </span>
                  </div>

                  {/* Quantity Stepper & Remove Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center space-x-1 glass-pill rounded-lg text-xs px-1 py-0.5 border border-white/10">
                      <button
                        onClick={() => updateBagQuantity(item.scarfId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-brand-sand hover:text-brand-ecru rounded hover:bg-white/10 transition-colors font-mono cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-mono text-brand-ecru font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateBagQuantity(item.scarfId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-brand-sand hover:text-brand-ecru rounded hover:bg-white/10 transition-colors font-mono cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromBag(item.scarfId)}
                      className="p-1.5 text-brand-sand/50 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Checkout Summary (Nike Style) */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 pt-4 space-y-3.5">
            <div className="space-y-1.5 text-xs text-brand-sand/75">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-brand-ecru">${subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Delivery & Handling</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Taxes</span>
                <span className="font-mono text-brand-ecru">$0.00</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-base border-t border-white/10 pt-2.5">
              <span className="font-serif uppercase tracking-luxury text-brand-ecru">Total</span>
              <span className="font-mono text-xl text-botanical-marigold font-semibold">
                ${subtotal} USD
              </span>
            </div>

            {/* Nike-Style Bold Primary Checkout Button */}
            <button
              onClick={handleOpenCheckoutForm}
              className="w-full bg-botanical-marigold hover:bg-botanical-marigold/90 text-brand-noir transition-all py-3.5 px-6 rounded-full font-serif text-xs tracking-luxury uppercase font-bold flex items-center justify-center space-x-2 shadow-lg shadow-botanical-marigold/20 cursor-pointer active:scale-98"
            >
              <span>Simulated Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Inspect Full-Page 3D Signature Card */}
            <Link
              href="/passport"
              onClick={closeBag}
              className="w-full mt-2 py-3 px-4 rounded-full bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 text-xs font-mono transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Inspect 3D Signature Card ({activePassportData?.batchNumber || '#0000'})</span>
            </Link>

            {/* Simulated Express Checkout Alternative */}
            <div className="text-center">
              <span className="text-[10px] text-brand-sand/40 font-mono uppercase tracking-widest block">
                Simulation Mode • No real charges applied
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Simulated Shipping Address Form Modal */}
      {isCheckoutFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCheckoutFormOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-brand-sand/60 hover:text-brand-ecru hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-botanical-marigold block mb-1">
                Simulated Shipping & Handling
              </span>
              <h3 className="font-serif text-2xl text-brand-ecru">Order Details</h3>
              <p className="text-xs text-brand-sand/70 mt-1">
                Provide your details to receive your digital Botanical Eco-Passport Certificate of Authenticity.
              </p>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-brand-sand/70 block mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={shippingForm.fullName}
                  onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                  className="w-full bg-[#18112C] border border-white/15 focus:border-botanical-marigold focus:ring-1 focus:ring-botanical-marigold/50 rounded-xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-brand-sand/70 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                  className="w-full bg-[#18112C] border border-white/15 focus:border-botanical-marigold focus:ring-1 focus:ring-botanical-marigold/50 rounded-xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-brand-sand/70 block mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  className="w-full bg-[#18112C] border border-white/15 focus:border-botanical-marigold focus:ring-1 focus:ring-botanical-marigold/50 rounded-xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-brand-sand/70 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    className="w-full bg-[#18112C] border border-white/15 focus:border-botanical-marigold focus:ring-1 focus:ring-botanical-marigold/50 rounded-xl py-2 px-3 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-brand-sand/70 block mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.postalCode}
                    onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                    className="w-full bg-[#18112C] border border-white/15 focus:border-botanical-marigold focus:ring-1 focus:ring-botanical-marigold/50 rounded-xl py-2 px-3 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full bg-botanical-marigold hover:bg-botanical-marigold/90 text-brand-noir transition-all py-3 rounded-full font-serif text-xs tracking-luxury uppercase font-bold flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <span>{isCheckingOut ? 'Generating Eco-Passport...' : 'Place Simulated Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
