import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

export interface ImageResult {
  uri: string;
  width: number;
  height: number;
  type?: string;
}

/**
 * Demande les permissions pour accéder à la caméra
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "L'accès à la caméra est nécessaire pour prendre une photo pour votre pass.",
        [{ text: "OK" }],
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la demande de permission caméra:", error);
    return false;
  }
};

/**
 * Demande les permissions pour accéder à la galerie
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "L'accès à la galerie est nécessaire pour sélectionner une photo pour votre pass.",
        [{ text: "OK" }],
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la demande de permission galerie:", error);
    return false;
  }
};

/**
 * Ouvre la caméra pour prendre une photo
 * @param allowsEditing - Permet à l'utilisateur de recadrer la photo
 * @param aspect - Ratio de l'image [width, height]
 * @returns L'URI de l'image ou null si annulé
 */
export const takePicture = async (
  allowsEditing: boolean = true,
  aspect: [number, number] = [1, 1],
): Promise<ImageResult | null> => {
  try {
    // Vérifier les permissions
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return null;
    }

    // Ouvrir la caméra
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing,
      aspect,
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      type: asset.type ?? "image",
    };
  } catch (error) {
    console.error("Erreur lors de la prise de photo:", error);
    Alert.alert(
      "Erreur",
      "Impossible de prendre la photo. Veuillez réessayer.",
    );
    return null;
  }
};

/**
 * Ouvre la galerie pour sélectionner une photo
 * @param allowsEditing - Permet à l'utilisateur de recadrer la photo
 * @param aspect - Ratio de l'image [width, height]
 * @returns L'URI de l'image ou null si annulé
 */
export const pickImage = async (
  allowsEditing: boolean = true,
  aspect: [number, number] = [1, 1],
): Promise<ImageResult | null> => {
  try {
    // Vérifier les permissions
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      return null;
    }

    // Ouvrir la galerie
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing,
      aspect,
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      type: asset.type ?? "image",
    };
  } catch (error) {
    console.error("Erreur lors de la sélection de photo:", error);
    Alert.alert(
      "Erreur",
      "Impossible de sélectionner la photo. Veuillez réessayer.",
    );
    return null;
  }
};

/**
 * Affiche un menu pour choisir entre caméra et galerie
 * @param allowsEditing - Permet à l'utilisateur de recadrer la photo
 * @param aspect - Ratio de l'image [width, height]
 * @returns L'URI de l'image ou null si annulé
 */
export const selectImageSource = (
  allowsEditing: boolean = true,
  aspect: [number, number] = [1, 1],
): Promise<ImageResult | null> => {
  return new Promise((resolve) => {
    if (Platform.OS === "web") {
      // Sur le web, utiliser uniquement la galerie
      pickImage(allowsEditing, aspect).then(resolve);
      return;
    }

    Alert.alert("Choisir une photo", "Sélectionnez la source de votre photo", [
      {
        text: "Prendre une photo",
        onPress: async () => {
          const result = await takePicture(allowsEditing, aspect);
          resolve(result);
        },
      },
      {
        text: "Choisir dans la galerie",
        onPress: async () => {
          const result = await pickImage(allowsEditing, aspect);
          resolve(result);
        },
      },
      {
        text: "Annuler",
        style: "cancel",
        onPress: () => resolve(null),
      },
    ]);
  });
};
