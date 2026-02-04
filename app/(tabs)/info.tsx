import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
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

interface VenueInfo {
  name: string;
  address: string;
  phone?: string;
  coordinates: { latitude: number; longitude: number };
  type: "cinema" | "event" | "village";
}

const VENUES: VenueInfo[] = [
  {
    name: "Cinéma Star Saint-Exupéry",
    address: "17 Rue du 22 novembre, 67000 Strasbourg",
    phone: "03 88 22 23 44",
    coordinates: { latitude: 48.5734053, longitude: 7.7521113 },
    type: "cinema",
  },
  {
    name: "Cinéma Odyssée",
    address: "3 Rue des Francs Bourgeois, 67000 Strasbourg",
    phone: "03 88 75 10 47",
    coordinates: { latitude: 48.5839, longitude: 7.7455 },
    type: "cinema",
  },
  {
    name: "Star UGC",
    address: "Place des Halles, 67000 Strasbourg",
    coordinates: { latitude: 48.5798, longitude: 7.7507 },
    type: "cinema",
  },
  {
    name: "Village Fantastique",
    address: "Place Kléber, 67000 Strasbourg",
    coordinates: { latitude: 48.5833, longitude: 7.7458 },
    type: "village",
  },
  {
    name: "Bibliothèque Nationale Universitaire",
    address: "6 Place de la République, 67000 Strasbourg",
    phone: "03 88 25 28 00",
    coordinates: { latitude: 48.5852, longitude: 7.7527 },
    type: "event",
  },
];

const FESTIVAL_INFO = {
  dates: Festival.dateRange,
  website: Festival.website,
  email: Festival.email,
  phone: Festival.phone,
};

