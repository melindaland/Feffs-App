import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, Shadows, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";

type SFSymbol =
  | "film"
  | "doc.questionmark"
  | "ticket"
  | "calendar"
  | "star"
  | "heart"
  | "magnifyingglass"
  | "exclamationmark.triangle"
  | "wifi.slash"
  | "xmark.circle";

interface EmptyStateProps {
  /**
   * Icône SF Symbol à afficher
   */
  icon: SFSymbol;
  /**
   * Titre principal
   */
  title: string;
  /**
   * Description secondaire
   */
  description: string;
  /**
   * Style supplémentaire pour le conteneur
   */
  style?: ViewStyle;
  /**
   * Si true, utilise un fond avec gradient subtil
   */
  withGradient?: boolean;
  /**
   * Taille de l'icône (défaut: 36)
   */
  iconSize?: number;
  /**
   * Composant personnalisé à afficher sous la description
   */
  action?: ReactNode;
  /**
   * Couleur de l'icône et du fond (défaut: tint)
   */
  color?: string;
}

/**
 * Composant d'état vide réutilisable avec design premium
 */
export function EmptyState({
  icon,
  title,
  description,
  style,
  withGradient = false,
  iconSize = 36,
  action,
  color,
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const activeColor = color || colors.tint;

  const content = (
    <>
      {/* Icon Container with gradient background */}
      <LinearGradient
        colors={[activeColor + "20", activeColor + "08"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <View style={[styles.iconInner, { borderColor: activeColor + "30" }]}>
          <IconSymbol name={icon} size={iconSize} color={activeColor} />
        </View>
      </LinearGradient>

      {/* Title */}
      <ThemedText type="defaultSemiBold" style={styles.title}>
        {title}
      </ThemedText>

      {/* Description */}
      <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </ThemedText>

      {/* Optional action */}
      {action && <View style={styles.actionContainer}>{action}</View>}
    </>
  );

  if (withGradient) {
    return (
      <LinearGradient
        colors={[colors.card, colors.backgroundSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.container, Shadows.card(colorScheme ?? "light"), style]}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card },
        Shadows.card(colorScheme ?? "light"),
        style,
      ]}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: "center",
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  actionContainer: {
    marginTop: Spacing.md,
  },
});
