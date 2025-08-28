import React from 'react';

interface AspectRatioSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ASPECT_RATIOS = ['1:1', '4:3', '3:4', '16:9', '9:16'];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col space-y-3">
      <label htmlFor="aspect-ratio-selector" className="text-lg font-semibold text-gray-300">
        Relación de Aspecto
      </label>
      <select
        id="aspect-ratio-selector"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
      >
        {ASPECT_RATIOS.map((ratio) => (
          <option key={ratio} value={ratio}>
            {ratio}
          </option>
        ))}
      </select>
    </div>
  );
};