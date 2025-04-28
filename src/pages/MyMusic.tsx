
import { useState, useEffect } from "react";
import { Album, Song } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateAlbumDialog } from "@/components/CreateAlbumDialog";
import MusicPlayer from "@/components/MusicPlayer";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Trash2, Music } from "lucide-react";
import { AlbumTracksDialog } from "@/components/album/AlbumTracksDialog";
import { useTracks } from "@/contexts/TracksContext";

const MyMusic = () => {
  const { albums, setAlbums, currentAlbum, setCurrentAlbum, currentSong, setCurrentSong } = useTracks();
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const { toast } = useToast();

  // Use the same consistent DEFAULT_ALBUM_ID as in TracksContext
  const DEFAULT_ALBUM_ID = "default-album";

  // Add an effect to ensure the "Added Songs" album always exists
  useEffect(() => {
    const defaultAlbum = albums.find(album => String(album.id) === DEFAULT_ALBUM_ID);
    
    if (!defaultAlbum) {
      const newDefaultAlbum: Album = {
        id: DEFAULT_ALBUM_ID,
        title: "Added Songs",
        theme: "default",
        songs: []
      };
      setAlbums([...albums, newDefaultAlbum]);
    }
  }, [albums, setAlbums]);

  const handleCreateAlbum = (album: Omit<Album, "id">) => {
    const newAlbum: Album = {
      ...album,
      id: Date.now(),
    };
    setAlbums([...albums, newAlbum]);
    toast({ title: "Альбом создан!", description: album.title });
  };

  const handleDeleteAlbum = (albumToDelete: Album) => {
    // Prevent deletion of the default "Added Songs" album
    if (String(albumToDelete.id) === DEFAULT_ALBUM_ID) {
      toast({ 
        title: "Невозможно удалить",
        description: "Альбом 'Added Songs' нельзя удалить",
        variant: "destructive"
      });
      return;
    }

    setAlbums(albums.filter(album => album.id !== albumToDelete.id));
    if (currentAlbum?.id === albumToDelete.id) {
      setCurrentAlbum(null);
      setCurrentSong(null);
      setIsAlbumDialogOpen(false);
    }
    toast({ title: "Альбом удален!" });
  };

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    const albumWithSong = albums.find(album => 
      album.songs.some(s => s.id === song.id)
    );
    if (albumWithSong) {
      setCurrentAlbum(albumWithSong);
    }
  };

  const handleDeleteSong = (albumId: number | string, songId: string | number) => {
    setAlbums(albums.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          songs: album.songs.filter(song => song.id !== songId),
        };
      }
      return album;
    }));
    if (currentSong?.id === songId) {
      setCurrentSong(null);
    }
    toast({ title: "Трек удален!" });
  };

  const handleNextSong = () => {
    if (currentAlbum && currentSong) {
      const currentIndex = currentAlbum.songs.findIndex(
        song => song.id === currentSong.id
      );
      const nextSong = currentAlbum.songs[(currentIndex + 1) % currentAlbum.songs.length];
      setCurrentSong(nextSong);
    }
  };

  const handlePreviousSong = () => {
    if (currentAlbum && currentSong) {
      const currentIndex = currentAlbum.songs.findIndex(
        song => song.id === currentSong.id
      );
      const previousSong = currentAlbum.songs[
        (currentIndex - 1 + currentAlbum.songs.length) % currentAlbum.songs.length
      ];
      setCurrentSong(previousSong);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
      <div className="container mx-auto py-6 relative">
        <Navigation />
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <CreateAlbumDialog onCreateAlbum={handleCreateAlbum} />
            <SettingsDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 albums-container">
          {albums.map((album) => (
            <Card
              key={album.id}
              className="cursor-pointer transition-colors hover:bg-accent/5 border-primary/10 relative overflow-hidden"
              onClick={() => {
                setCurrentAlbum(album);
                setIsAlbumDialogOpen(true);
              }}
            >
              <CardContent className="p-0">
                <div 
                  className="relative h-40 w-full bg-primary/5 flex items-center justify-center"
                >
                  {album.coverUrl ? (
                    <img 
                      src={album.coverUrl} 
                      alt={album.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : album.songs[0]?.coverUrl ? (
                    <img 
                      src={album.songs[0].coverUrl} 
                      alt={album.songs[0].title} 
                      className="w-full h-full object-cover opacity-70"
                    />
                  ) : (
                    <Music className="w-20 h-20 text-primary/50" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{album.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {album.songs.length} {album.songs.length === 1 ? 'трек' : 'треков'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary hover:text-primary-foreground hover:bg-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAlbum(album);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AlbumTracksDialog
        album={currentAlbum}
        isOpen={isAlbumDialogOpen}
        onClose={() => setIsAlbumDialogOpen(false)}
        onSongSelect={handleSongSelect}
        onDeleteSong={handleDeleteSong}
        currentSong={currentSong}
      />

      <div className="fixed bottom-0 left-0 right-0">
        <MusicPlayer
          currentSong={currentSong}
          onNext={handleNextSong}
          onPrevious={handlePreviousSong}
        />
      </div>
    </div>
  );
};

export default MyMusic;
