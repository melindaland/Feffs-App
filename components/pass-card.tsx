import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, Festival, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { UserPass } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Image,
  Platform,
  Share,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

interface PassCardProps {
  pass: UserPass;
  onDelete?: () => void;
  style?: StyleProp<ViewStyle>;
}

const PASS_TYPE_NAMES: Record<string, string> = {
  journee: "Pass Journée",
  weekend: "Pass Week-end",
  festival: "Pass Festival",
};

export function PassCard({ pass, onDelete, style }: PassCardProps) {
  const colorScheme = useColorScheme();

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mon pass ${Festival.yearString}\n${pass.firstName} ${pass.lastName}\nType: ${PASS_TYPE_NAMES[pass.passType]}\nValidité: ${formatDate(pass.createdAt)} - ${formatDate(pass.validUntil)}`,
      });
    } catch (error) {
      console.error("Erreur partage:", error);
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Supprimer le pass",
      "Êtes-vous sûr de vouloir supprimer ce pass ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: onDelete,
        },
      ],
    );
  };

  return (
    <ThemedView
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={`Pass festival ${Festival.yearString} de ${pass.firstName} ${pass.lastName}, type ${PASS_TYPE_NAMES[pass.passType]}, valide du ${formatDate(pass.createdAt)} au ${formatDate(pass.validUntil)}`}
    >
      {/* Premium gradient header */}
      <LinearGradient
        colors={[Colors[colorScheme ?? "light"].tint, "#6B21A8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View>
              <ThemedText style={styles.festivalYear}>
                {Festival.yearString}
              </ThemedText>
            </View>
          </View>
          <View style={styles.passTypeBadge}>
            <ThemedText style={styles.passTypeText}>
              {PASS_TYPE_NAMES[pass.passType]}
            </ThemedText>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {/* Photo & Info Row */}
        <View style={styles.mainRow}>
          {/* Photo with border */}
          <View style={styles.photoWrapper}>
            <LinearGradient
              colors={[Colors[colorScheme ?? "light"].tint, "#6B21A8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.photoBorder}
            >
              <View style={styles.photoContainer}>
                <Image source={{ uri: pass.photoUri }} style={styles.photo} />
              </View>
            </LinearGradient>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <ThemedText type="defaultSemiBold" style={styles.name}>
              {pass.firstName} {pass.lastName}
            </ThemedText>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoText} numberOfLines={1}>
                {pass.email}
              </ThemedText>
            </View>

            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <ThemedText style={styles.dateLabel}>Émis le</ThemedText>
                <ThemedText style={styles.dateValue}>
                  {formatDate(pass.createdAt)}
                </ThemedText>
              </View>
              <View style={styles.dateDivider} />
              <View style={styles.dateItem}>
                <ThemedText style={styles.dateLabel}>
                  Valide jusqu&apos;au
                </ThemedText>
                <ThemedText style={styles.dateValue}>
                  {formatDate(pass.validUntil)}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Dashed separator */}
        <View style={styles.dashedSeparator}>
          <View
            style={[
              styles.separatorCircle,
              styles.separatorCircleLeft,
              { backgroundColor: Colors[colorScheme ?? "light"].background },
            ]}
          />
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dash,
                { backgroundColor: Colors[colorScheme ?? "light"].border },
              ]}
            />
          ))}
          <View
            style={[
              styles.separatorCircle,
              styles.separatorCircleRight,
              { backgroundColor: Colors[colorScheme ?? "light"].background },
            ]}
          />
        </View>

        {/* QR Code */}
        <View
          style={styles.qrContainer}
          accessible={true}
          accessibilityRole="image"
        >
          <LinearGradient
            colors={[
              Colors[colorScheme ?? "light"].tint + "15",
              "#6B21A8" + "15",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.qrCodeWrapper}
          >
            <View style={styles.qrCodeInner} accessibilityElementsHidden={true}>
              <QRCode
                value={pass.qrCodeUri}
                size={160}
                backgroundColor="#ffffff"
                color="#000000"
              />
            </View>
          </LinearGradient>

          <View style={styles.passIdBadge}>
            <ThemedText style={styles.passIdText}>
              #{pass.id.slice(-8).toUpperCase()}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Partager le pass"
          accessibilityHint="Partage les informations de votre pass via le menu de partage"
        >
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED", "#6D28D9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionGradient}
          >
            <IconSymbol name="square.and.arrow.up" size={20} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Partager</ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Supprimer le pass"
            accessibilityHint="Attention, cette action est irréversible"
          >
            <IconSymbol name="trash.fill" size={20} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Supprimer</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  headerGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  festivalYear: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  passTypeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  passTypeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    padding: Spacing.lg,
  },
  mainRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  photoWrapper: {
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
  photoBorder: {
    padding: 2,
    borderRadius: BorderRadius.lg,
  },
  photoContainer: {
    width: 90,
    height: 110,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    gap: Spacing.sm,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: 13,
    opacity: 0.7,
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    opacity: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  dateDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
  },
  dashedSeparator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.lg,
    marginHorizontal: -Spacing.lg,
    gap: 6,
  },
  dash: {
    width: 8,
    height: 2,
    borderRadius: 1,
  },
  separatorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
  },
  separatorCircleLeft: {
    left: -12,
  },
  separatorCircleRight: {
    right: -12,
  },
  qrContainer: {
    alignItems: "center",
    gap: Spacing.md,
  },
  qrCodeWrapper: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
  qrCodeInner: {
    padding: Spacing.md,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.lg,
  },
  passIdBadge: {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  passIdText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    opacity: 0.6,
    letterSpacing: 1,
  },
  actions: {
    flexDirection: "row",
    padding: Spacing.lg,
    paddingTop: 0,
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    backgroundColor: "#EF4444",
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
});
