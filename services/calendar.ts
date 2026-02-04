import { Event, Projection } from "@/types";
import * as Calendar from "expo-calendar";
import { Alert, Platform } from "react-native";

/**
 * Demande les permissions pour accéder au calendrier
 */
export const requestCalendarPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "L'accès au calendrier est nécessaire pour ajouter les événements à votre agenda.",
        [{ text: "OK" }],
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la demande de permission calendrier:", error);
    return false;
  }
};

/**
 * Récupère le calendrier par défaut ou en crée un pour l'application
 */
const getOrCreateCalendar = async (): Promise<string | null> => {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT,
    );

    // Chercher le calendrier FEFFS
    const feffsCalendar = calendars.find((cal) => cal.title === "FEFFS");
    if (feffsCalendar) {
      return feffsCalendar.id;
    }

    // Si pas de calendrier FEFFS, utiliser le calendrier par défaut
    const defaultCalendar = calendars.find(
      (cal) => cal.allowsModifications && cal.source.name !== "Birthdays",
    );

    if (defaultCalendar) {
      return defaultCalendar.id;
    }

    // Sur iOS, créer un nouveau calendrier
    if (Platform.OS === "ios") {
      const defaultCalendarSource = calendars.find(
        (cal) => cal.source.type === Calendar.SourceType.LOCAL,
      )?.source;

      if (defaultCalendarSource) {
        const newCalendarId = await Calendar.createCalendarAsync({
          title: "FEFFS",
          color: "#FF6B35",
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: defaultCalendarSource.id,
          source: defaultCalendarSource,
          name: "FEFFS",
          ownerAccount: "personal",
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        return newCalendarId;
      }
    }

    return null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération/création du calendrier:",
      error,
    );
    return null;
  }
};

/**
 * Convertit une date et heure au format ISO
 */
const createDateFromTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

/**
 * Exporte une projection vers le calendrier
 */
export const exportProjectionToCalendar = async (
  projection: Projection,
  filmTitle: string,
): Promise<boolean> => {
  try {
    // Vérifier les permissions
    const hasPermission = await requestCalendarPermission();
    if (!hasPermission) {
      return false;
    }

    // Récupérer le calendrier
    const calendarId = await getOrCreateCalendar();
    if (!calendarId) {
      Alert.alert("Erreur", "Impossible d'accéder au calendrier.");
      return false;
    }

    // Créer les dates de début et fin
    const startDate = createDateFromTime(projection.date, projection.startTime);
    const endDate = createDateFromTime(projection.date, projection.endTime);

    // Créer l'événement
    const eventId = await Calendar.createEventAsync(calendarId, {
      title: `🎬 ${filmTitle}`,
      startDate,
      endDate,
      location: `${projection.venue.name}, ${projection.venue.address}`,
      notes: `Projection au FEFFS\nLieu: ${projection.venue.name}\nID: ${projection.id}`,
      alarms: [
        { relativeOffset: -30 }, // 30 minutes avant
        { relativeOffset: -60 }, // 1 heure avant
      ],
    });

    if (eventId) {
      Alert.alert(
        "Succès",
        `La projection de "${filmTitle}" a été ajoutée à votre calendrier.`,
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erreur lors de l'export vers le calendrier:", error);
    Alert.alert(
      "Erreur",
      "Impossible d'ajouter l'événement au calendrier. Veuillez réessayer.",
    );
    return false;
  }
};

/**
 * Exporte un événement vers le calendrier
 */
export const exportEventToCalendar = async (event: Event): Promise<boolean> => {
  try {
    // Vérifier les permissions
    const hasPermission = await requestCalendarPermission();
    if (!hasPermission) {
      return false;
    }

    // Récupérer le calendrier
    const calendarId = await getOrCreateCalendar();
    if (!calendarId) {
      Alert.alert("Erreur", "Impossible d'accéder au calendrier.");
      return false;
    }

    // Créer les dates de début et fin
    const startDate = createDateFromTime(event.date, event.startTime);
    const endDate = createDateFromTime(event.date, event.endTime);

    // Icône selon le type
    const typeIcons: Record<string, string> = {
      conference: "🎤",
      atelier: "🛠️",
      masterclass: "🎓",
      autre: "📅",
    };

    const icon = typeIcons[event.type] || "📅";

    // Créer l'événement
    const eventId = await Calendar.createEventAsync(calendarId, {
      title: `${icon} ${event.title}`,
      startDate,
      endDate,
      location: `${event.venue.name}, ${event.venue.address}`,
      notes: `${event.description}\n\nÉvénement FEFFS\nType: ${event.type}\nID: ${event.id}`,
      alarms: [{ relativeOffset: -30 }], // 30 minutes avant
    });

    if (eventId) {
      Alert.alert(
        "Succès",
        `L'événement "${event.title}" a été ajouté à votre calendrier.`,
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erreur lors de l'export vers le calendrier:", error);
    Alert.alert(
      "Erreur",
      "Impossible d'ajouter l'événement au calendrier. Veuillez réessayer.",
    );
    return false;
  }
};

/**
 * Exporte plusieurs projections en une seule fois
 */
export const exportMultipleProjectionsToCalendar = async (
  projections: { projection: Projection; filmTitle: string }[],
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  // Vérifier les permissions une seule fois
  const hasPermission = await requestCalendarPermission();
  if (!hasPermission) {
    return { success: 0, failed: projections.length };
  }

  for (const { projection, filmTitle } of projections) {
    const result = await exportProjectionToCalendar(projection, filmTitle);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  if (success > 0) {
    Alert.alert(
      "Export terminé",
      `${success} projection(s) ajoutée(s) au calendrier.${
        failed > 0 ? `\n${failed} échec(s).` : ""
      }`,
    );
  }

  return { success, failed };
};
