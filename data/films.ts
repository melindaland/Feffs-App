import { Film, Projection, Venue } from "@/types";

/**
 * Données de test pour le FEFFS 2026
 */

export const VENUES: Venue[] = [
  {
    id: "venue-1",
    name: "Cinéma Star Saint-Exupéry",
    address: "17 Rue du 22 novembre, 67000 Strasbourg",
    coordinates: {
      latitude: 48.5734053,
      longitude: 7.7521113,
    },
    capacity: 400,
  },
  {
    id: "venue-2",
    name: "Cinéma Odyssée",
    address: "3 Rue des Francs Bourgeois, 67000 Strasbourg",
    coordinates: {
      latitude: 48.5839,
      longitude: 7.7455,
    },
    capacity: 300,
  },
  {
    id: "venue-3",
    name: "Star UGC",
    address: "Place des Halles, 67000 Strasbourg",
    coordinates: {
      latitude: 48.5798,
      longitude: 7.7507,
    },
    capacity: 250,
  },
];

export const FILMS: Film[] = [
  {
    id: "film-1",
    title: "Nosferatu",
    originalTitle: "Nosferatu",
    director: "Robert Eggers",
    year: 2024,
    duration: 132,
    genre: ["Horreur", "Fantastique"],
    country: "USA",
    synopsis:
      "Une réinvention gothique du classique de Murnau. Une histoire obsédante d'amour interdit entre une jeune femme hantée et le terrifiant vampire épris d'elle.",
    posterUrl: "https://example.com/nosferatu.jpg",
    trailerUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "film-2",
    title: "The Substance",
    originalTitle: "The Substance",
    director: "Coralie Fargeat",
    year: 2024,
    duration: 141,
    genre: ["Horreur", "Science-Fiction", "Thriller"],
    country: "France",
    synopsis:
      "Une actrice vieillissante décide d'utiliser une drogue du marché noir, une substance de réplication cellulaire qui crée temporairement une version plus jeune et meilleure d'elle-même.",
    posterUrl: "https://example.com/substance.jpg",
    trailerUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "film-3",
    title: "Longlegs",
    originalTitle: "Longlegs",
    director: "Oz Perkins",
    year: 2024,
    duration: 101,
    genre: ["Horreur", "Thriller"],
    country: "USA",
    synopsis:
      "Une agente du FBI recherche un tueur en série qui a échappé à toutes les enquêtes pendant des décennies. Les indices commencent à converger vers des révélations occultes.",
    posterUrl: "https://example.com/longlegs.jpg",
    trailerUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "film-4",
    title: "Cuckoo",
    originalTitle: "Cuckoo",
    director: "Tilman Singer",
    year: 2024,
    duration: 102,
    genre: ["Horreur", "Mystère"],
    country: "Allemagne",
    synopsis:
      "Une adolescente réticente accompagne sa famille dans un complexe hôtelier dans les Alpes allemandes et découvre que l'endroit cache des secrets sinistres.",
    posterUrl: "https://example.com/cuckoo.jpg",
    trailerUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
];

// Générer des projections pour les 3 prochains jours
const generateProjections = (): Projection[] => {
  const projections: Projection[] = [];
  const today = new Date();

  FILMS.forEach((film, filmIndex) => {
    // 2-3 projections par film sur différents jours
    for (let day = 0; day < 3; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);

      const venue = VENUES[filmIndex % VENUES.length];
      const baseHour = 14 + filmIndex * 2;
      const startHour = baseHour + day;

      const startTime = `${startHour.toString().padStart(2, "0")}:00`;
      const endHour = startHour + Math.floor(film.duration / 60);
      const endMinutes = film.duration % 60;
      const endTime = `${endHour.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

      projections.push({
        id: `proj-${film.id}-${day}`,
        filmId: film.id,
        date,
        startTime,
        endTime,
        venue,
        ticketsAvailable: true,
        price: 8.5,
      });
    }
  });

  return projections.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const PROJECTIONS = generateProjections();

/**
 * Récupère un film par son ID
 */
export const getFilmById = (filmId: string): Film | undefined => {
  return FILMS.find((film) => film.id === filmId);
};

/**
 * Récupère les projections d'un film
 */
export const getProjectionsByFilmId = (filmId: string): Projection[] => {
  return PROJECTIONS.filter((proj) => proj.filmId === filmId);
};

/**
 * Récupère toutes les projections d'un jour donné
 */
export const getProjectionsByDate = (date: Date): Projection[] => {
  return PROJECTIONS.filter(
    (proj) =>
      proj.date.getDate() === date.getDate() &&
      proj.date.getMonth() === date.getMonth() &&
      proj.date.getFullYear() === date.getFullYear(),
  );
};
