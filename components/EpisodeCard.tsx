import React from 'react';
import { PodcastEpisode } from '../types';
import { Music2 } from 'lucide-react';

interface EpisodeCardProps {
  episode: PodcastEpisode;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 mx-2 sm:mx-0">
      <div className="relative shrink-0">
        {episode.coverUrl ? (
          <img 
            src={episode.coverUrl} 
            alt={episode.title} 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover shadow-md"
          />
        ) : (
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-400">
            <Music2 size={40} />
          </div>
        )}
      </div>
      <div className="flex-1 text-center sm:text-left overflow-hidden w-full">
        <h4 className="text-sm font-semibold text-indigo-600 mb-1 truncate">{episode.podcastName}</h4>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug line-clamp-2">{episode.title}</h3>
        <div className="mt-4 w-full bg-slate-50 rounded-lg p-2 border border-slate-100">
            <audio controls className="w-full h-8" src={episode.audioUrl}>
                您的浏览器不支持音频播放。
            </audio>
        </div>
      </div>
    </div>
  );
};