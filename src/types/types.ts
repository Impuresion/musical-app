
export interface Song {
  id: string | number;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
  albumTitle?: string;
  theme?: string;
}

export interface Album {
  id: string | number;
  title: string;
  theme?: string;
  coverUrl?: string;
  songs: Song[];
}

// Instead of declaring globally, we'll create a module declaration
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    webkitdirectory?: boolean;
    directory?: boolean;
  }
}
