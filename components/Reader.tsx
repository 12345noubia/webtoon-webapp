import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Bookmark, ArrowRight, ArrowUp, Menu, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mangadxApi, ChapterData } from '../services/jikanApi';

interface ReaderProps {
  chapter: ChapterData;
  onBack: () => void;
}

interface PageData {
  url: string;
  width: number;
  height: number;
}

export function Reader({ chapter, onBack }: ReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [readingMode, setReadingMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const progress = pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;

  // Fetch chapter pages
  useEffect(() => {
    const fetchChapterPages = async () => {
      if (!chapter?.id) return;

      setLoading(true);
      setError(null);
      
      try {
        const response = await mangadxApi.getChapterPages(chapter.id);
        
        // Create page URLs using placeholder images
        // Note: Real manga content requires licensing agreements
        const pageUrls = response.chapter.data.map((fileName: string, index: number) => ({
          url: `https://picsum.photos/800/1200?random=${chapter.id}-${index}`,
          width: 800,
          height: 1200
        }));
        
        setPages(pageUrls);
      } catch (err) {
        console.error('Error fetching chapter pages:', err);
        setError('Failed to load chapter pages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterPages();
  }, [chapter?.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (readingMode === 'vertical' && pages.length > 0) {
        const pageElements = document.querySelectorAll('.manga-page');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        pageElements.forEach((pageElement, index) => {
          const rect = pageElement.getBoundingClientRect();
          const pageTop = rect.top + window.scrollY;
          const pageBottom = pageTop + rect.height;
          
          if (scrollPosition >= pageTop && scrollPosition <= pageBottom) {
            setCurrentPage(index);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [readingMode, pages.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (readingMode === 'horizontal') {
        const pageElement = document.getElementById(`page-${newPage}`);
        pageElement?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (readingMode === 'horizontal') {
        const pageElement = document.getElementById(`page-${newPage}`);
        pageElement?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'Escape') {
        setShowControls(!showControls);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, showControls, pages.length]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl mb-4">No chapter selected</h2>
          <Button onClick={onBack} className="bg-[#00d564] hover:bg-[#00b851]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl mb-4">Chapter Content Not Available</h2>
          <div className="bg-blue-900/50 border border-blue-400 rounded-lg p-4 mb-6">
            <Info className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-200 text-sm leading-relaxed">
              This demo uses the Jikan API for manga metadata. Actual manga content requires licensing agreements 
              with publishers and is not freely available through public APIs.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Demo Pages
            </Button>
            <Button onClick={onBack} className="bg-[#00d564] hover:bg-[#00b851]">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header with loading state */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="font-semibold">Loading Chapter...</h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
        
        {/* Loading content */}
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d564] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading demo chapter pages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Controls */}
      <div className={`fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm transition-all duration-300 ${
        showControls ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="font-semibold">
                {chapter.attributes.volume && `Vol. ${chapter.attributes.volume} `}
                Chapter {chapter.attributes.chapter}
                {chapter.attributes.title && `: ${chapter.attributes.title}`}
              </h1>
              <p className="text-sm text-gray-400">
                Page {currentPage + 1} of {pages.length} • {chapter.attributes.pages} total pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={readingMode} onValueChange={(value: 'vertical' | 'horizontal') => setReadingMode(value)}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <Bookmark className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
              onClick={() => setShowControls(!showControls)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <Progress value={progress} className="h-1 bg-gray-800" />
        </div>
      </div>

      {/* Demo Notice */}
      <div className={`fixed top-20 left-4 right-4 z-30 bg-blue-900/50 border border-blue-400 rounded-lg p-3 backdrop-blur-sm transition-all duration-300 ${
        showControls ? 'translate-y-0' : '-translate-y-16'
      }`}>
        <div className="flex items-center gap-2 text-blue-200 text-sm">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>Demo Mode: Using placeholder images. Real manga content requires publisher licensing.</span>
        </div>
      </div>

      {/* Reading Area */}
      <div className={`pt-32 ${readingMode === 'vertical' ? 'pb-20' : ''}`}>
        {readingMode === 'vertical' ? (
          /* Vertical Reading Mode - Webtoon Style */
          <div className="max-w-4xl mx-auto px-4">
            {pages.map((page, index) => (
              <div
                key={index}
                id={`page-${index}`}
                className="manga-page mb-2 flex justify-center"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={page.url}
                    alt={`Page ${index + 1}`}
                    className="max-w-full h-auto rounded shadow-lg"
                    style={{ maxHeight: '100vh' }}
                  />
                  
                  {/* Page number overlay */}
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Horizontal Reading Mode - Traditional Manga */
          <div className="flex items-center justify-center min-h-screen px-4">
            {pages.length > 0 && (
              <div className="relative max-w-4xl w-full">
                <div className="relative">
                  <ImageWithFallback
                    src={pages[currentPage]?.url || ''}
                    alt={`Page ${currentPage + 1}`}
                    className="w-full h-auto max-h-[90vh] object-contain rounded shadow-lg"
                  />
                  
                  {/* Page number overlay */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-medium">
                    {currentPage + 1} of {pages.length}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm"
                  onClick={nextPage}
                  disabled={currentPage === pages.length - 1}
                >
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls (Vertical Mode) */}
      {readingMode === 'vertical' && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm transition-all duration-300 ${
          showControls ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="text-white hover:bg-gray-800"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Top
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm px-3 font-medium">
                {currentPage + 1} / {pages.length}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Controls Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50 md:hidden bg-black/50 text-white hover:bg-black/75 backdrop-blur-sm"
        onClick={() => setShowControls(!showControls)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Click Areas for Navigation (Horizontal Mode) */}
      {readingMode === 'horizontal' && (
        <>
          <div 
            className="fixed left-0 top-32 bottom-0 w-1/3 z-30 cursor-pointer"
            onClick={prevPage}
          />
          <div 
            className="fixed right-0 top-32 bottom-0 w-1/3 z-30 cursor-pointer"
            onClick={nextPage}
          />
          <div 
            className="fixed left-1/3 right-1/3 top-32 bottom-0 z-30 cursor-pointer"
            onClick={() => setShowControls(!showControls)}
          />
        </>
      )}

      {/* End of Chapter */}
      {currentPage === pages.length - 1 && readingMode === 'vertical' && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">End of Chapter</h2>
          <p className="text-gray-400 mb-4">
            {chapter.attributes.volume && `Vol. ${chapter.attributes.volume} `}
            Chapter {chapter.attributes.chapter} Complete
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Demo chapter with placeholder images
          </p>
          <Button 
            onClick={onBack}
            className="bg-[#00d564] hover:bg-[#00b851] text-white"
          >
            Back to Chapter List
          </Button>
        </div>
      )}
    </div>
  );
}