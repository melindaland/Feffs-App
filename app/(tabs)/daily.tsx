import { ExportCalendarButton } from "@/components/export-calendar-button";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, Shadows, Spacing } from "@/constants/theme";
import { getEventsByDate } from "@/data/events";
import { PROJECTIONS, getFilmById } from "@/data/films";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getUserSchedule } from "@/services/storage";
import { Event, Projection } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const EVENT_TYPE_CONFIG: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  conference: { icon: "mic.fill", color: "#8B5CF6", label: "Conférence" },
  atelier: { icon: "hammer.fill", color: "#F97316", label: "Atelier" },
  masterclass: {
    icon: "graduationcap.fill",
    color: "#EC4899",
    label: "Masterclass",
  },
  autre: { icon: "star.fill", color: "#F59E0B", label: "Événement" },
};

export default function DailyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userSchedule, setUserSchedule] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserSchedule();
  }, []);

  const loadUserSchedule = async () => {
    try {
      const schedule = await getUserSchedule();
      setUserSchedule(schedule);
    } catch (error) {
      console.error("Erreur chargement programme:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserSchedule();
    setRefreshing(false);
  };

  // Générer les dates disponibles (3 jours)
  const availableDates = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  // Projections du jour
  const dayProjections = PROJECTIONS.filter((p) => {
    const projDate = new Date(p.date);
    return (
      projDate.getDate() === selectedDate.getDate() &&
      projDate.getMonth() === selectedDate.getMonth() &&
      projDate.getFullYear() === selectedDate.getFullYear()
    );
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Événements du jour
  const dayEvents = getEventsByDate(selectedDate).sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  // Projections sélectionnées par l'utilisateur pour ce jour
  const userDayProjections = dayProjections.filter((p) =>
    userSchedule.includes(p.id),
  );

  const formatDateShort = (date: Date): string => {
    const day = date.toLocaleDateString("fr-FR", { weekday: "short" });
    return `${day.charAt(0).toUpperCase() + day.slice(1)}\n${date.getDate()}`;
  };

  const formatDateFull = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderProjectionCard = (
    projection: Projection,
    isInSchedule: boolean,
    index: number,
  ) => {
    const film = getFilmById(projection.filmId);
    if (!film) return null;

    return (
      <View
        key={projection.id}
        style={[
          styles.card,
          { backgroundColor: colors.card },
          Shadows.card(colorScheme ?? "light"),
        ]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`${film.title}, projection à ${projection.startTime}, ${projection.venue.name}${isInSchedule ? ", dans votre programme" : ""}`}
      >
        <View style={styles.cardContent}>
          <View style={styles.filmInfo}>
            <View style={styles.filmDetails}>
              <View style={styles.titleRow}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.filmTitle, { marginBottom: 0, flex: 1 }]}
                  numberOfLines={1}
                >
                  {film.title}
                </ThemedText>
                {isInSchedule && (
                  <View
                    style={[
                      styles.myProgramBadge,
                      { backgroundColor: colors.success },
                    ]}
                  >
                    <IconSymbol
                      name="checkmark.circle.fill"
                      size={10}
                      color="#fff"
                    />
                    <ThemedText style={styles.myProgramText}>
                      Sélectionné
                    </ThemedText>
                  </View>
                )}
              </View>
              <ThemedText
                style={[styles.filmMeta, { color: colors.textSecondary }]}
              >
                {film.director} • {film.duration} min
              </ThemedText>
            </View>
          </View>

          <View style={styles.venueRow}>
            <View
              style={[
                styles.venueIcon,
                { backgroundColor: colors.icon + "20" },
              ]}
            >
              <IconSymbol name="location.fill" size={12} color={colors.icon} />
            </View>
            <ThemedText
              style={[styles.venueText, { color: colors.textSecondary }]}
            >
              {projection.venue.name}
            </ThemedText>
            <ThemedText
              style={[styles.endTime, { color: colors.textSecondary }]}
            >
              → {projection.endTime}
            </ThemedText>
          </View>

          {isInSchedule && (
            <View style={styles.cardActions}>
              <ExportCalendarButton
                projection={projection}
                filmTitle={film.title}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEventCard = (event: Event) => {
    const config = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.autre;

    return (
      <View
        key={event.id}
        style={[styles.card, { backgroundColor: colors.card }]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`${event.title}, ${event.startTime}${event.isFree ? ", gratuit" : ""}, ${event.venue.name}`}
      >
        <View style={[styles.eventAccent, { backgroundColor: config.color }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.timeBadge,
                { backgroundColor: config.color + "15" },
              ]}
            >
              <IconSymbol name="clock.fill" size={12} color={config.color} />
              <ThemedText style={[styles.timeText, { color: config.color }]}>
                {event.startTime}
              </ThemedText>
            </View>
            {event.isFree && (
              <View style={styles.freeTag}>
                <ThemedText style={styles.freeText}>Gratuit</ThemedText>
              </View>
            )}
          </View>

          <ThemedText type="defaultSemiBold" style={styles.eventTitle}>
            {event.title}
          </ThemedText>

          <View style={styles.venueRow}>
            <View
              style={[
                styles.venueIcon,
                { backgroundColor: colors.icon + "20" },
              ]}
            >
              <IconSymbol name="location.fill" size={12} color={colors.icon} />
            </View>
            <ThemedText
              style={[styles.venueText, { color: colors.textSecondary }]}
            >
              {event.venue.name}
            </ThemedText>
          </View>

          <View style={styles.expandedContent}>
            <ThemedText
              style={[styles.description, { color: colors.textSecondary }]}
            >
              {event.description}
            </ThemedText>
            {event.speakers && event.speakers.length > 0 && (
              <View style={styles.speakersRow}>
                <IconSymbol
                  name="person.2.fill"
                  size={14}
                  color={colors.icon}
                />
                <ThemedText
                  style={[styles.speakersText, { color: colors.textSecondary }]}
                >
                  {event.speakers.join(", ")}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header avec gradient */}
      <LinearGradient
        colors={["#F97316", "#EA580C", "#C2410C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`La Quotidienne, ${formatDateFull(selectedDate)}. ${dayProjections.length} projections et ${dayEvents.length} événements`}
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
          <View style={styles.headerTop}>
            <View style={styles.headerIcon} accessibilityElementsHidden={true}>
              <IconSymbol name="sun.max.fill" size={32} color="#fff" />
            </View>
            <View style={styles.headerText}>
              <ThemedText style={styles.headerTitle}>La Quotidienne</ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                {formatDateFull(selectedDate)}
              </ThemedText>
            </View>
          </View>

          {/* Date Selector */}
          <View style={styles.dateSelector}>
            {availableDates.map((date, index) => {
              const isSelected =
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth();
              const today = isToday(date);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateButton,
                    isSelected && styles.dateButtonSelected,
                  ]}
                  onPress={() => setSelectedDate(date)}
                  activeOpacity={1}
                  accessibilityRole="button"
                  accessibilityLabel={`${formatDateFull(date)}${today ? ", aujourd'hui" : ""}`}
                  accessibilityHint="Appuyer pour voir le programme de ce jour"
                  accessibilityState={{ selected: isSelected }}
                >
                  <ThemedText
                    style={[
                      styles.dateButtonText,
                      isSelected && styles.dateButtonTextSelected,
                    ]}
                  >
                    {formatDateShort(date)}
                  </ThemedText>
                  {today && (
                    <View
                      style={[
                        styles.todayDot,
                        isSelected && styles.todayDotSelected,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        overScrollMode="never"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
          />
        }
      >
        {/* Stats rapides */}
        <View
          style={styles.statsRow}
          accessible={true}
          accessibilityRole="summary"
          accessibilityLabel={`${dayProjections.length} projections, ${dayEvents.length} événements, ${userDayProjections.length} ajoutées`}
        >
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {dayProjections.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Projections</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {dayEvents.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Événements</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {userDayProjections.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Ajoutées</ThemedText>
          </View>
        </View>

        {/* Mon Programme */}
        {userDayProjections.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Mon Programme
              </ThemedText>
            </View>
            {userDayProjections.map((proj, idx) =>
              renderProjectionCard(proj, true, idx),
            )}
          </View>
        )}

        {/* Événements du jour */}
        {dayEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Activités & Rencontres
              </ThemedText>
            </View>
            {dayEvents.map(renderEventCard)}
          </View>
        )}
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
  headerContent: {},
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
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
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    textTransform: "capitalize",
  },
  dateSelector: {
    flexDirection: "row",
    gap: 10,
  },
  dateButton: {
    flex: 1,
    height: 70,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  dateButtonSelected: {
    backgroundColor: "#fff",
  },
  dateButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 18,
  },
  dateButtonTextSelected: {
    color: "#8B5CF6",
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F97316",
    marginTop: 4,
  },
  todayDotSelected: {
    backgroundColor: "#F97316",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    backgroundColor: "#10B981",
    ...Shadows.md,
  },
  statNumber: {
    fontSize: 25,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    flex: 1,
    marginTop: 10,
  },
  card: {
    borderRadius: BorderRadius.xl,
    marginBottom: 12,
    overflow: "hidden",
  },
  eventAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.xl,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  myProgramBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  myProgramText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  filmInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  filmDetails: {
    flex: 1,
  },
  filmTitle: {
    fontSize: 16,
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  filmMeta: {
    fontSize: 13,
  },
  eventTitle: {
    fontSize: 17,
    marginBottom: 10,
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  venueIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  venueText: {
    fontSize: 13,
    flex: 1,
  },
  endTime: {
    fontSize: 12,
  },
  freeTag: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  freeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.15)",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  speakersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  speakersText: {
    fontSize: 13,
    fontStyle: "italic",
    flex: 1,
  },
  cardActions: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.15)",
  },
});
