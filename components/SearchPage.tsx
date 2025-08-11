import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, SlidersHorizontal, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mangadxApi, MangaData, TagData } from '../services/jikanApi';

interface SearchPageProps {
  searchQuery: string;
  onSeriesSelect: (series: MangaData) => void;
}

export function SearchPage({ searchQuery, onSeriesSelect }: SearchPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MangaData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [tags, setTags] = useState<TagData[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    includedTags: [] as string[],
    excludedTags: [] as string[],
    sortBy: 'popularity'
  });

  // Fetch available tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagData = await mangadxApi.getTags();
        setTags(tagData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Perform search when query or filters change
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        const statusFilter = filters.status === 'all' ? undefined : [filters.status];
        const orderMap: Record<string, Record<string, 'asc' | 'desc'>> = {
          popularity: { popularity: 'asc' }, // Lower rank = more popular
          rating: { rating: 'desc' },
          title: { title: 'asc' },
          year: { year: 'desc' }
        };

        const searchParams = {
          title: searchQuery || undefined,
          includedTags: filters.includedTags.length > 0 ? filters.includedTags : undefined,
          excludedTags: filters.excludedTags.length > 0 ? filters.excludedTags : undefined,
          status: statusFilter,
          order: orderMap[filters.sortBy] || { popularity: 'asc' },
          limit: 24
        };

        const response = await mangadxApi.getManga(searchParams);
        setResults(response.data);
        setTotalResults(response.total);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(performSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleTagToggle = (tagId: string, included: boolean) => {
    setFilters(prev => {
      if (included) {
        return {
          ...prev,
          includedTags: prev.includedTags.includes(tagId) 
            ? prev.includedTags.filter(id => id !== tagId)
            : [...prev.includedTags, tagId],
          excludedTags: prev.excludedTags.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          excludedTags: prev.excludedTags.includes(tagId)
            ? prev.excludedTags.filter(id => id !== tagId)
            : [...prev.excludedTags, tagId],
          includedTags: prev.includedTags.filter(id => id !== tagId)
        };
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>
                
                {/* Status Filter */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ongoing">Publishing</SelectItem>
                      <SelectItem value="completed">Finished</SelectItem>
                      <SelectItem value="hiatus">On Hiatus</SelectItem>
                      <SelectItem value="cancelled">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Genre Filter */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Genres</label>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {tags.map(tag => {
                      const tagName = mangadxApi.getTitle(tag.attributes.name);
                      const isIncluded = filters.includedTags.includes(tag.id);
                      const isExcluded = filters.excludedTags.includes(tag.id);
                      
                      return (
                        <div key={tag.id} className="flex items-center justify-between">
                          <span className="text-sm">{tagName}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleTagToggle(tag.id, true)}
                              className={`px-2 py-1 text-xs rounded ${
                                isIncluded 
                                  ? 'bg-[#00d564] text-white' 
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              Include
                            </button>
                            <button
                              onClick={() => handleTagToggle(tag.id, false)}
                              className={`px-2 py-1 text-xs rounded ${
                                isExcluded 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              Exclude
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select 
                    value={filters.sortBy} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setFilters({
                    status: 'all',
                    includedTags: [],
                    excludedTags: [],
                    sortBy: 'popularity'
                  })}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse All Manga'}
              </h1>
              <p className="text-gray-600">
                {loading ? 'Searching...' : `${totalResults} results found`}
                {searchQuery && (
                  <span className="text-sm text-blue-600 ml-2">
                    Powered by MyAnimeList via Jikan API
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-[3/4] bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.map((item) => {
                    const rating = mangadxApi.getRating(item);
                    
                    return (
                      <Card 
                        key={item.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                        onClick={() => onSeriesSelect(item)}
                      >
                        <CardContent className="p-0">
                          <div className="aspect-[3/4] relative">
                            <ImageWithFallback
                              src={mangadxApi.getCoverUrl(item.id, mangadxApi.getCoverArt(item) || undefined, '256')}
                              alt={mangadxApi.getTitle(item.attributes.title)}
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                            {/* Status badge */}
                            <div className="absolute top-2 right-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.attributes.status === 'ongoing' 
                                  ? 'bg-[#00d564] text-white' 
                                  : 'bg-gray-500 text-white'
                              }`}>
                                {item.attributes.status === 'ongoing' ? 'Ongoing' : 
                                 item.attributes.status === 'completed' ? 'Complete' :
                                 item.attributes.status.charAt(0).toUpperCase() + item.attributes.status.slice(1)}
                              </span>
                            </div>
                            
                            {/* Rating badge */}
                            {rating && (
                              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                                <span>⭐ {rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm line-clamp-2">
                              {mangadxApi.getTitle(item.attributes.title)}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {mangadxApi.getAuthor(item)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((item) => {
                    const rating = mangadxApi.getRating(item);
                    const memberCount = mangadxApi.getMemberCount(item);
                    
                    return (
                      <Card 
                        key={item.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300"
                        onClick={() => onSeriesSelect(item)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-20 h-28 flex-shrink-0">
                              <ImageWithFallback
                                src={mangadxApi.getCoverUrl(item.id, mangadxApi.getCoverArt(item) || undefined, '256')}
                                alt={mangadxApi.getTitle(item.attributes.title)}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1">
                                {mangadxApi.getTitle(item.attributes.title)}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                by {mangadxApi.getAuthor(item)}
                              </p>
                              <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                                {mangadxApi.getDescription(item.attributes.description)}
                              </p>
                              
                              <div className="flex flex-wrap gap-2">
                                {item.attributes.tags.slice(0, 3).map((tag) => (
                                  <span 
                                    key={tag.id}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                                  >
                                    {mangadxApi.getTitle(tag.attributes.name)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="text-right flex-shrink-0">
                              {rating && (
                                <div className="text-sm font-medium mb-1">
                                  ⭐ {rating.toFixed(1)}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 capitalize mb-1">
                                {item.attributes.status}
                              </div>
                              {item.attributes.year && (
                                <div className="text-xs text-gray-500">
                                  {item.attributes.year}
                                </div>
                              )}
                              {memberCount && (
                                <div className="text-xs text-gray-500">
                                  {memberCount > 1000 ? `${Math.floor(memberCount / 1000)}k` : memberCount} members
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* No results */}
              {results.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No manga found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <p className="text-sm text-blue-600">
                    Searching MyAnimeList database via Jikan API
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}