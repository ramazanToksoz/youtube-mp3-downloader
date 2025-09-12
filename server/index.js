const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const ytdl = require('@distube/ytdl-core');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = 5002;

// İstatistikler için basit JSON dosya veritabanı
const statsFile = path.join(__dirname, 'stats.json');

// İstatistikleri yükle
let stats = {
  totalDownloads: 0,
  totalVideos: 0,
  totalSize: 0,
  downloads: [],
  searches: []
};

if (fs.existsSync(statsFile)) {
  try {
    stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (error) {
    console.log('İstatistik dosyası oluşturuluyor...');
  }
}

// İstatistikleri kaydet
const saveStats = () => {
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../client/build')));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Sunucu hatası',
    message: err.message 
  });
});

// Downloads klasörünü oluştur
const downloadsDir = path.join(__dirname, 'downloads');
fs.ensureDirSync(downloadsDir);

// Ana route - React uygulamasını serve et
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// YouTube Arama API
app.post('/api/search', async (req, res) => {
  try {
    const { query, maxResults = 5 } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Arama terimi gerekli' });
    }

    console.log('YouTube arama:', query);
    
    // Basit YouTube arama URL oluştur ve manuel sonuçlar döndür
    const searchResults = [
      {
        id: `search_${Date.now()}_1`,
        title: `${query} - Popüler Video`,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '3:32',
        author: 'Müzik Kanalı',
        description: `${query} ile ilgili popüler video`
      },
      {
        id: `search_${Date.now()}_2`,
        title: `${query} - En İyi Versiyonu`,
        url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
        thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
        duration: '4:15',
        author: 'Sanatçı Adı',
        description: `${query} şarkısının en iyi versiyonu`
      },
      {
        id: `search_${Date.now()}_3`,
        title: `${query} - Canlı Performans`,
        url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        duration: '5:20',
        author: 'Konser Kanalı',
        description: `${query} canlı performans`
      }
    ];
    
    // İstatistiklere ekle
    stats.searches.push({
      query: query.trim(),
      timestamp: new Date().toISOString(),
      resultCount: searchResults.length
    });
    saveStats();
    
    // Başarılı response
    res.json({ 
      success: true, 
      results: searchResults,
      message: `"${query}" için ${searchResults.length} sonuç bulundu`
    });
    
  } catch (error) {
    console.error('Arama hatası:', error);
    res.status(500).json({ 
      success: false,
      error: 'Arama yapılırken bir hata oluştu. Lütfen tekrar deneyin.',
      details: error.message
    });
  }
});

// İstatistikler API
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalDownloads: stats.totalDownloads,
      totalVideos: stats.totalVideos,
      totalSize: Math.round(stats.totalSize / (1024 * 1024)), // MB cinsinden
      recentDownloads: stats.downloads.slice(-5).reverse(),
      recentSearches: stats.searches.slice(-5).reverse()
    }
  });
});

// Video bilgilerini getir
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL gerekli' });
    }

    // URL'nin geçerli olup olmadığını kontrol et
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Geçersiz YouTube URL' });
    }

    console.log('Video bilgisi alınıyor:', url);
    const startTime = Date.now();

    // Sadece temel bilgileri al (daha hızlı)
    const info = await ytdl.getBasicInfo(url);
    
    const endTime = Date.now();
    console.log(`Video bilgisi alındı: ${endTime - startTime}ms`);
    
    // Ses kalitesi seçeneklerini al
    const audioFormats = info.formats.filter(format => 
      format.hasAudio && !format.hasVideo
    ).map(format => ({
      itag: format.itag,
      quality: format.audioBitrate ? `${format.audioBitrate}kbps` : 'Bilinmeyen',
      container: format.container,
      size: format.contentLength
    }));
    
    const videoDetails = {
      title: info.videoDetails.title || 'Bilinmeyen Başlık',
      thumbnail: info.videoDetails.thumbnails?.[0]?.url || '',
      duration: info.videoDetails.lengthSeconds || '0',
      author: info.videoDetails.author?.name || 'Bilinmeyen Kanal',
      views: info.videoDetails.viewCount || '0',
      audioFormats: audioFormats
    };
    
    // İstatistiklere ekle
    stats.totalVideos++;
    saveStats();

    res.json({ success: true, data: videoDetails });
  } catch (error) {
    console.error('Video bilgisi alınırken hata:', error.message);
    
    // Basit hata mesajı döndür
    if (error.message.includes('Video unavailable')) {
      res.status(404).json({ error: 'Video bulunamadı veya özel' });
    } else if (error.message.includes('Sign in to confirm')) {
      res.status(403).json({ error: 'Video yaş kısıtlamalı' });
    } else {
      res.status(500).json({ error: 'Video bilgisi alınamadı. URL\'yi kontrol edin.' });
    }
  }
});

// MP3 indirme
app.post('/api/download', async (req, res) => {
  try {
    const { url, quality = 'highestaudio' } = req.body;
    
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Geçersiz YouTube URL' });
    }

    console.log('İndirme başlatılıyor:', url, 'Kalite:', quality);

    // Video bilgilerini al
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s-]/gi, '').trim();
    const fileName = `${title}.mp4`;

    console.log('Dosya adı:', fileName);
    
    // Video uzunluğundan tahmi dosya boyutu hesapla
    const duration = parseInt(info.videoDetails.lengthSeconds);
    const estimatedSize = duration * 50000; // Yaklaşık 50KB/saniye

    // Response headers'ını düzgün ayarla
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'audio/mp4');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('X-Estimated-Size', estimatedSize.toString());
    
    // Content-Length header'ını kaldır (streaming için)
    res.removeHeader('Content-Length');

    // Kalite ayarına göre ses stream'ini al
    const audioStream = ytdl(url, {
      filter: 'audioonly',
      quality: quality
    });

    // İndirme progress'ini takip et
    let downloadedBytes = 0;
    
    audioStream.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      const progressPercent = Math.min(Math.round((downloadedBytes / estimatedSize) * 100), 99);
      console.log(`İndirilen: ${Math.round(downloadedBytes / 1024)} KB (${progressPercent}%)`);
    });

    audioStream.on('end', () => {
      console.log('İndirme tamamlandı! 100%');
      
      // İstatistikleri güncelle
      stats.totalDownloads++;
      stats.totalSize += downloadedBytes;
      stats.downloads.push({
        title: title,
        size: Math.round(downloadedBytes / 1024), // KB
        quality: quality,
        timestamp: new Date().toISOString()
      });
      saveStats();
    });

    audioStream.on('error', (err) => {
      console.error('Stream hatası:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Ses dosyası alınırken hata oluştu' });
      }
    });

    // Stream'i response'a pipe et
    audioStream.pipe(res);

  } catch (error) {
    console.error('İndirme hatası:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'İndirme işlemi başarısız: ' + error.message });
    }
  }
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});