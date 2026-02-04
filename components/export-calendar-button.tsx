import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  exportEventToCalendar,
  exportProjectionToCalendar,
} from "@/services/calendar";
import { Event, Projection } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";

interface ExportCalendarButtonProps {
  projection?: Projection;
  event?: Event;
  filmTitle?: string;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

/**
 * Composant bouton pour exporter une projection ou un événement vers le calendrier
 */
export function ExportCalendarButton({
  projection,
  event,
  filmTitle,
  variant = "primary",
  fullWidth = false,
}: ExportCalendarButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const handlePress = async () => {
    setIsLoading(true);
    try {
      if (projection && filmTitle) {
        await exportProjectionToCalendar(projection, filmTitle);
      } else if (event) {
        await exportEventToCalendar(event);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isPrimary = variant === "primary";
  const textColor = isPrimary ? "#fff" : Colors[colorScheme ?? "light"].tint;

  const content = isLoading ? (
    <ActivityIndicator size="small" color={textColor} />
  ) : (
    <>
      <IconSymbol name="calendar.badge.plus" size={20} color={textColor} />
      <ThemedText
        style={[styles.buttonText, { color: textColor }]}
        accessibilityLabel="Ajouter au calendrier"
      >
        Ajouter au calendrier
      </ThemedText>
    </>
  );

  if (isPrimary) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLoading}
        accessibilityLabel="Ajouter au calendrier"
        accessibilityRole="button"
        accessibilityHint="Appuyez pour ajouter cet événement à votre calendrier"
        style={{ width: fullWidth ? "100%" : undefined }}
      >
        <LinearGradient
          colors={["#3B82F6", "#2563EB", "#1D4ED8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, { borderWidth: 0 }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isLoading}
      accessibilityLabel="Ajouter au calendrier"
      accessibilityRole="button"
      accessibilityHint="Appuyez pour ajouter cet événement à votre calendrier"
      style={[
        styles.button,
        {
          backgroundColor: "transparent",
          borderColor: Colors[colorScheme ?? "light"].tint,
          width: fullWidth ? "100%" : undefined,
        },
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
