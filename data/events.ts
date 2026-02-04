import { Event, Venue } from "@/types";

/**
 * Lieux des événements FEFFS 2026
 */
const VILLAGE_FANTASTIQUE: Venue = {
  id: "venue-village",
  name: "Village Fantastique",
  address: "Place Kléber, 67000 Strasbourg",
  coordinates: {
    latitude: 48.5833,
    longitude: 7.7458,
  },
  capacity: 200,
};

const BIBLIOTHEQUE: Venue = {
  id: "venue-biblio",
  name: "Bibliothèque Nationale Universitaire",
  address: "6 Place de la République, 67000 Strasbourg",
  coordinates: {
    latitude: 48.5852,
    longitude: 7.7527,
  },
  capacity: 150,
};

const CINEMA_STAR: Venue = {
  id: "venue-star",
  name: "Cinéma Star Saint-Exupéry",
  address: "17 Rue du 22 novembre, 67000 Strasbourg",
  coordinates: {
    latitude: 48.5734053,
    longitude: 7.7521113,
  },
  capacity: 100,
};

/**
 * Génère des événements pour les jours du festival
 */
const generateEvents = (): Event[] => {
  const today = new Date();
  const events: Event[] = [];

  // Jour 1 - Événements
  const day1 = new Date(today);
  day1.setHours(0, 0, 0, 0);

  events.push({
    id: "event-1",
    title: "Masterclass Robert Eggers",
    description:
      "Le réalisateur de Nosferatu revient sur son processus créatif et sa vision du cinéma fantastique. Une occasion unique de découvrir les coulisses de son dernier chef-d'œuvre.",
    type: "masterclass",
    date: day1,
    startTime: "14:00",
    endTime: "16:00",
    venue: BIBLIOTHEQUE,
    speakers: ["Robert Eggers"],
    isFree: false,
  });

  events.push({
    id: "event-2",
    title: "Atelier Maquillage Effets Spéciaux",
    description:
      "Apprenez les techniques de base du maquillage d'effets spéciaux avec des professionnels du cinéma. Matériel fourni, places limitées.",
    type: "atelier",
    date: day1,
    startTime: "10:00",
    endTime: "12:30",
    venue: VILLAGE_FANTASTIQUE,
    speakers: ["Marie Dubois", "Jean-Pierre Martin"],
    isFree: true,
  });

  events.push({
    id: "event-3",
    title: "Conférence : L'évolution du film d'horreur",
    description:
      "Retour sur 50 ans d'évolution du genre horrifique, des slashers des années 80 aux films post-horror contemporains.",
    type: "conference",
    date: day1,
    startTime: "17:00",
    endTime: "18:30",
    venue: BIBLIOTHEQUE,
    speakers: ["Dr. Sophie Laurent", "François Theurel"],
    isFree: true,
  });

  // Jour 2 - Événements
  const day2 = new Date(today);
  day2.setDate(today.getDate() + 1);
  day2.setHours(0, 0, 0, 0);

  events.push({
    id: "event-4",
    title: "Rencontre avec Coralie Fargeat",
    description:
      "La réalisatrice de The Substance vient présenter son film et échanger avec le public sur son approche du body horror féministe.",
    type: "conference",
    date: day2,
    startTime: "15:00",
    endTime: "16:30",
    venue: CINEMA_STAR,
    speakers: ["Coralie Fargeat"],
    isFree: false,
  });

  events.push({
    id: "event-5",
    title: "Atelier Écriture de Scénario Fantastique",
    description:
      "Workshop d'écriture créative animé par des scénaristes professionnels. Venez développer vos propres histoires fantastiques.",
    type: "atelier",
    date: day2,
    startTime: "10:00",
    endTime: "13:00",
    venue: VILLAGE_FANTASTIQUE,
    speakers: ["Claire Mathon"],
    isFree: true,
  });

  events.push({
    id: "event-6",
    title: "Table ronde : Le fantastique européen",
    description:
      "Discussion autour de la spécificité du cinéma fantastique européen face à Hollywood. Avec des réalisateurs et producteurs du continent.",
    type: "conference",
    date: day2,
    startTime: "18:00",
    endTime: "19:30",
    venue: BIBLIOTHEQUE,
    speakers: ["Tilman Singer", "Pascal Laugier", "Julia Ducournau"],
    isFree: true,
  });

  // Jour 3 - Événements
  const day3 = new Date(today);
  day3.setDate(today.getDate() + 2);
  day3.setHours(0, 0, 0, 0);

  events.push({
    id: "event-7",
    title: "Masterclass Musique de Film d'Horreur",
    description:
      "Découvrez comment la musique crée la tension et l'effroi au cinéma. Analyse de partitions célèbres et démonstration en direct.",
    type: "masterclass",
    date: day3,
    startTime: "14:00",
    endTime: "16:00",
    venue: BIBLIOTHEQUE,
    speakers: ["Robin Coudert (Rob)"],
    isFree: false,
  });

  events.push({
    id: "event-8",
    title: "Atelier Bruitage et Sound Design",
    description:
      "Initiez-vous aux techniques de bruitage et de création sonore pour le cinéma fantastique. Expérience interactive garantie.",
    type: "atelier",
    date: day3,
    startTime: "10:00",
    endTime: "12:00",
    venue: VILLAGE_FANTASTIQUE,
    isFree: true,
  });

  events.push({
    id: "event-9",
    title: "Cérémonie de clôture",
    description:
      "Remise des prix et projection du film gagnant. Soirée de clôture festive avec tous les invités du festival.",
    type: "autre",
    date: day3,
    startTime: "20:00",
    endTime: "23:00",
    venue: CINEMA_STAR,
    isFree: false,
  });

  return events;
};

export const EVENTS = generateEvents();

/**
 * Récupère un événement par son ID
 */
export const getEventById = (eventId: string): Event | undefined => {
  return EVENTS.find((event) => event.id === eventId);
};

/**
 * Récupère les événements d'une journée donnée
 */
export const getEventsByDate = (date: Date): Event[] => {
  return EVENTS.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear(),
  );
};

/**
 * Récupère les événements par type
 */
export const getEventsByType = (
  type: "conference" | "atelier" | "masterclass" | "autre",
): Event[] => {
  return EVENTS.filter((event) => event.type === type);
};

/**
 * Récupère les événements gratuits
 */
export const getFreeEvents = (): Event[] => {
  return EVENTS.filter((event) => event.isFree);
};
