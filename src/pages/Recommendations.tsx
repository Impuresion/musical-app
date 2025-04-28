import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import MusicPlayer from "@/components/MusicPlayer";
import { Song } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInView } from "react-intersection-observer";
import { searchTracks, getRecommendations } from "@/lib/jamendo";
import { Button } from "@/components/ui/button";
import { useTracks } from "@/contexts/TracksContext";

const ADDED_SONGS_ALBUM_ID = 1;
const ADDED_SONGS_ALBUM_TITLE = "Added Songs";

const Recommendations = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { ref, inView } = useInView();
  const { albums, setAlbums } = useTracks();

  const DEFAULT_ALBUM_ID = "default-album";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ['tracks', searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      if (searchQuery) {
        return searchTracks(searchQuery, pageParam);
      }
      return getRecommendations(pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.length * 20;
      return loadedItems < lastPage.total ? loadedItems : undefined;
    },
    initialPageParam: 0,
  });

  const addToMyMusic = (track: any) => {
    const newSong: Song = {
      id: String(track.id),
      title: track.title,
      artist: track.artist,
      url: track.url,
      coverUrl: track.coverUrl
    };

    let defaultAlbum = albums.find(album => String(album.id) === DEFAULT_ALBUM_ID);
    
    if (!defaultAlbum) {
      defaultAlbum = {
        id: DEFAULT_ALBUM_ID,
        title: "Added Songs",
        theme: "default",
        songs: []
      };
      setAlbums([...albums, defaultAlbum]);
      defaultAlbum = albums[albums.length];
    }

    const songExists = albums.some(album => 
      album.songs.some(song => String(song.id) === String(newSong.id))
    );

    if (songExists) {
      toast({
        description: "Этот трек уже добавлен в вашу музыку",
      });
      return;
    }

    const updatedAlbums = albums.map(album => {
      if (String(album.id) === DEFAULT_ALBUM_ID) {
        return {
          ...album,
          songs: [...album.songs, newSong]
        };
      }
      return album;
    });

    setAlbums(updatedAlbums);
    toast({
      description: "Трек добавлен в вашу музыку",
    });
  };

  if (isError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load tracks. Please try again later.",
    });
  }

  const allTracks = data?.pages.flatMap((page) => page.tracks) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <Navigation />
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tracks or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTracks.map((track) => (
            <Card 
              key={track.id}
              className="bg-card hover:bg-accent/5 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={track.coverUrl} />
                    <AvatarFallback>{track.title[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="font-medium truncate cursor-pointer"
                      onClick={() => setCurrentSong(track)}
                    >
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
                      addToMyMusic(track);
                    }}
                    className="text-primary hover:text-primary-foreground hover:bg-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(hasNextPage || isFetchingNextPage) && (
          <div
            ref={ref}
            className="flex justify-center p-4 mt-4"
          >
            {isFetchingNextPage && (
              <p className="text-muted-foreground">Loading more tracks...</p>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 w-full">
        <MusicPlayer 
          currentSong={currentSong}
          onNext={() => {
            if (allTracks && currentSong) {
              const currentIndex = allTracks.findIndex(
                track => String(track.id) === String(currentSong.id)
              );
              const nextTrack = allTracks[(currentIndex + 1) % allTracks.length];
              setCurrentSong(nextTrack);
            }
          }}
          onPrevious={() => {
            if (allTracks && currentSong) {
              const currentIndex = allTracks.findIndex(
                track => String(track.id) === String(currentSong.id)
              );
              const prevIndex = currentIndex - 1 < 0 ? allTracks.length - 1 : currentIndex - 1;
              const prevTrack = allTracks[prevIndex];
              setCurrentSong(prevTrack);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Recommendations;
