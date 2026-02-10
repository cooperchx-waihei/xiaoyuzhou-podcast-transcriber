export interface PodcastEpisode {
  title: string;
  audioUrl: string;
  coverUrl: string;
  podcastName: string;
}

export interface TranscriptionState {
  status: 'idle' | 'fetching_info' | 'downloading_audio' | 'transcribing' | 'completed' | 'error';
  progress?: number;
  error?: string;
  transcript?: string;
}

export interface ScraperResult {
  success: boolean;
  data?: PodcastEpisode;
  error?: string;
}
