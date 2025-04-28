
import { Slider } from "@/components/ui/slider";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
  disabled: boolean;
}

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
  disabled
}: ProgressBarProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs sm:text-sm tabular-nums text-gray-400 min-w-[40px] text-right">
        {formatTime(currentTime)}
      </span>
      
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={1}
        onValueChange={onSeek}
        disabled={disabled}
        className="flex-1 md:w-auto"
      />
      
      <span className="text-xs sm:text-sm tabular-nums text-gray-400 min-w-[40px]">
        {formatTime(duration)}
      </span>
    </div>
  );
}
