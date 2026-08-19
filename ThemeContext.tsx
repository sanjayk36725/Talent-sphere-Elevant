import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 'indigo' | 'emerald' | 'amber' | 'violet' | 'rose' | 'cyan' | 'dark' | 'rainbow';
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontColorOption =
  | 'default'
  | 'black'
  | 'white'
  | 'red'
  | 'crimson'
  | 'blue'
  | 'navy'
  | 'skyblue'
  | 'emerald'
  | 'green'
  | 'lime'
  | 'amber'
  | 'yellow'
  | 'orange'
  | 'violet'
  | 'purple'
  | 'pink'
  | 'rose'
  | 'cyan'
  | 'teal'
  | 'slate'
  | 'charcoal'
  | 'custom';

export type LetterHighlightOption = 'none' | 'yellow' | 'cyan' | 'pink' | 'green' | 'amber' | 'purple' | 'red' | 'blue';
export type FontFamilyOption = 'sans' | 'serif' | 'mono' | 'dyslexic' | 'geometric';

interface ThemeContextType {
  colorTheme: ColorTheme;
  mode: ThemeMode;
  fontColor: FontColorOption;
  customFontColorHex: string;
  letterHighlight: LetterHighlightOption;
  fontFamily: FontFamilyOption;
  fontSizeScale: 'standard' | 'large' | 'compact';
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: ThemeMode) => void;
  setFontColor: (color: FontColorOption) => void;
  setCustomFontColorHex: (hex: string) => void;
  setLetterHighlight: (highlight: LetterHighlightOption) => void;
  setFontFamily: (family: FontFamilyOption) => void;
  setFontSizeScale: (scale: 'standard' | 'large' | 'compact') => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  activeModalTab: 'theme' | 'font';
  setActiveModalTab: (tab: 'theme' | 'font') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem('ts_color_theme') as ColorTheme) || 'indigo';
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('ts_theme_mode') as ThemeMode) || 'light';
  });

  const [fontColor, setFontColorState] = useState<FontColorOption>(() => {
    return (localStorage.getItem('ts_font_color') as FontColorOption) || 'default';
  });

  const [customFontColorHex, setCustomFontColorHexState] = useState<string>(() => {
    return localStorage.getItem('ts_custom_font_color_hex') || '#2563eb';
  });

  const [letterHighlight, setLetterHighlightState] = useState<LetterHighlightOption>(() => {
    return (localStorage.getItem('ts_letter_highlight') as LetterHighlightOption) || 'none';
  });

  const [fontFamily, setFontFamilyState] = useState<FontFamilyOption>(() => {
    return (localStorage.getItem('ts_font_family') as FontFamilyOption) || 'sans';
  });

  const [fontSizeScale, setFontSizeScaleState] = useState<'standard' | 'large' | 'compact'>(() => {
    return (localStorage.getItem('ts_font_size_scale') as any) || 'standard';
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeModalTab, setActiveModalTab] = useState<'theme' | 'font'>('theme');

  const setCustomFontColorHex = (hex: string) => {
    setCustomFontColorHexState(hex);
    localStorage.setItem('ts_custom_font_color_hex', hex);
    if (fontColor === 'custom') {
      document.documentElement.style.setProperty('--user-text-color', hex);
    }
  };

  useEffect(() => {
    localStorage.setItem('ts_color_theme', colorTheme);
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem('ts_theme_mode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('ts_font_color', fontColor);
    document.documentElement.setAttribute('data-font-color', fontColor);
    
    // Apply font color variable
    const fontColorMap: Record<FontColorOption, string> = {
      default: '',
      black: '#000000',
      white: '#ffffff',
      red: '#dc2626',
      crimson: '#991b1b',
      blue: '#2563eb',
      navy: '#1e3a8a',
      skyblue: '#0284c7',
      emerald: '#059669',
      green: '#16a34a',
      lime: '#65a30d',
      amber: '#d97706',
      yellow: '#ca8a04',
      orange: '#ea580c',
      violet: '#7c3aed',
      purple: '#9333ea',
      pink: '#db2777',
      rose: '#e11d48',
      cyan: '#0891b2',
      teal: '#0d9488',
      charcoal: '#0f172a',
      slate: '#475569',
      custom: customFontColorHex,
    };

    const resolvedColor = fontColor === 'custom' ? customFontColorHex : fontColorMap[fontColor];
    if (resolvedColor) {
      document.documentElement.style.setProperty('--user-text-color', resolvedColor);
    } else {
      document.documentElement.style.removeProperty('--user-text-color');
    }
  }, [fontColor, customFontColorHex]);

  useEffect(() => {
    localStorage.setItem('ts_letter_highlight', letterHighlight);
    document.documentElement.setAttribute('data-letter-highlight', letterHighlight);
    
    const highlightMap: Record<LetterHighlightOption, string> = {
      none: 'transparent',
      yellow: '#fef08a',
      cyan: '#a5f3fc',
      pink: '#fbcfe8',
      green: '#bbf7d0',
      amber: '#fed7aa',
      purple: '#e9d5ff',
      red: '#fecaca',
      blue: '#bfdbfe',
    };
    document.documentElement.style.setProperty('--user-letter-highlight', highlightMap[letterHighlight]);
  }, [letterHighlight]);

  useEffect(() => {
    localStorage.setItem('ts_font_family', fontFamily);
    document.documentElement.setAttribute('data-font-family', fontFamily);
    
    const familyMap: Record<FontFamilyOption, string> = {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      dyslexic: '"Comic Sans MS", "Chalkboard SE", "Trebuchet MS", sans-serif',
      geometric: '"Century Gothic", "Apple Gothic", sans-serif',
    };
    document.documentElement.style.setProperty('--user-font-family', familyMap[fontFamily]);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('ts_font_size_scale', fontSizeScale);
    if (fontSizeScale === 'large') {
      document.documentElement.style.setProperty('--user-font-scale', '1.08');
    } else if (fontSizeScale === 'compact') {
      document.documentElement.style.setProperty('--user-font-scale', '0.94');
    } else {
      document.documentElement.style.setProperty('--user-font-scale', '1.0');
    }
  }, [fontSizeScale]);

  return (
    <ThemeContext.Provider
      value={{
        colorTheme,
        mode,
        fontColor,
        customFontColorHex,
        letterHighlight,
        fontFamily,
        fontSizeScale,
        setColorTheme: setColorThemeState,
        setMode: setModeState,
        setFontColor: setFontColorState,
        setCustomFontColorHex,
        setLetterHighlight: setLetterHighlightState,
        setFontFamily: setFontFamilyState,
        setFontSizeScale: setFontSizeScaleState,
        isModalOpen,
        setIsModalOpen,
        activeModalTab,
        setActiveModalTab,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
