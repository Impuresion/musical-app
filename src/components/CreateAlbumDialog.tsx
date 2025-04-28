
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Album } from "@/types/types";
import { CreateAlbumForm } from "./album/CreateAlbumForm";
import { ImportAlbumButton } from "./album/ImportAlbumButton";

interface CreateAlbumDialogProps {
  onCreateAlbum: (album: Omit<Album, "id">) => void;
}

export function CreateAlbumDialog({ onCreateAlbum }: CreateAlbumDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-4">
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-primary hover:bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Create Album
          </Button>
        </DialogTrigger>

        <ImportAlbumButton onCreateAlbum={onCreateAlbum} />
      </div>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Album</DialogTitle>
          <DialogDescription>
            Create a new album to organize your music.
          </DialogDescription>
        </DialogHeader>

        <CreateAlbumForm
          onCreateAlbum={onCreateAlbum}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
