
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TrackCardProps {
  track: {
    id: string | number;
    title: string;
    artist: string;
    coverUrl?: string;
  };
  onPlay: () => void;
  onAdd: () => void;
}

export const TrackCard = ({ track, onPlay, onAdd }: TrackCardProps) => {
  return (
    <div className="track-card bg-card hover:bg-accent/5 transition-colors rounded-lg relative group p-4 flex items-center gap-4">
      <img
        src={track.coverUrl}
        alt={track.title}
        className="w-16 h-16 object-cover rounded cursor-pointer"
        onClick={onPlay}
      />
      <div 
        className="flex-1 min-w-0 overflow-hidden cursor-pointer"
        onClick={onPlay}
      >
        <div className="track-title font-medium">
          {track.title}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {track.artist}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
        className="text-primary hover:text-primary-foreground hover:bg-primary absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
