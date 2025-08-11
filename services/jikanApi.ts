// Jikan API v4 Service - Real MyAnimeList API with no CORS restrictions
// Provides real manga metadata but uses placeholder images for content pages

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export interface MangaData {
  id: string;
  attributes: {
    title: { [key: string]: string };
    description: { [key: string]: string };
    status: string;
    year?: number;
    createdAt: string;
    updatedAt: string;
    tags: Array<{
      id: string;
      attributes: {
        name: { [key: string]: string };
      };
    }>;
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: any;
  }>;
  // Additional Jikan-specific fields
  jikan: {
    mal_id: number;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp?: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    title: string;
    title_english?: string;
    title_japanese?: string;
    type: string;
    chapters?: number;
    volumes?: number;
    status: string;
    publishing: boolean;
    published: {
      from: string;
      to?: string;
      prop: {
        from: { day: number; month: number; year: number };
        to?: { day: number; month: number; year: number };
      };
    };
    score?: number;
    scored_by?: number;
    rank?: number;
    popularity?: number;
    members?: number;
    favorites?: number;
    synopsis?: string;
    background?: string;
    authors: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    serializations: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    genres: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    themes: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    demographics: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
  };
}

export interface ChapterData {
  id: string;
  attributes: {
    chapter: string;
    title?: string;
    pages: number;
    publishAt: string;
    translatedLanguage: string;
    volume?: string;
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: any;
  }>;
}

export interface TagData {
  id: string;
  attributes: {
    name: { [key: string]: string };
  };
}

// Genre mapping from Jikan to our format
const GENRE_MAPPING: { [key: number]: string } = {
  1: 'action',
  2: 'adventure',
  4: 'comedy',
  8: 'drama',
  10: 'fantasy',
  14: 'horror',
  7: 'mystery',
  22: 'romance',
  24: 'sci-fi',
  36: 'slice-of-life',
  30: 'sports',
  37: 'supernatural',
  41: 'thriller',
  13: 'historical',
  62: 'isekai',
  16: 'magic'
};

class JikanAPI {
  private baseUrl = JIKAN_BASE_URL;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes cache to respect rate limits

