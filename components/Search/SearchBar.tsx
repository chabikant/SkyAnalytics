
import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  // Changed to any to avoid 'NodeJS' namespace error during build in browser environments
  const debounceTimerRef = useRef<any>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length > 0 && !isLoading) {
      setIsDebouncing(true);
      debounceTimerRef.current = setTimeout(() => {
        onSearch(query.trim());
        setIsDebouncing(false);
        // Note: We no longer clear the query here to provide feedback that a search is in progress
      }, 3000); 
    } else {
      setIsDebouncing(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, onSearch, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearch(query.trim());
      setIsDebouncing(false);
    }
  };

  // Clear query only when loading state changes from true to false (successful search)
  const prevLoading = useRef(isLoading);
  useEffect(() => {
    if (prevLoading.current && !isLoading) {
      setQuery('');
    }
    prevLoading.current = isLoading;
  }, [isLoading]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <input 
        type="text" 
        placeholder="Search cities (e.g., London, Tokyo, New York)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
        className={`w-full bg-slate-800/50 border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 transition-all placeholder:text-white/20 disabled:opacity-50 ${
          isDebouncing ? 'border-blue-500/50 ring-2 ring-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/10 focus:ring-blue-500/50'
        }`}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <i className={`fas ${isLoading ? 'fa-spinner fa-spin text-blue-400' : 'fa-search text-white/30'} transition-colors ${isDebouncing && !isLoading ? 'text-blue-400 animate-pulse' : ''}`}></i>
      </div>
      
      {(isDebouncing || isLoading) && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter animate-pulse">
            {isLoading ? 'Fetching Data...' : 'Auto-scanning in 3s...'}
          </span>
        </div>
      )}
    </form>
  );
};
