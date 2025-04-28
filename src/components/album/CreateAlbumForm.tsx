
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Album } from "@/types/types";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CreateAlbumFormProps {
  onCreateAlbum: (album: Omit<Album, "id">) => void;
  onClose: () => void;
}

export function CreateAlbumForm({ onCreateAlbum, onClose }: CreateAlbumFormProps) {
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [withCover, setWithCover] = useState<boolean | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title || !theme) return;

    let coverUrl: string | undefined = undefined;
    if (withCover && coverFile) {
      coverUrl = URL.createObjectURL(coverFile);
    }

    onCreateAlbum({
      title,
      theme,
      coverUrl,
      songs: []
    });

    toast({
      title: "Альбом создан",
      description: `Альбом "${title}" успешно создан`,
    });
    
    onClose();
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right text-white">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3 bg-gray-900 border-gray-700 text-white"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="theme" className="text-right text-white">
            Theme
          </Label>
          <Input
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="col-span-3 bg-gray-900 border-gray-700 text-white"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cover" className="text-right text-white">
            Cover
          </Label>
          <div className="col-span-3 flex gap-4">
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="bg-gray-900 border-gray-700 text-white"
              disabled={!withCover}
            />
            <Button
              variant="outline"
              onClick={() => setWithCover(!withCover)}
              className="border-primary text-accent hover:bg-primary"
            >
              {withCover ? "Without Cover" : "With Cover"}
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleSubmit}
          className="bg-primary text-[hsl(var(--button-text-color))] hover:bg-primary/90"
          disabled={!title || !theme}
        >
          Create Album
        </Button>
      </DialogFooter>
    </>
  );
}
