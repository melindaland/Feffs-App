/**
 * FEFFS 2026 - Thème de l'application
 * Design moderne avec une palette de couleurs inspirée du cinéma fantastique
 */

import { Platform } from "react-native";

// ============================================
// CONFIGURATION DU FESTIVAL - À MODIFIER ICI
// ============================================
export const Festival = {
  // Informations générales
  name: "FEFFS",
  fullName: "Festival Européen du Film Fantastique de Strasbourg",
  year: 2026,
  edition: "18ème édition",

  // Dates du festival
  startDate: new Date("2026-09-18"),
  endDate: new Date("2026-09-26"),

  // Textes formatés
  get dateRange(): string {
    return `${this.startDate.getDate()} - ${this.endDate.getDate()} Septembre ${this.year}`;
  },
  get shortDateRange(): string {
    return `${this.startDate.getDate()}-${this.endDate.getDate()} Sept. ${this.year}`;
  },
  get yearString(): string {
    return `${this.name} ${this.year}`;
  },

  // Contact
  website: "https://www.feffs.fr",
  email: "contact@feffs.fr",
  phone: "03 88 00 00 00",

  // Réseaux sociaux
  social: {
    facebook: "https://facebook.com/feffs",
    twitter: "https://twitter.com/feffs",
    instagram: "https://instagram.com/feffs",
  },
};

// Palette principale - Violet/Orange fantastique
const primaryPurple = "#8B5CF6";
const primaryOrange = "#F97316";
const accentRed = "#EF4444";
const accentGold = "#F59E0B";

export const Colors = {
  light: {
    text: "#1F2937",
    textSecondary: "#6B7280",
    background: "#FAFAFA",
    backgroundSecondary: "#F3F4F6",
    tint: primaryPurple,
    tintSecondary: primaryOrange,
    accent: accentRed,
    accentGold: accentGold,
    icon: "#9CA3AF",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: primaryPurple,
    card: "#FFFFFF",
    cardBorder: "#E5E7EB",
    border: "#E5E7EB",
    subtle: "#F3F4F6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: {
      primary: ["#8B5CF6", "#A78BFA"],
      secondary: ["#F97316", "#FB923C"],
      dark: ["#1F2937", "#374151"],
      accent: ["#EF4444", "#F87171"],
    },
    // Propriétés pour LinearGradient
    gradientPrimary: ["#8B5CF6", "#A78BFA", "#C4B5FD"],
    gradientSecondary: ["#F97316", "#FB923C", "#FDBA74"],
  },
  dark: {
    text: "#F9FAFB",
    textSecondary: "#9CA3AF",
    background: "#0F0F1A",
    backgroundSecondary: "#1A1A2E",
    tint: "#A78BFA",
    tintSecondary: "#FB923C",
    accent: "#F87171",
    accentGold: "#FBBF24",
    icon: "#6B7280",
    tabIconDefault: "#6B7280",
    tabIconSelected: "#A78BFA",
    card: "#1A1A2E",
    cardBorder: "#2D2D44",
    border: "#2D2D44",
    subtle: "#1A1A2E",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    gradient: {
      primary: ["#7C3AED", "#8B5CF6"],
      secondary: ["#EA580C", "#F97316"],
      dark: ["#0F0F1A", "#1A1A2E"],
      accent: ["#DC2626", "#EF4444"],
    },
    // Propriétés pour LinearGradient
    gradientPrimary: ["#7C3AED", "#8B5CF6", "#A78BFA"],
    gradientSecondary: ["#EA580C", "#F97316", "#FB923C"],
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
  card: (colorScheme: "light" | "dark") =>
    Platform.select({
      ios: {
        shadowColor: colorScheme === "dark" ? "#000" : "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: colorScheme === "dark" ? 0.3 : 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  glow: (color: string) =>
    Platform.select({
      ios: {
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Styles de texte standardisés
export const Typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 22,
    fontWeight: "600" as const,
  },
  title3: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  headline: {
    fontSize: 17,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 17,
    fontWeight: "400" as const,
  },
  callout: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  subhead: {
    fontSize: 15,
    fontWeight: "400" as const,
  },
  footnote: {
    fontSize: 13,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  caption2: {
    fontSize: 11,
    fontWeight: "400" as const,
  },
};
