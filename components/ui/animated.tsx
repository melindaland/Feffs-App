/**
 * Composants animés réutilisables avec react-native-reanimated
 * Pour des transitions fluides et une meilleure UX
 */

import React, { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  Layout,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// ============================================
// ANIMATIONS PRÉDÉFINIES
// ============================================

export const Animations = {
  // Entrées
  fadeIn: FadeIn.duration(300),
  fadeInFast: FadeIn.duration(150),
  fadeInSlow: FadeIn.duration(500),
  fadeInUp: FadeInUp.duration(400),
  fadeInDown: FadeInDown.duration(400),
  slideInRight: SlideInRight.duration(300),

  // Sorties
  fadeOut: FadeOut.duration(200),
  fadeOutUp: FadeOutUp.duration(300),
  fadeOutDown: FadeOutDown.duration(300),
  slideOutLeft: SlideOutLeft.duration(250),

  // Layout
  layout: Layout.duration(300),
  layoutFast: Layout.duration(200),
};

// ============================================
// COMPOSANTS ANIMÉS
// ============================================

interface AnimatedContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  entering?: typeof FadeIn;
  exiting?: typeof FadeOut;
}

/**
 * Container avec animation d'entrée fade-in par défaut
 */
export function AnimatedFadeIn({
  children,
  style,
  delay = 0,
}: AnimatedContainerProps) {
  return (
    <Animated.View entering={FadeIn.duration(300).delay(delay)} style={style}>
      {children}
    </Animated.View>
  );
}

/**
 * Container avec animation d'entrée depuis le bas
 */
export function AnimatedSlideUp({
  children,
  style,
  delay = 0,
}: AnimatedContainerProps) {
  return (
    <Animated.View entering={FadeInUp.duration(400).delay(delay)} style={style}>
      {children}
    </Animated.View>
  );
}

/**
 * Container avec animation d'entrée depuis le haut
 */
export function AnimatedSlideDown({
  children,
  style,
  delay = 0,
}: AnimatedContainerProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(delay)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Liste animée avec stagger effect (délai croissant entre les éléments)
 */
interface AnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  style?: ViewStyle;
  baseDelay?: number;
  staggerDelay?: number;
}

export function AnimatedListItem({
  children,
  index,
  style,
  baseDelay = 0,
  staggerDelay = 50,
}: AnimatedListItemProps) {
  const delay = baseDelay + index * staggerDelay;

  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(delay)}
      layout={Animations.layout}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

// ============================================
// HOOKS ANIMÉS
// ============================================

/**
 * Hook pour animation de pulsation (utile pour loading, badges, etc.)
 */
export function usePulseAnimation(duration: number = 1000) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: duration / 2 }),
        withTiming(1, { duration: duration / 2 }),
      ),
      -1,
      true,
    );
  }, [duration, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
}

/**
 * Hook pour animation de scale au press
 */
export function usePressAnimation() {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, onPressIn, onPressOut };
}

/**
 * Hook pour animation d'expansion/collapse
 */
export function useExpandAnimation(
  isExpanded: boolean,
  maxHeight: number = 500,
) {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isExpanded) {
      height.value = withSpring(maxHeight, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      height.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [isExpanded, maxHeight, height, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value === 0 ? undefined : height.value,
    maxHeight: height.value,
    opacity: opacity.value,
    overflow: "hidden" as const,
  }));

  return animatedStyle;
}

/**
 * Hook pour animation de rotation (chevron, icônes)
 */
export function useRotateAnimation(isRotated: boolean, degrees: number = 180) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withSpring(isRotated ? degrees : 0, { damping: 15 });
  }, [isRotated, degrees, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return animatedStyle;
}

/**
 * Hook pour animation de shimmer/skeleton loading
 */
export function useShimmerAnimation() {
  const translateX = useSharedValue(-100);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(100, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }));

  return animatedStyle;
}

/**
 * Hook pour animation de compteur (utile pour statistiques)
 */
export function useCountAnimation(
  targetValue: number,
  duration: number = 1000,
) {
  const count = useSharedValue(0);

  useEffect(() => {
    count.value = withTiming(targetValue, { duration });
  }, [targetValue, duration, count]);

  return count;
}

// ============================================
// COMPOSANTS SPÉCIAUX
// ============================================

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

/**
 * Bouton avec feedback visuel animé
 */
export function AnimatedPressable({
  children,
  onPress,
  style,
  disabled,
}: AnimatedPressableProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Animated.View
        onTouchStart={disabled ? undefined : onPressIn}
        onTouchEnd={disabled ? undefined : onPressOut}
        onTouchCancel={disabled ? undefined : onPressOut}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

interface SkeletonProps {
  width: number;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Composant skeleton loading avec animation shimmer
 */
export function Skeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const shimmerStyle = useShimmerAnimation();

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#E5E7EB",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(255,255,255,0.5)",
          },
          shimmerStyle,
        ]}
      />
    </Animated.View>
  );
}

/**
 * Badge pulsant (pour notifications, alertes)
 */
interface PulseBadgeProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function PulseBadge({ children, style }: PulseBadgeProps) {
  const pulseStyle = usePulseAnimation();

  return <Animated.View style={[pulseStyle, style]}>{children}</Animated.View>;
}
