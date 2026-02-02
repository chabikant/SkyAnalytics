
import React from 'react';
import { WeatherData, Unit } from '../../types';
import { WeatherChart } from '../Charts/WeatherChart';
import { convertTemp } from '../Dashboard/CityCard';

interface CityModalProps {
  city: WeatherData;
  insight: string;
  unit: Unit;
  onClose: () => void;
  isLoadingInsight: boolean;
}

export const CityModal: React.FC<CityModalProps> = ({ city, insight, unit, onClose, isLoadingInsight }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 z-10"
          onClick={onClose}
        >
          <i className="fas fa-times text-2xl"></i>
        </button>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-1/3">
              <div className="mb-8">
                <h2 className="text-5xl font-bold mb-2 tracking-tighter">{city.city}</h2>
                <p className="text-xl text-white/60 capitalize mb-6">{city.description || city.condition}</p>
                <div className="flex items-end gap-4">
                  <span className="text-8xl font-black">{convertTemp(city.temp, unit)}°</span>
                  <span className="text-2xl text-white/40 mb-4 font-bold">{unit}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass p-5 rounded-2xl border-blue-500/20 bg-blue-500/5 shadow-inner">
                  <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">
                    <i className="fas fa-microchip"></i>
                    <span>Climate Analysis Hub</span>
                  </div>
                  <p className="text-white/80 font-medium text-sm leading-relaxed">
                    {isLoadingInsight ? "Compiling regional atmospheric data..." : insight}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-bold">Humidity</p>
                    <p className="text-lg font-black">{city.humidity}%</p>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-bold">Dew Point</p>
                    <p className="text-lg font-black">{city.dewPoint}°</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-6 rounded-3xl">
                  <WeatherChart data={city.hourly} dataKey="temp" color="#3b82f6" label="Short-Term Forecast" />
                </div>
                <div className="glass p-6 rounded-3xl">
                  <WeatherChart data={city.historicalTrends} dataKey="temp" color="#10b981" label="Atmospheric Trends" type="bar" />
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-black text-white/30 mb-6 flex items-center gap-3">
                  <i className="fas fa-calendar-alt text-blue-500"></i>
                  Extended 5-Day Outlook
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {city.forecast.map((day, idx) => (
                    <div key={idx} className="glass p-5 rounded-[2rem] flex flex-col items-center text-center hover:bg-white/5 transition-colors border border-white/5">
                      <p className="text-[10px] text-white/30 font-black uppercase mb-4">{day.date}</p>
                      <i className={`fas ${day.icon || 'fa-cloud'} text-3xl text-blue-400 mb-6`}></i>
                      <div className="flex flex-col gap-1">
                        <span className="text-xl font-black">{convertTemp(day.high, unit)}°</span>
                        <span className="text-xs text-white/40 font-bold">{convertTemp(day.low, unit)}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
