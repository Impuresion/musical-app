
import { TrackCard } from "./TrackCard";
import { Song } from "@/types/types";

interface TrackListProps {
  tracks: any[];
  isLoading: boolean;
  query: string;
  onTrackPlay: (track: any) => void;
  onTrackAdd: (track: any) => void;
}

export const TrackList = ({ tracks, isLoading, query, onTrackPlay, onTrackAdd }: TrackListProps) => {
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (query.length === 0) {
    return (
      <div className="col-span-full text-center text-muted-foreground">
        Введите запрос для поиска треков
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          onPlay={() => onTrackPlay(track)}
          onAdd={() => onTrackAdd(track)}
        />
      ))}
    </div>
  );
};
