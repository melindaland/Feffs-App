import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface VideoPlayerProps {
  uri: string;
  posterUri?: string;
}

export function VideoPlayer({ uri, posterUri }: VideoPlayerProps) {
  const colorScheme = useColorScheme();
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPlaying = status?.isLoaded && status.isPlaying;

  const handlePlayPause = async () => {
    if (!video.current) return;

    try {
      if (isPlaying) {
        await video.current.pauseAsync();
      } else {
        await video.current.playAsync();
      }
    } catch (err) {
      setError("Erreur de lecture");
      console.error(err);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (error: string) => {
    setIsLoading(false);
    setError("Impossible de charger la vidéo");
    console.error("Video error:", error);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{ uri }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={setStatus}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        posterSource={posterUri ? { uri: posterUri } : undefined}
        usePoster={!!posterUri}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme ?? "light"].tint}
          />
        </View>
      )}

      {error && (
        <View style={styles.errorOverlay}>
          <IconSymbol
            name="exclamationmark.triangle"
            size={48}
            color={Colors[colorScheme ?? "light"].icon}
          />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      {!isLoading && !error && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pause" : "Lecture"}
        >
          <View
            style={[
              styles.playButtonCircle,
              { backgroundColor: Colors[colorScheme ?? "light"].tint + "CC" },
            ]}
          >
            <IconSymbol
              name={isPlaying ? "pause.fill" : "play.fill"}
              size={32}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  playButton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
