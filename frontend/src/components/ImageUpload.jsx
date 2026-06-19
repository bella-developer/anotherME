import { useState, useRef } from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';

/**
 * ImageUpload Component
 * Compact image upload with drag & drop and preview
 */
const ImageUpload = ({ onImageSelect, onImageRemove, disabled = false }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    if (!file) return false;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return false;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return false;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFileName(file.name);
      onImageSelect(file);
    };
    reader.readAsDataURL(file);
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndProcessFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    validateAndProcessFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove();
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
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!preview ? (
        <button
          type="button"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={disabled}
          className="w-full py-2 px-3 border border-dashed transition-all duration-200 flex items-center gap-2 group"
          style={{
            borderColor: isDragging ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
            background: isDragging ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
            borderRadius: '3px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <FaImage className="text-white/30 group-hover:text-white/50 transition-colors" size={14} />
          <div className="flex-1 text-left">
            <span className="text-white/50 text-xs font-light">
              {isDragging ? 'Drop image here' : 'Add image'}
            </span>
            <span className="text-white/30 text-[10px] ml-1">
              (optional)
            </span>
          </div>
        </button>
      ) : (
        <div className="relative flex items-center gap-2 p-2 border border-white/10 rounded bg-white/5">
          {/* Small preview thumbnail */}
          <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded border border-white/20">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* File name */}
          <div className="flex-1 min-w-0">
            <span className="text-white/60 text-xs block truncate">
              {fileName}
            </span>
            <span className="text-white/30 text-[10px]">
              Image attached
            </span>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: 'rgba(220, 38, 38, 0.8)',
            }}
          >
            <FaTimes className="text-white" size={10} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
