import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  Festival,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  cancelAllNotifications,
  getAllScheduledNotifications,
  sendImmediateNotification,
} from "@/services/notifications";

interface NotificationPreferences {
  projectionReminders: boolean;
  scheduleChanges: boolean;
  newEvents: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [hasNotificationPermission, setHasNotificationPermission] =
    useState(false);
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>({
      projectionReminders: true,
      scheduleChanges: true,
      newEvents: true,
    });
  const [scheduledCount, setScheduledCount] = useState(0);
  const [dataStats, setDataStats] = useState({
    scheduleCount: 0,
    surveysCount: 0,
    hasPass: false,
  });

  useEffect(() => {
    loadDataStats();
    checkNotificationPermission();
    loadScheduledNotifications();
  }, []);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasNotificationPermission(status === "granted");
  };

  const loadScheduledNotifications = async () => {
    const notifications = await getAllScheduledNotifications();
    setScheduledCount(notifications.length);
  };

  const loadDataStats = async () => {
    try {
      const schedule = await AsyncStorage.getItem("@feffs_user_schedule");
      const surveys = await AsyncStorage.getItem("@feffs_completed_surveys");
      const pass = await AsyncStorage.getItem("@feffs_user_pass");

      setDataStats({
        scheduleCount: schedule ? JSON.parse(schedule).length : 0,
        surveysCount: surveys ? JSON.parse(surveys).length : 0,
        hasPass: !!pass,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  const handleClearAllData = async () => {
    Alert.alert(
      "⚠️ Effacer toutes les données",
      "Cette action supprimera votre programme, vos enquêtes et votre pass. Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Tout effacer",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setDataStats({
                scheduleCount: 0,
                surveysCount: 0,
                hasPass: false,
              });
              Alert.alert("Succès", "Toutes les données ont été effacées.");
            } catch {
              Alert.alert("Erreur", "Impossible d'effacer les données.");
            }
          },
        },
      ],
    );
  };

  const handleRequestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === "granted";
    setHasNotificationPermission(granted);
    if (granted) {
      Alert.alert(
        "✅ Permissions accordées",
        "Vous recevrez désormais les notifications.",
      );
    } else {
      Alert.alert(
        "❌ Permissions refusées",
        "Vous pouvez les activer dans les paramètres de votre téléphone.",
      );
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendImmediateNotification(
        "🎬 Test de notification",
        `Ceci est une notification de test du ${Festival.yearString}`,
        { type: "test" },
      );
    } catch {
      Alert.alert("Erreur", "Impossible d'envoyer la notification");
    }
  };

  const handleClearAllNotifications = async () => {
    Alert.alert(
      "Effacer toutes les notifications",
      "Voulez-vous supprimer toutes les notifications planifiées ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Effacer",
          style: "destructive",
          onPress: async () => {
            await cancelAllNotifications();
            await loadScheduledNotifications();
            Alert.alert(
              "✅ Notifications effacées",
              "Toutes les notifications ont été supprimées.",
            );
          },
        },
      ],
    );
  };

  const toggleNotificationPreference = (key: keyof NotificationPreferences) => {
    setNotificationPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const appVersion = Application.nativeApplicationVersion || "1.0.0";
  const buildVersion = Application.nativeBuildVersion || "1";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#64748B", "#475569", "#334155"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Paramètres de l'application"
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 12,
            position: "relative",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 60, height: 60, resizeMode: "contain" }}
          />
          <TouchableOpacity
            style={{ position: "absolute", right: 0, top: 0, zIndex: 10 }}
            onPress={() => router.replace("/")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon} accessibilityElementsHidden={true}>
            <IconSymbol name="gearshape.fill" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.headerTitle}>Paramètres</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Personnalisez votre expérience
            </ThemedText>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* Stats Cards */}
        <View
          style={styles.statsRow}
          accessible={true}
          accessibilityRole="summary"
          accessibilityLabel={`Statistiques: ${dataStats.scheduleCount} séances, ${dataStats.surveysCount} enquêtes, pass ${dataStats.hasPass ? "actif" : "inactif"}`}
        >
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED", "#6D28D9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
            accessibilityElementsHidden={true}
          >
            <ThemedText style={styles.statNumber}>
              {dataStats.scheduleCount}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Séances</ThemedText>
          </LinearGradient>
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED", "#6D28D9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <ThemedText style={styles.statNumber}>
              {dataStats.surveysCount}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Enquêtes</ThemedText>
          </LinearGradient>
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED", "#6D28D9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <ThemedText style={styles.statNumber}>
              {dataStats.hasPass ? "✓" : "—"}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Pass</ThemedText>
          </LinearGradient>
        </View>

        {/* Notifications Section */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card },
            Shadows.card(colorScheme ?? "light"),
          ]}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIcon,
                { backgroundColor: colors.icon + "15" },
              ]}
            >
              <IconSymbol name="bell.fill" size={20} color={colors.icon} />
            </View>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Notifications
            </ThemedText>
          </View>

          {!hasNotificationPermission ? (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={handleRequestNotificationPermission}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Activer les notifications"
              accessibilityHint="Demande la permission pour recevoir des notifications de rappel"
            >
              <LinearGradient
                colors={["#8B5CF6", "#7C3AED", "#6D28D9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.permissionGradient}
              >
                <IconSymbol name="bell.badge" size={20} color="#FFFFFF" />
                <ThemedText
                  style={[styles.permissionText, { color: "#FFFFFF" }]}
                >
                  Activer les notifications
                </ThemedText>
                <IconSymbol name="chevron.right" size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.settingsList}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingTitle}>
                    Rappels de séances
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.settingDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    30 min avant chaque projection
                  </ThemedText>
                </View>
                <Switch
                  value={notificationPreferences.projectionReminders}
                  onValueChange={() =>
                    toggleNotificationPreference("projectionReminders")
                  }
                  trackColor={{ false: "#D1D5DB", true: colors.tint + "60" }}
                  thumbColor={
                    notificationPreferences.projectionReminders
                      ? colors.tint
                      : "#F3F4F6"
                  }
                  accessibilityRole="switch"
                  accessibilityLabel="Rappels de séances, 30 minutes avant chaque projection"
                  accessibilityState={{
                    checked: notificationPreferences.projectionReminders,
                  }}
                />
              </View>
              <View
                style={[
                  styles.settingDivider,
                  { backgroundColor: colors.cardBorder },
                ]}
              />
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingTitle}>
                    Changements de programme
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.settingDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Alertes modifications horaires
                  </ThemedText>
                </View>
                <Switch
                  value={notificationPreferences.scheduleChanges}
                  onValueChange={() =>
                    toggleNotificationPreference("scheduleChanges")
                  }
                  trackColor={{ false: "#D1D5DB", true: colors.tint + "60" }}
                  thumbColor={
                    notificationPreferences.scheduleChanges
                      ? colors.tint
                      : "#F3F4F6"
                  }
                  accessibilityRole="switch"
                  accessibilityLabel="Changements de programme, alertes en cas de modifications horaires"
                  accessibilityState={{
                    checked: notificationPreferences.scheduleChanges,
                  }}
                />
              </View>
              <View
                style={[
                  styles.settingDivider,
                  { backgroundColor: colors.cardBorder },
                ]}
              />
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingTitle}>
                    Nouveaux événements
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.settingDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Dernières actualités
                  </ThemedText>
                </View>
                <Switch
                  value={notificationPreferences.newEvents}
                  onValueChange={() =>
                    toggleNotificationPreference("newEvents")
                  }
                  trackColor={{ false: "#D1D5DB", true: colors.tint + "60" }}
                  thumbColor={
                    notificationPreferences.newEvents ? colors.tint : "#F3F4F6"
                  }
                  accessibilityRole="switch"
                  accessibilityLabel="Nouveaux événements, recevoir les dernières actualités"
                  accessibilityState={{
                    checked: notificationPreferences.newEvents,
                  }}
                />
              </View>
            </View>
          )}

          {hasNotificationPermission && scheduledCount > 0 && (
            <View
              style={[
                styles.notifInfoCard,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <IconSymbol
                name="clock.badge.checkmark"
                size={16}
                color={colors.tint}
              />
              <ThemedText
                style={[styles.notifInfoText, { color: colors.textSecondary }]}
              >
                {scheduledCount} notification{scheduledCount > 1 ? "s" : ""}{" "}
                planifiée{scheduledCount > 1 ? "s" : ""}
              </ThemedText>
              <TouchableOpacity
                onPress={handleClearAllNotifications}
                accessibilityRole="button"
                accessibilityLabel="Effacer toutes les notifications planifiées"
              >
                <ThemedText style={[styles.clearLink, { color: colors.error }]}>
                  Effacer
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {hasNotificationPermission && (
            <TouchableOpacity
              style={[styles.testButton, { borderColor: colors.cardBorder }]}
              onPress={handleTestNotification}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Envoyer une notification de test"
              accessibilityHint="Envoie une notification immédiate pour vérifier que les notifications fonctionnent"
            >
              <IconSymbol
                name="paperplane.fill"
                size={16}
                color={colors.tint}
              />
              <ThemedText
                style={[styles.testButtonText, { color: colors.tint }]}
              >
                Envoyer une notification de test
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Data & Storage Section */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card },
            Shadows.card(colorScheme ?? "light"),
          ]}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIcon,
                { backgroundColor: colors.icon + "15" },
              ]}
            >
              <IconSymbol
                name="externaldrive.fill"
                size={20}
                color={colors.icon}
              />
            </View>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Données & Stockage
            </ThemedText>
          </View>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAllData}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Effacer toutes les données"
            accessibilityHint="Attention: supprime votre programme, vos enquêtes et votre pass de manière irréversible"
          >
            <IconSymbol name="trash.fill" size={18} color="#FFFFFF" />
            <ThemedText style={[styles.dangerButtonText, { color: "#FFFFFF" }]}>
              Effacer toutes les données
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card },
            Shadows.card(colorScheme ?? "light"),
          ]}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIcon,
                { backgroundColor: colors.icon + "15" },
              ]}
            >
              <IconSymbol
                name="questionmark.circle.fill"
                size={20}
                color={colors.icon}
              />
            </View>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Support
            </ThemedText>
          </View>

          <View style={styles.linksList}>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => Linking.openURL("https://www.feffs.eu")}
              activeOpacity={0.7}
            >
              <IconSymbol name="globe" size={18} color={colors.icon} />
              <ThemedText style={styles.linkText}>Site web du FEFFS</ThemedText>
              <IconSymbol
                name="arrow.up.right"
                size={14}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            <View
              style={[
                styles.settingDivider,
                { backgroundColor: colors.cardBorder },
              ]}
            />
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() =>
                Linking.openURL(
                  "mailto:contact@feffs.eu?subject=Support FEFFS App",
                )
              }
              activeOpacity={0.7}
            >
              <IconSymbol name="envelope.fill" size={18} color={colors.icon} />
              <ThemedText style={styles.linkText}>
                Contacter le support
              </ThemedText>
              <IconSymbol
                name="arrow.up.right"
                size={14}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <ThemedText style={[styles.appName, { color: colors.textSecondary }]}>
            {Festival.yearString}
          </ThemedText>
          <ThemedText
            style={[styles.appVersion, { color: colors.textSecondary }]}
          >
            Version {appVersion} ({buildVersion})
          </ThemedText>
          <ThemedText
            style={[styles.appCopyright, { color: colors.textSecondary }]}
          >
            © {Festival.fullName}
          </ThemedText>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 25,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    color: "#FFFFFF",
  },
  section: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 17,
  },
  permissionButton: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  permissionGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  permissionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  settingsList: {
    gap: Spacing.sm,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 15,
  },
  settingDesc: {
    fontSize: 12,
  },
  settingDivider: {
    height: 1,
    marginVertical: 4,
  },
  notifInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  notifInfoText: {
    flex: 1,
    fontSize: 12,
  },
  clearLink: {
    fontSize: 12,
    fontWeight: "600",
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  testButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: "#EF4444",
    gap: Spacing.sm,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  linksList: {
    gap: Spacing.xs,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    gap: 4,
  },
  appName: {
    fontSize: 16,
    fontWeight: "600",
  },
  appVersion: {
    fontSize: 13,
  },
  appCopyright: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
});
