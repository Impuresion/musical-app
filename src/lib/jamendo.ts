
const JAMENDO_CLIENT_ID = '7bbfce21';
const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';

export const searchTracks = async (query: string, offset: number = 0) => {
  const response = await fetch(
    `${JAMENDO_API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&offset=${offset}&search=${encodeURIComponent(query)}&include=musicinfo&groupby=artist_id`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search tracks');
  }
  
  const data = await response.json();
  return {
    tracks: data.results.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      coverUrl: track.image,
      url: track.audio,
    })),
    total: data.headers.results_count,
  };
};

export const getRecommendations = async (offset: number = 0) => {
  const response = await fetch(
    `${JAMENDO_API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&offset=${offset}&ordering=popularity_total&boost=popularity_month`
  );
  
  if (!response.ok) {
    throw new Error('Failed to get recommendations');
  }
  
  const data = await response.json();
  return {
    tracks: data.results.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      coverUrl: track.image,
      url: track.audio,
    })),
    total: data.headers.results_count,
  };
};
