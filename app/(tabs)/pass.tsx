import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { PassCard } from "@/components/pass-card";
import { PassPurchaseForm } from "@/components/pass-purchase-form";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, Festival, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { clearUserPass, getUserPass, saveUserPass } from "@/services/storage";
import { UserPass } from "@/types";

export default function PassScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [pass, setPass] = useState<UserPass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPass();
  }, []);

  const loadPass = async () => {
    try {
      const savedPass = await getUserPass();
      if (savedPass) {
        setPass({
          ...savedPass,
          createdAt: new Date(savedPass.createdAt),
          validUntil: new Date(savedPass.validUntil),
        });
      }
    } catch (error) {
      console.error("Erreur chargement pass:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (newPass: UserPass) => {
    setIsSaving(true);
    try {
      await saveUserPass(newPass);
      setPass(newPass);
      Alert.alert(
        "✅ Pass créé",
        "Votre demande de pass a été enregistrée. Présentez-vous au Village Fantastique pour finaliser votre achat.",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sauvegarder le pass");
      console.error("Erreur sauvegarde pass:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await clearUserPass();
      setPass(null);
      Alert.alert("Pass supprimé", "Votre pass a été supprimé avec succès.");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de supprimer le pass");
      console.error("Erreur suppression pass:", error);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText
            style={[styles.loadingText, { color: colors.textSecondary }]}
          >
            Chargement...
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={
          pass
            ? ["#10B981", "#059669", "#047857"]
            : ["#0D9488", "#0F766E", "#115E59"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={
          pass
            ? `Mon Pass Festival, pass actif et validé pour ${pass.firstName} ${pass.lastName}`
            : "Mon Pass, créez votre pass festival"
        }
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
            <IconSymbol
              name={pass ? "checkmark.seal.fill" : "ticket.fill"}
              size={32}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.headerTitle}>Mon Pass</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {pass
                ? `Pass actif • ${Festival.yearString}`
                : "Créez votre pass festival"}
            </ThemedText>
          </View>

          {/* Status Badge */}
          <View style={styles.statusBadge} accessibilityElementsHidden={true}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: pass ? "#4ADE80" : "#FCD34D" },
              ]}
            />
            <ThemedText style={styles.statusText}>
              {pass ? "Validé" : "En attente"}
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
        {pass ? (
          <>
            {/* Info Card */}
            <View
              style={[styles.infoCard]}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel="Information: Présentez le QR code au Village Fantastique pour accéder aux projections"
            >
              <ThemedText style={[styles.infoText, { color: "#FFFFFF" }]}>
                Présentez le QR code au Village Fantastique pour accéder aux
                projections.
              </ThemedText>
            </View>

            {/* Pass Card */}
            <PassCard
              pass={pass}
              onDelete={handleDelete}
              style={{ backgroundColor: colors.card }}
            />

            {/* Benefits Section */}
            <View
              style={[styles.benefitsCard]}
              accessible={true}
              accessibilityRole="list"
              accessibilityLabel="Vos avantages: Accès à toutes les projections, Événements exclusifs, Goodies et surprises"
            >
              <ThemedText type="defaultSemiBold" style={styles.benefitsTitle}>
                Vos avantages
              </ThemedText>
              <View style={styles.benefitsList}>
                <View
                  style={styles.benefitItem}
                  accessibilityElementsHidden={true}
                >
                  <View
                    style={[
                      styles.benefitIcon,
                      { backgroundColor: colors.icon + "15" },
                    ]}
                  >
                    <IconSymbol name="film" size={24} color={colors.icon} />
                  </View>
                  <ThemedText style={styles.benefitText}>
                    Accès à toutes les projections
                  </ThemedText>
                </View>
                <View
                  style={styles.benefitItem}
                  accessibilityElementsHidden={true}
                >
                  <View
                    style={[
                      styles.benefitIcon,
                      { backgroundColor: colors.icon + "15" },
                    ]}
                  >
                    <IconSymbol
                      name="star.fill"
                      size={24}
                      color={colors.icon}
                    />
                  </View>
                  <ThemedText style={styles.benefitText}>
                    Événements exclusifs
                  </ThemedText>
                </View>
                <View
                  style={styles.benefitItem}
                  accessibilityElementsHidden={true}
                >
                  <View
                    style={[
                      styles.benefitIcon,
                      { backgroundColor: colors.icon + "15" },
                    ]}
                  >
                    <IconSymbol
                      name="gift.fill"
                      size={24}
                      color={colors.icon}
                    />
                  </View>
                  <ThemedText style={styles.benefitText}>
                    Goodies et surprises
                  </ThemedText>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Welcome Card */}
            <View
              style={[styles.welcomeCard, { backgroundColor: colors.card }]}
            >
              <LinearGradient
                colors={[colors.tint + "20", colors.tintSecondary + "10"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.welcomeGradient}
              >
                <IconSymbol name="sparkles" size={40} color={colors.tint} />
                <ThemedText type="defaultSemiBold" style={styles.welcomeTitle}>
                  Bienvenue au FEFFS !
                </ThemedText>
                <ThemedText
                  style={[styles.welcomeText, { color: colors.textSecondary }]}
                >
                  Créez votre pass pour profiter de toutes les projections et
                  événements du Festival Européen du Film Fantastique de
                  Strasbourg.
                </ThemedText>
              </LinearGradient>
            </View>

            {/* Pass Types */}
            <View style={styles.passTypesSection}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Choisissez votre formule
              </ThemedText>
              <View style={styles.passTypeCards}>
                <View
                  style={[
                    styles.passTypeCard,
                    { backgroundColor: colors.card, borderColor: colors.tint },
                  ]}
                >
                  <ThemedText
                    style={[styles.passTypeLabel, { color: colors.tint }]}
                  >
                    POPULAIRE
                  </ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.passTypeName}
                  >
                    Pass Festival
                  </ThemedText>
                  <ThemedText style={styles.passTypePrice}>65€</ThemedText>
                  <ThemedText
                    style={[
                      styles.passTypeDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Accès illimité pendant 11 jours
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.passTypeCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.passTypeLabel,
                      { color: colors.tintSecondary },
                    ]}
                  >
                    DÉCOUVERTE
                  </ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.passTypeName}
                  >
                    Pass Week-end
                  </ThemedText>
                  <ThemedText style={styles.passTypePrice}>35€</ThemedText>
                  <ThemedText
                    style={[
                      styles.passTypeDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Accès 3 jours au choix
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Purchase Form */}
            <PassPurchaseForm onSubmit={handleSubmit} isLoading={isSaving} />
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: 14,
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
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  benefitsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  benefitsTitle: {
    fontSize: 22,
  },
  benefitsList: {
    gap: Spacing.xl,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
  welcomeCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  welcomeGradient: {
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.md,
  },
  welcomeTitle: {
    fontSize: 20,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  passTypesSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
  },
  passTypeCards: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  passTypeCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: "center",
    gap: 4,
  },
  passTypeLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  passTypeName: {
    fontSize: 15,
    marginTop: 4,
  },
  passTypePrice: {
    fontSize: 28,
    fontWeight: "700",
  },
  passTypeDesc: {
    fontSize: 12,
    textAlign: "center",
  },
});