export default function InfoScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "lieux",
  );

  const openMaps = (venue: VenueInfo) => {
    const { latitude, longitude } = venue.coordinates;
    const label = encodeURIComponent(venue.name);
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    Linking.openURL(url as string);
  };

  const openPhone = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
  };

  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const openWebsite = (url: string) => {
    Linking.openURL(url);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#0EA5E9", "#0284C7", "#0369A1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`Informations pratiques du festival, ${FESTIVAL_INFO.dates}`}
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
            <IconSymbol name="info.circle.fill" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.headerTitle}>Infos Pratiques</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Tout pour votre festival
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
        {/* Quick Actions */}
        <View
          style={styles.quickActions}
          accessible={true}
          accessibilityRole="toolbar"
          accessibilityLabel="Actions rapides: Site web, Appeler, Email"
        >
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => openWebsite(FESTIVAL_INFO.website)}
            activeOpacity={0.7}
            accessibilityRole="link"
            accessibilityLabel="Ouvrir le site web du festival"
            accessibilityHint="Ouvre le navigateur vers feffs.fr"
          >
            <LinearGradient
              colors={["#F97316", "#EA580C", "#C2410C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="globe" size={32} color="#FFFFFF" />
              <ThemedText style={styles.quickActionText}>Site web</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => openPhone(FESTIVAL_INFO.phone)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Appeler le festival au ${FESTIVAL_INFO.phone}`}
            accessibilityHint="Lance l'application Téléphone"
          >
            <LinearGradient
              colors={["#F97316", "#EA580C", "#C2410C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="phone.fill" size={32} color="#FFFFFF" />
              <ThemedText style={styles.quickActionText}>Appeler</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => openEmail(FESTIVAL_INFO.email)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Envoyer un email à ${FESTIVAL_INFO.email}`}
            accessibilityHint="Ouvre l'application de messagerie"
          >
            <LinearGradient
              colors={["#F97316", "#EA580C", "#C2410C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="envelope.fill" size={32} color="#FFFFFF" />
              <ThemedText style={styles.quickActionText}>Email</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Lieux Section */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card },
            Shadows.card(colorScheme ?? "light"),
          ]}
        >
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection("lieux")}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Lieux du festival, ${VENUES.length} lieux à Strasbourg`}
            accessibilityHint={
              expandedSection === "lieux"
                ? "Appuyer pour masquer les lieux"
                : "Appuyer pour afficher les lieux"
            }
            accessibilityState={{ expanded: expandedSection === "lieux" }}
          >
            <View style={styles.sectionTitleRow}>
              <View
                style={[
                  styles.sectionIcon,
                  { backgroundColor: colors.icon + "15" },
                ]}
                accessibilityElementsHidden={true}
              >
                <IconSymbol name="map.fill" size={20} color={colors.icon} />
              </View>
              <View>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Lieux du festival
                </ThemedText>
                <ThemedText
                  style={[
                    styles.sectionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  {VENUES.length} lieux à Strasbourg
                </ThemedText>
              </View>
            </View>
            <View
              style={[
                styles.chevronCircle,
                expandedSection === "lieux" && {
                  backgroundColor: colors.tint + "15",
                },
              ]}
            >
              <IconSymbol
                name={
                  expandedSection === "lieux" ? "chevron.up" : "chevron.down"
                }
                size={16}
                color={expandedSection === "lieux" ? colors.tint : colors.icon}
              />
            </View>
          </TouchableOpacity>

          {expandedSection === "lieux" && (
            <View style={styles.sectionContent}>
              <View
                style={[styles.divider, { backgroundColor: colors.cardBorder }]}
              />
              {VENUES.map((venue, index) => (
                <View key={index} style={styles.venueItem}>
                  <View style={styles.venueInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.venueName}>
                      {venue.name}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.venueAddress,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {venue.address}
                    </ThemedText>
                    <View style={styles.venueActions}>
                      <TouchableOpacity
                        style={[
                          styles.venueBtn,
                          { backgroundColor: "#0EA5E9" + "15" },
                        ]}
                        onPress={() => openMaps(venue)}
                      >
                        <IconSymbol
                          name="location.fill"
                          size={14}
                          color="#0EA5E9"
                        />
                        <ThemedText
                          style={[styles.venueBtnText, { color: "#0EA5E9" }]}
                        >
                          Itinéraire
                        </ThemedText>
                      </TouchableOpacity>
                      {venue.phone && (
                        <TouchableOpacity
                          style={[
                            styles.venueBtn,
                            { backgroundColor: "#0EA5E9" + "15" },
                          ]}
                          onPress={() => openPhone(venue.phone!)}
                        >
                          <IconSymbol
                            name="phone.fill"
                            size={14}
                            color="#0EA5E9"
                          />
                          <ThemedText
                            style={[styles.venueBtnText, { color: "#0EA5E9" }]}
                          >
                            Appeler
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Horaires Section */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card },
            Shadows.card(colorScheme ?? "light"),
          ]}
        >
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection("horaires")}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Horaires d'ouverture des guichets"
            accessibilityHint={
              expandedSection === "horaires"
                ? "Appuyer pour masquer les horaires"
                : "Appuyer pour afficher les horaires"
            }
            accessibilityState={{ expanded: expandedSection === "horaires" }}
          >
            <View style={styles.sectionTitleRow}>
              <View
                style={[
                  styles.sectionIcon,
                  { backgroundColor: colors.icon + "15" },
                ]}
                accessibilityElementsHidden={true}
              >
                <IconSymbol name="clock.fill" size={20} color={colors.icon} />
              </View>
              <View>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Horaires
                </ThemedText>
                <ThemedText
                  style={[
                    styles.sectionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Ouverture des guichets
                </ThemedText>
              </View>
            </View>
            <View
              style={[
                styles.chevronCircle,
                expandedSection === "horaires" && {
                  backgroundColor: colors.tint + "15",
                },
              ]}
            >
              <IconSymbol
                name={
                  expandedSection === "horaires" ? "chevron.up" : "chevron.down"
                }
                size={16}
                color={
                  expandedSection === "horaires" ? colors.tint : colors.icon
                }
              />
            </View>
          </TouchableOpacity>

          {expandedSection === "horaires" && (
            <View style={styles.sectionContent}>
              <View
                style={[styles.divider, { backgroundColor: colors.cardBorder }]}
              />
              <View style={styles.scheduleGrid}>
                <View
                  style={[
                    styles.scheduleItem,
                    { backgroundColor: colors.backgroundSecondary },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.scheduleDay,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Lun - Jeu
                  </ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.scheduleTime}
                  >
                    14h - 22h
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.scheduleItem,
                    { backgroundColor: colors.backgroundSecondary },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.scheduleDay,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Ven - Sam
                  </ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.scheduleTime}
                  >
                    10h - 00h
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.scheduleItem,
                    { backgroundColor: colors.backgroundSecondary },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.scheduleDay,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Dimanche
                  </ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.scheduleTime}
                  >
                    10h - 22h
                  </ThemedText>
                </View>
              </View>
              <View
                style={[styles.noteCard, { backgroundColor: "#0EA5E9" + "CC" }]}
              >
                <ThemedText style={[styles.noteText, { color: "#FFFFFF" }]}>
                  Les horaires peuvent varier selon les événements spéciaux
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Accessibilité Section */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card },
            Shadows.card(colorScheme ?? "light"),
          ]}
        >
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection("accessibilite")}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Accessibilité du festival"
            accessibilityHint={
              expandedSection === "accessibilite"
                ? "Appuyer pour masquer les informations d'accessibilité"
                : "Appuyer pour afficher les informations d'accessibilité"
            }
            accessibilityState={{
              expanded: expandedSection === "accessibilite",
            }}
          >
            <View style={styles.sectionTitleRow}>
              <View
                style={[
                  styles.sectionIcon,
                  { backgroundColor: colors.icon + "15" },
                ]}
                accessibilityElementsHidden={true}
              >
                <IconSymbol name="figure.roll" size={20} color={colors.icon} />
              </View>
              <View>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Accessibilité
                </ThemedText>
                <ThemedText
                  style={[
                    styles.sectionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Festival accessible à tous
                </ThemedText>
              </View>
            </View>
            <View
              style={[
                styles.chevronCircle,
                expandedSection === "accessibilite" && {
                  backgroundColor: colors.tint + "15",
                },
              ]}
            >
              <IconSymbol
                name={
                  expandedSection === "accessibilite"
                    ? "chevron.up"
                    : "chevron.down"
                }
                size={16}
                color={
                  expandedSection === "accessibilite"
                    ? colors.tint
                    : colors.icon
                }
              />
            </View>
          </TouchableOpacity>

          {expandedSection === "accessibilite" && (
            <View style={styles.sectionContent}>
              <View
                style={[styles.divider, { backgroundColor: colors.cardBorder }]}
              />
              <View style={styles.accessList}>
                <View style={styles.accessItem}>
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={18}
                    color={colors.icon}
                  />
                  <ThemedText style={styles.accessText}>
                    Accès PMR dans tous les cinémas
                  </ThemedText>
                </View>
                <View style={styles.accessItem}>
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={18}
                    color={colors.icon}
                  />
                  <ThemedText style={styles.accessText}>
                    Boucle magnétique disponible
                  </ThemedText>
                </View>
                <View style={styles.accessItem}>
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={18}
                    color={colors.icon}
                  />
                  <ThemedText style={styles.accessText}>
                    Audiodescription sur demande
                  </ThemedText>
                </View>
                <View style={styles.accessItem}>
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={18}
                    color={colors.icon}
                  />
                  <ThemedText style={styles.accessText}>
                    Places réservées accompagnants
                  </ThemedText>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Social Media */}
        <View style={[styles.socialCard]}>
          <ThemedText type="defaultSemiBold" style={styles.socialTitle}>
            Suivez-nous
          </ThemedText>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Linking.openURL("https://twitter.com/feffs")}
            >
              <FontAwesome name="twitter" size={32} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Linking.openURL("https://instagram.com/feffs")}
            >
              <FontAwesome name="instagram" size={32} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Linking.openURL("https://facebook.com/feffs")}
            >
              <FontAwesome name="facebook" size={32} color="#1877F2" />
            </TouchableOpacity>
          </View>
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
  quickActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: 10,
  },
  quickAction: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  quickActionGradient: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.md,
    gap: 6,
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 2,
    color: "#FFFFFF",
  },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.sm,
  },
  sectionTitleRow: {
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
  chevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  divider: {
    height: 1,
  },
  venueItem: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  venueInfo: {
    flex: 1,
    gap: 4,
  },
  venueName: {
    fontSize: 14,
  },
  venueAddress: {
    fontSize: 12,
  },
  venueActions: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginTop: 6,
  },
  venueBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  venueBtnText: {
    fontSize: 11,
    fontWeight: "600",
  },
  scheduleGrid: {
    gap: Spacing.sm,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  scheduleDay: {
    fontSize: 14,
  },
  scheduleTime: {
    fontSize: 16,
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
  },
  accessList: {
    gap: Spacing.sm,
  },
  accessItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  accessText: {
    fontSize: 14,
  },
  socialCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  socialTitle: {
    fontSize: 22,
    marginTop: 10,
  },
  socialButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  socialBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
});
