import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { UrlForm } from './components/UrlForm';
import { EpisodeCard } from './components/EpisodeCard';
import { TranscriptionStatus } from './components/TranscriptionStatus';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { fetchPodcastInfo, fetchAudioAsBase64 } from './services/scraper';
import { transcribeAudio } from './services/gemini';
import { PodcastEpisode, TranscriptionState } from './types';

function App() {
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [transcriptionState, setTranscriptionState] = useState<TranscriptionState>({ status: 'idle' });
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Just a sanity check if the env var is loaded, though we can't really "check" the value securely client-side in this specific way without revealing it, 
    // but we trust the runtime environment to have process.env.API_KEY available.
    if (process.env.API_KEY) {
      setHasApiKey(true);
    }
  }, []);

  const handleProcessUrl = async (url: string) => {
    if (!hasApiKey) {
        setTranscriptionState({ status: 'error', error: '环境变量中未找到 API Key。' });
        return;
    }

    // Reset state
    setEpisode(null);
    setTranscriptionState({ status: 'fetching_info' });

    // Step 1: Fetch Metadata
    const result = await fetchPodcastInfo(url);

    if (!result.success || !result.data) {
      setTranscriptionState({ status: 'error', error: result.error || '获取单集信息失败。' });
      return;
    }

    const episodeData = result.data;
    setEpisode(episodeData);

    // Step 2: Download Audio
    setTranscriptionState({ status: 'downloading_audio', progress: 0 });

    try {
      const base64Audio = await fetchAudioAsBase64(episodeData.audioUrl, (percent) => {
        setTranscriptionState(prev => ({ ...prev, status: 'downloading_audio', progress: percent }));
      });

      // Step 3: Transcribe
      setTranscriptionState({ status: 'transcribing' });
      
      const transcript = await transcribeAudio(base64Audio);

      setTranscriptionState({ status: 'completed', transcript });

    } catch (error: any) {
      console.error(error);
      let errorMessage = '处理过程中发生错误。';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'CORS 错误: 音频服务器拒绝了下载请求。请尝试手动下载。';
      } else if (error.message.includes('413')) {
        errorMessage = '文件过大，超过了 API 限制。';
      } else {
        errorMessage = error.message;
      }

      setTranscriptionState({ status: 'error', error: errorMessage });
    }
  };

  return (
    <Layout>
      <Header />
      
      {!hasApiKey && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-8 text-center mx-2 sm:mx-0">
            <strong>警告:</strong> 未检测到 API Key。请确保环境变量 <code>process.env.API_KEY</code> 已配置。
        </div>
      )}

      <UrlForm onSubmit={handleProcessUrl} isLoading={transcriptionState.status !== 'idle' && transcriptionState.status !== 'completed' && transcriptionState.status !== 'error'} />
      
      {episode && <EpisodeCard episode={episode} />}
      
      <TranscriptionStatus state={transcriptionState} />
      
      {transcriptionState.status === 'completed' && transcriptionState.transcript && (
        <TranscriptDisplay content={transcriptionState.transcript} />
      )}
    </Layout>
  );
}

export default App;