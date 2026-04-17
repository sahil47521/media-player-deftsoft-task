import { VideoItem } from '../types';

export const VIDEO_DATA: VideoItem[] = [
  {
    id: 'tears-of-steel-hls',
    title: 'Tears of Steel (HLS)',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMJbOeQxPYQdasx0L2jc3FXYxEw1byH3Wn3MeYhPCCwQ&s=10',
    duration: '12:14',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    bitrate: 5000,
    resolution: 'Adaptive (HLS)',
    description: 'Professional HLS stream from Unified Streaming. Adapts quality to your network speed.'
  }
];