
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SearchBar } from "@/components/browse/SearchBar";
import MusicPlayer from "@/components/MusicPlayer";
import { useTracks } from "@/contexts/TracksContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResult {
  title: string;
  url: string;
  description: string;
  type: "video" | "music" | "website";
}

const getSearchResults = (query: string): SearchResult[] => {
  if (!query) return [];
  
  // Реальные ссылки для результатов поиска
  return [
    {
      title: `${query} - YouTube`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      description: `Найдите видео и музыку по запросу "${query}" на YouTube`,
      type: "video"
    },
    {
      title: `${query} - Spotify`,
      url: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
      description: `Слушайте треки и плейлисты "${query}" на Spotify`,
      type: "music"
    },
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, "_"))}`,
      description: `Информация о "${query}" на Wikipedia`,
      type: "website"
    },
    {
      title: `${query} - Google`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      description: `Результаты поиска по запросу "${query}" в Google`,
      type: "website"
    },
    {
      title: `${query} - SoundCloud`,
      url: `https://soundcloud.com/search?q=${encodeURIComponent(query)}`,
      description: `Слушайте треки и плейлисты на SoundCloud по запросу "${query}"`,
      type: "music"
    }
  ];
};

const Browse = () => {
  const [query, setQuery] = useState("");
  const { currentSong } = useTracks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  
  const searchResults = getSearchResults(query);

  const handleLinkClick = (url: string) => {
    setCurrentUrl(url);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
      <div className="container mx-auto py-6 relative">
        <Navigation />
        <SearchBar query={query} onQueryChange={setQuery} />
        
        {query && (
          <div className="mt-6 space-y-4">
            {searchResults.map((result, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg bg-card border border-primary/10 cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={() => handleLinkClick(result.url)}
              >
                <h3 className="text-lg font-medium mb-1">{result.title}</h3>
                <div className="text-sm text-muted-foreground mb-2">{result.url}</div>
                <p className="text-sm">{result.description}</p>
                <div className="mt-2">
                  <span className="inline-block text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {result.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!query && (
          <div className="flex flex-col items-center justify-center mt-20">
            <h2 className="text-2xl font-bold mb-4">Search the Web</h2>
            <p className="text-center text-muted-foreground max-w-md">
              Type something in the search bar above to find music, videos, and information on the web.
            </p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-background/95 border-primary/20 backdrop-blur-sm max-w-4xl w-full max-h-[80vh] p-0">
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-primary/10">
            <DialogTitle className="text-xl font-bold truncate">
              {currentUrl}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="overflow-auto h-full w-full">
            <iframe 
              src={currentUrl.startsWith('http') ? currentUrl : `https://example.com`} 
              title="Web content"
              className="w-full h-[60vh] border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-0 left-0 right-0">
        <MusicPlayer
          currentSong={currentSong}
        />
      </div>
    </div>
  );
};

export default Browse;
