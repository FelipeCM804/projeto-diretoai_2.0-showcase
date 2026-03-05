
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon, X, Camera } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useIsMobile } from '@/hooks/use-mobile';
import { forceUpdatePersistentState } from '@/hooks/usePersistentState';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export const ImageUpload = ({ value, onChange, onRemove, className }: ImageUploadProps) => {
  const { uploadImage, uploading, uploadProgress } = useImageUpload();
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();

  // Sincronização aprimorada do preview com value prop
  useEffect(() => {
    console.log('🔄 [ImageUpload] Sincronizando preview com value prop:', { 
      currentValue: value, 
      currentPreview: preview,
      isProcessing,
      uploading
    });
    
    if (value && value !== preview && !isProcessing) {
      console.log('🖼️ [ImageUpload] Atualizando preview para nova URL:', value);
      setPreview(value);
    }
  }, [value, preview, isProcessing]);

  // Detectar retorno de câmera e restaurar estado
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !uploading && !isProcessing) {
        console.log('📱 [ImageUpload] App voltou para foreground, verificando sincronização...');
        
        // Verificar se existe uma URL no localStorage que não está sendo exibida
        const currentVariante = localStorage.getItem('produtos_current_variante');
        if (currentVariante) {
          try {
            const varianteData = JSON.parse(currentVariante);
            if (varianteData.url_imagem && varianteData.url_imagem !== preview) {
              console.log('🔧 [ImageUpload] Recuperando URL da imagem do localStorage:', varianteData.url_imagem);
              setPreview(varianteData.url_imagem);
              onChange(varianteData.url_imagem);
            }
          } catch (error) {
            console.error('❌ [ImageUpload] Erro ao recuperar dados do localStorage:', error);
          }
        }
      }
    };

    const handleFocus = () => {
      if (!uploading && !isProcessing) {
        console.log('🎯 [ImageUpload] Window focus detectado, verificando estado...');
        handleVisibilityChange();
      }
    };

    // Listener customizado para atualizações do persistent state
    const handlePersistentStateUpdate = (event: CustomEvent) => {
      const { key, value } = event.detail;
      if (key === 'produtos_current_variante' && value?.url_imagem && value.url_imagem !== preview) {
        console.log('🔄 [ImageUpload] Detectada atualização de estado persistente:', value.url_imagem);
        setPreview(value.url_imagem);
        onChange(value.url_imagem);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('persistentStateUpdate', handlePersistentStateUpdate as EventListener);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('persistentStateUpdate', handlePersistentStateUpdate as EventListener);
    };
  }, [preview, onChange, uploading, isProcessing]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      console.log('❌ [ImageUpload] Nenhum arquivo selecionado');
      return;
    }

    console.log('📁 [ImageUpload] Arquivo selecionado:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    setIsProcessing(true);

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    console.log('👁️ [ImageUpload] Preview URL criada:', previewUrl);

    try {
      // Upload file
      console.log('📤 [ImageUpload] Iniciando upload...');
      const uploadedUrl = await uploadImage(file);
      
      if (uploadedUrl) {
        console.log('✅ [ImageUpload] Upload concluído, processando URL:', uploadedUrl);
        
        // Atualizar preview e chamar onChange
        setPreview(uploadedUrl);
        onChange(uploadedUrl);
        
        // Forçar atualização no localStorage para garantir persistência
        setTimeout(() => {
          const currentVariante = localStorage.getItem('produtos_current_variante');
          if (currentVariante) {
            try {
              const varianteData = JSON.parse(currentVariante);
              const updatedVariante = { ...varianteData, url_imagem: uploadedUrl };
              forceUpdatePersistentState('produtos_current_variante', updatedVariante);
              console.log('🔧 [ImageUpload] Forçada atualização do localStorage com nova URL:', uploadedUrl);
            } catch (error) {
              console.error('❌ [ImageUpload] Erro ao forçar atualização do localStorage:', error);
            }
          }
        }, 100);
        
        console.log('🔄 [ImageUpload] onChange executado e preview atualizado com URL final');
      } else {
        console.log('❌ [ImageUpload] Upload falhou, restaurando preview anterior');
        setPreview(value || null);
      }
    } catch (error) {
      console.error('❌ [ImageUpload] Erro durante upload:', error);
      setPreview(value || null);
    } finally {
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      setIsProcessing(false);
    }
  }, [uploadImage, onChange, value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading || isProcessing
  });

  const handleCameraCapture = () => {
    console.log('📸 [ImageUpload] Iniciando captura de câmera (mobile)');
    setIsProcessing(true);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera';
    
    const handleFileChange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('📱 [ImageUpload] Imagem capturada via câmera:', file.name);
        onDrop([file]);
      } else {
        setIsProcessing(false);
      }
    };
    
    const handleCancel = () => {
      console.log('❌ [ImageUpload] Captura de câmera cancelada');
      setIsProcessing(false);
    };
    
    input.onchange = handleFileChange;
    input.oncancel = handleCancel;
    
    // Detectar quando o usuário cancela sem selecionar arquivo
    setTimeout(() => {
      if (document.activeElement !== input) {
        handleCancel();
      }
    }, 1000);
    
    input.click();
  };

  const handleRemove = () => {
    console.log('🗑️ [ImageUpload] Removendo imagem');
    setPreview(null);
    if (onRemove) {
      onRemove();
    }
    onChange('');
  };

  console.log('🖼️ [ImageUpload] Estado atual do render:', {
    value,
    preview,
    uploading,
    uploadProgress,
    isProcessing,
    hasImage: !!preview
  });

  return (
    <div className={className}>
      {preview ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md"
                onLoad={() => {
                  console.log('✅ [ImageUpload] Imagem carregada com sucesso:', preview);
                }}
                onError={(e) => {
                  console.error('❌ [ImageUpload] Erro ao carregar imagem:', preview);
                  setPreview(null);
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={uploading || isProcessing}
              >
                <X className="w-4 h-4" />
              </Button>
              {(uploading || isProcessing) && (
                <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                  <div className="text-white text-sm">
                    {uploading ? 'Enviando...' : 'Processando...'}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`text-center cursor-pointer ${
                  isDragActive ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-2">
                  {uploading || isProcessing ? (
                    <>
                      <Upload className="w-8 h-8 animate-pulse" />
                      <p className="text-sm">
                        {uploading ? 'Enviando imagem...' : 'Processando...'}
                      </p>
                      {uploading && <Progress value={uploadProgress} className="w-full max-w-xs" />}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8" />
                      <p className="text-sm">
                        {isDragActive
                          ? 'Solte a imagem aqui...'
                          : isMobile
                          ? 'Toque para selecionar uma imagem'
                          : 'Arraste uma imagem ou clique para selecionar'}
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF até 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isMobile && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCameraCapture}
              disabled={uploading || isProcessing}
              className="w-full mobile-button"
            >
              <Camera className="w-4 h-4 mr-2" />
              Tirar Foto
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
