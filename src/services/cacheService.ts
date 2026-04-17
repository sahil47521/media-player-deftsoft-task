import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoItem } from '../types';

interface CacheItem {
  url: string;
  timestamp: number;
  videoData: VideoItem;
}

const CACHE_KEY = 'VIDEO_CACHE';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const isCacheExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > CACHE_DURATION;
};

export const VideoCacheService = {
  async cacheVideo(video: VideoItem): Promise<void> {
    try {
      const existingCache = await this.getCache();
      const updatedCache = existingCache.filter((item: CacheItem) => item.url !== video.url);
      
      const cacheItem: CacheItem = {
        url: video.url,
        timestamp: Date.now(),
        videoData: video
      };
      
      updatedCache.push(cacheItem);
      
      const limitedCache = updatedCache.slice(-50);
      
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(limitedCache));
    } catch (error: any) {
      console.error('Error caching video:', error);
    }
  },

  async getCachedVideo(url: string): Promise<VideoItem | null> {
    try {
      const cache = await this.getCache();
      const cacheItem = cache.find((item: CacheItem) => item.url === url);
      
      if (cacheItem && !isCacheExpired(cacheItem.timestamp)) {
        return cacheItem.videoData;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error getting cached video:', error);
      return null;
    }
  },

  async getCache(): Promise<CacheItem[]> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error: any) {
      console.error('Error getting cache:', error);
      return [];
    }
  },

  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
    } catch (error: any) {
      console.error('Error clearing cache:', error);
    }
  },

  async cleanExpiredCache(): Promise<void> {
    try {
      const cache = await this.getCache();
      const validCache = cache.filter((item: CacheItem) => !isCacheExpired(item.timestamp));
      
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(validCache));
    } catch (error: any) {
      console.error('Error cleaning cache:', error);
    }
  },

  async getAllCachedVideos(): Promise<VideoItem[]> {
    try {
      const cache = await this.getCache();
      return cache
        .filter((item: CacheItem) => !isCacheExpired(item.timestamp))
        .map((item: CacheItem) => item.videoData);
    } catch (error: any) {
      console.error('Error getting all cached videos:', error);
      return [];
    }
  }
};

export default VideoCacheService;