  private async makeRequest<T>(endpoint: string, retryCount = 0): Promise<T> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      
      if (response.status === 429) {
        // Rate limited, wait and retry
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
          return this.makeRequest<T>(endpoint, retryCount + 1);
        }
        throw new Error('Rate limit exceeded');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('Jikan API Error:', error);
      throw error;
    }
  }

  // Convert Jikan manga data to our format
  private convertJikanToMangaData(jikanManga: any): MangaData {
    const publishedYear = jikanManga.published?.from ? 
      new Date(jikanManga.published.from).getFullYear() : undefined;

    const tags = [
      ...jikanManga.genres || [],
      ...jikanManga.themes || [],
      ...jikanManga.demographics || []
    ].map(genre => ({
      id: GENRE_MAPPING[genre.mal_id] || genre.name.toLowerCase().replace(/\s+/g, '-'),
      attributes: {
        name: { en: genre.name }
      }
    }));

    return {
      id: `manga-${jikanManga.mal_id}`,
      attributes: {
        title: {
          en: jikanManga.title_english || jikanManga.title,
          jp: jikanManga.title_japanese || jikanManga.title
        },
        description: {
          en: jikanManga.synopsis || 'No description available.'
        },
        status: this.mapJikanStatus(jikanManga.status),
        year: publishedYear,
        createdAt: jikanManga.published?.from || new Date().toISOString(),
        updatedAt: jikanManga.published?.to || new Date().toISOString(),
        tags
      },
      relationships: [
        {
          id: `author-${jikanManga.mal_id}`,
          type: 'author',
          attributes: {
            name: jikanManga.authors?.[0]?.name || 'Unknown Author'
          }
        },
        {
          id: `cover-${jikanManga.mal_id}`,
          type: 'cover_art',
          attributes: {
            fileName: jikanManga.images?.jpg?.image_url || ''
          }
        }
      ],
      jikan: jikanManga
    };
  }

  private mapJikanStatus(jikanStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'Publishing': 'ongoing',
      'Finished': 'completed',
      'On Hiatus': 'hiatus',
      'Discontinued': 'cancelled',
      'Not yet published': 'upcoming'
    };
    return statusMap[jikanStatus] || 'unknown';
  }

  // Get manga list with various filters
  async getManga(params: {
    limit?: number;
    offset?: number;
    title?: string;
    includedTags?: string[];
    excludedTags?: string[];
    status?: string[];
    order?: Record<string, 'asc' | 'desc'>;
    includes?: string[];
  } = {}): Promise<{ data: MangaData[]; total: number }> {
    
    const page = Math.floor((params.offset || 0) / (params.limit || 20)) + 1;
    let endpoint = `/manga?page=${page}&limit=${params.limit || 20}`;
    
    // Add search query
    if (params.title) {
      endpoint += `&q=${encodeURIComponent(params.title)}`;
    }
    
    // Add status filter
    if (params.status && params.status.length > 0) {
      const jikanStatuses = params.status.map(status => {
        const statusMap: { [key: string]: string } = {
          'ongoing': 'publishing',
          'completed': 'complete',
          'hiatus': 'hiatus',
          'cancelled': 'discontinued'
        };
        return statusMap[status] || status;
      });
      endpoint += `&status=${jikanStatuses.join(',')}`;
    }
    
    // Add genre filters (only inclusion supported by Jikan)
    if (params.includedTags && params.includedTags.length > 0) {
      const genreIds = params.includedTags.map(tag => {
        // Reverse lookup genre ID from mapping
        const genreId = Object.entries(GENRE_MAPPING).find(([id, name]) => name === tag)?.[0];
        return genreId;
      }).filter(Boolean);
      
      if (genreIds.length > 0) {
        endpoint += `&genres=${genreIds.join(',')}`;
      }
    }
    
    // Add sorting
    if (params.order) {
      const orderKey = Object.keys(params.order)[0];
      const orderDir = params.order[orderKey];
      
      const sortMap: { [key: string]: string } = {
        'title': 'title',
        'year': 'start_date',
        'updatedAt': 'end_date',
        'createdAt': 'start_date',
        'popularity': 'popularity',
        'rating': 'score'
      };
      
      const jikanSort = sortMap[orderKey];
      if (jikanSort) {
        endpoint += `&order_by=${jikanSort}&sort=${orderDir}`;
      }
    } else {
      // Default sorting
      endpoint += '&order_by=popularity&sort=desc';
    }

    try {
      const response = await this.makeRequest<{
        data: any[];
        pagination: {
          last_visible_page: number;
          has_next_page: boolean;
          current_page: number;
          items: {
            count: number;
            total: number;
            per_page: number;
          };
        };
      }>(endpoint);

      const mangaData = response.data.map(manga => this.convertJikanToMangaData(manga));
      
      return {
        data: mangaData,
        total: response.pagination.items.total
      };
    } catch (error) {
      console.error('Error fetching manga:', error);
      return { data: [], total: 0 };
    }
  }

  // Get specific manga by ID
  async getMangaById(id: string): Promise<MangaData> {
    const malId = id.replace('manga-', '');
    const response = await this.makeRequest<{ data: any }>(`/manga/${malId}/full`);
    return this.convertJikanToMangaData(response.data);
  }

  // Get chapters for a manga (mock implementation since Jikan doesn't provide chapters)
  async getChapters(mangaId: string, params: {
    limit?: number;
    offset?: number;
    translatedLanguage?: string[];
    order?: Record<string, 'asc' | 'desc'>;
  } = {}): Promise<{ data: ChapterData[]; total: number }> {
    // Since Jikan doesn't provide actual chapters, we'll generate mock chapters
    // based on the manga's chapter count if available
    
    try {
      const manga = await this.getMangaById(mangaId);
      const chapterCount = manga.jikan.chapters || Math.floor(Math.random() * 50) + 10;
      
      const chapters = Array.from({ length: Math.min(chapterCount, 20) }, (_, i) => {
        const chapterNum = chapterCount - i;
        return {
          id: `chapter-${mangaId}-${chapterNum}`,
          attributes: {
            chapter: String(chapterNum),
            title: `Chapter ${chapterNum}`,
            pages: Math.floor(Math.random() * 25) + 15,
            publishAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
            translatedLanguage: 'en',
            volume: String(Math.floor(chapterNum / 10) + 1)
          },
          relationships: [
            {
              id: 'official-translation',
              type: 'scanlation_group',
              attributes: { name: 'Official Translation' }
            }
          ]
        };
      });

      // Apply sorting
      if (params.order?.chapter === 'asc') {
        chapters.reverse();
      }

      // Apply pagination
      const offset = params.offset || 0;
      const limit = params.limit || 20;
      const paginatedChapters = chapters.slice(offset, offset + limit);

      return {
        data: paginatedChapters,
        total: chapters.length
      };
    } catch (error) {
      console.error('Error generating chapters:', error);
      return { data: [], total: 0 };
    }
  }

  // Get chapter pages (placeholder implementation)
  async getChapterPages(chapterId: string): Promise<{
    baseUrl: string;
    chapter: {
      hash: string;
      data: string[];
      dataSaver: string[];
    };
  }> {
    // Generate mock page data with consistent count based on chapter ID
    const pageCount = Math.floor(Math.random() * 20) + 10;
    const pages = Array.from({ length: pageCount }, (_, i) => `page-${i + 1}.jpg`);
    
    return {
      baseUrl: 'https://picsum.photos',
      chapter: {
        hash: chapterId,
        data: pages,
        dataSaver: pages
      }
    };
  }

  // Get all available genres
  async getTags(): Promise<TagData[]> {
    try {
      const response = await this.makeRequest<{ data: any[] }>('/genres/manga');
      
      return response.data.map(genre => ({
        id: GENRE_MAPPING[genre.mal_id] || genre.name.toLowerCase().replace(/\s+/g, '-'),
        attributes: {
          name: { en: genre.name }
        }
      }));
    } catch (error) {
      console.error('Error fetching genres:', error);
      // Return fallback genres
      return Object.entries(GENRE_MAPPING).map(([id, name]) => ({
        id: name,
        attributes: {
          name: { en: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ') }
        }
      }));
    }
  }

  // Search manga
  async searchManga(query: string, filters: {
    includedTags?: string[];
    excludedTags?: string[];
    status?: string[];
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data: MangaData[]; total: number }> {
    return this.getManga({
      title: query,
      ...filters
    });
  }

  // Get trending manga (top rated/popular)
  async getTrendingManga(limit = 20): Promise<{ data: MangaData[]; total: number }> {
    return this.getManga({
      limit,
      order: { popularity: 'asc' } // Lower number = more popular in MAL
    });
  }

  // Get recently updated manga (not directly supported, using recently finished)
  async getRecentlyUpdated(limit = 20): Promise<{ data: MangaData[]; total: number }> {
    return this.getManga({
      limit,
      order: { updatedAt: 'desc' }
    });
  }

  // Get newly added manga
  async getNewlyAdded(limit = 20): Promise<{ data: MangaData[]; total: number }> {
    return this.getManga({
      limit,
      order: { createdAt: 'desc' }
    });
  }

  // Get ongoing manga
  async getOngoingManga(limit = 20): Promise<{ data: MangaData[]; total: number }> {
    return this.getManga({
      limit,
      status: ['ongoing'],
      order: { popularity: 'asc' }
    });
  }

  // Get cover image URL from Jikan data
  getCoverUrl(mangaId: string, fileName?: string, size: 'original' | '512' | '256' = 'original'): string {
    // Try to get from manga data first
    const manga = Array.from(this.cache.values())
      .find(cached => cached.data?.data?.mal_id === parseInt(mangaId.replace('manga-', '')));
    
    if (manga?.data?.images?.jpg) {
      const images = manga.data.images.jpg;
      switch (size) {
        case '256':
          return images.small_image_url || images.image_url;
        case '512':
          return images.image_url;
        case 'original':
          return images.large_image_url || images.image_url;
        default:
          return images.image_url;
      }
    }

    // Fallback to fileName if provided
    if (fileName) {
      return fileName;
    }

    // Final fallback
    const seed = mangaId.replace('manga-', '');
    const sizeMap = {
      'original': '600/800',
      '512': '512/683',
      '256': '256/341'
    };
    return `https://picsum.photos/${sizeMap[size]}?random=${seed}`;
  }

  // Get cover art from relationships
  getCoverArt(manga: MangaData): string | null {
    if (manga.jikan?.images?.jpg?.image_url) {
      return manga.jikan.images.jpg.image_url;
    }
    
    const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
    return coverArt?.attributes?.fileName || null;
  }

  // Get author name
  getAuthor(manga: MangaData): string {
    if (manga.jikan?.authors?.[0]?.name) {
      return manga.jikan.authors[0].name;
    }
    
    const author = manga.relationships.find(rel => rel.type === 'author');
    return author?.attributes?.name || 'Unknown Author';
  }

  // Get title in preferred language
  getTitle(titleObj: { [key: string]: string }, preferredLang = 'en'): string {
    return titleObj[preferredLang] || titleObj['en'] || Object.values(titleObj)[0] || 'Unknown Title';
  }

  // Get description in preferred language
  getDescription(descObj: { [key: string]: string }, preferredLang = 'en'): string {
    return descObj[preferredLang] || descObj['en'] || Object.values(descObj)[0] || 'No description available.';
  }

  // Get rating from Jikan data
  getRating(manga: MangaData): number | null {
    return manga.jikan?.score || null;
  }

  // Get member count
  getMemberCount(manga: MangaData): number | null {
    return manga.jikan?.members || null;
  }

  // Get chapter count
  getChapterCount(manga: MangaData): number | null {
    return manga.jikan?.chapters || null;
  }

  // Get volume count
  getVolumeCount(manga: MangaData): number | null {
    return manga.jikan?.volumes || null;
  }
}

export const mangadxApi = new JikanAPI();