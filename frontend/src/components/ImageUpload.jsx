import { useState, useRef, useEffect } from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';

/**
 * ImageUpload Component
 * Compact image upload with drag & drop and preview
 */
const ImageUpload = ({ onImageSelect, onImageSelected, onImageRemove, disabled = false, existingImage = null }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const notifySelect = onImageSelect || onImageSelected;

  // Handle existing image from server or file object
  useEffect(() => {
    if (existingImage) {
      if (typeof existingImage === 'string') {
        setPreview(existingImage);
        setFileName('Selected image');
      } else if (existingImage.url) {
        setPreview(existingImage.url);
        setFileName('Attached image');
      } else if (typeof File !== 'undefined' && existingImage instanceof File) {
        const objUrl = URL.createObjectURL(existingImage);
        setPreview(objUrl);
        setFileName(existingImage.name || 'Selected image');
        return () => URL.revokeObjectURL(objUrl);
      } else if (typeof Blob !== 'undefined' && existingImage instanceof Blob) {
        const objUrl = URL.createObjectURL(existingImage);
        setPreview(objUrl);
        setFileName('Selected image');
        return () => URL.revokeObjectURL(objUrl);
      }
    } else {
      setPreview(null);
      setFileName('');
    }
  }, [existingImage]);

  const validateAndProcessFile = (file) => {
    if (!file) return false;

    // Validate file type (images including GIF)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select an image file (JPEG, PNG, GIF, or WebP)');
      return false;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image/GIF size must be less than 5MB');
      return false;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFileName(file.name);
      if (notifySelect) {
        notifySelect(file);
      }
    };
    reader.readAsDataURL(file);
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndProcessFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging false if leaving the main container
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!preview ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="w-full py-3 px-4 border border-dashed transition-all duration-200 cursor-pointer"
          style={{
            borderColor: isDragging ? 'rgba(161, 98, 7, 0.6)' : 'rgba(255,255,255,0.15)',
            background: isDragging ? 'rgba(161, 98, 7, 0.1)' : 'rgba(255,255,255,0.02)',
            borderRadius: '3px',
            opacity: disabled ? 0.5 : 1,
            pointerEvents: disabled ? 'none' : 'auto',
          }}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <FaImage 
              className="transition-colors" 
              style={{ color: isDragging ? 'rgba(161, 98, 7, 0.8)' : 'rgba(161, 98, 7, 0.5)' }}
              size={16} 
            />
            <div className="text-center">
              <span 
                className="text-xs font-light tracking-wide block"
                style={{ color: isDragging ? 'rgba(161, 98, 7, 0.9)' : 'rgba(161, 98, 7, 0.7)' }}
              >
                {isDragging ? 'Drop your image here' : 'Add image or GIF (optional)'}
              </span>
              {!isDragging && (
                <span className="text-white/30 text-[10px] block mt-1">
                  Click or drag & drop • Max 5MB • JPG, PNG, GIF, WebP
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col gap-2 p-2.5 border border-white/10 rounded bg-white/5">
          {/* Preview Container with Image */}
          <div className="relative w-full max-h-52 overflow-hidden rounded border border-white/10 bg-black/50 flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-52 object-contain rounded"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-black/70 hover:bg-red-600 text-white transition-all duration-200 shadow"
              title="Remove image"
            >
              <FaTimes size={12} />
            </button>
          </div>

          {/* File details bar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-white/70 text-xs truncate max-w-[220px]">
              {fileName}
            </span>
            <span className="text-white/40 text-[10px] font-mono">
              Ready to publish
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
