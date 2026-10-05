import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
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

const THEME = {
  light: {
    background: '#F9F9F9',
    text: '#111111',
    textSecondary: '#6B6B6B',
    border: '#E5E5E5',
    dot: '#10B981',
  },
  dark: {
    background: '#050505',
    text: '#F5F5F5',
    textSecondary: '#999999',
    border: '#1F1F1F',
    dot: '#10B981',
  },
};

const FadeInView = ({ children, delay = 0, style }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const StatusDot = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
          transform: [
            {
              scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              }),
            },
          ],
        },
      ]}
    />
  );
};

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? THEME.dark : THEME.light;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: insets.top + 80,
          paddingBottom: insets.bottom + 60,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={100}>
        <Text style={[styles.title, { color: colors.text }]}>
          My Experiments
        </Text>
      </FadeInView>

      <FadeInView delay={300}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Building, breaking, learning, and experimenting with technology.
        </Text>
      </FadeInView>

      <FadeInView delay={500} style={styles.statusContainer}>
        <View style={[styles.statusBadge, { borderColor: colors.border }]}>
          <StatusDot />
          <Text style={[styles.statusText, { color: colors.text }]}>
            Currently experimenting
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={700} style={styles.introSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          The Laboratory
        </Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          A space dedicated to exploring new paradigms in mobile interfaces, 
          fluid interactions, and minimal design systems.
        </Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Every project is an iteration. The focus is on finding elegance 
          through simplicity and reducing visual noise to the absolute minimum.
        </Text>
      </FadeInView>
      
      <FadeInView delay={900}>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.experimentItem}>
          <Text style={[styles.experimentId, { color: colors.textSecondary }]}>01</Text>
          <View style={styles.experimentDetails}>
            <Text style={[styles.experimentTitle, { color: colors.text }]}>Spatial Navigation</Text>
            <Text style={[styles.experimentDesc, { color: colors.textSecondary }]}>Exploring gesture-driven interfaces and natural spatial transitions between contexts.</Text>
          </View>
        </View>
        
        <View style={styles.experimentItem}>
          <Text style={[styles.experimentId, { color: colors.textSecondary }]}>02</Text>
          <View style={styles.experimentDetails}>
            <Text style={[styles.experimentTitle, { color: colors.text }]}>Haptic Typography</Text>
            <Text style={[styles.experimentDesc, { color: colors.textSecondary }]}>Synchronizing physical device feedback with variable font weight animations.</Text>
          </View>
        </View>

        <View style={styles.experimentItem}>
          <Text style={[styles.experimentId, { color: colors.textSecondary }]}>03</Text>
          <View style={styles.experimentDetails}>
            <Text style={[styles.experimentTitle, { color: colors.text }]}>Algorithmic Layouts</Text>
            <Text style={[styles.experimentDesc, { color: colors.textSecondary }]}>Using generative principles to dictate whitespace and content structure dynamically.</Text>
          </View>
        </View>
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.2,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: -0.2,
    marginBottom: 40,
  },
  statusContainer: {
    marginBottom: 56,
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  introSection: {
    marginBottom: 56,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 20,
    opacity: 0.8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 20,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 40,
  },
  experimentItem: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  experimentId: {
    fontSize: 13,
    fontWeight: '600',
    width: 32,
    marginTop: 3,
    letterSpacing: 0.5,
  },
  experimentDetails: {
    flex: 1,
  },
  experimentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  experimentDesc: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  }
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
