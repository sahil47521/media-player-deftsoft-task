import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoPlayerScreenProps } from '../types';
import CustomVideoPlayer from '../components/video/CustomVideoPlayer';
import { SkipBack } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const VideoListScreen: React.FC<VideoPlayerScreenProps> = ({ route }) => {
  const { video } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  console.log("video", video);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Video Player - 1/3 of screen */}
      <View style={styles.videoContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <SkipBack fill="#fff" size={24} />
        </TouchableOpacity>
        <CustomVideoPlayer video={video} />
      </View>

      {/* Video Information - 2/3 of screen */}
      <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{video.title}</Text>
            <View style={styles.metadataRow}>
              <Text style={styles.duration}>{video.duration}</Text>
              <Text style={styles.resolution}>{video.resolution}</Text>
              {video.bitrate && (
                <Text style={styles.bitrate}>
                  {Math.round(video.bitrate)} kbps
                </Text>
              )}
            </View>
          </View>

          {/* Video Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Video Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>{video.duration}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Resolution:</Text>
              <Text style={styles.detailValue}>{video.resolution}</Text>
            </View>
            {video.bitrate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bitrate:</Text>
                <Text style={styles.detailValue}>{Math.round(video.bitrate)} kbps</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Video ID:</Text>
              <Text style={styles.detailValue}>{video.id}</Text>
            </View>
          </View>


          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              Experience high-quality video streaming with this amazing content.
              This video showcases beautiful visuals with professional production quality
              and optimized streaming for the best viewing experience.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  videoContainer: {
    flex: 0.5,
    backgroundColor: '#000',
  },
  infoContainer: {
    flex: 2,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 32,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  duration: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  resolution: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bitrate: {
    fontSize: 12,
    color: '#999',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  actionsSection: {
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    left: 20,
    zIndex: 999,
  },
});
