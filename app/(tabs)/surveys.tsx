import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { EmptyState } from "@/components/empty-state";
import { QRCodeScanner } from "@/components/qrcode-scanner";
import { SurveyForm } from "@/components/survey-form";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, Shadows, Spacing } from "@/constants/theme";
import { getSurveyById } from "@/data/surveys";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  getCompletedSurveys,
  hasSurveyBeenCompleted,
  saveCompletedSurvey,
} from "@/services/storage";
import type { CompletedSurvey, Survey, SurveyResponse } from "@/types";

type ViewMode = "list" | "scanner" | "form";

export default function SurveysScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [mode, setMode] = useState<ViewMode>("list");
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [completedSurveys, setCompletedSurveys] = useState<CompletedSurvey[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletedSurveys();
  }, []);

  const loadCompletedSurveys = async () => {
    try {
      const surveys = await getCompletedSurveys();
      setCompletedSurveys(surveys);
    } catch (error) {
      console.error("Erreur lors du chargement des enquêtes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (data: string) => {
    try {
      const cleanData = data.trim();
      const survey = getSurveyById(cleanData);

      if (!survey) {
        Alert.alert(
          "Erreur",
          `QR code invalide : "${cleanData}". Enquête introuvable.`,
        );
        return;
      }

      const alreadyCompleted = await hasSurveyBeenCompleted(survey.id);
      if (alreadyCompleted) {
        Alert.alert(
          "Enquête déjà complétée",
          "Vous avez déjà répondu à cette enquête.",
        );
        setMode("list");
        return;
      }

      if (survey.expiresAt && new Date(survey.expiresAt) < new Date()) {
        Alert.alert("Enquête expirée", "Cette enquête n'est plus disponible.");
        setMode("list");
        return;
      }

      setCurrentSurvey(survey);
      setMode("form");
    } catch (error) {
      console.error("Erreur lors du scan:", error);
      Alert.alert("Erreur", "Impossible de charger l'enquête.");
    }
  };

  const handleSubmit = async (responses: SurveyResponse[]) => {
    if (!currentSurvey) return;

    try {
      const completedSurvey: CompletedSurvey = {
        id: `completed-${Date.now()}`,
        surveyId: currentSurvey.id,
        surveyTitle: currentSurvey.title,
        responses,
        completedAt: new Date(),
      };

      await saveCompletedSurvey(completedSurvey);
      await loadCompletedSurveys();

      Alert.alert("Merci !", "Votre réponse a été enregistrée avec succès.", [
        {
          text: "OK",
          onPress: () => {
            setCurrentSurvey(null);
            setMode("list");
          },
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder vos réponses.");
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Annuler",
      "Êtes-vous sûr de vouloir annuler ? Vos réponses seront perdues.",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui",
          style: "destructive",
          onPress: () => {
            setCurrentSurvey(null);
            setMode("list");
          },
        },
      ],
    );
  };

  if (mode === "scanner") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.scannerHeader}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card }]}
            onPress={() => setMode("list")}
            accessibilityRole="button"
            accessibilityLabel="Fermer le scanner"
            accessibilityHint="Revenir à la liste des enquêtes"
          >
            <IconSymbol name="xmark" size={20} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="defaultSemiBold" style={styles.scannerTitle}>
            Scanner le QR code
          </ThemedText>
        </View>
        <QRCodeScanner onScan={handleScan} />
      </View>
    );
  }

  if (mode === "form" && currentSurvey) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={colors.gradientSecondary as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.formHeader}
        >
          <TouchableOpacity
            style={styles.formBackButton}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Annuler l'enquête"
            accessibilityHint="Ferme le formulaire et annule vos réponses"
          >
            <IconSymbol name="xmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.formHeaderContent}>
            <ThemedText style={styles.formTitle}>
              {currentSurvey.title}
            </ThemedText>
            <ThemedText style={styles.formSubtitle}>
              {currentSurvey.questions.length} questions
            </ThemedText>
          </View>
        </LinearGradient>
        <SurveyForm
          survey={currentSurvey}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#EC4899", "#DB2777", "#BE185D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`Enquêtes de satisfaction. ${completedSurveys.length} enquêtes complétées`}
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
              name="doc.text.magnifyingglass"
              size={32}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.headerTitle}>Enquêtes</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Partagez votre avis
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
        {/* Scan Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setMode("scanner")}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Scanner un QR code"
          accessibilityHint="Ouvre la caméra pour scanner les QR codes affichés en salle après chaque projection"
        >
          <LinearGradient
            colors={["#0EA5E9", "#0284C7", "#0369A1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanGradient}
          >
            <View
              style={styles.scanIconContainer}
              accessibilityElementsHidden={true}
            >
              <IconSymbol name="qrcode.viewfinder" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.scanTextContainer}>
              <ThemedText style={styles.scanTitle}>
                Scanner un QR code
              </ThemedText>
              <ThemedText style={styles.scanDescription}>
                Scannez les codes affichés en salle
              </ThemedText>
            </View>
            <IconSymbol
              name="chevron.right"
              size={24}
              color="rgba(255,255,255,0.7)"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Info Card */}
        <View
          style={[styles.infoCard, Shadows.card(colorScheme ?? "light")]}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Conseil: Les enquêtes nous aident à améliorer le festival. Scannez les QR codes après chaque projection pour donner votre avis."
        >
          <ThemedText style={[styles.infoText, { color: "#FFFFFF" }]}>
            Les enquêtes nous aident à améliorer le festival. Scannez les QR
            codes après chaque projection pour donner votre avis.
          </ThemedText>
        </View>

        {/* Completed Surveys */}
        {completedSurveys.length > 0 && (
          <View style={styles.completedSection}>
            <View style={styles.sectionHeader}>
              <IconSymbol
                name="checkmark.circle.fill"
                size={22}
                color={colors.success}
              />
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Enquêtes complétées
              </ThemedText>
            </View>

            <View style={styles.completedList}>
              {completedSurveys.map((survey, index) => (
                <View
                  key={survey.id}
                  style={[
                    styles.surveyCard,
                    { backgroundColor: colors.card },
                    Shadows.card(colorScheme ?? "light"),
                  ]}
                >
                  <View
                    style={[
                      styles.surveyIndex,
                      { backgroundColor: colors.success + "15" },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.surveyIndexText,
                        { color: colors.success },
                      ]}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </ThemedText>
                  </View>
                  <View style={styles.surveyInfo}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.surveyTitle}
                    >
                      {survey.surveyTitle}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.surveyDate,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Complétée le{" "}
                      {new Date(survey.completedAt).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                        },
                      )}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.checkBadge,
                      { backgroundColor: colors.success },
                    ]}
                  >
                    <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {completedSurveys.length === 0 && !loading && (
          <EmptyState
            icon="doc.questionmark"
            title="Aucune enquête"
            description="Vous n'avez pas encore répondu à des enquêtes. Scannez un QR code pour commencer."
            style={{ marginVertical: Spacing.lg }}
            color={colors.icon}
          />
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
  scanButton: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#8B5CF6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  scanGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  scanIconContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scanDescription: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  completedSection: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
  },
  completedList: {
    gap: Spacing.sm,
  },
  surveyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  surveyIndex: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  surveyIndexText: {
    fontSize: 14,
    fontWeight: "700",
  },
  surveyInfo: {
    flex: 1,
    gap: 2,
  },
  surveyTitle: {
    fontSize: 15,
  },
  surveyDate: {
    fontSize: 12,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerTitle: {
    fontSize: 18,
  },
  formHeader: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  formBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  formHeaderContent: {
    flex: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  formSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
});
