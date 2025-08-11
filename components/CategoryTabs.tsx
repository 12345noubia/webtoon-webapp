import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { mangadxApi, TagData } from '../services/jikanApi';

export function CategoryTabs() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagData = await mangadxApi.getTags();
        // Take the most popular genres for the tabs
        setTags(tagData.slice(0, 15));
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-scroll');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    // TODO: Implement filtering functionality
    console.log('Selected category:', categoryName, categoryId);
  };

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-hidden px-10 py-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 h-8 w-20 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', name: 'All' },
    ...tags.map(tag => ({
      id: tag.id,
      name: mangadxApi.getTitle(tag.attributes.name)
    }))
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center py-4">
          {/* Left scroll button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-0 z-10 bg-white shadow-md hover:shadow-lg"
            onClick={() => scrollContainer('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Category tabs - horizontal scroll */}
          <div 
            id="category-scroll"
            className="flex gap-2 overflow-x-auto scrollbar-hide px-10 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id, category.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                  selectedCategory === category.id
                    ? 'bg-[#00d564] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Right scroll button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 z-10 bg-white shadow-md hover:shadow-lg"
            onClick={() => scrollContainer('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}