import React, { useState, useEffect } from 'react';
import { FeaturedCarousel } from './FeaturedCarousel';
import { CategoryTabs } from './CategoryTabs';
import { ContentSection } from './ContentSection';
import { mangadxApi, MangaData } from '../services/jikanApi';

interface HomepageProps {
  onSeriesSelect: (series: MangaData) => void;
}

export function Homepage({ onSeriesSelect }: HomepageProps) {
  const [trendingManga, setTrendingManga] = useState<MangaData[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<MangaData[]>([]);
  const [ongoingManga, setOngoingManga] = useState<MangaData[]>([]);
  const [newlyAdded, setNewlyAdded] = useState<MangaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data concurrently with rate limiting consideration
        const [trending, recent, ongoing, newManga] = await Promise.all([
          mangadxApi.getTrendingManga(10),
          mangadxApi.getRecentlyUpdated(20),
          mangadxApi.getOngoingManga(20),
          mangadxApi.getNewlyAdded(20)
        ]);

        setTrendingManga(trending.data);
        setRecentlyUpdated(recent.data);
        setOngoingManga(ongoing.data);
        setNewlyAdded(newManga.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load manga data. Please check your internet connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              This app uses the free Jikan API (MyAnimeList). If you're experiencing issues, 
              the API may be rate-limited or temporarily unavailable.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#00d564] text-white rounded-lg hover:bg-[#00b851]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Loading skeleton for featured carousel */}
        <div className="h-96 md:h-[500px] lg:h-[600px] bg-gray-200 animate-pulse" />
        
        <CategoryTabs />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Loading skeletons for content sections */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex-shrink-0 w-48">
                    <div className="aspect-[3/4] bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Featured section uses trending manga */}
      <FeaturedCarousel 
        featuredSeries={trendingManga.slice(0, 5)}
        onSeriesSelect={onSeriesSelect}
      />
      
      {/* Category tabs for browsing by genre */}
      <CategoryTabs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Trending section */}
        <ContentSection
          title="Trending Now"
          description="Most popular manga on MyAnimeList"
          items={trendingManga}
          onItemSelect={onSeriesSelect}
        />
        
        {/* Recently updated section */}
        <ContentSection
          title="Recently Updated"
          description="Latest manga additions and updates"
          items={recentlyUpdated}
          onItemSelect={onSeriesSelect}
          showLatestChapter={false}
        />
        
        {/* Ongoing series section */}
        <ContentSection
          title="Ongoing Series"
          description="Currently publishing manga"
          items={ongoingManga}
          onItemSelect={onSeriesSelect}
        />
        
        {/* Newly added section */}
        <ContentSection
          title="Newly Added"
          description="Recently added to MyAnimeList"
          items={newlyAdded}
          onItemSelect={onSeriesSelect}
        />
      </div>
    </div>
  );
}