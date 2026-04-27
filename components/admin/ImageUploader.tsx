'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Link as LinkIcon, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/admin/ToastProvider';

interface ImageUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
  multiple?: boolean;
}

export function ImageUploader({ onUploadSuccess, multiple = false }: ImageUploaderProps) {
  const [urls, setUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [directLink, setDirectLink] = useState('');
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    // Since we don't have a backend upload route yet (needs keys),
    // we would ideally send FormData to /api/admin/upload here.
    // For now we will mock the upload delay and animation, 
    // but we can also use Cloudinary unsigned upload directly if we had the cloud_name.

    try {
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
         // Fallback mock upload for UI demonstration since user requested to continue without keys
         toast('في وضع التجربة: إضافة صور مؤقتة', 'success');
         for (let i=0; i<files.length; i++) {
             // Simulate network delay for animation
             await new Promise(r => setTimeout(r, 1000));
             newUrls.push(URL.createObjectURL(files[i]));
         }
      } else {
         // Real Cloudinary Upload Logic (Unsigned)
         // Will work once user adds NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
         // to .env.local
         for (let i = 0; i < files.length; i++) {
           const formData = new FormData();
           formData.append('file', files[i]);
           formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');

           const res = await fetch(
             `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
             { method: 'POST', body: formData }
           );
           
           if (!res.ok) throw new Error('Upload failed');
           const data = await res.json();
           newUrls.push(data.secure_url);
         }
      }

      setUrls(prev => [...prev, ...newUrls]);
      onUploadSuccess([...urls, ...newUrls]);
    } catch (error) {
      toast('فشل في رفع الصور', 'error');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleAddLink = () => {
    if (!directLink) return;
    setUrls(prev => [...prev, directLink]);
    onUploadSuccess([...urls, directLink]);
    setDirectLink('');
  };

  const removeImage = (idx: number) => {
    const newArr = [...urls];
    newArr.splice(idx, 1);
    setUrls(newArr);
    onUploadSuccess(newArr);
  };

  return (
    <div className="bg-rich-black-light border border-white/10 rounded-2xl p-6">
      <div className="flex gap-4 mb-6">
        <label className="flex-1 border-2 border-dashed border-white/10 hover:border-gold/50 transition-colors rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer group bg-rich-black relative overflow-hidden">
          {uploading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin mb-2" />
              <span className="text-sm text-gold font-bold">جاري الرفع...</span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-white/50 group-hover:text-gold transition-colors">
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">اسحب الصور أو اضغط للرفع</span>
              <span className="text-xs mt-1">يدعم الرفع المتعدد (Multiple)</span>
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            multiple={multiple} 
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
        
        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-rich-black p-4 rounded-xl border border-white/5 h-full flex flex-col justify-center">
              <label className="text-xs text-white/50 mb-2 font-bold block">أو إضافة رابط مباشر للصورة</label>
              <div className="flex gap-2">
                 <input 
                   type="url"
                   value={directLink}
                   onChange={e => setDirectLink(e.target.value)}
                   placeholder="https://..."
                   dir="ltr"
                   className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-gold/50 text-left font-mono"
                 />
                 <button 
                    onClick={handleAddLink}
                    disabled={!directLink}
                    className="bg-white/10 hover:bg-gold hover:text-rich-black text-white px-3 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                 >
                    إضافة
                 </button>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {urls.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
             {urls.map((url, i) => (
                <motion.div 
                  key={url + i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group bg-rich-black"
                >
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={url} alt={`Uploaded ${i}`} className="w-full h-full object-cover" />
                   <button 
                     onClick={() => removeImage(i)}
                     className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                   >
                     <X className="w-4 h-4" />
                   </button>
                </motion.div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
