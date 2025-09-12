import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { FaYoutube, FaDownload, FaMusic, FaSpinner, FaPlay, FaPause, FaVolumeUp, FaStar, FaFire } from 'react-icons/fa';
import VideoInfo from './components/VideoInfo';
import DownloadButton from './components/DownloadButton';
import './App.css';

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a0e27;
    overflow-x: hidden;
  }
  
  ::selection {
    background: rgba(102, 126, 234, 0.3);
  }
`;

// Animasyonlar
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(102, 126, 234, 0.4); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #0a0e27, #16213e, #0f3460, #533483);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="%23ffffff" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.4;
    pointer-events: none;
  }
`;

const Header = styled.header`
  text-align: center;
  color: white;
  margin-bottom: 60px;
  padding-top: 60px;
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${glow} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  opacity: 0.9;
  font-weight: 400;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
`;

const FeatureIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  
  svg {
    font-size: 2rem;
    color: #f093fb;
    filter: drop-shadow(0 0 10px rgba(240, 147, 251, 0.5));
  }
`;

const MainCard = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border-radius: 30px;
  padding: 60px;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 40px 80px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(240,147,251,0.1));
    border-radius: 30px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    padding: 40px 25px;
    margin: 10px;
    border-radius: 25px;
  }
`;

const InputSection = styled.div`
  margin-bottom: 40px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 30px;
`;

const InputLabel = styled.label`
  display: block;
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: #f093fb;
    filter: drop-shadow(0 0 5px rgba(240, 147, 251, 0.5));
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 20px 25px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 16px;
  outline: none;
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: white;
  margin-bottom: 20px;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 
      0 0 0 4px rgba(102, 126, 234, 0.1),
      0 0 20px rgba(102, 126, 234, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const SearchButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  color: white;
  border: none;
  padding: 20px 35px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  box-shadow: 
    0 10px 30px rgba(102, 126, 234, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: ${glow} 4s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    animation-play-state: paused;
    background-position: 100% 100%;
    box-shadow: 
      0 15px 40px rgba(102, 126, 234, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.01);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    animation: none;
    
    &::before {
      display: none;
    }
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.2));
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #ff6b6b;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
  backdrop-filter: blur(10px);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin: 30px 0;
  padding: 25px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1));
  border-radius: 20px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1.1rem;
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Progress Bar Bileşenleri
const ProgressContainer = styled.div`
  margin: 25px 0;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  text-align: center;
`;

const ProgressTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 20px;
  font-weight: 600;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #81C784);
  border-radius: 10px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ProgressPercent = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
`;

// Yeni Bileşenler
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const TabButton = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 15px;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent'};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.1)'};
  }
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(0,0,0,0.4);
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 30px;
`;

const SearchResultsContainer = styled.div`
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
  background: rgba(255,255,255,0.05);
  border-radius: 15px;
  padding: 15px;
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  margin-bottom: 10px;
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.12);
    transform: translateX(5px);
  }
`;

const QualitySelector = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: rgba(255,255,255,0.08);
  border-radius: 15px;
  backdrop-filter: blur(10px);
`;

const QualityLabel = styled.label`
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QualitySelect = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 16px;
  cursor: pointer;
  
  option {
    background: #1a1a2e;
    color: white;
  }
`;

const StatsContainer = styled.div`
  background: rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(102,126,234,0.2), rgba(240,147,251,0.2));
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  color: white;
  
  h3 {
    font-size: 2rem;
    margin-bottom: 5px;
    color: #f093fb;
  }
  
  p {
    opacity: 0.8;
    font-weight: 500;
  }
`;

