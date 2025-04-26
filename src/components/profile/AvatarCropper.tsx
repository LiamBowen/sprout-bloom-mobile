
import { useState, useRef, useEffect } from "react";
import { Crop } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface AvatarCropperProps {
  imageFile: File;
  onCropComplete: (croppedImageUrl: string) => void;
}

export const AvatarCropper = ({ imageFile, onCropComplete }: AvatarCropperProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Load the image when the component mounts or the file changes
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        
        // Load the image to get its dimensions
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          drawCanvas();
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);
  
  // Update the canvas when zoom or position changes
  useEffect(() => {
    if (imageSrc) {
      drawCanvas();
    }
  }, [zoom, position, imageSrc]);
  
  // Draw the image on the canvas with the current zoom and position
  const drawCanvas = () => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Calculate scaled dimensions
    const img = imageRef.current;
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * zoom;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // Calculate position with centering and user position
    const x = centerX - (scaledWidth / 2) + position.x;
    const y = centerY - (scaledHeight / 2) + position.y;
    
    // Draw the image
    ctx.drawImage(img, 0, 0, img.width, img.height, x, y, scaledWidth, scaledHeight);
    ctx.restore();
    
    // Get the cropped image as base64
    const croppedImageUrl = canvas.toDataURL('image/png');
    onCropComplete(croppedImageUrl);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        ref={containerRef}
        className="w-64 h-64 rounded-full overflow-hidden border-2 border-sprout-green/50 cursor-move relative bg-gray-100"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas 
          ref={canvasRef}
          width={250}
          height={250}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-xs text-white bg-black/50 px-2 py-1 rounded">Drag to position</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 w-full max-w-xs">
        <Crop className="h-4 w-4" />
        <Slider 
          value={[zoom]} 
          min={0.5}
          max={3}
          step={0.1}
          onValueChange={handleZoomChange}
        />
      </div>
    </div>
  );
};
