import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const THEME = {
  dark: {
    bg: '#000000',
    surface: '#111111',
    surfaceHighlight: '#1A1A1A',
    text: '#FFFFFF',
    textMuted: '#888888',
    accent: '#3B82F6', // Blue accent
    border: '#222222',
  },
  light: {
    bg: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceHighlight: '#F1F3F5',
    text: '#000000',
    textMuted: '#666666',
    accent: '#2563EB',
    border: '#E5E5E5',
  },
};

// ---------------------------------------------
// 1. ANIMATED COMPONENTS
// ---------------------------------------------

const FadeInStagger = ({ children, delay = 0, style }: any) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      delay,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [anim, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const AmbientBackground = ({ isDark }: { isDark: boolean }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  const scale1 = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] });
  const scale2 = pulse.interpolate({ inputRange: [0, 1], outputRange: [1.2, 1] });
  const opacity = isDark ? 0.15 : 0.08;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        style={[
          styles.ambientOrb,
          {
            backgroundColor: '#3B82F6',
            top: -width * 0.2,
            left: -width * 0.2,
            opacity,
            transform: [{ scale: scale1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ambientOrb,
          {
            backgroundColor: '#8B5CF6',
            top: width * 0.4,
            right: -width * 0.3,
            opacity,
            transform: [{ scale: scale2 }],
          },
        ]}
      />
    </View>
  );
};

const PulsingDot = ({ color }: { color: string }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  return (
    <View style={styles.dotContainer}>
      <Animated.View
        style={[
          styles.dotPulse,
          {
            backgroundColor: color,
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }],
          },
        ]}
      />
      <View style={[styles.dotCore, { backgroundColor: color }]} />
    </View>
  );
};

// ---------------------------------------------
// 2. INTERACTIVE CARD
// ---------------------------------------------

const ExperimentCard = ({
  number,
  title,
  desc,
  delay,
  colors,
}: {
  number: string;
  title: string;
  desc: string;
  delay: number;
  colors: any;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <FadeInStagger delay={delay}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardNumber, { color: colors.textMuted }]}>{number}</Text>
            <View style={[styles.cardArrow, { backgroundColor: colors.surfaceHighlight }]}>
              <Text style={{ color: colors.text, fontSize: 16 }}>↗</Text>
            </View>
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.cardDesc, { color: colors.textMuted }]}>{desc}</Text>
        </Pressable>
      </Animated.View>
    </FadeInStagger>
  );
};

// ---------------------------------------------
// 3. MAIN APP
// ---------------------------------------------

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? THEME.dark : THEME.light;
  const insets = useSafeAreaInsets();
  
  // Parallax Scroll value
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <AmbientBackground isDark={isDarkMode} />
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: 24,
        }}
      >
        {/* HERO SECTION */}
        <Animated.View
          style={{
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-100, 0, 100],
                  outputRange: [-20, 0, 20], // Parallax effect
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}
        >
          <FadeInStagger delay={100} style={styles.badgeWrapper}>
            <View style={[styles.statusBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <PulsingDot color="#10B981" />
              <Text style={[styles.statusText, { color: colors.text }]}>
                Currently building something new
              </Text>
            </View>
          </FadeInStagger>

          <FadeInStagger delay={300}>
            <Text style={[styles.title, { color: colors.text }]}>
              My{'\n'}Experiments.
            </Text>
          </FadeInStagger>

          <FadeInStagger delay={500}>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              A digital playground blending code, motion, and minimal design. Exploring the limits of what's possible on mobile.
            </Text>
          </FadeInStagger>
        </Animated.View>

        {/* CONTENT SECTION */}
        <FadeInStagger delay={700}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Labs
          </Text>
        </FadeInStagger>

        <View style={styles.grid}>
          <ExperimentCard
            number="01"
            title="Fluid Gestures"
            desc="Interactive UI elements that respond organically to touch and swipe momentum."
            delay={850}
            colors={colors}
          />
          <ExperimentCard
            number="02"
            title="Dynamic Island UI"
            desc="Exploring playful, contextual animations that live around hardware cutouts."
            delay={1000}
            colors={colors}
          />
          <ExperimentCard
            number="03"
            title="Glassmorphism"
            desc="Real-time blur and depth effects layered over complex vibrant backgrounds."
            delay={1150}
            colors={colors}
          />
        </View>

      </Animated.ScrollView>
    </View>
  );
}

// ---------------------------------------------
// 4. STYLES
// ---------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ambientOrb: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
  },
  badgeWrapper: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
  },
  dotContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dotCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  dotPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 64,
    letterSpacing: -2,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
    marginBottom: 56,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  grid: {
    gap: 16,
  },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16, // fallback if gap isn't supported in some RN versions
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  cardDesc: {
    fontSize: 15,
    lineHeight: 24,
  },
});

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppContent />
    </SafeAreaProvider>
  );
}
