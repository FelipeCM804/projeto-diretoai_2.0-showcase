
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    console.log('🚀 [useImageUpload] Iniciando upload da imagem:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setUploading(true);
    setUploadProgress(0);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Imagem deve ser menor que 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `produtos/${fileName}`;

      console.log('📤 [useImageUpload] Fazendo upload do arquivo:', filePath);

      // Upload to Supabase Storage using the correct bucket name
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('produtos-imagens')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ [useImageUpload] Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('✅ [useImageUpload] Upload realizado com sucesso:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('produtos-imagens')
        .getPublicUrl(uploadData.path);

      console.log('🔗 [useImageUpload] URL pública gerada:', urlData.publicUrl);

      setUploadProgress(100);

      console.log('✅ [useImageUpload] Upload concluído com sucesso');

      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ [useImageUpload] Erro ao fazer upload da imagem:', error);
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Não foi possível enviar a imagem.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadImage,
    uploading,
    uploadProgress
  };
};
