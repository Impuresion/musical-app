
import { ChevronDown, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Song } from "@/types/types";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExpandedPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onCollapse: () => void;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
  onShuffleToggle: () => void;
}

export function ExpandedPlayer({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onCollapse,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onShuffleToggle,
}: ExpandedPlayerProps) {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-lg z-50 flex flex-col expanded-player">
      <div className="flex justify-between items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className="text-foreground hover:text-primary"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onShuffleToggle}
          className="text-foreground hover:text-primary"
        >
          <Shuffle className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-4">
        <div className="expanded-player-artwork rounded-lg overflow-hidden shadow-xl md:w-[400px] md:h-[400px] w-[300px] h-[300px]">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full max-w-xl space-y-2 text-center">
          <h2 className="text-2xl font-bold text-foreground truncate">
            {currentSong.title}
          </h2>
          <p className="text-lg text-muted-foreground truncate">
            {currentSong.artist}
          </p>
        </div>

        <div className="expanded-player-controls w-full max-w-2xl px-4 space-y-6">
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            onNext={onNext}
            onPrevious={onPrevious}
            disabled={false}
          />

          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
            disabled={false}
          />

          {!isMobile && (
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={onVolumeChange}
              onMuteToggle={onMuteToggle}
              disabled={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
