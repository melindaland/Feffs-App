import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  USER_SCHEDULE: "@feffs_user_schedule",
  USER_PASS: "@feffs_user_pass",
  PREFERENCES: "@feffs_preferences",
  COMPLETED_SURVEYS: "@feffs_completed_surveys",
};

/**
 * Service de stockage local pour persister les données
 */

/**
 * Sauvegarde le programme personnalisé de l'utilisateur
 */
export const saveUserSchedule = async (
  projectionIds: string[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      KEYS.USER_SCHEDULE,
      JSON.stringify(projectionIds),
    );
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du programme:", error);
    throw error;
  }
};

/**
 * Récupère le programme personnalisé de l'utilisateur
 */
export const getUserSchedule = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_SCHEDULE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération du programme:", error);
    return [];
  }
};

/**
 * Ajoute une projection au programme
 */
export const addProjectionToSchedule = async (
  projectionId: string,
): Promise<void> => {
  try {
    const schedule = await getUserSchedule();
    if (!schedule.includes(projectionId)) {
      schedule.push(projectionId);
      await saveUserSchedule(schedule);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la projection:", error);
    throw error;
  }
};

/**
 * Retire une projection du programme
 */
export const removeProjectionFromSchedule = async (
  projectionId: string,
): Promise<void> => {
  try {
    const schedule = await getUserSchedule();
    const updatedSchedule = schedule.filter((id) => id !== projectionId);
    await saveUserSchedule(updatedSchedule);
  } catch (error) {
    console.error("Erreur lors de la suppression de la projection:", error);
    throw error;
  }
};

/**
 * Vérifie si une projection est dans le programme
 */
export const isProjectionInSchedule = async (
  projectionId: string,
): Promise<boolean> => {
  try {
    const schedule = await getUserSchedule();
    return schedule.includes(projectionId);
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    return false;
  }
};

/**
 * Efface tout le programme
 */
export const clearSchedule = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.USER_SCHEDULE);
  } catch (error) {
    console.error("Erreur lors de la suppression du programme:", error);
    throw error;
  }
};

/**
 * Sauvegarde le pass utilisateur
 */
export const saveUserPass = async (pass: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PASS, JSON.stringify(pass));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du pass:", error);
    throw error;
  }
};

/**
 * Récupère le pass utilisateur
 */
export const getUserPass = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PASS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du pass:", error);
    return null;
  }
};

/**
 * Supprime le pass utilisateur
 */
export const clearUserPass = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.USER_PASS);
  } catch (error) {
    console.error("Erreur lors de la suppression du pass:", error);
    throw error;
  }
};

/**
 * Sauvegarde une enquête complétée
 */
export const saveCompletedSurvey = async (survey: any): Promise<void> => {
  try {
    const surveys = await getCompletedSurveys();
    surveys.push(survey);
    await AsyncStorage.setItem(KEYS.COMPLETED_SURVEYS, JSON.stringify(surveys));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'enquête:", error);
    throw error;
  }
};

/**
 * Récupère toutes les enquêtes complétées
 */
export const getCompletedSurveys = async (): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.COMPLETED_SURVEYS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des enquêtes:", error);
    return [];
  }
};

/**
 * Vérifie si une enquête a déjà été complétée
 */
export const hasSurveyBeenCompleted = async (
  surveyId: string,
): Promise<boolean> => {
  try {
    const surveys = await getCompletedSurveys();
    return surveys.some((s) => s.surveyId === surveyId);
  } catch (error) {
    console.error("Erreur lors de la vérification de l'enquête:", error);
    return false;
  }
};
