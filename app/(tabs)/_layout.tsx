import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 0.5,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          height: Platform.OS === "ios" ? 88 : 68,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 10,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}
    >
      <Tabs.Screen
        name="daily"
        options={{
          title: "Quotidienne",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="sun.max.fill" color={color} />
          ),
          tabBarAccessibilityLabel: "La Quotidienne - Programme du jour",
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          title: "Programme",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.bullet" color={color} />
          ),
          tabBarAccessibilityLabel: "Mon programme personnalisé",
        }}
      />
      <Tabs.Screen
        name="films"
        options={{
          title: "Films",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="film" color={color} />
          ),
          tabBarAccessibilityLabel: "Catalogue des films",
        }}
      />
      <Tabs.Screen
        name="pass"
        options={{
          title: "Pass",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="ticket.fill" color={color} />
          ),
          tabBarAccessibilityLabel: "Mon pass festivalier",
        }}
      />
      <Tabs.Screen
        name="surveys"
        options={{
          title: "Enquêtes",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="doc.text.fill" color={color} />
          ),
          tabBarAccessibilityLabel: "Enquêtes de satisfaction",
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: "Infos",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="info.circle.fill" color={color} />
          ),
          tabBarAccessibilityLabel: "Informations pratiques",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Réglages",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
          tabBarAccessibilityLabel: "Réglages de l'application",
        }}
      />
    </Tabs>
  );
}
