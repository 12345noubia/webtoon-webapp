import React, { useState } from 'react';
import { Search, User, Bell, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, onSearch, currentPage }: HeaderProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // API Integration: POST/GET to /manga endpoint with title parameter
      // Example: GET /manga?title=${searchInput}&limit=20&offset=0
      onSearch(searchInput.trim());
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-[#00d564] hover:opacity-80 transition-opacity"
            >
              MangaHub
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search manga, webtoons, comics..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-4 pr-12 py-2 w-full rounded-full border-2 border-gray-200 focus:border-[#00d564] focus:ring-0"
                />
                <Button 
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#00d564] hover:bg-[#00b851] text-white rounded-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className={currentPage === 'home' ? 'text-[#00d564]' : ''}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('search')}
              className={currentPage === 'search' ? 'text-[#00d564]' : ''}
            >
              Browse
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('profile')}
              className={currentPage === 'profile' ? 'text-[#00d564]' : ''}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search manga..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-4 pr-12 py-2 w-full rounded-full border-2 border-gray-200 focus:border-[#00d564]"
              />
              <Button 
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#00d564] hover:bg-[#00b851] text-white rounded-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate('home');
                  setIsMobileMenuOpen(false);
                }}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate('search');
                  setIsMobileMenuOpen(false);
                }}
              >
                Browse
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate('profile');
                  setIsMobileMenuOpen(false);
                }}
              >
                Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}