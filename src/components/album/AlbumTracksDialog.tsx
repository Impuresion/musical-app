
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Album, Song } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Trash2, Shuffle } from "lucide-react";

interface AlbumTracksDialogProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
  onSongSelect: (song: Song) => void;
  onDeleteSong: (albumId: string | number, songId: string | number) => void;
  currentSong: Song | null;
}

export function AlbumTracksDialog({
  album,
  isOpen,
  onClose,
  onSongSelect,
  onDeleteSong,
  currentSong
}: AlbumTracksDialogProps) {
  if (!album) return null;

  const shuffleAndPlay = () => {
    if (album.songs.length > 0) {
      const shuffledSongs = [...album.songs]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      
      onSongSelect(shuffledSongs[0]);
      album.songs = shuffledSongs;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background/90 border-primary/20 backdrop-blur-sm max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-col items-start">
          <div className="flex items-center w-full mb-4 gap-4">
            {album.coverUrl && (
              <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-primary/10">
                <img 
                  src={album.coverUrl} 
                  alt={album.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col flex-grow">
              <DialogTitle className="text-xl font-bold truncate">
                {album.title}
              </DialogTitle>
              <div className="text-sm text-muted-foreground mt-1">
                {album.songs.length} {album.songs.length === 1 ? 'трек' : 'треков'}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-primary hover:text-primary-foreground hover:bg-primary self-start mt-2"
                onClick={shuffleAndPlay}
              >
                <Shuffle className="h-4 w-4" />
                Перемешать треки
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-1 mt-4 max-h-[calc(90vh-150px)] overflow-y-auto pr-2">
          {album.songs.map((song) => (
            <div
              key={song.id}
              className={`track-card rounded-lg cursor-pointer transition-colors ${
                currentSong?.id === song.id
                  ? "bg-primary/20"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => onSongSelect(song)}
            >
              <div className="flex items-center justify-between w-full p-2">
                {song.coverUrl && (
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={song.coverUrl} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 mr-2">
                  <div className="font-medium truncate">
                    {song.title}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {song.artist}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:text-primary-foreground hover:bg-primary flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSong(album.id, song.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
