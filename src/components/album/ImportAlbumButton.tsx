
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Album, Song } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

interface ImportAlbumButtonProps {
  onCreateAlbum: (album: Omit<Album, "id">) => void;
}

export function ImportAlbumButton({ onCreateAlbum }: ImportAlbumButtonProps) {
  const { toast } = useToast();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImportAlbum = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) {
        toast({
          title: "Ошибка",
          description: "Не выбраны файлы для импорта",
          variant: "destructive",
        });
        return;
      }

      const path = files[0].webkitRelativePath;
      if (!path) {
        toast({
          title: "Ошибка",
          description: "Выберите папку с музыкой",
          variant: "destructive",
        });
        return;
      }

      const albumName = path.split('/')[0];
      if (!albumName) {
        toast({
          title: "Ошибка",
          description: "Не удалось определить название альбома",
          variant: "destructive",
        });
        return;
      }

      let coverFile: File | null = null;
      const musicFiles: File[] = [];

      for (const file of Array.from(files)) {
        if (file.type.startsWith('audio/')) {
          musicFiles.push(file);
        } else if (file.type.startsWith('image/') && !coverFile) {
          coverFile = file;
        }
      }

      if (musicFiles.length === 0) {
        toast({
          title: "Ошибка",
          description: "В папке не найдены музыкальные файлы",
          variant: "destructive",
        });
        return;
      }

      let coverUrl: string | undefined = undefined;
      if (coverFile) {
        coverUrl = await convertFileToBase64(coverFile);
      }

      const songs: Song[] = await Promise.all(
        musicFiles.map(async (file, index) => ({
          id: Date.now() + index,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          url: await convertFileToBase64(file),
          coverUrl: coverUrl
        }))
      );

      onCreateAlbum({
        title: albumName,
        theme: "Imported",
        coverUrl,
        songs: songs
      });

      toast({
        title: "Альбом импортирован",
        description: `Альбом "${albumName}" успешно импортирован с ${songs.length} треками`,
      });
    } catch (error) {
      console.error('Error importing album:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при импорте альбома",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full border-primary text-[hsl(var(--button-text-color))] hover:bg-primary hover:text-[hsl(var(--button-text-color))]"
      onClick={(e) => {
        e.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.multiple = true;
        input.onchange = (e) => handleImportAlbum(e as any);
        input.click();
      }}
    >
      <Upload className="mr-2 h-4 w-4" />
      Import Album
    </Button>
  );
}
