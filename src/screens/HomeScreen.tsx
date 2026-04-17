import { StyleSheet, Text, View, FlatList, StatusBar } from 'react-native'
import React from 'react'
import { HomeScreenProps, VideoItem } from '../types'
import VideoCard from '../components/video/VideoCard'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setCurrentVideo } from '../redux/slices/AppSlice'

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const videos = useAppSelector(state => state.app.videos);
  const handleVideoPress = (video: VideoItem) => {
    dispatch(setCurrentVideo(video));
    navigation?.navigate('VideoPlayer', { video });
  };

  const renderVideoItem = ({ item }: { item: VideoItem }) => (
    <VideoCard video={item} onPress={handleVideoPress} />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Library</Text>
        <Text style={styles.headerSubtitle}>Choose from our collection</Text>
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
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  listContainer: {
    paddingBottom: 20,
  },
})