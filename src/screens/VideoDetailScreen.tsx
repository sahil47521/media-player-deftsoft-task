import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoPlayerScreenProps, VideoPlayerScreenNavigationProp } from '../types';
import CustomVideoPlayer from '../components/video/CustomVideoPlayer';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import CardWrapper from '../components/common/CardWrapper';
import { COLORS } from '../constants/variables';
import { VIDEO_DATA } from '../services/videoService';
import { useAppSelector } from '../redux/hooks';

export const VideoDetailScreen: React.FC<VideoPlayerScreenProps> = ({ route }) => {
  const video = route.params?.video || VIDEO_DATA[0];
  const navigation = useNavigation<VideoPlayerScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const isFullscreen = useAppSelector(state => state.app.isFullscreen);

  if (!video) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.textMain }}>No video available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: isFullscreen ? 0 : insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Video Player Section */}
      <View style={styles.videoWrapper}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Root', { screen: 'Video' } as any);
            }
          }}
        >
          <ChevronLeft color={COLORS.textMain} size={24} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.playerContainer}>
          <CustomVideoPlayer video={video} />
        </View>
      </View>

      {/* Information Section */}
      <ScrollView
        style={styles.infoContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CardWrapper>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>VIDEO INFO</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{video.title}</Text>

            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Duration</Text>
                <Text style={styles.metaValue}>{video.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Resolution</Text>
                <Text style={styles.metaValue}>{video.resolution}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Bitrate</Text>
                <Text style={styles.metaValue}>
                  {video.bitrate ? `${Math.round(video.bitrate)} kbps` : 'N/A'}
                </Text>
              </View>
              {video.codec && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Codec</Text>
                  <Text style={styles.metaValue}>{video.codec}</Text>
                </View>
              )}
              {video.mos && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>MOS</Text>
                  <Text style={styles.metaValue}>{video.mos}</Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {video.description || "High-quality video streaming content. Optimized for the best viewing experience with professional production standards."}
            </Text>
          </View>
        </CardWrapper>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  videoWrapper: {
    backgroundColor: COLORS.white,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 4,
  },
  backText: {
    fontSize: 16,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  infoContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    padding: 12,
    backgroundColor: COLORS.cardHeader,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default VideoDetailScreen;
