import { LinearGradient } from "expo-linear-gradient";
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
import { AnimatedListItem } from "@/components/ui/animated";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { VideoPlayer } from "@/components/video-player";
import {
  BorderRadius,
  Colors,
  Festival,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { FILMS } from "@/data/films";
import { useColorScheme } from "@/hooks/use-color-scheme";

const GENRE_COLORS = [
  "#8B5CF6",
  "#F97316",
  "#EC4899",
  "#10B981",
  "#3B82F6",
  "#EF4444",
];

function getGenreColor(index: number): string {
  return GENRE_COLORS[index % GENRE_COLORS.length];
}

export default function FilmsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [expandedFilm, setExpandedFilm] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={colors.gradientPrimary as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`Les Films. ${FILMS.length} films dans la sélection officielle ${Festival.year}`}
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
            <IconSymbol name="film.stack" size={32} color="#FFFFFF" />
          </View>
          <View>
            <ThemedText style={styles.headerTitle}>Les Films</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Sélection officielle {Festival.year}
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
        {/* Intro Card */}
        <View
          style={[styles.introCard]}
          accessible={true}
          accessibilityRole="text"
        >
          <ThemedText style={[styles.introText, { color: "#FFFFFF" }]}>
            Découvrez {FILMS.length} films fantastiques sélectionnés pour cette
            édition. Appuyez sur un film pour voir sa bande-annonce et plus de
            détails.
          </ThemedText>
        </View>

        {/* Films List */}
        <View style={styles.filmsSection}>
          {FILMS.map((film, filmIndex) => {
            const isExpanded = expandedFilm === film.id;
            const hasTrailer = !!film.trailerUrl;

            return (
              <AnimatedListItem
                key={film.id}
                index={filmIndex}
                staggerDelay={80}
              >
                <View
                  style={[
                    styles.filmCard,
                    { backgroundColor: colors.card },
                    Shadows.card(colorScheme ?? "light"),
                  ]}
                >
                  <View
                    style={[
                      styles.filmAccentBar,
                      { backgroundColor: getGenreColor(filmIndex) },
                    ]}
                  />

                  {/* Film Header */}
                  <TouchableOpacity
                    onPress={() => setExpandedFilm(isExpanded ? null : film.id)}
                    style={styles.filmHeader}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`${film.title}, réalisé par ${film.director}, ${film.year}, ${film.duration} minutes, genres: ${film.genre.slice(0, 3).join(", ")}${hasTrailer ? ", bande-annonce disponible" : ""}`}
                    accessibilityHint={
                      isExpanded
                        ? "Appuyer pour masquer les détails"
                        : "Appuyer pour voir la bande-annonce et le synopsis"
                    }
                    accessibilityState={{ expanded: isExpanded }}
                  >
                    <View style={styles.filmInfo}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.filmTitle}
                      >
                        {film.title}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.filmMeta,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {film.director} • {film.year} • {film.duration} min
                      </ThemedText>
                      <View style={styles.genreBadges}>
                        {film.genre.slice(0, 2).map((g, i) => (
                          <View
                            key={g}
                            style={[
                              styles.genreBadge,
                              { backgroundColor: colors.icon + "15" },
                            ]}
                          >
                            <ThemedText
                              style={[styles.genreText, { color: colors.icon }]}
                            >
                              {g}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    </View>

                    <LinearGradient
                      colors={[
                        getGenreColor(filmIndex),
                        getGenreColor(filmIndex + 1),
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.filmNumberBadge}
                    >
                      <ThemedText style={styles.filmNumber}>
                        {String(filmIndex + 1).padStart(2, "0")}
                      </ThemedText>
                    </LinearGradient>

                    <View style={styles.expandArea}>
                      <View
                        style={[
                          styles.chevronCircle,
                          isExpanded && { backgroundColor: colors.tint + "15" },
                        ]}
                      >
                        <IconSymbol
                          name={isExpanded ? "chevron.up" : "chevron.down"}
                          size={16}
                          color={isExpanded ? colors.tint : colors.icon}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      {/* Trailer */}
                      {hasTrailer && film.trailerUrl && (
                        <View style={styles.trailerSection}>
                          <View style={styles.sectionHeader}>
                            <ThemedText
                              type="defaultSemiBold"
                              style={styles.sectionTitle}
                            >
                              Bande-annonce
                            </ThemedText>
                          </View>
                          <View style={styles.videoWrapper}>
                            <VideoPlayer uri={film.trailerUrl} />
                          </View>
                        </View>
                      )}

                      {/* Synopsis */}
                      <View style={styles.synopsisSection}>
                        <View
                          style={styles.sectionHeader}
                          accessibilityElementsHidden={true}
                        >
                          <ThemedText
                            type="defaultSemiBold"
                            style={styles.sectionTitle}
                          >
                            Synopsis
                          </ThemedText>
                        </View>
                        <ThemedText
                          style={[
                            styles.synopsis,
                            { color: colors.textSecondary },
                          ]}
                          accessibilityRole="text"
                          accessibilityLabel={`Synopsis: ${film.synopsis}`}
                        >
                          {film.synopsis}
                        </ThemedText>
                      </View>

                      {/* Info */}
                      <View
                        style={[
                          styles.infoCard,
                          { backgroundColor: colors.backgroundSecondary },
                        ]}
                      >
                        <View style={styles.infoRow}>
                          <IconSymbol
                            name="flag.fill"
                            size={14}
                            color={colors.icon}
                          />
                          <ThemedText
                            style={[
                              styles.infoLabel,
                              { color: colors.textSecondary },
                            ]}
                          >
                            Pays
                          </ThemedText>
                          <ThemedText style={styles.infoValue}>
                            {film.country}
                          </ThemedText>
                        </View>
                        {film.originalTitle !== film.title && (
                          <View style={styles.infoRow}>
                            <IconSymbol
                              name="character.book.closed.fill"
                              size={14}
                              color={colors.icon}
                            />
                            <ThemedText
                              style={[
                                styles.infoLabel,
                                { color: colors.textSecondary },
                              ]}
                            >
                              Titre original
                            </ThemedText>
                            <ThemedText style={styles.infoValue}>
                              {film.originalTitle}
                            </ThemedText>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </AnimatedListItem>
            );
          })}
        </View>

        {/* Bottom Spacing */}
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
  introCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
  },
  filmsSection: {
    gap: Spacing.xl,
  },
  filmCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
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
  filmNumberBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomLeftRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  filmNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  filmInfo: {
    flex: 1,
    gap: 6,
  },
  filmTitle: {
    fontSize: 18,
    letterSpacing: 0.2,
  },
  filmMeta: {
    fontSize: 13,
  },
  genreBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  genreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  genreText: {
    fontSize: 11,
    fontWeight: "600",
  },
  expandArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  chevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  expandedContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  trailerSection: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sectionTitle: {
    marginTop: 5,
    fontSize: 15,
  },
  videoWrapper: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  synopsisSection: {
    gap: Spacing.sm,
  },
  synopsis: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  infoLabel: {
    fontSize: 13,
    width: 90,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
});
