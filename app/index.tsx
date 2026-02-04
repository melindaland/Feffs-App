import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Spacing } from "@/constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleStart = () => {
    router.replace("/(tabs)/daily");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B5CF6", "#F97316"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.content}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          <ThemedText type="title" style={styles.title}>
            FEFFS 2026
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Festival Européen du Film Fantastique de Strasbourg
          </ThemedText>
        </View>

        <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>Commencer</ThemedText>
            <IconSymbol name="arrow.right" size={20} color="#F97316" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  content: { alignItems: "center" },
  logo: { width: 200, height: 200, resizeMode: "contain" },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "800",
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 18,
    textAlign: "center",
    maxWidth: 300,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 280,
    marginTop: 40,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  buttonText: {
    color: "#F97316",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
