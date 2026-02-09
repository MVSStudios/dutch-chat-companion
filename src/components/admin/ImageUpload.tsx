import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUpload = ({ images, onImagesChange }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("motorhome-images")
        .upload(fileName, file);

      if (error) {
        toast.error(`Fout bij uploaden van ${file.name}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("motorhome-images")
        .getPublicUrl(fileName);

      newUrls.push(publicUrl);
    }

    onImagesChange([...images, ...newUrls]);
    setUploading(false);
    // Reset input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-0.5 top-0.5 rounded-full bg-destructive p-0.5 text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2">
        <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
          <span>
            {uploading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Upload className="mr-1 h-4 w-4" />}
            {uploading ? "Uploaden..." : "Foto's uploaden"}
          </span>
        </Button>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
