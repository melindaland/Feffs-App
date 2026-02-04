import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Service de gestion des notifications push
 */

// Configuration du comportement des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Demande la permission d'envoyer des notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permission de notification refusée");
      return false;
    }

    // Configuration pour Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la demande de permission:", error);
    return false;
  }
};

/**
 * Envoie une notification locale immédiate
 */
export const sendImmediateNotification = async (
  title: string,
  body: string,
  data?: any,
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log("Notifications non autorisées");
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Envoi immédiat
    });

    return notificationId;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification:", error);
    return null;
  }
};

/**
 * Planifie une notification pour une date/heure spécifique
 */
export const scheduleNotification = async (
  title: string,
  body: string,
  date: Date,
  data?: any,
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log("Notifications non autorisées");
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: {
        type: "date" as any,
        date,
      } as any,
    });

    return notificationId;
  } catch (error) {
    console.error("Erreur lors de la planification de la notification:", error);
    return null;
  }
};

/**
 * Planifie une notification pour une projection
 * Envoie des rappels 1h et 30min avant
 */
export const scheduleProjectionNotifications = async (
  filmTitle: string,
  projectionDate: Date,
  venue: string,
  projectionId: string,
): Promise<string[]> => {
  const notificationIds: string[] = [];

  try {
    // Notification 1h avant
    const oneHourBefore = new Date(projectionDate.getTime() - 60 * 60 * 1000);
    if (oneHourBefore > new Date()) {
      const id1h = await scheduleNotification(
        "🎬 Projection dans 1h",
        `${filmTitle} à ${venue}`,
        oneHourBefore,
        { type: "projection", projectionId, delay: "1h" },
      );
      if (id1h) notificationIds.push(id1h);
    }

    // Notification 30min avant
    const thirtyMinBefore = new Date(projectionDate.getTime() - 30 * 60 * 1000);
    if (thirtyMinBefore > new Date()) {
      const id30m = await scheduleNotification(
        "🎬 Projection dans 30 minutes",
        `${filmTitle} à ${venue}`,
        thirtyMinBefore,
        { type: "projection", projectionId, delay: "30m" },
      );
      if (id30m) notificationIds.push(id30m);
    }

    return notificationIds;
  } catch (error) {
    console.error("Erreur lors de la planification des notifications:", error);
    return notificationIds;
  }
};

/**
 * Annule une notification planifiée
 */
export const cancelNotification = async (
  notificationId: string,
): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Erreur lors de l'annulation de la notification:", error);
  }
};

/**
 * Annule toutes les notifications planifiées
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Erreur lors de l'annulation des notifications:", error);
  }
};

/**
 * Récupère toutes les notifications planifiées
 */
export const getAllScheduledNotifications = async (): Promise<
  Notifications.NotificationRequest[]
> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return [];
  }
};

/**
 * Notifie un changement de planning
 */
export const notifyScheduleChange = async (
  title: string,
  message: string,
): Promise<void> => {
  await sendImmediateNotification(`⚠️ ${title}`, message, {
    type: "schedule_change",
  });
};

/**
 * Notifie un nouvel événement
 */
export const notifyNewEvent = async (
  eventTitle: string,
  eventDate: string,
): Promise<void> => {
  await sendImmediateNotification(
    "🎉 Nouvel événement",
    `${eventTitle} - ${eventDate}`,
    { type: "new_event" },
  );
};
