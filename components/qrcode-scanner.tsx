import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

export function QRCodeScanner({ onScan, onClose }: QRCodeScannerProps) {
  const colorScheme = useColorScheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès à la caméra est nécessaire pour scanner les QR codes.",
        );
      }
    } catch (error) {
      console.error("Erreur permission caméra:", error);
      setHasPermission(false);
    }
  };

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;

    setScanned(true);
    onScan(data);

    // Réactiver le scan après 2 secondes
    setTimeout(() => {
      setScanned(false);
    }, 2000);
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Demande d&apos;autorisation...</ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <IconSymbol
          name="exclamationmark.triangle.fill"
          size={64}
          color={Colors[colorScheme ?? "light"].icon}
        />
        <ThemedText style={styles.errorText}>Accès caméra refusé</ThemedText>
        <ThemedText style={styles.errorDescription}>
          Activez l&apos;accès à la caméra dans les paramètres pour scanner les
          QR codes.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Header */}
          {onClose && (
            <View style={styles.header}>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { backgroundColor: "rgba(0,0,0,0.5)" },
                ]}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Fermer le scanner"
              >
                <IconSymbol name="xmark" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Center frame */}
          <View
            style={styles.centerContainer}
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="Zone de scan. Placez le QR code dans le cadre pour le scanner automatiquement"
          >
            <View style={styles.scanFrame}>
              {/* Corners */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              {scanned && (
                <View style={styles.scannedOverlay}>
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={64}
                    color="#10b981"
                  />
                  <ThemedText style={styles.scannedText}>Scanné !</ThemedText>
                </View>
              )}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <ThemedText style={styles.instructionText}>
              Placez le QR code dans le cadre
            </ThemedText>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: "flex-end",
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#fff",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scannedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  scannedText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  instructions: {
    padding: 20,
    paddingBottom: 60,
    alignItems: "center",
  },
  instructionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  errorDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 40,
  },
});
