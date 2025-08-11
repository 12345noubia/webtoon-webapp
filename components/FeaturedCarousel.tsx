import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, BookOpen, Star, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mangadxApi, MangaData } from '../services/jikanApi';

interface FeaturedCarouselProps {
  featuredSeries: MangaData[];
  onSeriesSelect: (series: MangaData) => void;
}

export function FeaturedCarousel({ featuredSeries, onSeriesSelect }: FeaturedCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (featuredSeries.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredSeries.length);
    }, 6000); // Slower transition for reading

    return () => clearInterval(timer);
  }, [featuredSeries.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredSeries.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredSeries.length) % featuredSeries.length);
  };

  if (featuredSeries.length === 0) {
    return (
      <div className="h-96 md:h-[500px] lg:h-[600px] bg-gray-200 animate-pulse" />
    );
  }

  const currentSeries = featuredSeries[currentSlide];
  const rating = mangadxApi.getRating(currentSeries);
  const memberCount = mangadxApi.getMemberCount(currentSeries);
  const chapterCount = mangadxApi.getChapterCount(currentSeries);

  return (
    <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-700">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Real cover image from Jikan API */}
        <ImageWithFallback
          src={mangadxApi.getCoverUrl(currentSeries.id, mangadxApi.getCoverArt(currentSeries) || undefined, 'original')}
          alt={mangadxApi.getTitle(currentSeries.attributes.title)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {/* Real manga title from Jikan */}
              {mangadxApi.getTitle(currentSeries.attributes.title)}
            </h1>
            
            {/* Rating and stats */}
            <div className="flex items-center gap-4 mb-4">
              {rating && (
                <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-semibold">{rating.toFixed(1)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-gray-200">
                <Calendar className="w-4 h-4" />
                <span>{currentSeries.attributes.year || 'N/A'}</span>
              </div>
              
              {memberCount && (
                <div className="flex items-center gap-1 text-gray-200">
                  <Users className="w-4 h-4" />
                  <span>{memberCount > 1000 ? `${Math.floor(memberCount / 1000)}k` : memberCount} members</span>
                </div>
              )}
              
              {chapterCount && (
                <div className="flex items-center gap-1 text-gray-200">
                  <BookOpen className="w-4 h-4" />
                  <span>{chapterCount} chapters</span>
                </div>
              )}
            </div>
            
            <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-4 leading-relaxed">
              {/* Real description from Jikan */}
              {mangadxApi.getDescription(currentSeries.attributes.description)}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {/* Real genres from Jikan */}
              {currentSeries.attributes.tags.slice(0, 4).map((tag) => (
                <span 
                  key={tag.id}
                  className="px-3 py-1 bg-[#00d564] bg-opacity-80 text-white rounded-full text-sm font-medium hover:bg-opacity-100 transition-all cursor-pointer"
                >
                  {mangadxApi.getTitle(tag.attributes.name)}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-[#00d564] hover:bg-[#00b851] text-white px-8 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                onClick={() => onSeriesSelect(currentSeries)}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Read Now
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold text-base bg-black/20 backdrop-blur-sm transition-all"
                onClick={() => onSeriesSelect(currentSeries)}
              >
                <Play className="w-5 h-5 mr-2" />
                More Info
              </Button>
            </div>
            
            {/* Additional info */}
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-300">
              <span>By {mangadxApi.getAuthor(currentSeries)}</span>
              <span>•</span>
              <span className="capitalize">{currentSeries.attributes.status.replace('_', ' ')}</span>
              <span>•</span>
              <span>{currentSeries.jikan?.type || 'Manga'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/75 text-white transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/75 text-white transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {featuredSeries.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-[#00d564] scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Gradient overlays for better text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-5" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent z-5" />
      
      <style jsx>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}