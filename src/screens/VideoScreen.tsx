import { StyleSheet, View, FlatList, StatusBar, Text } from 'react-native'
import React from 'react'
import { VideoItem } from '../types'
import VideoCard from '../components/video/VideoCard'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setCurrentVideo } from '../redux/slices/AppSlice'
import { useNavigation } from '@react-navigation/native'
import CardWrapper from '../components/common/CardWrapper'
import { COLORS } from '../constants/variables'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { VIDEO_DATA } from '../services/videoService'

const VideoScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const videos = VIDEO_DATA;

  const handleVideoPress = (video: VideoItem) => {
    dispatch(setCurrentVideo(video));
    (navigation as any).navigate('VideoPlayer', { video });
  };

  const renderVideoItem = ({ item }: { item: VideoItem }) => (
    <VideoCard video={item} onPress={handleVideoPress} />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.content}>
        <CardWrapper style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>VIDEO LIBRARY</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{videos.length}</Text>
            </View>
          </View>
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={5}
          />
        </CardWrapper>
      </View>
    </View>
  )
}

export default VideoScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.cardHeader,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  badge: {
    marginLeft: 8,
    backgroundColor: COLORS.badge,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 20,
  },
})
