import React from 'react';
import { ChevronLeft, ChevronRight, Clock, Star, Users, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mangadxApi, MangaData } from '../services/jikanApi';

interface ContentSectionProps {
  title: string;
  description: string;
  items: MangaData[];
  onItemSelect: (item: MangaData) => void;
  showLatestChapter?: boolean;
}

export function ContentSection({ 
  title, 
  description, 
  items, 
  onItemSelect,
  showLatestChapter = false 
}: ContentSectionProps) {
  const scrollContainer = (direction: 'left' | 'right', containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const containerId = `scroll-${title.replace(/\s+/g, '-').toLowerCase()}`;

  if (items.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="aspect-[3/4] bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollContainer('left', containerId)}
            className="rounded-full p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollContainer('right', containerId)}
            className="rounded-full p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        id={containerId}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => {
          const rating = mangadxApi.getRating(item);
          const memberCount = mangadxApi.getMemberCount(item);
          const chapterCount = mangadxApi.getChapterCount(item);
          
          return (
            <Card 
              key={item.id}
              className="flex-shrink-0 w-48 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden"
              onClick={() => onItemSelect(item)}
            >
              <CardContent className="p-0">
                {/* Cover Image */}
                <div className="relative aspect-[3/4] bg-gray-100">
                  {/* Real cover image from Jikan API */}
                  <ImageWithFallback
                    src={mangadxApi.getCoverUrl(item.id, mangadxApi.getCoverArt(item) || undefined, '256')}
                    alt={mangadxApi.getTitle(item.attributes.title)}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.attributes.status === 'ongoing' 
                        ? 'bg-[#00d564] text-white' 
                        : item.attributes.status === 'completed'
                        ? 'bg-blue-500 text-white'
                        : item.attributes.status === 'hiatus'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {item.attributes.status === 'ongoing' ? 'Ongoing' : 
                       item.attributes.status === 'completed' ? 'Complete' : 
                       item.attributes.status === 'hiatus' ? 'Hiatus' :
                       item.attributes.status.charAt(0).toUpperCase() + item.attributes.status.slice(1)}
                    </span>
                  </div>

                  {/* Rating overlay */}
                  {rating && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                    {/* Real manga title from Jikan */}
                    {mangadxApi.getTitle(item.attributes.title)}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {/* Real author name from Jikan */}
                    {mangadxApi.getAuthor(item)}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {/* Real genres from Jikan */}
                    {item.attributes.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag.id}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {mangadxApi.getTitle(tag.attributes.name)}
                      </span>
                    ))}
                  </div>

                  {/* Additional info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      {item.attributes.year && (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>{item.attributes.year}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {chapterCount && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{chapterCount}</span>
                        </div>
                      )}
                      
                      {memberCount && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{memberCount > 1000 ? `${Math.floor(memberCount / 1000)}k` : memberCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}