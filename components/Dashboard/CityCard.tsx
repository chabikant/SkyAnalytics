
import React from 'react';
import { WeatherData, Unit } from '../../types';

interface CityCardProps {
  data: WeatherData;
  unit: Unit;
  isFavorite: boolean;
  onToggleFavorite: (city: string) => void;
  onClick: () => void;
}

export const convertTemp = (celsius: number, unit: Unit) => {
  if (unit === Unit.CELSIUS) return Math.round(celsius);
  return Math.round((celsius * 9/5) + 32);
};

export const CityCard: React.FC<CityCardProps> = ({ data, unit, isFavorite, onToggleFavorite, onClick }) => {
  return (
    <div 
      className="glass p-6 rounded-3xl cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden"
      onClick={onClick}
    >
      <button 
        className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(data.city); }}
      >
        <i className={`fa-star ${isFavorite ? 'fas text-yellow-400' : 'far text-white/50'}`}></i>
      </button>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{data.city}</h3>
          <p className="text-white/60 capitalize text-sm">{data.description || data.condition}</p>
        </div>
        <div className="text-4xl text-blue-400">
          <i className={`fas ${data.icon || 'fa-cloud'}`}></i>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className="text-5xl font-bold">{convertTemp(data.temp, unit)}°</span>
        <span className="text-xl text-white/40 mb-1">{unit}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-white/70 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-droplet text-blue-400"></i>
          <span>{data.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-wind text-blue-400"></i>
          <span>{Math.round(data.windSpeed)} km/h</span>
        </div>
      </div>
    </div>
  );
};
