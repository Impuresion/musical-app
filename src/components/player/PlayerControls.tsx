import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  disabled: boolean;
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  disabled
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onPrevious}
        disabled={disabled || !onPrevious}
        className="text-primary hover:text-primary-foreground hover:bg-primary disabled:text-muted-foreground h-8 w-8 sm:h-10 sm:w-10 bg-black"
      >
        <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onPlayPause}
        disabled={disabled}
        className="h-10 w-10 sm:h-12 sm:w-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:border-muted disabled:text-muted-foreground bg-black"
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <Play className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onNext}
        disabled={disabled || !onNext}
        className="text-primary hover:text-primary-foreground hover:bg-primary disabled:text-muted-foreground h-8 w-8 sm:h-10 sm:w-10 bg-black"
      >
        <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
}