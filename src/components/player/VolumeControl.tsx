import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
  disabled: boolean;
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  disabled
}: VolumeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onMuteToggle}
        disabled={disabled}
        className="text-primary hover:text-primary-foreground hover:bg-primary disabled:text-muted-foreground h-8 w-8 sm:h-10 sm:w-10"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </Button>
      
      <Slider
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={onVolumeChange}
        disabled={disabled}
        className="w-20 sm:w-28"
      />
    </div>
  );
}