import { PodcastEpisode, ScraperResult } from '../types';

// Define proxy strategies
const PROXIES = {
  ALL_ORIGINS: (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&t=${Date.now()}`,
  CORS_PROXY: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  CODE_TABS: (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
};

/**
 * Fetches the Xiaoyuzhou page using multiple fallback proxies.
 */
export const fetchPodcastInfo = async (url: string): Promise<ScraperResult> => {
  if (!url.includes('xiaoyuzhoufm.com/episode/')) {
    return { success: false, error: '无效的链接。请输入有效的小宇宙单集链接 (xiaoyuzhoufm.com/episode/...)。' };
  }

  let html = '';
  let errorDetails = '';

  // Strategy 1: AllOrigins (Preferred for metadata as it wraps in JSON and handles some headers)
  try {
    const response = await fetch(PROXIES.ALL_ORIGINS(url));
    if (response.ok) {
      const data = await response.json();
      if (data.contents) html = data.contents;
    }
  } catch (e: any) {
    console.warn('AllOrigins metadata fetch failed:', e);
    errorDetails += `AllOrigins: ${e.message}; `;
  }

  // Strategy 2: CORS Proxy (Fallback)
  if (!html) {
    try {
      const response = await fetch(PROXIES.CORS_PROXY(url));
      if (response.ok) {
        html = await response.text();
      }
    } catch (e: any) {
      console.warn('CorsProxy metadata fetch failed:', e);
      errorDetails += `CorsProxy: ${e.message}; `;
    }
  }

  // Strategy 3: CodeTabs (Fallback)
  if (!html) {
    try {
      const response = await fetch(PROXIES.CODE_TABS(url));
      if (response.ok) {
        html = await response.text();
      }
    } catch (e: any) {
      console.warn('CodeTabs metadata fetch failed:', e);
      errorDetails += `CodeTabs: ${e.message}; `;
    }
  }

  if (!html) {
    return { success: false, error: `无法获取页面内容。请检查网络或稍后重试。详情: ${errorDetails}` };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Attempt 1: Open Graph Tags (Most reliable for Xiaoyuzhou)
    const audioUrl = doc.querySelector('meta[property="og:audio"]')?.getAttribute('content');
    const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const coverUrl = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const podcastName = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');

    if (audioUrl) {
      return {
        success: true,
        data: {
          title: title || '未知单集',
          audioUrl: audioUrl,
          coverUrl: coverUrl || '',
          podcastName: podcastName || '未知播客',
        },
      };
    }

    // Attempt 2: Next.js Hydration Data (Fallback)
    const nextDataScript = doc.getElementById('__NEXT_DATA__');
    if (nextDataScript && nextDataScript.textContent) {
      const nextData = JSON.parse(nextDataScript.textContent);
      const episodeData = nextData.props?.pageProps?.episode;
      
      if (episodeData) {
        return {
          success: true,
          data: {
            title: episodeData.title,
            audioUrl: episodeData.enclosure?.url || episodeData.media?.url,
            coverUrl: episodeData.image?.originalUrl || episodeData.image?.url,
            podcastName: episodeData.podcast?.title,
          },
        };
      }
    }

    return { success: false, error: '无法从页面中解析音频地址。该节目可能已下架或格式不受支持。' };

  } catch (error: any) {
    console.error(error);
    return { success: false, error: '解析页面内容时发生错误。' };
  }
};

/**
 * Downloads the audio file using multiple fallback proxies.
 */
export const fetchAudioAsBase64 = async (audioUrl: string, onProgress: (percent: number) => void): Promise<string> => {
  // Define download strategies in order of preference
  const strategies = [
    // 1. Direct fetch (fastest if CORS allows)
    { name: 'Direct', url: audioUrl },
    // 2. CorsProxy.io (reliable for binary)
    { name: 'CorsProxy', url: PROXIES.CORS_PROXY(audioUrl) },
    // 3. CodeTabs (fallback)
    { name: 'CodeTabs', url: PROXIES.CODE_TABS(audioUrl) }
  ];

  let lastError: any;

  for (const strategy of strategies) {
    try {
      console.log(`Attempting download via ${strategy.name}...`);
      const response = await fetch(strategy.url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentLength = + (response.headers.get('Content-Length') ?? '0');
      const reader = response.body?.getReader();
      
      if (!reader) throw new Error("无法读取数据流");

      let receivedLength = 0;
      const chunks = [];

      while(true) {
        const {done, value} = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        
        if (contentLength > 0) {
          onProgress(Math.round((receivedLength / contentLength) * 100));
        }
      }

      const blob = new Blob(chunks, { type: 'audio/m4a' });
      
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          const result = fileReader.result as string;
          // Remove the Data URI prefix to get raw base64
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        fileReader.onerror = reject;
        fileReader.readAsDataURL(blob);
      });

    } catch (error) {
      console.warn(`${strategy.name} download failed:`, error);
      lastError = error;
      // Continue to next strategy
    }
  }

  throw new Error(`音频下载失败，多次尝试均未成功。错误信息: ${lastError?.message || '未知错误'}`);
};