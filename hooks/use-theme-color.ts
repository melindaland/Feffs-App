/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Types pour les couleurs simples (strings uniquement)
type SimpleColorKeys =
  | "text"
  | "textSecondary"
  | "background"
  | "backgroundSecondary"
  | "tint"
  | "tintSecondary"
  | "accent"
  | "accentGold"
  | "icon"
  | "tabIconDefault"
  | "tabIconSelected"
  | "card"
  | "cardBorder"
  | "success"
  | "warning"
  | "error";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: SimpleColorKeys,
): string {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName] as string;
  }
}
