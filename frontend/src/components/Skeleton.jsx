function Skeleton({ variant = 'text', className = '' }) {
  const baseStyles = 'bg-primary-elevated relative overflow-hidden';
  
  const shimmerStyles = `
    before:absolute before:inset-0 
    before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
    before:animate-shimmer
  `;

  const variantStyles = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
  };

  return (
    <div className={`${baseStyles} ${shimmerStyles} ${variantStyles[variant]} ${className}`} />
  );
}

// Skeleton components for specific content types
function SkeletonPost() {
  return (
    <div className="bg-primary-secondary rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Skeleton variant="circle" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-32" />
          <Skeleton variant="text" className="w-24" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-3/4" />
      </div>

      {/* Footer */}
      <div className="flex items-center space-x-4 pt-2">
        <Skeleton variant="text" className="w-16" />
        <Skeleton variant="text" className="w-16" />
        <Skeleton variant="text" className="w-16" />
      </div>
    </div>
  );
}

function SkeletonCircle() {
  return (
    <div className="bg-primary-secondary rounded-xl p-4 space-y-3">
      {/* Title */}
      <Skeleton variant="title" className="w-3/4" />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4 pt-2">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-20" />
      </div>

      {/* Button */}
      <Skeleton variant="rectangle" className="w-full h-10" />
    </div>
  );
}

function SkeletonComment() {
  return (
    <div className="bg-primary-secondary rounded-lg p-3 space-y-2">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Skeleton variant="circle" className="w-8 h-8" />
        <Skeleton variant="text" className="w-24" />
      </div>

      {/* Content */}
      <div className="space-y-1 pl-10">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-4/5" />
      </div>
    </div>
  );
}

// Export all skeleton components
Skeleton.Post = SkeletonPost;
Skeleton.Circle = SkeletonCircle;
Skeleton.Comment = SkeletonComment;

export default Skeleton;
