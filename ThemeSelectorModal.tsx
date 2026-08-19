import React, { useState } from 'react';
import { X, Palette, Sun, Moon, Laptop, Check, Type, Highlighter, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { useTheme, ColorTheme, FontColorOption, LetterHighlightOption, FontFamilyOption } from '../context/ThemeContext';

export const ThemeSelectorModal: React.FC = () => {
  const {
    colorTheme,
    mode,
    fontColor,
    customFontColorHex,
    letterHighlight,
    fontFamily,
    fontSizeScale,
    setColorTheme,
    setMode,
    setFontColor,
    setCustomFontColorHex,
    setLetterHighlight,
    setFontFamily,
    setFontSizeScale,
    isModalOpen,
    setIsModalOpen,
    activeModalTab,
    setActiveModalTab,
  } = useTheme();

  const [previewText, setPreviewText] = useState<string>('TalentSphere Elevate: Master skills with black, white, red, blue, green, and vibrant text colors.');
  const [selectedColorGroup, setSelectedColorGroup] = useState<string>('all');
  const [tempHexInput, setTempHexInput] = useState<string>(customFontColorHex || '#2563eb');

  if (!isModalOpen) return null;

  const palettes: {
    id: ColorTheme;
    name: string;
    bgClass: string;
    borderClass: string;
    badge: string;
    previewGradient: string;
  }[] = [
    {
      id: 'indigo',
      name: 'Classic Indigo',
      bgClass: 'bg-indigo-600',
      borderClass: 'border-indigo-600',
      badge: 'Indigo Blue',
      previewGradient: 'from-indigo-500 to-blue-600',
    },
    {
      id: 'emerald',
      name: 'Emerald Green',
      bgClass: 'bg-emerald-600',
      borderClass: 'border-emerald-600',
      badge: 'Emerald Mint',
      previewGradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'amber',
      name: 'Amber Gold',
      bgClass: 'bg-amber-500',
      borderClass: 'border-amber-500',
      badge: 'Warm Yellow',
      previewGradient: 'from-amber-400 to-orange-500',
    },
    {
      id: 'violet',
      name: 'Royal Violet',
      bgClass: 'bg-violet-600',
      borderClass: 'border-violet-600',
      badge: 'Royal Purple',
      previewGradient: 'from-violet-500 to-purple-600',
    },
    {
      id: 'rose',
      name: 'Crimson Rose',
      bgClass: 'bg-rose-600',
      borderClass: 'border-rose-600',
      badge: 'Crimson Pink',
      previewGradient: 'from-rose-500 to-pink-600',
    },
    {
      id: 'cyan',
      name: 'Ocean Cyan',
      bgClass: 'bg-cyan-600',
      borderClass: 'border-cyan-600',
      badge: 'Sky Cyan',
      previewGradient: 'from-cyan-400 to-teal-500',
    },
    {
      id: 'dark',
      name: 'Midnight Slate',
      bgClass: 'bg-slate-900',
      borderClass: 'border-slate-800',
      badge: 'Dark Charcoal',
      previewGradient: 'from-slate-700 to-slate-900',
    },
    {
      id: 'rainbow',
      name: 'Multi-Color Rainbow',
      bgClass: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
      borderClass: 'border-pink-500',
      badge: 'Dynamic Multi-Gradient',
      previewGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    },
  ];

  const fontColorCategories: {
    category: string;
    colors: { id: FontColorOption; name: string; hex: string; desc: string; isLight?: boolean }[];
  }[] = [
    {
      category: 'Core High-Contrast',
      colors: [
        { id: 'black', name: 'Pure Black', hex: '#000000', desc: 'Maximum contrast ultra-dense black' },
        { id: 'white', name: 'Pure White', hex: '#ffffff', desc: 'High visibility crisp white', isLight: true },
        { id: 'charcoal', name: 'Executive Charcoal', hex: '#0f172a', desc: 'Refined deep midnight black' },
        { id: 'slate', name: 'Muted Slate Gray', hex: '#475569', desc: 'Soft readable dark neutral' },
        { id: 'default', name: 'Default System', hex: '#0f172a', desc: 'Standard adaptive theme color' },
      ],
    },
    {
      category: 'Reds & Warm Earth',
      colors: [
        { id: 'red', name: 'Vibrant Red', hex: '#dc2626', desc: 'Bright attention-grabbing scarlet' },
        { id: 'crimson', name: 'Ruby Crimson', hex: '#991b1b', desc: 'Rich academic ruby wine' },
        { id: 'rose', name: 'Crimson Rose', hex: '#e11d48', desc: 'Vivid rose red tone' },
        { id: 'orange', name: 'Vivid Orange', hex: '#ea580c', desc: 'Energetic tangerine orange' },
        { id: 'amber', name: 'Deep Amber Gold', hex: '#d97706', desc: 'Warm golden honey tone' },
        { id: 'yellow', name: 'Golden Yellow', hex: '#ca8a04', desc: 'Radiant high-visibility yellow' },
      ],
    },
    {
      category: 'Blues & Ocean Cyans',
      colors: [
        { id: 'blue', name: 'Royal Blue', hex: '#2563eb', desc: 'Crisp electric cobalt blue' },
        { id: 'navy', name: 'Deep Navy Blue', hex: '#1e3a8a', desc: 'Formal executive naval blue' },
        { id: 'skyblue', name: 'Sky Cyan Blue', hex: '#0284c7', desc: 'Bright azure sky tone' },
        { id: 'cyan', name: 'Oceanic Cyan', hex: '#0891b2', desc: 'Deep tropical marine cyan' },
        { id: 'teal', name: 'Deep Teal', hex: '#0d9488', desc: 'Rich turquoise emerald-teal' },
      ],
    },
    {
      category: 'Greens & Purples',
      colors: [
        { id: 'emerald', name: 'Forest Emerald', hex: '#059669', desc: 'Vibrant botanical emerald' },
        { id: 'green', name: 'Leaf Green', hex: '#16a34a', desc: 'Lush natural green tone' },
        { id: 'lime', name: 'Lime Green', hex: '#65a30d', desc: 'Fresh high-energy chartreuse' },
        { id: 'violet', name: 'Royal Violet', hex: '#7c3aed', desc: 'Majestic deep indigo-violet' },
        { id: 'purple', name: 'Imperial Purple', hex: '#9333ea', desc: 'Vivid amethyst royal purple' },
        { id: 'pink', name: 'Bright Fuchsia Pink', hex: '#db2777', desc: 'High-contrast vibrant magenta' },
      ],
    },
  ];

  const highlightList: { id: LetterHighlightOption; name: string; hex: string }[] = [
    { id: 'none', name: 'Default Selection', hex: '#cbd5e1' },
    { id: 'yellow', name: 'Neon Yellow', hex: '#fef08a' },
    { id: 'cyan', name: 'Sky Cyan', hex: '#a5f3fc' },
    { id: 'pink', name: 'Soft Pink', hex: '#fbcfe8' },
    { id: 'green', name: 'Mint Green', hex: '#bbf7d0' },
    { id: 'amber', name: 'Warm Amber', hex: '#fed7aa' },
    { id: 'purple', name: 'Lavender Purple', hex: '#e9d5ff' },
    { id: 'red', name: 'Light Red', hex: '#fecaca' },
    { id: 'blue', name: 'Light Blue', hex: '#bfdbfe' },
  ];

  const fontFamilyList: { id: FontFamilyOption; name: string; sample: string; desc: string }[] = [
    { id: 'sans', name: 'Inter (Modern Sans)', sample: 'Clean & Contemporary', desc: 'Engineered for high digital clarity' },
    { id: 'serif', name: 'Editorial Serif (Playfair / Georgia)', sample: 'Classic & Elegant', desc: 'Distinguished academic styling' },
    { id: 'mono', name: 'Tech Monospace (JetBrains / Menlo)', sample: 'Technical Code & Data', desc: 'Fixed-width developer aesthetic' },
    { id: 'dyslexic', name: 'High-Legibility Dyslexic', sample: 'Maximum Readability', desc: 'Distinct character shapes' },
    { id: 'geometric', name: 'Century Geometric', sample: 'Crisp Geometric Curves', desc: 'Modern minimalist structure' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-sm">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">Appearance & Font Styling Studio</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Customize button themes, font colors, letter highlighting, and typography.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Themes vs Font & Letters */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveModalTab('theme')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeModalTab === 'theme'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            Theme Colors & Dark Mode
          </button>
          <button
            onClick={() => setActiveModalTab('font')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeModalTab === 'font'
                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            Font, Letter & Word Color
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {activeModalTab === 'theme' ? (
            <>
              {/* Appearance Mode Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
                  Appearance Mode (Light / Dark / System)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMode('light')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      mode === 'light'
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm ring-2 ring-indigo-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" /> Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('dark')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      mode === 'dark'
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm ring-2 ring-indigo-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" /> Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('system')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      mode === 'system'
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm ring-2 ring-indigo-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Laptop className="w-4 h-4 text-slate-500" /> Auto System
                  </button>
                </div>
              </div>

              {/* Theme Palettes */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
                  Primary Accent Color & Button Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {palettes.map((p) => {
                    const isSelected = colorTheme === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setColorTheme(p.id)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${p.bgClass} shadow-xs flex items-center justify-center`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100 text-center leading-tight">
                          {p.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* FONT & LETTER COLOR CUSTOMIZER */}
              <div className="space-y-6">
                {/* 1. Letter & Font Color Picker */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="text-xs font-black uppercase tracking-wider font-mono text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Font & Word Text Color
                    </label>
                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                      Active: {fontColor === 'custom' ? `Custom (${customFontColorHex})` : fontColor}
                    </span>
                  </div>

                  {/* Color Group Filter Tabs */}
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {[
                      { id: 'all', label: 'All Colors' },
                      { id: 'contrast', label: 'Black & White' },
                      { id: 'reds', label: 'Red & Warm' },
                      { id: 'blues', label: 'Blue & Cyan' },
                      { id: 'greens', label: 'Green & Purple' },
                      { id: 'custom', label: '🎨 Custom Picker' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedColorGroup(g.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          selectedColorGroup === g.id
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Hex Color Box if 'custom' group or fontColor === 'custom' */}
                  {selectedColorGroup === 'custom' && (
                    <div className="p-3.5 bg-purple-50/60 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-700 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-900 dark:text-purple-200">
                          Custom Hex & Color Wheel
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Pick any custom color</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Native Color Picker Circle */}
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-xs border-2 border-slate-300 dark:border-slate-600 shrink-0 cursor-pointer">
                          <input
                            type="color"
                            value={tempHexInput.startsWith('#') ? tempHexInput : '#2563eb'}
                            onChange={(e) => {
                              setTempHexInput(e.target.value);
                              setCustomFontColorHex(e.target.value);
                              setFontColor('custom');
                            }}
                            className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer border-0"
                            title="Open native color wheel"
                          />
                        </div>

                        {/* Hex text input */}
                        <div className="flex-1 flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-slate-400">#</span>
                            <input
                              type="text"
                              value={tempHexInput.replace('#', '')}
                              onChange={(e) => {
                                const val = '#' + e.target.value.replace(/[^0-9a-fA-F]/g, '');
                                setTempHexInput(val);
                              }}
                              placeholder="2563eb"
                              maxLength={7}
                              className="w-full bg-white dark:bg-slate-900 pl-7 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              let formatted = tempHexInput.startsWith('#') ? tempHexInput : '#' + tempHexInput;
                              if (formatted.length === 4) {
                                formatted = '#' + formatted[1] + formatted[1] + formatted[2] + formatted[2] + formatted[3] + formatted[3];
                              }
                              setCustomFontColorHex(formatted);
                              setFontColor('custom');
                            }}
                            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      {/* Quick custom swatches */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 font-mono">Quick:</span>
                        {[
                          { name: 'Neon Green', hex: '#22c55e' },
                          { name: 'Hot Pink', hex: '#f43f5e' },
                          { name: 'Coral', hex: '#fb923c' },
                          { name: 'Indigo Deep', hex: '#4338ca' },
                          { name: 'Pure Gold', hex: '#eab308' },
                          { name: 'Electric Violet', hex: '#8b5cf6' },
                          { name: 'Turquoise', hex: '#14b8a6' },
                        ].map((sw) => (
                          <button
                            key={sw.hex}
                            type="button"
                            onClick={() => {
                              setTempHexInput(sw.hex);
                              setCustomFontColorHex(sw.hex);
                              setFontColor('custom');
                            }}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-2xs transition-all cursor-pointer"
                            style={{ backgroundColor: sw.hex }}
                          >
                            {sw.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grid of Font Color Options */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                    {fontColorCategories
                      .filter((cat) => {
                        if (selectedColorGroup === 'contrast') return cat.category === 'Core High-Contrast';
                        if (selectedColorGroup === 'reds') return cat.category === 'Reds & Warm Earth';
                        if (selectedColorGroup === 'blues') return cat.category === 'Blues & Ocean Cyans';
                        if (selectedColorGroup === 'greens') return cat.category === 'Greens & Purples';
                        return true;
                      })
                      .flatMap((cat) => cat.colors)
                      .map((fc) => {
                        const isSelected = fontColor === fc.id;
                        return (
                          <button
                            key={fc.id}
                            type="button"
                            onClick={() => setFontColor(fc.id)}
                            className={`p-2.5 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                              isSelected
                                ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/60 shadow-sm ring-2 ring-purple-500/20'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/80'
                            }`}
                          >
                            <div
                              className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 shadow-2xs flex items-center justify-center"
                              style={{ backgroundColor: fc.hex }}
                            >
                              {isSelected && (
                                <Check className={`w-3 h-3 ${fc.isLight ? 'text-slate-900' : 'text-white'}`} />
                              )}
                            </div>
                            <div className="overflow-hidden min-w-0">
                              <span
                                className="text-xs font-black block truncate"
                                style={{ color: fc.hex === '#ffffff' && mode === 'light' ? '#334155' : fc.hex }}
                              >
                                {fc.name}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 block truncate">
                                {fc.hex}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* 2. Letter / Word Selection Highlighter */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider font-mono text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                      <Highlighter className="w-4 h-4 text-amber-500" />
                      Text Selection & Word Highlight Color
                    </label>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      Applies to mouse selection
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {highlightList.map((hl) => {
                      const isSelected = letterHighlight === hl.id;
                      return (
                        <button
                          key={hl.id}
                          type="button"
                          onClick={() => setLetterHighlight(hl.id)}
                          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: hl.hex }}
                          />
                          <span>{hl.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Typography Font Family */}
                <div className="space-y-2.5">
                  <label className="text-xs font-black uppercase tracking-wider font-mono text-slate-900 dark:text-slate-200">
                    Typography Font Family
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fontFamilyList.map((ff) => {
                      const isSelected = fontFamily === ff.id;
                      return (
                        <div
                          key={ff.id}
                          onClick={() => setFontFamily(ff.id)}
                          className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900 dark:text-slate-100">{ff.name}</span>
                              {isSelected && <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-900 px-1 py-0.2 rounded">Active</span>}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{ff.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Interactive Live Preview */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-indigo-600" /> Live Letter & Word Preview
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Highlight text to test selection</span>
                  </div>

                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  {/* Multi-color word sample preview chips */}
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Live Multi-Color Word Samples:
                    </p>
                    <div className="flex flex-wrap gap-1.5 text-xs font-black">
                      <span className="word-color-black px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Black Text</span>
                      <span className="word-color-white px-2 py-0.5 bg-slate-900 dark:bg-slate-700 rounded">White Text</span>
                      <span className="word-color-red px-2 py-0.5 bg-red-50 dark:bg-red-950 rounded">Red Text</span>
                      <span className="word-color-blue px-2 py-0.5 bg-blue-50 dark:bg-blue-950 rounded">Blue Text</span>
                      <span className="word-color-emerald px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 rounded">Green Text</span>
                      <span className="word-color-amber px-2 py-0.5 bg-amber-50 dark:bg-amber-950 rounded">Yellow/Amber</span>
                      <span className="word-color-violet px-2 py-0.5 bg-purple-50 dark:bg-purple-950 rounded">Purple Text</span>
                      <span className="word-color-orange px-2 py-0.5 bg-orange-50 dark:bg-orange-950 rounded">Orange Text</span>
                      <span className="word-color-cyan px-2 py-0.5 bg-cyan-50 dark:bg-cyan-950 rounded">Cyan Text</span>
                    </div>

                    <p className="pt-1 text-xs leading-relaxed document-body-text">
                      "{previewText}"
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => {
              setFontColor('default');
              setLetterHighlight('none');
              setFontFamily('sans');
              setColorTheme('indigo');
              setMode('light');
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            onClick={() => setIsModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Save & Apply Styling
          </button>
        </div>
      </div>
    </div>
  );
};
