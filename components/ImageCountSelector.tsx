import React from 'react';

interface ImageCountSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const IMAGE_COUNTS = [1, 2, 3, 4, 5];

export const ImageCountSelector: React.FC<ImageCountSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col space-y-3">
      <label htmlFor="image-count-selector" className="text-lg font-semibold text-gray-300">
        Número de Imágenes
      </label>
      <select
        id="image-count-selector"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
      >
        {IMAGE_COUNTS.map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </select>
    </div>
  );
};