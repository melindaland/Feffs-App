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

import { ThemedText } from "@/components/themed-text";
import { AnimatedListItem } from "@/components/ui/animated";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, Shadows, Spacing } from "@/constants/theme";
import { FILMS, PROJECTIONS, getFilmById } from "@/data/films";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { checkConflicts, validateFullSchedule } from "@/services/schedule";
import {
  addProjectionToSchedule,
  getUserSchedule,
  removeProjectionFromSchedule,
} from "@/services/storage";
import { Projection } from "@/types";

const GENRE_COLORS = [
  "#8B5CF6", // Violet
  "#F97316", // Orange
  "#EC4899", // Rose
  "#10B981", // Vert
  "#3B82F6", // Bleu
  "#EF4444", // Rouge
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [selectedProjections, setSelectedProjections] = useState<string[]>([]);
  const [expandedFilm, setExpandedFilm] = useState<string | null>(null);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const schedule = await getUserSchedule();
    setSelectedProjections(schedule);
  };

  const handleToggleProjection = async (projection: Projection) => {
    const isSelected = selectedProjections.includes(projection.id);

    if (isSelected) {
      await removeProjectionFromSchedule(projection.id);
      setSelectedProjections((prev) =>
        prev.filter((id) => id !== projection.id),
      );
    } else {
      const existingProjs = PROJECTIONS.filter((p) =>
        selectedProjections.includes(p.id),
      );
      const conflicts = checkConflicts(projection, existingProjs);

      if (conflicts.length > 0) {
        const film = getFilmById(projection.filmId);
        const conflictMessages = conflicts
          .map(
            (c) =>
              `• ${c.conflictType === "time" ? "Conflit horaire" : "Temps de trajet insuffisant"}: ${c.message}`,
          )
          .join("\n");

        Alert.alert(
          "⚠️ Conflit détecté",
          `La projection de "${film?.title}" crée un conflit:\n\n${conflictMessages}\n\nVoulez-vous l'ajouter quand même ?`,
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Ajouter quand même",
              style: "destructive",
              onPress: async () => {
                await addProjectionToSchedule(projection.id);
                setSelectedProjections((prev) => [...prev, projection.id]);
              },
            },
          ],
        );
      } else {
        await addProjectionToSchedule(projection.id);
        setSelectedProjections((prev) => [...prev, projection.id]);
      }
    }
  };

  const validateSchedule = () => {
    const selectedProjs = PROJECTIONS.filter((p) =>
      selectedProjections.includes(p.id),
    );
    const validation = validateFullSchedule(selectedProjs);

    if (validation.isValid) {
      Alert.alert(
        "✅ Programme valide",
        "Votre programme est faisable ! Aucun conflit détecté.",
        [{ text: "OK" }],
      );
    } else {
      const conflictMessages = validation.conflicts
        .map(
          (c) =>
            `• ${c.conflictType === "time" ? "Conflit horaire" : "Temps de trajet"}: ${c.message}`,
        )
        .join("\n\n");

      Alert.alert("⚠️ Conflits détectés", conflictMessages, [{ text: "OK" }]);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const getProjectionsByFilm = (filmId: string) => {
    return PROJECTIONS.filter((p) => p.filmId === filmId);
  };

  const totalHours = Math.round(
    selectedProjections.reduce((total, id) => {
      const proj = PROJECTIONS.find((p) => p.id === id);
      const film = proj ? getFilmById(proj.filmId) : null;
      return total + (film?.duration || 0);
    }, 0) / 60,
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#3B82F6", "#2563EB", "#1D4ED8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`Mon Programme. ${selectedProjections.length} séances ajoutées, ${totalHours} heures de films, ${FILMS.length} films disponibles`}
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
              name="list.bullet.clipboard"
              size={32}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.headerTitle}>Mon Programme</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Planifiez votre festival
            </ThemedText>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow} accessibilityElementsHidden={true}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {selectedProjections.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Séances</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{totalHours}h</ThemedText>
            <ThemedText style={styles.statLabel}>De films</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{FILMS.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Films</ThemedText>
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
        {/* Validate Button */}
        {selectedProjections.length > 0 && (
          <TouchableOpacity
            style={styles.validateButton}
            onPress={validateSchedule}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Valider mon programme"
            accessibilityHint="Vérifie les conflits horaires et les temps de trajet entre vos séances"
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.validateGradient}
            >
              <IconSymbol
                name="checkmark.shield.fill"
                size={22}
                color="#FFFFFF"
              />
              <ThemedText style={styles.validateText}>
                Valider mon programme
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Info Card */}
        <View
          style={[styles.infoCard]}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Conseil: Sélectionnez vos projections. Les conflits horaires et temps de trajet sont vérifiés automatiquement."
        >
          <ThemedText style={[styles.infoText, { color: "#FFFFFF" }]}>
            Sélectionnez vos projections. Les conflits horaires et temps de
            trajet sont vérifiés automatiquement.
          </ThemedText>
        </View>

        {/* Films List */}
        <View style={styles.filmsSection}>
          {FILMS.map((film, filmIndex) => {
            const filmProjections = getProjectionsByFilm(film.id);
            const isExpanded = expandedFilm === film.id;
            const selectedCount = filmProjections.filter((p) =>
              selectedProjections.includes(p.id),
            ).length;

            return (
              <AnimatedListItem
                key={film.id}
                index={filmIndex}
                staggerDelay={60}
              >
                <View
                  style={[
                    styles.filmCard,
                    { backgroundColor: colors.card },
                    selectedCount > 0 && styles.filmCardSelected,
                    Shadows.card(colorScheme ?? "light"),
                  ]}
                >
                  <View
                    style={[
                      styles.filmAccentBar,
                      {
                        backgroundColor:
                          GENRE_COLORS[filmIndex % GENRE_COLORS.length],
                      },
                    ]}
                  />

                  <TouchableOpacity
                    onPress={() => setExpandedFilm(isExpanded ? null : film.id)}
                    style={styles.filmHeader}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`${film.title}, réalisé par ${film.director}, ${film.duration} minutes${selectedCount > 0 ? `, ${selectedCount} séance${selectedCount > 1 ? "s" : ""} sélectionnée${selectedCount > 1 ? "s" : ""}` : ""}`}
                    accessibilityHint={
                      isExpanded
                        ? "Appuyer pour masquer les séances"
                        : "Appuyer pour afficher les séances disponibles"
                    }
                    accessibilityState={{ expanded: isExpanded }}
                  >
                    <View style={styles.filmInfo}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.filmTitle}
                        numberOfLines={1}
                      >
                        {film.title}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.filmMeta,
                          { color: colors.textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {film.director} • {film.duration} min
                      </ThemedText>

                      {selectedCount > 0 ? (
                        <View
                          style={[
                            styles.selectedBadge,
                            { backgroundColor: colors.success + "18" },
                          ]}
                        >
                          <IconSymbol
                            name="checkmark.circle.fill"
                            size={12}
                            color={colors.success}
                          />
                          <ThemedText
                            style={[
                              styles.selectedBadgeText,
                              { color: colors.success },
                            ]}
                          >
                            {selectedCount} séance{selectedCount > 1 ? "s" : ""}
                          </ThemedText>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.selectedBadge,
                            { backgroundColor: colors.backgroundSecondary },
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.selectedBadgeText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {filmProjections.length} disponible
                            {filmProjections.length > 1 ? "s" : ""}
                          </ThemedText>
                        </View>
                      )}
                    </View>

                    <View
                      style={[
                        styles.expandButton,
                        isExpanded && { backgroundColor: colors.tint + "15" },
                      ]}
                    >
                      <IconSymbol
                        name={isExpanded ? "chevron.up" : "chevron.down"}
                        size={16}
                        color={isExpanded ? colors.tint : colors.icon}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Projections */}
                  {isExpanded && (
                    <View style={styles.projectionsContainer}>
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.cardBorder },
                        ]}
                      />
                      {filmProjections.map((projection) => {
                        const isSelected = selectedProjections.includes(
                          projection.id,
                        );

                        return (
                          <TouchableOpacity
                            key={projection.id}
                            style={[
                              styles.projectionItem,
                              { borderColor: colors.cardBorder },
                              isSelected && {
                                backgroundColor: colors.tint + "10",
                                borderColor: colors.tint,
                              },
                            ]}
                            onPress={() => handleToggleProjection(projection)}
                            activeOpacity={0.7}
                            accessibilityRole="checkbox"
                            accessibilityLabel={`${formatDate(projection.date)}, ${projection.startTime} à ${projection.endTime}, ${projection.venue.name}`}
                            accessibilityHint={
                              isSelected
                                ? "Appuyer pour retirer du programme"
                                : "Appuyer pour ajouter au programme"
                            }
                            accessibilityState={{ checked: isSelected }}
                          >
                            <View style={styles.projectionInfo}>
                              <View style={styles.projectionRow}>
                                <IconSymbol
                                  name="calendar"
                                  size={15}
                                  color={colors.icon}
                                />
                                <ThemedText style={styles.projectionText}>
                                  {formatDate(projection.date)}
                                </ThemedText>
                              </View>
                              <View style={styles.projectionRow}>
                                <IconSymbol
                                  name="clock.fill"
                                  size={15}
                                  color={colors.icon}
                                />
                                <ThemedText
                                  style={[
                                    styles.projectionText,
                                    { fontWeight: "600" },
                                  ]}
                                >
                                  {projection.startTime} - {projection.endTime}
                                </ThemedText>
                              </View>
                              <View style={styles.projectionRow}>
                                <IconSymbol
                                  name="mappin.circle.fill"
                                  size={15}
                                  color={colors.icon}
                                />
                                <ThemedText
                                  style={[
                                    styles.projectionText,
                                    { color: colors.textSecondary },
                                  ]}
                                >
                                  {projection.venue.name}
                                </ThemedText>
                              </View>
                            </View>

                            <View
                              style={[
                                styles.checkCircle,
                                isSelected && { backgroundColor: colors.tint },
                              ]}
                            >
                              {isSelected && (
                                <IconSymbol
                                  name="checkmark"
                                  size={16}
                                  color="#FFFFFF"
                                />
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              </AnimatedListItem>
            );
          })}
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
    marginBottom: Spacing.lg,
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
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  validateButton: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  validateGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  validateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 5,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  filmsSection: {
    gap: Spacing.xl,
  },
  filmCard: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  filmCardSelected: {
    borderWidth: 0,
  },
  filmAccentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  filmHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  filmInfo: {
    flex: 1,
    gap: 3,
  },
  filmTitle: {
    fontSize: 18,
    letterSpacing: 0.2,
  },
  filmMeta: {
    fontSize: 13,
  },
  selectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  expandButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  projectionsContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.sm,
  },
  projectionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing.md,
  },
  projectionInfo: {
    flex: 1,
    gap: 6,
  },
  projectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  projectionText: {
    fontSize: 13,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
});
