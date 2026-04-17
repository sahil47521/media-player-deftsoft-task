import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Trash2, Music } from 'lucide-react-native';
import { AudioItem } from '../../types';
import CardWrapper from '../common/CardWrapper';
import { COLORS } from '../../constants/variables';

interface AudioListProps {
  data: AudioItem[];
  isPlayingId: string | null;
  onPlay: (item: AudioItem) => void;
  onDelete: (item: AudioItem) => void;
  formatSize: (bytes: number) => string;
}

const AudioList: React.FC<AudioListProps> = ({
  data,
  isPlayingId,
  onPlay,
  onDelete,
  formatSize,
}) => {
  const renderItem = ({ item }: { item: AudioItem }) => {
    const isPlaying = isPlayingId === item.id;
    return (
      <View style={[styles.item, isPlaying && styles.itemPlaying]}>
        <TouchableOpacity style={styles.itemInfo} onPress={() => onPlay(item)} activeOpacity={0.7}>
          <View style={[styles.playIcon, isPlaying && styles.playIconActive]}>
            {isPlaying ? (
              <Pause size={18} color={COLORS.white} fill={COLORS.white} />
            ) : (
              <Play size={18} color={COLORS.primary} fill={COLORS.primary} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.itemTitle, isPlaying && styles.textPlaying]} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.itemSubtitle}>{item.duration} • {formatSize(item.size || 0)}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => onDelete(item)} 
          style={styles.deleteButton}
          activeOpacity={0.6}
        >
          <Trash2 size={18} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <CardWrapper style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Music size={16} color={COLORS.primary} />
          <Text style={styles.headerTitle}>RECORDINGS</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{data.length}</Text>
        </View>
      </View>
      <FlatList
        data={[...data].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Music size={48} color={COLORS.divider} />
            <Text style={styles.emptyText}>No recordings yet</Text>
          </View>
        }
      />
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  itemPlaying: {
    backgroundColor: COLORS.background,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  playIconActive: {
    backgroundColor: COLORS.primary,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  textPlaying: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '500',
  },
});

export default AudioList;
