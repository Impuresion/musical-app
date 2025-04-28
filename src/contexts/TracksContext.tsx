
import { createContext, useContext, useState, useEffect } from "react";
import { Song, Album } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

interface TracksContextType {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  currentAlbum: Album | null;
  setCurrentAlbum: (album: Album | null) => void;
}

const TracksContext = createContext<TracksContextType | undefined>(undefined);

const DB_NAME = 'music-player-db';
const DB_VERSION = 1;
const ALBUMS_STORE = 'albums';
const CURRENT_SONG_STORE = 'currentSong';
const CURRENT_ALBUM_STORE = 'currentAlbum';

// Define a consistent default album ID
const DEFAULT_ALBUM_ID = "default-album";

export function TracksProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);

  // Initialize IndexedDB
  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      toast({
        title: "Ошибка",
        description: "Не удалось инициализировать хранилище",
        variant: "destructive",
      });
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(ALBUMS_STORE)) {
        db.createObjectStore(ALBUMS_STORE);
      }
      if (!db.objectStoreNames.contains(CURRENT_SONG_STORE)) {
        db.createObjectStore(CURRENT_SONG_STORE);
      }
      if (!db.objectStoreNames.contains(CURRENT_ALBUM_STORE)) {
        db.createObjectStore(CURRENT_ALBUM_STORE);
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Load initial data
      const albumsTransaction = db.transaction(ALBUMS_STORE, 'readonly');
      const albumsStore = albumsTransaction.objectStore(ALBUMS_STORE);
      const albumsRequest = albumsStore.get('albums');

      albumsRequest.onsuccess = () => {
        let loadedAlbums = albumsRequest.result || [];
        
        // Ensure "Added Songs" album exists
        const defaultAlbumExists = loadedAlbums.some(
          (album: Album) => String(album.id) === DEFAULT_ALBUM_ID
        );
        
        if (!defaultAlbumExists) {
          loadedAlbums = [
            ...loadedAlbums,
            {
              id: DEFAULT_ALBUM_ID,
              title: "Added Songs",
              songs: []
            }
          ];
        }
        
        setAlbums(loadedAlbums);
      };

      const currentSongTransaction = db.transaction(CURRENT_SONG_STORE, 'readonly');
      const currentSongStore = currentSongTransaction.objectStore(CURRENT_SONG_STORE);
      const currentSongRequest = currentSongStore.get('currentSong');

      currentSongRequest.onsuccess = () => {
        if (currentSongRequest.result) {
          setCurrentSong(currentSongRequest.result);
        }
      };

      const currentAlbumTransaction = db.transaction(CURRENT_ALBUM_STORE, 'readonly');
      const currentAlbumStore = currentAlbumTransaction.objectStore(CURRENT_ALBUM_STORE);
      const currentAlbumRequest = currentAlbumStore.get('currentAlbum');

      currentAlbumRequest.onsuccess = () => {
        if (currentAlbumRequest.result) {
          setCurrentAlbum(currentAlbumRequest.result);
        }
      };

      setIsDbReady(true);
    };
  }, [toast]);

  // Save albums to IndexedDB whenever they change
  useEffect(() => {
    if (!isDbReady || albums.length === 0) return;

    // Ensure "Added Songs" album exists before saving
    const defaultAlbumExists = albums.some(album => String(album.id) === DEFAULT_ALBUM_ID);
    
    const albumsToSave = defaultAlbumExists 
      ? albums 
      : [
          ...albums,
          {
            id: DEFAULT_ALBUM_ID,
            title: "Added Songs",
            songs: []
          }
        ];

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(ALBUMS_STORE, 'readwrite');
      const store = transaction.objectStore(ALBUMS_STORE);
      store.put(albumsToSave, 'albums');
    };
  }, [albums, isDbReady]);

  // Save current song to IndexedDB whenever it changes
  useEffect(() => {
    if (!isDbReady) return;

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(CURRENT_SONG_STORE, 'readwrite');
      const store = transaction.objectStore(CURRENT_SONG_STORE);
      store.put(currentSong, 'currentSong');
    };
  }, [currentSong, isDbReady]);

  // Save current album to IndexedDB whenever it changes
  useEffect(() => {
    if (!isDbReady) return;

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(CURRENT_ALBUM_STORE, 'readwrite');
      const store = transaction.objectStore(CURRENT_ALBUM_STORE);
      store.put(currentAlbum, 'currentAlbum');
    };
  }, [currentAlbum, isDbReady]);

  return (
    <TracksContext.Provider
      value={{
        albums,
        setAlbums,
        currentSong,
        setCurrentSong,
        currentAlbum,
        setCurrentAlbum,
      }}
    >
      {children}
    </TracksContext.Provider>
  );
}

export function useTracks() {
  const context = useContext(TracksContext);
  if (context === undefined) {
    throw new Error("useTracks must be used within a TracksProvider");
  }
  return context;
}
