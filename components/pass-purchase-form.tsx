import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Festival } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { selectImageSource } from "@/services/camera";
import { UserPass } from "@/types";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PassPurchaseFormProps {
  onSubmit: (pass: UserPass) => void;
  isLoading?: boolean;
}

const PASS_TYPES = [
  { id: "journee", name: "Pass Journée", price: "15€" },
  { id: "weekend", name: "Pass Week-end", price: "35€" },
  { id: "festival", name: "Pass Festival", price: "60€" },
];

export function PassPurchaseForm({
  onSubmit,
  isLoading,
}: PassPurchaseFormProps) {
  const colorScheme = useColorScheme();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    passType: "festival",
    photoUri: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPickingImage, setIsPickingImage] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.photoUri) {
      newErrors.photo = "La photo est requise pour le pass";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTakePhoto = async () => {
    setIsPickingImage(true);
    try {
      const result = await selectImageSource();
      if (result && result.uri) {
        setFormData({ ...formData, photoUri: result.uri });
        setErrors({ ...errors, photo: "" });
      }
    } catch {
      Alert.alert("Erreur", "Impossible de prendre la photo");
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs requis");
      return;
    }

    const pass: UserPass = {
      id: `pass-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      photoUri: formData.photoUri,
      qrCodeUri: JSON.stringify({
        passId: `pass-${Date.now()}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        type: formData.passType,
        purchaseDate: new Date().toISOString(),
      }),
      passType: formData.passType as "journée" | "weekend" | "semaine",
      createdAt: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    };

    onSubmit(pass);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.description}>
          Complétez ce formulaire pour obtenir votre pass {Festival.yearString}.
          La validation finale se fera au Village Fantastique.
        </ThemedText>

        {/* Photo Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Photo d&apos;identité *
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.photoButton,
              { borderColor: Colors[colorScheme ?? "light"].tint },
              errors.photo && styles.errorBorder,
            ]}
            onPress={handleTakePhoto}
            disabled={isPickingImage || isLoading}
            accessibilityLabel={
              formData.photoUri
                ? "Modifier la photo d'identité"
                : "Prendre une photo d'identité, champ obligatoire"
            }
            accessibilityRole="button"
            accessibilityHint="Ouvre la caméra ou la galerie pour sélectionner une photo"
          >
            {isPickingImage ? (
              <ActivityIndicator
                size="large"
                color={Colors[colorScheme ?? "light"].tint}
              />
            ) : formData.photoUri ? (
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: formData.photoUri }}
                  style={styles.photo}
                />
                <View style={styles.photoOverlay}>
                  <IconSymbol name="camera.fill" size={24} color="#fff" />
                  <ThemedText style={styles.photoOverlayText}>
                    Modifier
                  </ThemedText>
                </View>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <IconSymbol
                  name="camera"
                  size={48}
                  color={Colors[colorScheme ?? "light"].icon}
                />
                <ThemedText style={styles.photoPlaceholderText}>
                  Prendre une photo
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
          {errors.photo && (
            <ThemedText style={styles.errorText}>{errors.photo}</ThemedText>
          )}
        </ThemedView>

        {/* Personal Info */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Informations personnelles
          </ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Prénom *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: Colors[colorScheme ?? "light"].text },
                { borderColor: Colors[colorScheme ?? "light"].icon + "40" },
                errors.firstName && styles.errorBorder,
              ]}
              placeholder="Votre prénom"
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
              value={formData.firstName}
              onChangeText={(text) => {
                setFormData({ ...formData, firstName: text });
                setErrors({ ...errors, firstName: "" });
              }}
              editable={!isLoading}
              accessibilityLabel="Prénom, champ obligatoire"
              accessibilityHint="Entrez votre prénom"
            />
            {errors.firstName && (
              <ThemedText style={styles.errorText}>
                {errors.firstName}
              </ThemedText>
            )}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nom *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: Colors[colorScheme ?? "light"].text },
                { borderColor: Colors[colorScheme ?? "light"].icon + "40" },
                errors.lastName && styles.errorBorder,
              ]}
              placeholder="Votre nom"
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
              value={formData.lastName}
              onChangeText={(text) => {
                setFormData({ ...formData, lastName: text });
                setErrors({ ...errors, lastName: "" });
              }}
              editable={!isLoading}
              accessibilityLabel="Nom de famille, champ obligatoire"
              accessibilityHint="Entrez votre nom de famille"
            />
            {errors.lastName && (
              <ThemedText style={styles.errorText}>
                {errors.lastName}
              </ThemedText>
            )}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: Colors[colorScheme ?? "light"].text },
                { borderColor: Colors[colorScheme ?? "light"].icon + "40" },
                errors.email && styles.errorBorder,
              ]}
              placeholder="votre.email@exemple.com"
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                setErrors({ ...errors, email: "" });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
              accessibilityLabel="Email"
            />
            {errors.email && (
              <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
            )}
          </View>
        </ThemedView>

        {/* Pass Type Selection */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Choisissez votre formule *
          </ThemedText>
          <View style={styles.passTypes}>
            {PASS_TYPES.map((pass) => {
              const isSelected = formData.passType === pass.id;
              return (
                <TouchableOpacity
                  key={pass.id}
                  style={[
                    styles.passTypeCard,
                    {
                      borderColor: isSelected
                        ? Colors[colorScheme ?? "light"].tint
                        : Colors[colorScheme ?? "light"].icon + "40",
                      backgroundColor: isSelected
                        ? Colors[colorScheme ?? "light"].tint + "20"
                        : "transparent",
                    },
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, passType: pass.id })
                  }
                  disabled={isLoading}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={`${pass.name}, ${pass.price}`}
                >
                  <View style={styles.passTypeHeader}>
                    <IconSymbol
                      name={isSelected ? "checkmark.circle.fill" : "circle"}
                      size={24}
                      color={
                        isSelected
                          ? Colors[colorScheme ?? "light"].tint
                          : Colors[colorScheme ?? "light"].icon
                      }
                    />
                    <ThemedText type="defaultSemiBold">{pass.name}</ThemedText>
                  </View>
                  <ThemedText style={styles.passTypePrice}>
                    {pass.price}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: Colors[colorScheme ?? "light"].tint },
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Valider la demande de pass"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <IconSymbol name="checkmark.circle.fill" size={24} color="#fff" />
              <ThemedText style={styles.submitButtonText}>
                Valider la demande
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        <ThemedText style={styles.note}>
          * Champs obligatoires. Après validation, présentez-vous au Village
          Fantastique pour finaliser votre achat.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
  },
  photoButton: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  photoContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  photoOverlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  photoPlaceholderText: {
    fontSize: 16,
    opacity: 0.7,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  errorBorder: {
    borderColor: "#ef4444",
    borderStyle: "solid",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
  },
  passTypes: {
    gap: 12,
  },
  passTypeCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 18,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  passTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  passTypePrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 36,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 14,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  note: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
  },
});
