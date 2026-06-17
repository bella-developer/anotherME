import { useState, useRef } from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';

/**
 * ImageUpload Component
 * Provides image upload with preview in artistic frame
 */
const ImageUpload = ({ onImageSelect, onImageRemove, disabled = false }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFileName(file.name);
      onImageSelect(file);
    };
    reader.readAsDataURL(file);
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
          disabled={disabled}
          className="w-full p-4 border border-dashed transition-all duration-200"
          style={{
            borderColor: 'rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '3px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <FaImage className="text-white/30" size={24} />
            <span className="text-white/50 text-xs font-light tracking-wide">
              Add an image (optional)
            </span>
            <span className="text-white/30 text-[10px]">
              Max 5MB • JPG, PNG, GIF, WebP
            </span>
          </div>
        </button>
      ) : (
        <div className="relative">
          {/* Artistic Frame */}
          <div
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              borderRadius: '3px',
              padding: '12px',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1), inset 0 0 20px rgba(0,0,0,0.3)',
            }}
          >
            {/* Inner shadow frame effect */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: '2px',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto"
                style={{
                  display: 'block',
                  maxHeight: '400px',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Decorative corner accents */}
            <div
              className="absolute top-2 left-2"
              style={{
                width: '16px',
                height: '16px',
                borderTop: '2px solid rgba(255,255,255,0.2)',
                borderLeft: '2px solid rgba(255,255,255,0.2)',
              }}
            />
            <div
              className="absolute top-2 right-2"
              style={{
                width: '16px',
                height: '16px',
                borderTop: '2px solid rgba(255,255,255,0.2)',
                borderRight: '2px solid rgba(255,255,255,0.2)',
              }}
            />
            <div
              className="absolute bottom-2 left-2"
              style={{
                width: '16px',
                height: '16px',
                borderBottom: '2px solid rgba(255,255,255,0.2)',
                borderLeft: '2px solid rgba(255,255,255,0.2)',
              }}
            />
            <div
              className="absolute bottom-2 right-2"
              style={{
                width: '16px',
                height: '16px',
                borderBottom: '2px solid rgba(255,255,255,0.2)',
                borderRight: '2px solid rgba(255,255,255,0.2)',
              }}
            />
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(220, 38, 38, 0.9)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaTimes className="text-white" size={12} />
          </button>

          {/* File name */}
          <div className="mt-2 text-center">
            <span className="text-white/40 text-[10px] font-light">
              {fileName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
