import React from 'react';

interface ImageGalleryProps {
  images: string[];
}

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold">Tus Imágenes Generadas Aparecerán Aquí</h3>
        <p className="mt-2 max-w-sm">Define el perfil a la izquierda y haz clic en "Generar" para crear un nuevo conjunto de imágenes.</p>
    </div>
);

const DownloadButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
      aria-label="Descargar imagen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </button>
);


export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (images.length === 0) {
    return <Placeholder />;
  }

  const handleDownload = (src: string, index: number) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `imagen-influencer-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalImages = images.length;
  // Layout especial para un número impar de imágenes (1, 3, 5).
  // La primera imagen se hace más grande para crear una cuadrícula dinámica y atractiva.
  const useSpecialLayout = totalImages % 2 !== 0;

  return (
    <div className="w-full h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((src, index) => (
                <div
                    key={index}
                    className={`relative group rounded-lg overflow-hidden shadow-lg ${
                        useSpecialLayout && index === 0 ? 'sm:col-span-2' : ''
                    }`}
                >
                    <img
                        src={src}
                        alt={`Influencer generado ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <DownloadButton onClick={() => handleDownload(src, index)} />
                </div>
            ))}
        </div>
    </div>
  );
};