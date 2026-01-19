"use client";

import React, { useState, useRef } from 'react';
import { Download, RefreshCcw, Type, Layout, Settings, Upload, Eye, EyeOff, Plus, Trash2, Image as ImageIcon, ChevronDown, ChevronUp, Megaphone, CheckCircle, Users, TrendingUp } from 'lucide-react';
import html2canvas from 'html2canvas';

// --- Types ---
type PhotocardData = {
  date: string;
  headline: string;
  subHeadline: string;
  bodyText: string;
  stats: { year: string; amount: string; unit: string; note: string }[];
  logoUrl: string;
  logoSize: number;
  sourceText: string;
  warningLabel: string;
  warningText: string;
  backgroundUrl?: string; // New: Custom background
  // Template 3 Specific Fields
  bigStat?: string;
  bigStatLabel?: string;
  ctaLabel?: string; // New: CTA Label
  ctaLink?: string;  // New: CTA Link
};

type StyleConfig = {
  headlineSize: number;
  bodySize: number;
  dateSize: number;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  textMainColor: string;

  // New: Advanced Stats Styling
  statYearSize: number;
  statAmountSize: number;
  statUnitSize: number;
  statNoteSize: number;

  statYearColor: string;
  statAmountColor: string;
  statUnitColor: string;
  statNoteColor: string;
};

type VisibilityConfig = {
  showDate: boolean;
  showHeadline: boolean;
  showBody: boolean;
  showStats: boolean;
  showFooter: boolean;
  showLogo: boolean;
};

const LOGO_DIR = '/logos/';

