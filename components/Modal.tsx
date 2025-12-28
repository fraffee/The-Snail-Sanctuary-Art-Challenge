
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  image: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, image, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-16 bg-black/70 backdrop-blur-md transition-opacity duration-700"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
      >
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 p-4 text-white/40 hover:text-white transition-colors pointer-events-auto z-50 bg-black/20 rounded-full m-4"
          aria-label="Close"
        >
          <X size={32} strokeWidth={1.5} />
        </button>
        
        {/* Paper Fold Animation Container */}
        <div 
          className="bg-white p-2 md:p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto paper-unfold-container"
          style={{
            maxWidth: '90vw',
            maxHeight: '85vh',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full h-full overflow-hidden rounded-xl border border-gray-100">
            <img 
              src={image} 
              alt="Art Challenge Card" 
              className="w-full h-full object-contain block"
              style={{ 
                maxWidth: '100%', 
                maxHeight: 'calc(85vh - 40px)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = '0.5';
              }}
            />
          </div>
        </div>
      </div>
      <style>{`
        .paper-unfold-container {
          animation: unfold-fancy 1.1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          transform-origin: center top;
          backface-visibility: hidden;
          perspective: 2000px;
        }

        @keyframes unfold-fancy {
          0% {
            transform: rotateX(-95deg) rotateY(5deg) scale(0.4) translateY(-100px);
            opacity: 0;
            filter: brightness(0.3) blur(2px);
          }
          40% {
            filter: brightness(1.2) blur(0);
          }
          70% {
            transform: rotateX(10deg) rotateY(-2deg) scale(1.05);
          }
          100% {
            transform: rotateX(0deg) rotateY(0deg) scale(1) translateY(0);
            opacity: 1;
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
