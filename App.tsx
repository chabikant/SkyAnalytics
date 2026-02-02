
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './app/store';
import { fetchWeather, setSelectedCity, clearError } from './features/weather/weatherSlice';
import { toggleFavorite, addFavorite } from './features/favorites/favoritesSlice';
import { toggleUnit } from './features/settings/settingsSlice';
import { SearchBar } from './components/Search/SearchBar';
import { CityCard } from './components/Dashboard/CityCard';
import { CityModal } from './components/WeatherDetails/CityModal';

const LogoSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
    <path d="M4.5 12.5C4.5 9.46243 6.96243 7 10 7C11.1441 7 12.2078 7.35017 13.0858 7.94939C13.6068 5.66228 15.6515 4 18 4C20.7614 4 23 6.23858 23 9C23 10.1558 22.6074 11.22 21.9491 12.0645" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 15.5C2 13.567 3.567 12 5.5 12C5.97637 12 6.43033 12.0949 6.84478 12.2673C7.51347 10.3758 9.30396 9 11.4167 9C13.7915 9 15.7735 10.6865 16.208 12.9213C16.5912 12.6515 17.0527 12.5 17.55 12.5C18.9031 12.5 20 13.606 20 14.9688V15.5C20 17.9853 17.9853 20 15.5 20H6.5C4.01472 20 2 17.9853 2 15.5Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cities: favorites } = useSelector((state: RootState) => state.favorites);
  const { unit } = useSelector((state: RootState) => state.settings);
  const { cachedData, selectedCity, loading, insights, error } = useSelector((state: RootState) => state.weather);

  // Background sync for favorites on mount
  useEffect(() => {
    favorites.forEach(city => {
      if (!cachedData[city]) {
        dispatch(fetchWeather(city));
      }
    });
  }, [favorites, dispatch]); // cachedData not in deps to prevent loop

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    dispatch(fetchWeather(query)).then((res) => {
      if (fetchWeather.fulfilled.match(res)) {
        const { data } = res.payload;
        // 1. Ensure city is in favorites dashboard
        dispatch(addFavorite(data.city));
        // 2. Open the modal immediately
        dispatch(setSelectedCity(data));
      }
    });
  }, [dispatch]);

  const quickAccessCities = [
    { name: 'London', icon: 'fa-landmark' },
    { name: 'New York', icon: 'fa-city' },
    { name: 'Tokyo', icon: 'fa-torii-gate' },
    { name: 'Dubai', icon: 'fa-archway' }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      {/* Error Banner */}
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-red-500/10 border border-red-500/50 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl shadow-red-500/20">
            <i className="fas fa-circle-exclamation text-red-500"></i>
            <span className="text-sm font-bold text-red-200">{error}</span>
            <button 
              onClick={() => dispatch(clearError())}
              className="ml-2 hover:bg-white/10 rounded-lg p-1 transition-colors"
            >
              <i className="fas fa-times text-red-500/50"></i>
            </button>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-40 glass border-b border-white/5 px-4 py-4 md:px-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 border border-white/20">
            <LogoSVG />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              SKYANALYTICS
              <span className="block text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase">Precision Hub</span>
            </h1>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={loading} />

        <div className="flex items-center gap-3">
          <button 
            onClick={() => dispatch(toggleUnit())}
            className="glass h-11 px-6 rounded-2xl text-xs font-bold hover:bg-white/10 active:scale-95 transition-all border border-white/10 flex items-center gap-2"
          >
            <span className={unit === 'C' ? 'text-blue-400' : 'text-white/40'}>°C</span>
            <span className="text-white/10">|</span>
            <span className={unit === 'F' ? 'text-blue-400' : 'text-white/40'}>°F</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-10 mt-10 pb-20">
        {loading && !selectedCity && favorites.length === 0 && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm">
             <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-sm font-black uppercase tracking-widest text-blue-400 animate-pulse">Initializing Data Stream...</p>
             </div>
           </div>
        )}

        {favorites.length > 0 ? (
          <>
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div>
                <h2 className="text-4xl font-bold mb-2 tracking-tight">Active Stations</h2>
                <p className="text-white/40 text-sm font-medium">Real-time telemetry from {favorites.length} global network nodes.</p>
              </div>
              <div className="flex gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest border border-white/5 bg-white/5 px-4 py-2 rounded-full">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Sensors Online
                </span>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map(city => {
                const data = cachedData[city];
                if (!data) return (
                  <div key={city} className="glass h-64 rounded-[2rem] animate-pulse bg-white/5 border-dashed border-white/10"></div>
                );
                return (
                  <div key={city} className="animate-in fade-in zoom-in duration-500">
                    <CityCard 
                      data={data}
                      unit={unit}
                      isFavorite={true}
                      onToggleFavorite={(c) => dispatch(toggleFavorite(c))}
                      onClick={() => dispatch(setSelectedCity(data))}
                    />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-700">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent border border-white/10 rounded-full flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 border-2 border-blue-500/20 border-dashed rounded-full animate-[spin_20s_linear_infinite]"></div>
                <i className="fas fa-satellite text-4xl text-blue-400/50 group-hover:scale-110 transition-transform"></i>
              </div>
            </div>
            
            <h2 className="text-5xl font-black mb-4 tracking-tighter max-w-2xl">
              Atmospheric Command Center <br/> 
              <span className="text-blue-500">Initialize Global Scanning</span>
            </h2>
            <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Precision climate monitoring via the SkyAnalytics network. Search for a specific station or initialize a primary hub below.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
              {quickAccessCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleSearch(city.name)}
                  className="glass group p-6 rounded-[2rem] hover:bg-blue-500/10 transition-all border border-white/5 hover:border-blue-500/30 text-center"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <i className={`fas ${city.icon} text-white/40 group-hover:text-blue-400`}></i>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                    {city.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedCity && (
        <CityModal 
          city={selectedCity} 
          insight={insights[selectedCity.city] || "Compiling atmospheric datasets..."}
          unit={unit}
          isLoadingInsight={loading}
          onClose={() => dispatch(setSelectedCity(null))}
        />
      )}

      <footer className="fixed bottom-0 w-full glass border-t border-white/5 py-4 px-10 hidden md:flex justify-between items-center text-[10px] text-white/20 uppercase tracking-widest pointer-events-none z-30">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <i className="fas fa-shield-halved text-blue-500/50"></i>
            Precision Stream Active
          </span>          
        </div>
        <span>© 2026 SkyAnalytics Precision Hub</span>
      </footer>
    </div>
  );
};

export default App;
