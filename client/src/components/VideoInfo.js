import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEye, FaClock, FaUser, FaPlay, FaHeart } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const VideoCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 35px;
  margin-bottom: 35px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    border-radius: 25px 25px 0 0;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
`;

const VideoHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Thumbnail = styled.img`
  width: 240px;
  height: 180px;
  object-fit: cover;
  border-radius: 20px;
  flex-shrink: 0;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 220px;
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    background: white;
  }
  
  svg {
    color: #667eea;
    font-size: 1.5rem;
    margin-left: 3px;
  }
`;

const VideoDetails = styled.div`
  flex: 1;
  color: white;
`;

const VideoTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 20px;
  line-height: 1.4;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
`;

const VideoMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 20px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  svg {
    color: #f093fb;
    filter: drop-shadow(0 0 5px rgba(240, 147, 251, 0.5));
  }
`;

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatViews = (views) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

const VideoInfo = ({ videoInfo }) => {
  return (
    <VideoCard>
      <VideoHeader>
        <ThumbnailContainer>
          <Thumbnail src={videoInfo.thumbnail} alt={videoInfo.title} />
          <PlayButton>
            <FaPlay />
          </PlayButton>
        </ThumbnailContainer>
        <VideoDetails>
          <VideoTitle>{videoInfo.title}</VideoTitle>
          <VideoMeta>
            <MetaItem>
              <FaUser />
              {videoInfo.author}
            </MetaItem>
            <MetaItem>
              <FaClock />
              {formatDuration(videoInfo.duration)}
            </MetaItem>
            <MetaItem>
              <FaEye />
              {formatViews(videoInfo.views)} görüntüleme
            </MetaItem>
          </VideoMeta>
        </VideoDetails>
      </VideoHeader>
    </VideoCard>
  );
};

export default VideoInfo;