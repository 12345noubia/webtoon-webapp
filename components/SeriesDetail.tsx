import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Heart, Share2, Star, Calendar, User, Tag, Eye, Clock, Users, TrendingUp, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mangadxApi, MangaData, ChapterData } from '../services/jikanApi';

interface SeriesDetailProps {
  series: MangaData;
  onChapterSelect: (chapter: ChapterData) => void;
  onBack: () => void;
}

export function SeriesDetail({ series, onChapterSelect, onBack }: SeriesDetailProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapterLoading, setChapterLoading] = useState(true);
  const [totalChapters, setTotalChapters] = useState(0);

  // Get rich data from Jikan
  const rating = mangadxApi.getRating(series);
  const memberCount = mangadxApi.getMemberCount(series);
  const chapterCount = mangadxApi.getChapterCount(series);
  const volumeCount = mangadxApi.getVolumeCount(series);

  // Fetch chapters when series is loaded
  useEffect(() => {
    const fetchChapters = async () => {
      if (!series?.id) return;
      
      setChapterLoading(true);
      try {
        const response = await mangadxApi.getChapters(series.id, {
          limit: 50,
          translatedLanguage: ['en'],
          order: { chapter: 'desc' }
        });
        
        setChapters(response.data);
        setTotalChapters(response.total);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setChapterLoading(false);
      }
    };

    fetchChapters();
    setLoading(false);
  }, [series?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScanlationGroup = (chapter: ChapterData) => {
    const group = chapter.relationships.find(rel => rel.type === 'scanlation_group');
    return group?.attributes?.name || 'Unknown Group';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!series || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-gray-200 rounded" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-6 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Browse
      </Button>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Cover Image */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <div className="aspect-[3/4] relative">
                  {/* Real cover from Jikan */}
                  <ImageWithFallback
                    src={mangadxApi.getCoverUrl(series.id, mangadxApi.getCoverArt(series) || undefined, 'original')}
                    alt={mangadxApi.getTitle(series.attributes.title)}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={series.attributes.status === 'ongoing' ? 'default' : 'secondary'}
                      className={`font-semibold ${series.attributes.status === 'ongoing' ? 'bg-[#00d564] hover:bg-[#00b851]' : ''}`}
                    >
                      {series.attributes.status === 'ongoing' ? 'Ongoing' :
                       series.attributes.status === 'completed' ? 'Completed' :
                       series.attributes.status === 'hiatus' ? 'On Hiatus' :
                       series.attributes.status.charAt(0).toUpperCase() + series.attributes.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Rating Badge */}
                  {rating && (
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}

                  {/* Rank Badge */}
                  {series.jikan?.rank && (
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        <Award className="h-3 w-3" />
                        <span>#{series.jikan.rank}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="p-4 space-y-3">
                  <Button 
                    className="w-full bg-[#00d564] hover:bg-[#00b851] text-white font-semibold"
                    size="lg"
                    onClick={() => {
                      if (chapters.length > 0) {
                        const firstChapter = chapters[chapters.length - 1];
                        onChapterSelect(firstChapter);
                      }
                    }}
                    disabled={chapters.length === 0}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    {chapters.length > 0 ? 'Start Reading' : 'No Chapters Available'}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`font-medium ${isFollowing ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'hover:bg-gray-50'}`}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                    
                    <Button variant="outline" className="hover:bg-gray-50">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Series Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and basic info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              {mangadxApi.getTitle(series.attributes.title)}
            </h1>
            
            {/* Alternative titles */}
            {series.jikan?.title_english && series.jikan.title_english !== series.jikan.title && (
              <p className="text-lg text-gray-600 mb-2">{series.jikan.title_english}</p>
            )}
            
            {series.jikan?.title_japanese && (
              <p className="text-base text-gray-500 mb-4">{series.jikan.title_japanese}</p>
            )}
            
            {/* Key stats */}
            <div className="flex items-center gap-6 mb-6">
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{rating.toFixed(1)}</span>
                  {series.jikan?.scored_by && (
                    <span className="text-gray-600">({formatNumber(series.jikan.scored_by)} votes)</span>
                  )}
                </div>
              )}
              
              {memberCount && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(memberCount)} members</span>
                </div>
              )}
              
              {series.jikan?.popularity && (
                <div className="flex items-center gap-1 text-gray-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>#{series.jikan.popularity} popularity</span>
                </div>
              )}
            </div>

            {/* Author and publication info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{mangadxApi.getAuthor(series)}</span>
              </div>
              
              {series.attributes.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{series.attributes.year}</span>
                </div>
              )}
              
              {series.jikan?.type && (
                <Badge variant="secondary">{series.jikan.type}</Badge>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {series.attributes.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="hover:bg-gray-100 cursor-pointer">
                  <Tag className="h-3 w-3 mr-1" />
                  {mangadxApi.getTitle(tag.attributes.name)}
                </Badge>
              ))}
            </div>

            {/* Synopsis */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Synopsis</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {mangadxApi.getDescription(series.attributes.description)}
                </p>
                
                {/* Background info if available */}
                {series.jikan?.background && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Background</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {series.jikan.background}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#00d564]">
                  {chapterCount || totalChapters || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Chapters</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#00d564]">
                  {volumeCount || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Volumes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#00d564]">
                  {rating ? rating.toFixed(1) : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#00d564]">
                  {series.jikan?.rank ? `#${series.jikan.rank}` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Rank</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chapters and Additional Info */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="chapters" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chapters">Chapters ({totalChapters})</TabsTrigger>
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chapters" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">All Chapters</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Sort: Latest First
                  </Button>
                </div>
              </div>
              
              {chapterLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : chapters.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {chapters.map((chapter) => (
                    <Card 
                      key={chapter.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50"
                      onClick={() => onChapterSelect(chapter)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="font-semibold text-[#00d564]">
                                {chapter.attributes.volume && `Vol. ${chapter.attributes.volume} `}
                                Chapter {chapter.attributes.chapter}
                              </div>
                              {chapter.attributes.title && (
                                <div className="font-medium truncate">
                                  {chapter.attributes.title}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span>{chapter.attributes.pages} pages</span>
                              <span>{getScanlationGroup(chapter)}</span>
                              <span>{formatDate(chapter.attributes.publishAt)}</span>
                              <span className="uppercase text-xs bg-gray-100 px-2 py-1 rounded">
                                {chapter.attributes.translatedLanguage}
                              </span>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="bg-[#00d564] hover:bg-[#00b851] text-white ml-4"
                          >
                            Read
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No chapters available</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="info" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Publication Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{series.attributes.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{series.jikan?.type || 'Manga'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Published:</span>
                      <span className="font-medium">
                        {series.jikan?.published?.from ? formatDate(series.jikan.published.from) : 'Unknown'}
                        {series.jikan?.published?.to && ` - ${formatDate(series.jikan.published.to)}`}
                      </span>
                    </div>
                    {series.jikan?.serializations?.[0] && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Serialization:</span>
                        <span className="font-medium">{series.jikan.serializations[0].name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Authors & Artists</h4>
                  <div className="space-y-2">
                    {series.jikan?.authors?.map((author) => (
                      <div key={author.mal_id} className="flex justify-between">
                        <span className="text-gray-600">{author.type}:</span>
                        <span className="font-medium">{author.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">MyAnimeList Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-medium">{rating ? `${rating.toFixed(2)}/10` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scored by:</span>
                      <span className="font-medium">{series.jikan?.scored_by ? formatNumber(series.jikan.scored_by) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rank:</span>
                      <span className="font-medium">{series.jikan?.rank ? `#${series.jikan.rank}` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Popularity:</span>
                      <span className="font-medium">{series.jikan?.popularity ? `#${series.jikan.popularity}` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Members:</span>
                      <span className="font-medium">{memberCount ? formatNumber(memberCount) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Favorites:</span>
                      <span className="font-medium">{series.jikan?.favorites ? formatNumber(series.jikan.favorites) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}