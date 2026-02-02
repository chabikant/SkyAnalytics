
import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Automatic search effect
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only start debounce if query has content and we're not already loading
    if (query.trim().length > 0 && !isLoading) {
      setIsDebouncing(true);
      debounceTimerRef.current = setTimeout(() => {
        onSearch(query.trim());
        setQuery(''); // Clear after firing
        setIsDebouncing(false);
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
      // If manually submitting, cancel the automatic one
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearch(query.trim());
      setQuery('');
      setIsDebouncing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <input 
        type="text" 
        placeholder="Search cities (e.g., Delhi, Mumbai, New York)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
        className={`w-full bg-slate-800/50 border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 transition-all placeholder:text-white/20 disabled:opacity-50 ${
          isDebouncing ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-white/10 focus:ring-blue-500/50'
        }`}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-search'} text-white/30 transition-colors ${isDebouncing && !isLoading ? 'text-blue-400 animate-pulse' : ''}`}></i>
      </div>
      
      {isDebouncing && !isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter animate-pulse">
            Auto-scanning...
          </span>
        </div>
      )}
    </form>
  );
};