const PhotocardEditor = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTemplate, setActiveTemplate] = useState(3); // Default to 3 as requested
  const [template3BgMode, setTemplate3BgMode] = useState<'primary' | 'black'>('primary'); // 'primary' or 'black'
  const [loading, setLoading] = useState(false);

  // Security State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "NPA26") {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };





  // Expanded State for Advanced UI
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  // -- State --
  const [content, setContent] = useState<PhotocardData>({
    date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
    headline: "কৃতজ্ঞতা ও পরবর্তী পদক্ষেপ",
    subHeadline: "আমদানির পরিসংখ্যান ও বাস্তবতা",
    bodyText: "দেশ ও দেশের বাইরে থেকে আপনাদের এই স্বতঃস্ফূর্ত অংশগ্রহণের জন্য আমরা আন্তরিকভাবে কৃতজ্ঞ। আমাদের আঞ্চলিক প্রতিনিধিরা আগামী ২ দিনের মধ্যেই আপনাদের সাথে যোগাযোগ শুরু করবেন।",
    stats: [
      { year: "২০২৩", amount: "১২.৭৫", unit: "লাখ টন", note: "চাহিদা ক্রমাগত বাড়ছিল" },
      { year: "২০২৪", amount: "১৬.১০", unit: "লাখ টন", note: "আগের বছরের তুলনায় বৃদ্ধি" },
      { year: "২০২৫", amount: "১৪.৬৫", unit: "লাখ টন", note: "তুলনামূলক ১.৫ লাখ টন কম" },
    ],
    logoUrl: "/logos/npa logo.png",
    logoSize: 64,
    sourceText: "তথ্যসূত্র: এলপিজি অপারেটরস অ্যাসোসিয়েশন",
    warningLabel: "সতর্কবার্তা:",
    warningText: "সংকট আসন্ন",
    bigStat: "১৩০০+",
    bigStatLabel: "মাত্র ২ দিনে যুক্ত হয়েছেন",
    ctaLabel: "বিস্তারিত জানতে:",
    ctaLink: "www.ournpa.org"
  });

  const [styles, setStyles] = useState<StyleConfig>({
    headlineSize: 30,
    bodySize: 16,
    dateSize: 14,
    primaryColor: "#006e70", // Teal (Primary)
    accentColor: "#ffdf00",  // Gold (Secondary)
    bgColor: "#000000",      // Pure Black (Secondary)
    textMainColor: "#ffffff",

    // Default Stat Styles
    statYearSize: 18,
    statAmountSize: 30,
    statUnitSize: 14,
    statNoteSize: 12,

    statYearColor: "#ffffff",
    statAmountColor: "#ffdf00",
    statUnitColor: "#ffffff",
    statNoteColor: "#cccccc"
  });

  const [visibility, setVisibility] = useState<VisibilityConfig>({
    showDate: true,
    showHeadline: true,
    showBody: true,
    showStats: true,
    showFooter: true,
    showLogo: true
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-teal-700 p-4 rounded-full">
              <span className="text-white font-bold text-2xl">NPA</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Editor Access Restricted</h2>
          <p className="text-gray-500 mb-6">Please enter the access code to continue.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Password"
                className={`w-full px-4 py-3 rounded-lg border ${authError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-teal-500'} focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all`}
                autoFocus
              />
              {authError && <p className="text-red-500 text-sm mt-2 text-left flex items-center"><span className="mr-1">⚠️</span> Incorrect password</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-lg transition-colors duration-200 transform active:scale-95"
            >
              Unlock Editor
            </button>
          </form>
          <div className="mt-6 text-xs text-gray-400">
            Internal Use Only &bull; NPA Photocard
          </div>
        </div>
      </div>
    );
  }

  // -- Available Logos --
  const availableLogos = [
    "npa logo.png",
    "logo round .png",
    "no background.png",
    "no background white.png",
    "circle.png",
    "square.png"
  ];

  // -- Handlers --
  const handleStatChange = (index: number, field: keyof typeof content.stats[0], value: string) => {
    const newStats = [...content.stats];
    newStats[index][field] = value;
    setContent({ ...content, stats: newStats });
  };

  const addStatRow = () => {
    setContent({
      ...content,
      stats: [...content.stats, { year: "নতুন", amount: "০.০০", unit: "একক", note: "নোট লিখুন" }]
    });
  };

  const removeStatRow = (index: number) => {
    const newStats = content.stats.filter((_, i) => i !== index);
    setContent({ ...content, stats: newStats });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setContent({ ...content, logoUrl: url });
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setContent({ ...content, backgroundUrl: url });
    }
  };

  // Helper to determine Template 3 background color
  const getTemplate3BackgroundColor = () => {
    return template3BgMode === 'primary' ? styles.primaryColor : styles.bgColor;
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setLoading(true);

    try {
      // 1. Create a container ensuring a clean context
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%"; // Full viewport width
      container.style.zIndex = "-9999";
      container.style.opacity = "0"; // Invisible but rendered
      document.body.appendChild(container);

      // 2. Clone the node
      const originalNode = cardRef.current;
      const clone = originalNode.cloneNode(true) as HTMLElement;

      // 3. Reset clone styles to ensure no external shifts
      clone.style.transform = "scale(1)"; // Reset any scaling
      clone.style.margin = "0";
      clone.style.position = "relative"; // Standard flow inside our fixed container

      // 4. Add clone to container
      container.appendChild(clone);

      // 5. Wait for layout settling
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 6. Capture
      const canvas = await html2canvas(clone, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        // Remove manual x/y/scroll options - let it capture the element naturally
        onclone: (clonedDoc) => {
          const images = clonedDoc.getElementsByTagName('img');
          for (let i = 0; i < images.length; i++) {
            images[i].crossOrigin = "anonymous";
          }
        }
      });

      // 7. Cleanup
      document.body.removeChild(container);

      // 8. Download
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `NPA-Photocard-${Date.now()}.png`;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err: any) {
      console.error("Download failed:", err);
      alert(`Download failed: ${err?.message || err}`);
      // Emergency cleanup
      const containers = document.querySelectorAll('body > [style*="z-index: -9999"]');
      containers.forEach(c => c.remove());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-serif text-gray-800 p-4 md:p-8">
      {/* Font Loader */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700;800&display=swap');
        .font-bengali { font-family: 'Noto Serif Bengali', serif; }
      `}} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- LEFT PANEL: Controls --- */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 rounded-2xl shadow-xl h-fit max-h-[90vh] overflow-y-auto">

          <div className="flex items-center space-x-2 border-b pb-4 mb-4 border-gray-200">
            <Settings className="text-[#006e70]" />
            <h2 className="text-2xl font-bold font-bengali text-[#006e70]">এডিটর প্যানেল</h2>
          </div>

          {/* 1. Template Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">ডিজাইন বাছাই করুন</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTemplate(1)}
                className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${activeTemplate === 1 ? 'border-[#006e70] bg-[#006e70]/10 text-[#006e70]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Layout size={18} />
                <span className="font-bengali font-bold text-xs">পরিসংখ্যান</span>
              </button>
              <button
                onClick={() => setActiveTemplate(2)}
                className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${activeTemplate === 2 ? 'border-[#006e70] bg-[#006e70]/10 text-[#006e70]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Type size={18} />
                <span className="font-bengali font-bold text-xs">বিবরণী</span>
              </button>
              <button
                onClick={() => setActiveTemplate(3)}
                className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${activeTemplate === 3 ? 'border-[#006e70] bg-[#006e70]/10 text-[#006e70]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <TrendingUp size={18} />
                <span className="font-bengali font-bold text-xs">ইনফো কার্ড</span>
              </button>
            </div>
          </div>

          {/* Template 3 Specific Settings */}
          {activeTemplate === 3 && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">ইনফো কার্ড সেটিংস</label>

              {/* Background Toggle */}
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setTemplate3BgMode('primary')}
                  className={`flex-1 py-2 text-xs font-bold rounded border transition-all flex items-center justify-center gap-1 ${template3BgMode === 'primary' ? 'bg-[#006e70] text-white border-[#006e70]' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                  {template3BgMode === 'primary' && <CheckCircle size={12} />}
                  Primary Color
                </button>
                <button
                  onClick={() => setTemplate3BgMode('black')}
                  className={`flex-1 py-2 text-xs font-bold rounded border transition-all flex items-center justify-center gap-1 ${template3BgMode === 'black' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                  {template3BgMode === 'black' && <CheckCircle size={12} />}
                  Black
                </button>
              </div>

              {/* Big Stat Input */}
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                  <label className="text-xs text-gray-400 block mb-1">বড় সংখ্যা (Big Stat)</label>
                  <input
                    type="text"
                    value={content.bigStat}
                    onChange={(e) => setContent({ ...content, bigStat: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#006e70] font-bengali text-sm font-bold"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs text-gray-400 block mb-1">লেবেল (Label)</label>
                  <input
                    type="text"
                    value={content.bigStatLabel}
                    onChange={(e) => setContent({ ...content, bigStatLabel: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#006e70] font-bengali text-sm"
                  />
                </div>
              </div>

              {/* CTA / Footer Link Input */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <div className="col-span-1">
                  <label className="text-xs text-gray-400 block mb-1">ফুটার লেবেল</label>
                  <input
                    type="text"
                    value={content.ctaLabel}
                    onChange={(e) => setContent({ ...content, ctaLabel: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#006e70] font-bengali text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs text-gray-400 block mb-1">লিংক (Link)</label>
                  <input
                    type="text"
                    value={content.ctaLink}
                    onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#006e70] font-bengali text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Style & Background */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider block">ব্যাকগ্রাউন্ড ও কালার</label>

            {/* Background Upload */}
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 text-sm">
                <ImageIcon size={16} />
                <span className="truncate">{content.backgroundUrl ? "ব্যাকগ্রাউন্ড পরিবর্তন" : "ব্যাকগ্রাউন্ড আপলোড"}</span>
                <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
              </label>
              {content.backgroundUrl && (
                <button onClick={() => setContent({ ...content, backgroundUrl: undefined })} className="text-red-500 hover:bg-red-50 p-2 rounded">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Background</label>
                <input type="color" value={styles.bgColor} onChange={(e) => setStyles({ ...styles, bgColor: e.target.value })} className="h-8 w-16 cursor-pointer rounded border" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Text Main</label>
                <input type="color" value={styles.textMainColor} onChange={(e) => setStyles({ ...styles, textMainColor: e.target.value })} className="h-8 w-16 cursor-pointer rounded border" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Primary</label>
                <input type="color" value={styles.primaryColor} onChange={(e) => setStyles({ ...styles, primaryColor: e.target.value })} className="h-8 w-16 cursor-pointer rounded border" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Accent</label>
                <input type="color" value={styles.accentColor} onChange={(e) => setStyles({ ...styles, accentColor: e.target.value })} className="h-8 w-16 cursor-pointer rounded border" />
              </div>
            </div>
          </div>


          {/* 3. Stats Editor with Advanced Controls - Custom Condition */}
          {(activeTemplate === 1 || activeTemplate === 2) && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">পরিসংখ্যান</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAdvancedStats(!showAdvancedStats)}
                    className="text-xs flex items-center gap-1 text-[#006e70] hover:underline"
                  >
                    {showAdvancedStats ? "সিম্পল ভিউ" : "অ্যাডভান্সড স্টাইল"}
                    {showAdvancedStats ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <button onClick={() => setVisibility({ ...visibility, showStats: !visibility.showStats })}>
                    {visibility.showStats ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Advanced Stats Styling Controls */}
              {showAdvancedStats && (
                <div className="bg-gray-50 p-3 rounded grid grid-cols-2 gap-3 text-xs border border-gray-200">
                  <div>
                    <label className="block text-gray-500 mb-1">Year Size</label>
                    <input type="number" value={styles.statYearSize} onChange={(e) => setStyles({ ...styles, statYearSize: parseInt(e.target.value) })} className="border rounded p-1 w-full" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Year Color</label>
                    <input type="color" value={styles.statYearColor} onChange={(e) => setStyles({ ...styles, statYearColor: e.target.value })} className="h-6 w-full cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Amount Size</label>
                    <input type="number" value={styles.statAmountSize} onChange={(e) => setStyles({ ...styles, statAmountSize: parseInt(e.target.value) })} className="border rounded p-1 w-full" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Amount Color</label>
                    <input type="color" value={styles.statAmountColor} onChange={(e) => setStyles({ ...styles, statAmountColor: e.target.value })} className="h-6 w-full cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Unit Size</label>
                    <input type="number" value={styles.statUnitSize} onChange={(e) => setStyles({ ...styles, statUnitSize: parseInt(e.target.value) })} className="border rounded p-1 w-full" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Note Size</label>
                    <input type="number" value={styles.statNoteSize} onChange={(e) => setStyles({ ...styles, statNoteSize: parseInt(e.target.value) })} className="border rounded p-1 w-full" />
                  </div>
                </div>
              )}

              {/* Dynamic Stats Rows */}
              <div className="space-y-2">
                {content.stats.map((stat, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="grid grid-cols-12 gap-2 bg-gray-50 p-2 rounded flex-1">
                      <input
                        className="col-span-3 p-1 text-sm border rounded font-bengali"
                        value={stat.year}
                        onChange={(e) => handleStatChange(idx, 'year', e.target.value)}
                        placeholder="সাল"
                      />
                      <input
                        className="col-span-3 p-1 text-sm border rounded font-bengali"
                        value={stat.amount}
                        onChange={(e) => handleStatChange(idx, 'amount', e.target.value)}
                        placeholder="সংখ্যা"
                      />
                      <input
                        className="col-span-6 p-1 text-sm border rounded font-bengali"
                        value={stat.note}
                        onChange={(e) => handleStatChange(idx, 'note', e.target.value)}
                        placeholder="নোট"
                      />
                    </div>
                    <button onClick={() => removeStatRow(idx)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addStatRow}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-[#006e70] hover:text-[#006e70] flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                >
                  <Plus size={16} /> নতুন লাইন যোগ করুন
                </button>
              </div>
            </div>
          )}

          {/* 4. Text Content */}
          <div className="space-y-4 border-t pt-4">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider block">হেডলাইন ও টেক্সট</label>

            {/* Headline */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-gray-400">হেডলাইন</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={styles.headlineSize}
                    onChange={(e) => setStyles({ ...styles, headlineSize: parseInt(e.target.value) })}
                    className="w-12 text-xs border rounded px-1"
                  />
                  <button onClick={() => setVisibility({ ...visibility, showHeadline: !visibility.showHeadline })}>
                    {visibility.showHeadline ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={content.headline}
                onChange={(e) => setContent({ ...content, headline: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#006e70] outline-none font-bengali"
              />
            </div>

            {/* Body */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-gray-400">বিবরণ</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={styles.bodySize}
                    onChange={(e) => setStyles({ ...styles, bodySize: parseInt(e.target.value) })}
                    className="w-12 text-xs border rounded px-1"
                  />
                  <button onClick={() => setVisibility({ ...visibility, showBody: !visibility.showBody })}>
                    {visibility.showBody ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>
              <textarea
                value={content.bodyText}
                onChange={(e) => setContent({ ...content, bodyText: e.target.value })}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#006e70] outline-none font-bengali text-sm"
              />
            </div>
          </div>

          {/* Logo Selection */}
          <div className="space-y-3 border-t pt-4">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider block">লোগো নির্ধারণ</label>

            <div className="grid grid-cols-4 gap-2">
              {availableLogos.map((logo) => (
                <button
                  key={logo}
                  onClick={() => setContent({ ...content, logoUrl: LOGO_DIR + logo })}
                  className={`border rounded p-1 hover:border-[#006e70] ${content.logoUrl === LOGO_DIR + logo ? 'ring-2 ring-[#006e70]' : ''}`}
                >
                  <img src={LOGO_DIR + logo} alt={logo} className="w-full h-8 object-contain" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 text-sm flex-1">
                <Upload size={16} />
                <span className="truncate">কাস্টম আপলোড</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              <div className="w-1/2">
                <input
                  type="range" min="30" max="200"
                  value={content.logoSize}
                  onChange={(e) => setContent({ ...content, logoSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#006e70]"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full py-4 bg-[#006e70] hover:bg-[#00585a] text-white rounded-lg shadow-lg flex items-center justify-center gap-2 font-bold transition-all transform active:scale-95"
          >
            {loading ? <RefreshCcw className="animate-spin" /> : <Download />}
            {loading ? "ডাউনলোড হচ্ছে..." : "ইমেজ ডাউনলোড করুন"}
          </button>

        </div>

        {/* --- RIGHT PANEL: Preview --- */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start bg-gray-200 p-4 rounded-3xl min-h-[600px]">
          <div className="mb-4 text-gray-500 font-mono text-xs">Preview (1:1 Ratio)</div>

          <div
            id="capture-target"
            ref={cardRef}
            className="relative w-full max-w-[600px] aspect-square shadow-2xl overflow-hidden font-bengali"
            style={{
              backgroundColor: activeTemplate === 1 ? styles.primaryColor : activeTemplate === 3 ? getTemplate3BackgroundColor() : styles.bgColor,
              color: activeTemplate === 3 ? styles.accentColor : styles.textMainColor,
            }}
          >
            {/* Custom Background Image Overlay */}
            {content.backgroundUrl ? (
              <img
                src={content.backgroundUrl}
                alt="Background"
                crossOrigin="anonymous"
                className="absolute inset-0 z-0 w-full h-full object-cover opacity-100 pointer-events-none"
              />
            ) : (
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>
            )}

            {/* Wrapper to ensure content sits on top of background */}
            <div className="relative z-10 w-full h-full">

              {/* --- TEMPLATE 1: STATS FOCUS --- */}
              {activeTemplate === 1 && (
                <div className="h-full w-full p-8 flex flex-col relative">
                  {/* Borders */}
                  <div className="absolute inset-4 border border-opacity-30 pointer-events-none" style={{ borderColor: styles.accentColor }}></div>
                  <div className="absolute inset-5 border border-opacity-20 pointer-events-none" style={{ borderColor: styles.accentColor }}></div>

                  {/* Header */}
                  <div className="flex justify-between items-start mb-6 z-10">
                    <div className="flex-1">
                      {visibility.showHeadline && (
                        <h1 className="font-extrabold leading-tight mb-1" style={{ fontSize: `${styles.headlineSize}px`, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                          {content.headline}
                        </h1>
                      )}
                      <div className="h-1 w-24 mt-2" style={{ backgroundColor: styles.accentColor }}></div>
                    </div>
                    {visibility.showLogo && (
                      <img
                        src={content.logoUrl}
                        alt="Logo"
                        className="object-contain p-1 rounded-full shadow-lg"
                        style={{ width: `${content.logoSize}px`, height: 'auto', backgroundColor: 'rgba(255,255,255,0.9)' }}
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 z-10 flex flex-col justify-center space-y-4">
                    {visibility.showStats && (
                      <div className="grid gap-3">
                        {content.stats.map((stat, i) => (
                          <div key={i} className="flex items-center backdrop-blur-sm rounded-lg p-2 border-l-4 transition-all" style={{ borderColor: styles.accentColor, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            <div className="w-20 text-center pr-3" style={{ borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                              <span className="block font-bold opacity-80" style={{ fontSize: `${styles.statYearSize}px`, color: styles.statYearColor }}>
                                {stat.year}
                              </span>
                            </div>
                            <div className="flex-1 px-4">
                              <div className="font-bold tracking-tighter" style={{ fontSize: `${styles.statAmountSize}px`, color: styles.statAmountColor }}>
                                {stat.amount}
                                <span className="font-normal opacity-90 ml-1" style={{ fontSize: `${styles.statUnitSize}px`, color: styles.statUnitColor }}>
                                  {stat.unit}
                                </span>
                              </div>
                              <div className="opacity-90 italic mt-0" style={{ fontSize: `${styles.statNoteSize}px`, color: styles.statNoteColor }}>
                                {stat.note}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {visibility.showBody && (
                      <div className="mt-4 p-4 rounded-lg backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <p className="leading-relaxed text-justify opacity-90" style={{ fontSize: `${styles.bodySize}px` }}>
                          {content.bodyText.substring(0, 250)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {visibility.showFooter && (
                    <div className="mt-auto pt-4 flex justify-between items-end z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <span className="text-xs opacity-60 uppercase tracking-widest">{content.sourceText}</span>
                      {visibility.showDate && <span className="text-xs font-bold">{content.date}</span>}
                    </div>
                  )}
                </div>
              )}

              {/* --- TEMPLATE 2: EDITORIAL FOCUS --- */}
              {activeTemplate === 2 && (
                <div className="h-full w-full p-10 flex flex-col relative" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                  <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: styles.primaryColor }}></div>

                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="h-8 w-1" style={{ backgroundColor: styles.accentColor }}></div>
                      <div className="ml-4 flex flex-col justify-center">
                        {visibility.showDate && (
                          <span className="block leading-none uppercase tracking-wider" style={{ fontSize: `${styles.dateSize}px`, fontWeight: 'bold', color: styles.primaryColor }}>
                            {content.date}
                          </span>
                        )}
                      </div>
                    </div>
                    {visibility.showLogo && (
                      <img
                        src={content.logoUrl}
                        alt="Logo"
                        className="object-contain"
                        style={{ width: `${content.logoSize}px`, height: 'auto' }}
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col justify-center relative z-10 pl-6">
                    <div className="absolute top-0 left-0 font-serif opacity-10 pointer-events-none leading-none" style={{ fontSize: '8rem', color: styles.primaryColor, marginTop: '-20px', marginLeft: '-15px' }}>“</div>

                    {visibility.showHeadline && (
                      <h1 className="leading-snug mb-6 z-10 relative" style={{ color: 'black', fontSize: `${styles.headlineSize}px`, fontWeight: 'bold' }}>
                        {content.headline}
                      </h1>
                    )}

                    {visibility.showBody && (
                      <p className="leading-7 text-justify border-l-2 pl-4 z-10" style={{ color: '#1f2937', borderColor: styles.accentColor, fontSize: `${styles.bodySize}px`, fontWeight: 'medium' }}>
                        {content.bodyText}
                      </p>
                    )}

                    {visibility.showStats && (
                      <div className="mt-8 flex gap-4">
                        <div className="flex-1 p-3 rounded" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                          <span className="block" style={{ fontSize: '0.75rem', color: '#6b7280' }}>২০২৪ আমদানি</span>
                          <span className="block" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: styles.primaryColor }}>১৬.১০ <small style={{ fontSize: '0.75rem', color: 'black' }}>লাখ টন</small></span>
                        </div>
                        <div className="flex-1 p-3 rounded" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                          <span className="block" style={{ fontSize: '0.75rem', color: '#6b7280' }}>২০২৫ আমদানি</span>
                          <span className="block" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626' }}>১৪.৬৫ <small style={{ fontSize: '0.75rem', color: 'black' }}>লাখ টন</small></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {visibility.showFooter && (
                    <div className="mt-8 pt-4 flex justify-between items-center" style={{ borderTop: '1px solid #f3f4f6' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {content.warningLabel} <span style={{ fontWeight: 'bold', color: 'black' }}>{content.warningText}</span>
                      </div>
                      <div className="text-right">
                        <span className="block" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: styles.primaryColor }}>www.ournpa.org</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --- TEMPLATE 3: INFORMATIVE STYLE (Redesigned) --- */}
              {activeTemplate === 3 && (
                <div className="h-full w-full p-8 flex flex-col relative justify-between"
                  style={{
                    backgroundColor: getTemplate3BackgroundColor(),
                    color: 'white'
                  }}>

                  {/* Header Row: Date & Logo */}
                  <div className="flex justify-between items-center mb-6 z-10 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full" style={{ backgroundColor: styles.accentColor }}>
                        <Megaphone size={16} className="text-black" />
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase opacity-80">{content.date}</span>
                    </div>
                    {visibility.showLogo && (
                      <img
                        src={content.logoUrl}
                        alt="Logo"
                        className="object-contain p-1 rounded"
                        style={{ width: `${content.logoSize * 0.8}px`, height: 'auto', backgroundColor: 'rgba(255,255,255,0.1)' }}
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>

                  {/* Main Headline */}
                  <div className="z-10 mb-4">
                    {visibility.showHeadline && (
                      <h1 className="font-bold leading-tight" style={{ fontSize: `${styles.headlineSize}px` }}>
                        {content.headline}
                      </h1>
                    )}
                  </div>

                  {/* HERO STAT CARD */}
                  <div className="flex-1 z-10 flex flex-col justify-center my-2">
                    <div className="rounded-xl p-6 relative overflow-hidden group"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                      {/* Background subtle effect */}
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Users size={120} />
                      </div>

                      <div className="relative z-10">
                        <span className="block text-sm font-medium opacity-80 mt-2">{content.bigStatLabel}</span>
                        <div className="text-6xl font-extrabold tracking-tight leading-none" style={{ color: styles.accentColor }}>
                          {content.bigStat}
                        </div>
                        <div className="h-1.5 w-24 mt-6 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                          <div className="h-full rounded-full w-3/4" style={{ backgroundColor: styles.accentColor }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Body Text */}
                    {visibility.showBody && (
                      <div className="mt-6 pl-2 border-l-2" style={{ borderColor: styles.accentColor }}>
                        <p className="leading-relaxed whitespace-pre-line" style={{ fontSize: `${styles.bodySize}px`, color: 'rgba(255,255,255,0.9)' }}>
                          {content.bodyText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer: CTA */}
                  {visibility.showFooter && (
                    <div className="mt-4 pt-4 flex justify-between items-center z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <div>
                        <span className="text-xs opacity-60 block">{content.ctaLabel}</span>
                        <span className="text-sm font-bold tracking-wide" style={{ color: styles.accentColor }}>{content.ctaLink}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotocardEditor;