function App() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [videoCache, setVideoCache] = useState(new Map()); // Cache ekledik
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('');
  
  // Yeni state'ler
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('highestaudio');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); // search, url, stats
  
  // Tema değiştirme
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // İstatistikleri yükle
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  };
  
  // YouTube arama
  const handleYouTubeSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Lütfen arama terimi girin');
      return;
    }
    
    setSearching(true);
    setError('');
    setSearchResults([]);
    
    try {
      console.log('Arama başlatılıyor:', searchQuery);
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Arama cevabı:', data);
      
      if (data.success && data.results) {
        setSearchResults(data.results);
        console.log(`${data.results.length} sonuç bulundu`);
      } else {
        setError(data.error || 'Arama sonuçları alınamadı');
      }
    } catch (error) {
      console.error('Arama hatası:', error);
      setError(`Arama sırasında hata oluştu: ${error.message}`);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!url.trim()) {
      setError('Lütfen geçerli bir YouTube URL\'si girin');
      return;
    }

    // Cache kontrol et
    if (videoCache.has(url)) {
      console.log('Cache\'den video bilgisi alındı');
      setVideoInfo(videoCache.get(url));
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    const startTime = Date.now();
    console.log('Video arama başlatıldı...');

    try {
      const response = await fetch('/api/video-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      const endTime = Date.now();
      console.log(`Video bilgisi alındı: ${endTime - startTime}ms`);

      if (data.success) {
        setVideoInfo(data.data);
        // Cache'e kaydet
        setVideoCache(prev => new Map(prev.set(url, data.data)));
        console.log('Video başarıyla yüklendi:', data.data.title);
      } else {
        setError(data.error || 'Video bilgisi alınamadı');
      }
    } catch (err) {
      console.error('Bağlantı hatası:', err);
      setError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    setDownloadProgress(0);
    setDownloadSpeed('');

    try {
      console.log('İndirme işlemi başlatılıyor...');
      
      const startTime = Date.now();
      let lastTime = startTime;
      let lastLoaded = 0;
      
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, quality: selectedQuality }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        // Content-Type kontrol et
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          // JSON hatası geldi
          const errorData = await response.json();
          setError(errorData.error || 'Bilinmeyen hata');
          return;
        }
        
        // Tahmini dosya boyutunu al
        const estimatedSize = parseInt(response.headers.get('x-estimated-size') || '0');
        
        // Stream okuyucu oluştur
        const reader = response.body.getReader();
        const chunks = [];
        let receivedLength = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          chunks.push(value);
          receivedLength += value.length;
          
          // Progress hesapla
          const progress = estimatedSize > 0 
            ? Math.min(Math.round((receivedLength / estimatedSize) * 100), 99)
            : 0;
          
          setDownloadProgress(progress);
          
          // Hız hesapla
          const currentTime = Date.now();
          if (currentTime - lastTime > 500) { // Her 500ms'de bir güncelle
            const speed = ((receivedLength - lastLoaded) / (currentTime - lastTime)) * 1000; // bytes/second
            const speedMB = (speed / (1024 * 1024)).toFixed(1);
            setDownloadSpeed(`${speedMB} MB/s`);
            lastTime = currentTime;
            lastLoaded = receivedLength;
          }
        }
        
        // Tüm chunk'ları birleştir
        const blob = new Blob(chunks);
        
        console.log('Dosya alındı, boyut:', blob.size);
        
        if (blob.size === 0) {
          setError('Dosya boş geldi, lütfen tekrar deneyin');
          return;
        }
        
        // Progress'i 100% yap
        setDownloadProgress(100);
        
        // Dosya adını response header'dan al
        const contentDisposition = response.headers.get('content-disposition');
        let fileName = `${videoInfo.title}.mp4`;
        
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          if (fileNameMatch) {
            fileName = fileNameMatch[1];
          }
        }
        
        // İndirme link'i oluştur
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.style.display = 'none';
        
        // Link'i DOM'a ekle ve tıkla
        document.body.appendChild(link);
        link.click();
        
        // Temizlik
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        console.log('İndirme tamamlandı!');
        
        // Başarı mesajı göster
        setTimeout(() => {
          setDownloadProgress(0);
          setDownloadSpeed('');
        }, 2000);
        
      } else {
        // Hata durumu
        const errorText = await response.text();
        console.error('Server hatası:', errorText);
        setError(`Server hatası: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('İndirme hatası:', err);
      setError('İndirme sırasında bir hata oluştu: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>
            <FaYoutube color="#ff0000" size="3rem" />
            YouTube MP3 İndirici
            <FaMusic color="#ffd700" size="2.5rem" />
          </Title>
          <Subtitle>
            🎵 YouTube videolarını yüksek kalitede MP3 formatına dönüştürün
          </Subtitle>
          <FeatureIcons>
            <FeatureIcon delay="0s">
              <FaFire />
              <span>Hızlı</span>
            </FeatureIcon>
            <FeatureIcon delay="0.2s">
              <FaVolumeUp />
              <span>Kaliteli</span>
            </FeatureIcon>
            <FeatureIcon delay="0.4s">
              <FaStar />
              <span>Ücretsiz</span>
            </FeatureIcon>
          </FeatureIcons>
        </Header>

        <MainCard>
          <TabContainer>
            <TabButton 
              active={activeTab === 'search'} 
              onClick={() => setActiveTab('search')}
            >
              <FaYoutube /> YouTube Ara
            </TabButton>
            <TabButton 
              active={activeTab === 'url'} 
              onClick={() => setActiveTab('url')}
            >
              <FaDownload /> URL İle İndir
            </TabButton>
            <TabButton 
              active={activeTab === 'stats'} 
              onClick={() => {setActiveTab('stats'); fetchStats();}}
            >
              <FaFire /> İstatistikler
            </TabButton>
          </TabContainer>
          
          <ThemeToggle onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </ThemeToggle>

          {activeTab === 'search' && (
            <SearchContainer>
              <InputWrapper>
                <InputLabel>
                  <FaYoutube />
                  YouTube'da Ara
                </InputLabel>
                <Input
                  type="text"
                  placeholder="Sanatçı, şarkı adı veya anahtar kelime girin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleYouTubeSearch();
                    }
                  }}
                />
              </InputWrapper>
              
              <SearchButton onClick={handleYouTubeSearch} disabled={searching}>
                {searching ? (
                  <>
                    <SpinnerIcon />
                    Aranıyor...
                  </>
                ) : (
                  <>
                    <FaYoutube />
                    YouTube'da Ara
                  </>
                )}
              </SearchButton>
              
              {searchResults.length > 0 && (
                <SearchResultsContainer>
                  <h3 style={{color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <FaYoutube /> Arama Sonuçları ({searchResults.length})
                  </h3>
                  {searchResults.map((result, index) => (
                    <SearchResultItem 
                      key={result.id || index} 
                      onClick={() => {
                        setUrl(result.url); 
                        setActiveTab('url');
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <img 
                        src={result.thumbnail} 
                        alt={result.title} 
                        style={{
                          width: '120px', 
                          height: '90px', 
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }} 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/120x90/667eea/white?text=Video';
                        }}
                      />
                      <div style={{flex: 1}}>
                        <h4 style={{
                          color: 'white', 
                          margin: '0 0 8px 0',
                          fontSize: '1.1rem',
                          fontWeight: '600'
                        }}>
                          {result.title}
                        </h4>
                        <p style={{
                          color: 'rgba(255,255,255,0.7)', 
                          margin: '0 0 5px 0', 
                          fontSize: '0.9rem'
                        }}>
                          🎤 {result.author} • ⏱️ {result.duration}
                        </p>
                        {result.description && (
                          <p style={{
                            color: 'rgba(255,255,255,0.5)', 
                            margin: 0, 
                            fontSize: '0.8rem',
                            fontStyle: 'italic'
                          }}>
                            {result.description}
                          </p>
                        )}
                      </div>
                      <FaPlay style={{color: '#f093fb', fontSize: '1.5rem'}} />
                    </SearchResultItem>
                  ))}
                </SearchResultsContainer>
              )}
            </SearchContainer>
          )}
          
          {activeTab === 'url' && (
            <InputSection>
              <InputWrapper>
                <InputLabel>
                  <FaYoutube />
                  YouTube Video Linki
                </InputLabel>
                <Input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... veya https://music.youtube.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </InputWrapper>
              
              <SearchButton onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <>
                    <SpinnerIcon />
                    Video Aranıyor...
                  </>
                ) : (
                  <>
                    <FaDownload />
                    Video Bilgilerini Getir
                  </>
                )}
              </SearchButton>
            </InputSection>
          )}
          
          {activeTab === 'stats' && stats && (
            <StatsContainer>
              <h2 style={{color: 'white', textAlign: 'center', marginBottom: '30px'}}>
                📈 Kullanım İstatistikleri
              </h2>
              <StatsGrid>
                <StatCard>
                  <h3>{stats.totalDownloads}</h3>
                  <p>Toplam İndirme</p>
                </StatCard>
                <StatCard>
                  <h3>{stats.totalVideos}</h3>
                  <p>Video Sayısı</p>
                </StatCard>
                <StatCard>
                  <h3>{stats.totalSize} MB</h3>
                  <p>Toplam Boyut</p>
                </StatCard>
                <StatCard>
                  <h3>{stats.recentDownloads?.length || 0}</h3>
                  <p>Son İndirmeler</p>
                </StatCard>
              </StatsGrid>
              
              {stats.recentDownloads && stats.recentDownloads.length > 0 && (
                <div>
                  <h3 style={{color: 'white', marginBottom: '15px'}}>Son İndirmeler:</h3>
                  {stats.recentDownloads.map((download, index) => (
                    <div key={index} style={{
                      background: 'rgba(255,255,255,0.1)', 
                      padding: '15px', 
                      marginBottom: '10px',
                      borderRadius: '10px',
                      color: 'white'
                    }}>
                      <strong>{download.title}</strong><br/>
                      <small>{download.size} KB • {download.quality} • {new Date(download.timestamp).toLocaleString('tr-TR')}</small>
                    </div>
                  ))}
                </div>
              )}
            </StatsContainer>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {loading && (
            <LoadingSpinner>
              <SpinnerIcon />
              Video bilgisi alınıyor, lütfen bekleyin...
            </LoadingSpinner>
          )}

          {videoInfo && (
            <>
              <VideoInfo videoInfo={videoInfo} />
              
              {videoInfo.audioFormats && videoInfo.audioFormats.length > 0 && (
                <QualitySelector>
                  <QualityLabel>
                    <FaVolumeUp />
                    Ses Kalitesi Seçin:
                  </QualityLabel>
                  <QualitySelect 
                    value={selectedQuality} 
                    onChange={(e) => setSelectedQuality(e.target.value)}
                  >
                    <option value="highestaudio">En Yüksek Kalite (Otomatik)</option>
                    <option value="lowestaudio">En Düşük Kalite</option>
                    <option value="140">128 kbps (Standart)</option>
                    <option value="139">48 kbps (Düşük)</option>
                  </QualitySelect>
                </QualitySelector>
              )}
              
              {downloading && downloadProgress > 0 && (
                <ProgressContainer>
                  <ProgressTitle>
                    <FaDownload style={{marginRight: '10px'}} />
                    İndiriliyor...
                  </ProgressTitle>
                  <ProgressBarContainer>
                    <ProgressBar progress={downloadProgress} />
                  </ProgressBarContainer>
                  <ProgressInfo>
                    <ProgressPercent>{downloadProgress}%</ProgressPercent>
                    {downloadSpeed && <span>Hız: {downloadSpeed}</span>}
                  </ProgressInfo>
                </ProgressContainer>
              )}
              
              <DownloadButton 
                onDownload={handleDownload} 
                downloading={downloading}
                quality={selectedQuality}
              />
            </>
          )}
        </MainCard>
      </Container>
    </>
  );
}

export default App;