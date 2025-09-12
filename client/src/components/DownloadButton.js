import React from 'react';
import styled from 'styled-components';
import { FaDownload, FaSpinner } from 'react-icons/fa';

const DownloadSection = styled.div`
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
`;

const DownloadTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const DownloadDescription = styled.p`
  opacity: 0.9;
  margin-bottom: 25px;
  font-size: 1rem;
`;

const DownloadBtn = styled.button`
  background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
  color: white;
  border: none;
  padding: 18px 45px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s ease;
  display: inline-flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 8px 30px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
  
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
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 15px 40px rgba(76, 175, 80, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #bbb 0%, #999 100%);
    color: #666;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    
    &::before {
      display: none;
    }
  }
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const QualityInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.9rem;
`;

const DownloadButton = ({ onDownload, downloading, quality = 'highestaudio' }) => {
  return (
    <DownloadSection>
      <DownloadTitle>MP3 Olarak İndir</DownloadTitle>
      <DownloadDescription>
        Video yüksek kaliteli MP3 formatına dönüştürülecek ve cihazınıza indirilecek
      </DownloadDescription>
      
      <DownloadBtn onClick={onDownload} disabled={downloading}>
        {downloading ? (
          <>
            <SpinnerIcon />
            İndiriliyor...
          </>
        ) : (
          <>
            <FaDownload />
            MP3 İndir
          </>
        )}
      </DownloadBtn>
      
      <QualityInfo>
        <strong>Seçili Kalite:</strong> {quality === 'highestaudio' ? 'En Yüksek' : quality} • <strong>Format:</strong> .mp3
      </QualityInfo>
    </DownloadSection>
  );
};

export default DownloadButton;