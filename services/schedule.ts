import { Projection, Venue } from "@/types";

/**
 * Interface pour les résultats de conflit
 */
export interface ConflictResult {
  hasConflict: boolean;
  conflictType?: "time" | "travel";
  conflictingProjection?: Projection;
  message?: string;
  travelTimeNeeded?: number; // en minutes
}

/**
 * Calcule la distance approximative entre deux lieux (formule haversine simplifiée)
 */
const calculateDistance = (venue1: Venue, venue2: Venue): number => {
  if (!venue1.coordinates || !venue2.coordinates) {
    return 0;
  }

  const { latitude: lat1, longitude: lon1 } = venue1.coordinates;
  const { latitude: lat2, longitude: lon2 } = venue2.coordinates;

  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Estime le temps de trajet en minutes entre deux lieux
 * Vitesse moyenne en ville : 4 km/h à pied
 */
const estimateTravelTime = (venue1: Venue, venue2: Venue): number => {
  const distance = calculateDistance(venue1, venue2);
  const walkingSpeed = 4; // km/h
  const timeInHours = distance / walkingSpeed;
  const timeInMinutes = Math.ceil(timeInHours * 60);

  // Ajouter un buffer de 5 minutes pour être sûr
  return timeInMinutes + 5;
};

/**
 * Convertit une heure au format "HH:mm" en minutes depuis minuit
 */
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Vérifie si deux projections ont un conflit horaire direct
 */
const hasTimeOverlap = (proj1: Projection, proj2: Projection): boolean => {
  // Vérifier si c'est le même jour
  if (
    proj1.date.getDate() !== proj2.date.getDate() ||
    proj1.date.getMonth() !== proj2.date.getMonth() ||
    proj1.date.getFullYear() !== proj2.date.getFullYear()
  ) {
    return false;
  }

  const start1 = timeToMinutes(proj1.startTime);
  const end1 = timeToMinutes(proj1.endTime);
  const start2 = timeToMinutes(proj2.startTime);
  const end2 = timeToMinutes(proj2.endTime);

  // Vérifier si les périodes se chevauchent
  return start1 < end2 && start2 < end1;
};

/**
 * Vérifie si le temps de trajet entre deux projections est suffisant
 */
const hasTravelConflict = (
  proj1: Projection,
  proj2: Projection,
): ConflictResult => {
  // Vérifier si c'est le même jour
  if (
    proj1.date.getDate() !== proj2.date.getDate() ||
    proj1.date.getMonth() !== proj2.date.getMonth() ||
    proj1.date.getFullYear() !== proj2.date.getFullYear()
  ) {
    return { hasConflict: false };
  }

  const end1 = timeToMinutes(proj1.endTime);
  const start2 = timeToMinutes(proj2.startTime);

  // Projection 2 est après projection 1
  if (start2 > end1) {
    const availableTime = start2 - end1;
    const travelTimeNeeded = estimateTravelTime(proj1.venue, proj2.venue);

    if (availableTime < travelTimeNeeded) {
      return {
        hasConflict: true,
        conflictType: "travel",
        conflictingProjection: proj2,
        travelTimeNeeded,
        message: `Temps de trajet insuffisant : ${travelTimeNeeded} min nécessaires, seulement ${availableTime} min disponibles entre ${proj1.venue.name} et ${proj2.venue.name}`,
      };
    }
  }

  // Projection 1 est après projection 2
  const end2 = timeToMinutes(proj2.endTime);
  const start1 = timeToMinutes(proj1.startTime);

  if (start1 > end2) {
    const availableTime = start1 - end2;
    const travelTimeNeeded = estimateTravelTime(proj2.venue, proj1.venue);

    if (availableTime < travelTimeNeeded) {
      return {
        hasConflict: true,
        conflictType: "travel",
        conflictingProjection: proj1,
        travelTimeNeeded,
        message: `Temps de trajet insuffisant : ${travelTimeNeeded} min nécessaires, seulement ${availableTime} min disponibles entre ${proj2.venue.name} et ${proj1.venue.name}`,
      };
    }
  }

  return { hasConflict: false };
};

/**
 * Vérifie si une nouvelle projection crée un conflit avec le programme existant
 */
export const checkConflicts = (
  newProjection: Projection,
  existingProjections: Projection[],
): ConflictResult[] => {
  const conflicts: ConflictResult[] = [];

  for (const existingProj of existingProjections) {
    // Vérifier conflit horaire direct
    if (hasTimeOverlap(newProjection, existingProj)) {
      conflicts.push({
        hasConflict: true,
        conflictType: "time",
        conflictingProjection: existingProj,
        message: `Conflit horaire avec une projection de ${newProjection.startTime} à ${newProjection.endTime}`,
      });
      continue;
    }

    // Vérifier conflit de temps de trajet
    const travelConflict = hasTravelConflict(newProjection, existingProj);
    if (travelConflict.hasConflict) {
      conflicts.push(travelConflict);
    }
  }

  return conflicts;
};

/**
 * Vérifie si un programme complet est faisable
 */
export const validateFullSchedule = (
  projections: Projection[],
): { isValid: boolean; conflicts: ConflictResult[] } => {
  const allConflicts: ConflictResult[] = [];

  // Trier les projections par date et heure
  const sortedProjections = [...projections].sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();
    if (dateCompare !== 0) return dateCompare;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  // Vérifier chaque paire de projections
  for (let i = 0; i < sortedProjections.length; i++) {
    for (let j = i + 1; j < sortedProjections.length; j++) {
      const proj1 = sortedProjections[i];
      const proj2 = sortedProjections[j];

      // Vérifier conflit horaire
      if (hasTimeOverlap(proj1, proj2)) {
        allConflicts.push({
          hasConflict: true,
          conflictType: "time",
          conflictingProjection: proj2,
          message: `Conflit horaire entre deux projections`,
        });
      } else {
        // Vérifier conflit de trajet
        const travelConflict = hasTravelConflict(proj1, proj2);
        if (travelConflict.hasConflict) {
          allConflicts.push(travelConflict);
        }
      }
    }
  }

  return {
    isValid: allConflicts.length === 0,
    conflicts: allConflicts,
  };
};

/**
 * Obtient des suggestions pour résoudre les conflits
 */
export const getSuggestedAlternatives = (
  projection: Projection,
  allProjections: Projection[],
  conflictingProjectionId: string,
): Projection[] => {
  // Trouver d'autres projections du même film qui ne créent pas de conflit
  return allProjections.filter(
    (p) =>
      p.filmId === projection.filmId &&
      p.id !== projection.id &&
      p.id !== conflictingProjectionId,
  );
};
