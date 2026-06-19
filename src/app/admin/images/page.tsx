"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  Link,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface ImageData {
  url: string;
  name: string;
  size: number;
  createdAt: string;
}

export default function AdminImages() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");

      toast({ title: "Image uploadée", description: `${file.name} a été ajoutée.` });
      loadImages();
    } catch {
      toast({ title: "Erreur", description: "Échec de l'upload", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyUrl = (url: string, index: number) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({ title: "URL copiée", description: "Lien de l'image copié dans le presse-papier." });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion des Images
          </h1>
          <p className="text-muted-foreground mt-1">
            Uploader et gérer vos images pour le portfolio.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
            <Upload className="w-4 h-4" />
            {uploading ? "Upload..." : "Uploader une image"}
          </Button>
        </div>
      </motion.div>

      {images.length === 0 ? (
        <motion.div variants={item}>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                Aucune image
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
                Uploader vos images pour les utiliser dans le portfolio (avatar, projets, blog...).
              </p>
              <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Upload className="w-4 h-4" />
                Uploader une image
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <motion.div
              key={img.name}
              variants={item}
              className="group relative rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8"
                  onClick={() => copyUrl(img.url, index)}
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Link className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + img.url);
                    toast({ title: "URL copiée", description: "Lien de l'image copié." });
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-2 border-t border-border">
                <p className="text-xs truncate text-muted-foreground">{img.name}</p>
                <p className="text-[10px] text-muted-foreground/60">{formatSize(img.size)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
