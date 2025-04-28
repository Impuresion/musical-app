
import { useState, useRef, useEffect } from "react";
import { Song } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlayerControls } from "./player/PlayerControls";
import { ProgressBar } from "./player/ProgressBar";
import { VolumeControl } from "./player/VolumeControl";
import { ExpandedPlayer } from "./player/ExpandedPlayer";
import { ChevronUp } from "lucide-react";

interface MusicPlayerProps {
  currentSong: Song | null;
  onNext?: () => void;
  onPrevious?: () => void;
}

const STORAGE_KEYS = {
  POSITION: 'player-position',
  SONG_ID: 'player-song-id',
  VOLUME: 'player-volume',
  MUTED: 'player-muted',
};

const MusicPlayer = ({ currentSong, onNext, onPrevious }: MusicPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
    return savedVolume ? Number(savedVolume) : 1;
  });
  const [isMuted, setIsMuted] = useState(() => {
    const savedMuted = localStorage.getItem(STORAGE_KEYS.MUTED);
    return savedMuted ? savedMuted === 'true' : false;
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastSongIdRef = useRef<string | null>(localStorage.getItem(STORAGE_KEYS.SONG_ID));

  // Initialize volume and muted state on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, []);

  // Handle song change
  useEffect(() => {
    if (currentSong) {
      if (audioRef.current) {
        // Reset playback state for new song
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setIsPlaying(false);
        
        // Apply current volume and muted settings
        audioRef.current.volume = volume;
        audioRef.current.muted = isMuted;
        
        // Update last played song ID
        const songId = String(currentSong.id); // Convert to string explicitly
        lastSongIdRef.current = songId;
        localStorage.setItem(STORAGE_KEYS.SONG_ID, songId);
      }
    }
  }, [currentSong]);

  // Save position periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (audioRef.current && currentSong && isPlaying) {
        localStorage.setItem(STORAGE_KEYS.POSITION, String(audioRef.current.currentTime));
      }
    }, 1000);

    return () => clearInterval(saveInterval);
  }, [currentSong, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
      localStorage.setItem(STORAGE_KEYS.MUTED, String(newMuted));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    localStorage.setItem(STORAGE_KEYS.VOLUME, String(newVolume));
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onNext) {
      onNext();
    }
  };

  const handleShuffleToggle = () => {
    // Implement shuffle functionality here
    console.log("Shuffle toggled");
  };

  if (!currentSong) return null;

  return (
    <>
      {isExpanded && (
        <ExpandedPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          onCollapse={() => setIsExpanded(false)}
          onPlayPause={togglePlay}
          onNext={onNext}
          onPrevious={onPrevious}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={toggleMute}
          onShuffleToggle={handleShuffleToggle}
        />
      )}

      <div className="border-t border-primary/10 bg-background/80 backdrop-blur-lg p-4 w-full">
        <audio
          ref={audioRef}
          src={currentSong?.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                <AvatarImage src={currentSong.coverUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentSong.title[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate text-foreground text-sm sm:text-base">
                  {currentSong.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {currentSong.artist}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(true)}
                className="text-primary hover:text-primary-foreground hover:bg-primary"
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
            </div>

            <PlayerControls
              isPlaying={isPlaying}
              onPlayPause={togglePlay}
              onNext={onNext}
              onPrevious={onPrevious}
              disabled={!currentSong}
            />

            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              disabled={!currentSong}
            />

            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
              disabled={!currentSong}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
