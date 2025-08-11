// MangaDx API v5 Service - Mock Implementation
// Due to CORS restrictions, we're using mock data that matches the real API structure

const MANGADX_BASE_URL = 'https://api.mangadx.org';
const MANGADX_COVER_URL = 'https://uploads.mangadx.org/covers';

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

// Mock data that matches MangaDX API structure
const mockTags: TagData[] = [
  { id: 'action', attributes: { name: { en: 'Action' } } },
  { id: 'adventure', attributes: { name: { en: 'Adventure' } } },
  { id: 'comedy', attributes: { name: { en: 'Comedy' } } },
  { id: 'drama', attributes: { name: { en: 'Drama' } } },
  { id: 'fantasy', attributes: { name: { en: 'Fantasy' } } },
  { id: 'horror', attributes: { name: { en: 'Horror' } } },
  { id: 'mystery', attributes: { name: { en: 'Mystery' } } },
  { id: 'romance', attributes: { name: { en: 'Romance' } } },
  { id: 'sci-fi', attributes: { name: { en: 'Sci-Fi' } } },
  { id: 'slice-of-life', attributes: { name: { en: 'Slice of Life' } } },
  { id: 'sports', attributes: { name: { en: 'Sports' } } },
  { id: 'supernatural', attributes: { name: { en: 'Supernatural' } } },
  { id: 'thriller', attributes: { name: { en: 'Thriller' } } },
  { id: 'historical', attributes: { name: { en: 'Historical' } } },
  { id: 'isekai', attributes: { name: { en: 'Isekai' } } },
  { id: 'magic', attributes: { name: { en: 'Magic' } } },
  { id: 'martial-arts', attributes: { name: { en: 'Martial Arts' } } },
  { id: 'mecha', attributes: { name: { en: 'Mecha' } } },
  { id: 'psychological', attributes: { name: { en: 'Psychological' } } },
  { id: 'school-life', attributes: { name: { en: 'School Life' } } }
];

const mockManga: MangaData[] = [
  {
    id: 'manga-1',
    attributes: {
      title: { en: 'Attack on Titan' },
      description: { 
        en: 'In a world where humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid beings who devour humans seemingly without reason, Eren Yeager joins the military to fight back against the Titans.' 
      },
      status: 'completed',
      year: 2009,
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2023-04-09T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'drama', attributes: { name: { en: 'Drama' } } },
        { id: 'fantasy', attributes: { name: { en: 'Fantasy' } } }
      ]
    },
    relationships: [
      { id: 'author-1', type: 'author', attributes: { name: 'Hajime Isayama' } },
      { id: 'cover-1', type: 'cover_art', attributes: { fileName: 'aot-cover.jpg' } }
    ]
  },
  {
    id: 'manga-2',
    attributes: {
      title: { en: 'One Piece' },
      description: { 
        en: 'Monkey D. Luffy explores the Grand Line to find the legendary treasure known as the One Piece and proclaim himself the next Pirate King.' 
      },
      status: 'ongoing',
      year: 1997,
      createdAt: '2020-01-02T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      tags: [
        { id: 'adventure', attributes: { name: { en: 'Adventure' } } },
        { id: 'comedy', attributes: { name: { en: 'Comedy' } } },
        { id: 'action', attributes: { name: { en: 'Action' } } }
      ]
    },
    relationships: [
      { id: 'author-2', type: 'author', attributes: { name: 'Eiichiro Oda' } },
      { id: 'cover-2', type: 'cover_art', attributes: { fileName: 'one-piece-cover.jpg' } }
    ]
  },
  {
    id: 'manga-3',
    attributes: {
      title: { en: 'Solo Leveling' },
      description: { 
        en: 'The weakest hunter becomes the strongest through a mysterious system that allows him to level up infinitely.' 
      },
      status: 'completed',
      year: 2018,
      createdAt: '2020-01-03T00:00:00Z',
      updatedAt: '2022-12-28T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'fantasy', attributes: { name: { en: 'Fantasy' } } },
        { id: 'supernatural', attributes: { name: { en: 'Supernatural' } } }
      ]
    },
    relationships: [
      { id: 'author-3', type: 'author', attributes: { name: 'Chugong' } },
      { id: 'cover-3', type: 'cover_art', attributes: { fileName: 'solo-leveling-cover.jpg' } }
    ]
  },
  {
    id: 'manga-4',
    attributes: {
      title: { en: 'Tower of God' },
      description: { 
        en: 'Follow Bam as he climbs the mysterious Tower to find his friend Rachel, facing challenges and making allies along the way.' 
      },
      status: 'ongoing',
      year: 2010,
      createdAt: '2020-01-04T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'adventure', attributes: { name: { en: 'Adventure' } } },
        { id: 'fantasy', attributes: { name: { en: 'Fantasy' } } }
      ]
    },
    relationships: [
      { id: 'author-4', type: 'author', attributes: { name: 'SIU' } },
      { id: 'cover-4', type: 'cover_art', attributes: { fileName: 'tower-of-god-cover.jpg' } }
    ]
  },
  {
    id: 'manga-5',
    attributes: {
      title: { en: 'Demon Slayer' },
      description: { 
        en: 'A young boy becomes a demon slayer to save his sister who has been turned into a demon.' 
      },
      status: 'completed',
      year: 2016,
      createdAt: '2020-01-05T00:00:00Z',
      updatedAt: '2020-05-18T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'supernatural', attributes: { name: { en: 'Supernatural' } } },
        { id: 'historical', attributes: { name: { en: 'Historical' } } }
      ]
    },
    relationships: [
      { id: 'author-5', type: 'author', attributes: { name: 'Koyoharu Gotouge' } },
      { id: 'cover-5', type: 'cover_art', attributes: { fileName: 'demon-slayer-cover.jpg' } }
    ]
  },
  {
    id: 'manga-6',
    attributes: {
      title: { en: 'My Hero Academia' },
      description: { 
        en: 'In a world where most people have superpowers called Quirks, a powerless boy strives to become a hero.' 
      },
      status: 'ongoing',
      year: 2014,
      createdAt: '2020-01-06T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'adventure', attributes: { name: { en: 'Adventure' } } },
        { id: 'supernatural', attributes: { name: { en: 'Supernatural' } } }
      ]
    },
    relationships: [
      { id: 'author-6', type: 'author', attributes: { name: 'Kohei Horikoshi' } },
      { id: 'cover-6', type: 'cover_art', attributes: { fileName: 'mha-cover.jpg' } }
    ]
  },
  {
    id: 'manga-7',
    attributes: {
      title: { en: 'Naruto' },
      description: { 
        en: 'A young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.' 
      },
      status: 'completed',
      year: 1999,
      createdAt: '2020-01-07T00:00:00Z',
      updatedAt: '2014-11-10T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'adventure', attributes: { name: { en: 'Adventure' } } },
        { id: 'martial-arts', attributes: { name: { en: 'Martial Arts' } } }
      ]
    },
    relationships: [
      { id: 'author-7', type: 'author', attributes: { name: 'Masashi Kishimoto' } },
      { id: 'cover-7', type: 'cover_art', attributes: { fileName: 'naruto-cover.jpg' } }
    ]
  },
  {
    id: 'manga-8',
    attributes: {
      title: { en: 'Dragon Ball' },
      description: { 
        en: 'The adventures of Son Goku, from his childhood through adulthood as he trains in martial arts and explores the world.' 
      },
      status: 'completed',
      year: 1984,
      createdAt: '2020-01-08T00:00:00Z',
      updatedAt: '1995-06-05T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'adventure', attributes: { name: { en: 'Adventure' } } },
        { id: 'comedy', attributes: { name: { en: 'Comedy' } } }
      ]
    },
    relationships: [
      { id: 'author-8', type: 'author', attributes: { name: 'Akira Toriyama' } },
      { id: 'cover-8', type: 'cover_art', attributes: { fileName: 'dragon-ball-cover.jpg' } }
    ]
  },
  {
    id: 'manga-9',
    attributes: {
      title: { en: 'Death Note' },
      description: { 
        en: 'A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name in it.' 
      },
      status: 'completed',
      year: 2003,
      createdAt: '2020-01-09T00:00:00Z',
      updatedAt: '2006-05-15T00:00:00Z',
      tags: [
        { id: 'thriller', attributes: { name: { en: 'Thriller' } } },
        { id: 'supernatural', attributes: { name: { en: 'Supernatural' } } },
        { id: 'mystery', attributes: { name: { en: 'Mystery' } } }
      ]
    },
    relationships: [
      { id: 'author-9', type: 'author', attributes: { name: 'Tsugumi Ohba' } },
      { id: 'cover-9', type: 'cover_art', attributes: { fileName: 'death-note-cover.jpg' } }
    ]
  },
  {
    id: 'manga-10',
    attributes: {
      title: { en: 'Fullmetal Alchemist' },
      description: { 
        en: 'Two brothers use alchemy in their quest to find the Philosopher\'s Stone to restore their bodies after a failed attempt to bring their mother back to life.' 
      },
      status: 'completed',
      year: 2001,
      createdAt: '2020-01-10T00:00:00Z',
      updatedAt: '2010-06-11T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'adventure', attributes: { name: { en: 'Adventure' } } },
        { id: 'drama', attributes: { name: { en: 'Drama' } } }
      ]
    },
    relationships: [
      { id: 'author-10', type: 'author', attributes: { name: 'Hiromu Arakawa' } },
      { id: 'cover-10', type: 'cover_art', attributes: { fileName: 'fma-cover.jpg' } }
    ]
  },
  {
    id: 'manga-11',
    attributes: {
      title: { en: 'Jujutsu Kaisen' },
      description: { 
        en: 'A high school student joins a secret organization of sorcerers to kill a powerful Curse that threatens humanity.' 
      },
      status: 'ongoing',
      year: 2018,
      createdAt: '2020-01-11T00:00:00Z',
      updatedAt: '2024-01-13T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'supernatural', attributes: { name: { en: 'Supernatural' } } },
        { id: 'school-life', attributes: { name: { en: 'School Life' } } }
      ]
    },
    relationships: [
      { id: 'author-11', type: 'author', attributes: { name: 'Gege Akutami' } },
      { id: 'cover-11', type: 'cover_art', attributes: { fileName: 'jjk-cover.jpg' } }
    ]
  },
  {
    id: 'manga-12',
    attributes: {
      title: { en: 'Chainsaw Man' },
      description: { 
        en: 'A young man makes a contract with a devil to become a devil hunter in exchange for a normal life.' 
      },
      status: 'ongoing',
      year: 2018,
      createdAt: '2020-01-12T00:00:00Z',
      updatedAt: '2024-01-14T00:00:00Z',
      tags: [
        { id: 'action', attributes: { name: { en: 'Action' } } },
        { id: 'horror', attributes: { name: { en: 'Horror' } } },
        { id: 'supernatural', attributes: { name: { en: 'Supernatural' } } }
      ]
    },
    relationships: [
      { id: 'author-12', type: 'author', attributes: { name: 'Tatsuki Fujimoto' } },
      { id: 'cover-12', type: 'cover_art', attributes: { fileName: 'csm-cover.jpg' } }
    ]
  }
];

const mockChapters: { [mangaId: string]: ChapterData[] } = {
  'manga-1': Array.from({ length: 10 }, (_, i) => ({
    id: `chapter-1-${i + 1}`,
    attributes: {
      chapter: String(139 - i),
      title: i === 0 ? 'Toward the Tree on That Hill' : i === 1 ? 'A Long Dream' : `Chapter ${139 - i}`,
      pages: Math.floor(Math.random() * 30) + 15,
      publishAt: new Date(2021, 3, 9 - i).toISOString(),
      translatedLanguage: 'en',
      volume: String(Math.floor((139 - i) / 4) + 1)
    },
    relationships: [
      { id: 'group-1', type: 'scanlation_group', attributes: { name: 'Official Translation' } }
    ]
  })),
  'manga-2': Array.from({ length: 15 }, (_, i) => ({
    id: `chapter-2-${i + 1}`,
    attributes: {
      chapter: String(1100 - i),
      title: i === 0 ? 'The Final Island' : i === 1 ? 'Pacifista' : `Chapter ${1100 - i}`,
      pages: Math.floor(Math.random() * 20) + 15,
      publishAt: new Date(2024, 0, 15 - i).toISOString(),
      translatedLanguage: 'en',
      volume: String(Math.floor((1100 - i) / 10) + 1)
    },
    relationships: [
      { id: 'group-2', type: 'scanlation_group', attributes: { name: 'Official Translation' } }
    ]
  })),
  'manga-3': Array.from({ length: 12 }, (_, i) => ({
    id: `chapter-3-${i + 1}`,
    attributes: {
      chapter: String(179 - i),
      title: i === 0 ? 'The Final Battle' : `Chapter ${179 - i}`,
      pages: Math.floor(Math.random() * 35) + 20,
      publishAt: new Date(2022, 11, 28 - i).toISOString(),
      translatedLanguage: 'en',
      volume: String(Math.floor((179 - i) / 15) + 1)
    },
    relationships: [
      { id: 'group-3', type: 'scanlation_group', attributes: { name: 'Webtoon Official' } }
    ]
  })),
  'manga-4': Array.from({ length: 20 }, (_, i) => ({
    id: `chapter-4-${i + 1}`,
    attributes: {
      chapter: String(590 - i),
      title: `Chapter ${590 - i}`,
      pages: Math.floor(Math.random() * 40) + 25,
      publishAt: new Date(2024, 0, 10 - i).toISOString(),
      translatedLanguage: 'en',
      volume: String(Math.floor((590 - i) / 25) + 1)
    },
    relationships: [
      { id: 'group-4', type: 'scanlation_group', attributes: { name: 'Webtoon Official' } }
    ]
  })),
  'manga-5': Array.from({ length: 8 }, (_, i) => ({
    id: `chapter-5-${i + 1}`,
    attributes: {
      chapter: String(205 - i),
      title: i === 0 ? 'The Final Battle' : `Chapter ${205 - i}`,
      pages: Math.floor(Math.random() * 25) + 18,
      publishAt: new Date(2020, 4, 18 - i).toISOString(),
      translatedLanguage: 'en',
      volume: String(Math.floor((205 - i) / 23) + 1)
    },
    relationships: [
      { id: 'group-5', type: 'scanlation_group', attributes: { name: 'Official Translation' } }
    ]
  }))
};

// Add chapters for remaining manga
['manga-6', 'manga-7', 'manga-8', 'manga-9', 'manga-10', 'manga-11', 'manga-12'].forEach(mangaId => {
  const chapterCount = Math.floor(Math.random() * 15) + 5;
  const maxChapter = mangaId === 'manga-6' ? 400 : mangaId === 'manga-7' ? 700 : mangaId === 'manga-8' ? 519 : 108;
  
  mockChapters[mangaId] = Array.from({ length: chapterCount }, (_, i) => ({
    id: `${mangaId}-chapter-${i + 1}`,
    attributes: {
      chapter: String(maxChapter - i),
      title: i === 0 ? 'Latest Chapter' : `Chapter ${maxChapter - i}`,
      pages: Math.floor(Math.random() * 25) + 15,
      publishAt: new Date(2024, 0, 15 - i).toISOString(),
      translatedLanguage: 'en',
      volume: String(Math.floor((maxChapter - i) / 10) + 1)
    },
    relationships: [
      { id: `group-${mangaId}`, type: 'scanlation_group', attributes: { name: 'Official Translation' } }
    ]
  }));
});

class MangaDxAPI {
  private baseUrl = MANGADX_BASE_URL;

  // Simulate network delay
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async mockRequest<T>(data: T): Promise<T> {
    await this.delay(Math.random() * 500 + 200); // Random delay 200-700ms
    return data;
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
    let filteredManga = [...mockManga];
    
    // Filter by title
    if (params.title) {
      const searchTerm = params.title.toLowerCase();
      filteredManga = filteredManga.filter(manga => 
        this.getTitle(manga.attributes.title).toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by status
    if (params.status && params.status.length > 0) {
      filteredManga = filteredManga.filter(manga => 
        params.status!.includes(manga.attributes.status)
      );
    }
    
    // Filter by included tags
    if (params.includedTags && params.includedTags.length > 0) {
      filteredManga = filteredManga.filter(manga => 
        params.includedTags!.some(tagId => 
          manga.attributes.tags.some(tag => tag.id === tagId)
        )
      );
    }
    
    // Filter by excluded tags
    if (params.excludedTags && params.excludedTags.length > 0) {
      filteredManga = filteredManga.filter(manga => 
        !params.excludedTags!.some(tagId => 
          manga.attributes.tags.some(tag => tag.id === tagId)
        )
      );
    }
    
    // Apply sorting
    if (params.order) {
      const orderKey = Object.keys(params.order)[0];
      const orderDir = params.order[orderKey];
      
      filteredManga.sort((a, b) => {
        let aVal, bVal;
        switch (orderKey) {
          case 'title':
            aVal = this.getTitle(a.attributes.title);
            bVal = this.getTitle(b.attributes.title);
            break;
          case 'year':
            aVal = a.attributes.year || 0;
            bVal = b.attributes.year || 0;
            break;
          case 'createdAt':
            aVal = new Date(a.attributes.createdAt).getTime();
            bVal = new Date(b.attributes.createdAt).getTime();
            break;
          case 'updatedAt':
            aVal = new Date(a.attributes.updatedAt).getTime();
            bVal = new Date(b.attributes.updatedAt).getTime();
            break;
          default:
            return 0;
        }
        
        if (orderDir === 'desc') {
          return aVal < bVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });
    }
    
    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || 20;
    const paginatedData = filteredManga.slice(offset, offset + limit);
    
    return this.mockRequest({
      data: paginatedData,
      total: filteredManga.length
    });
  }

  // Get specific manga by ID
  async getMangaById(id: string): Promise<MangaData> {
    const manga = mockManga.find(m => m.id === id);
    if (!manga) {
      throw new Error(`Manga with ID ${id} not found`);
    }
    return this.mockRequest(manga);
  }

  // Get chapters for a manga
  async getChapters(mangaId: string, params: {
    limit?: number;
    offset?: number;
    translatedLanguage?: string[];
    order?: Record<string, 'asc' | 'desc'>;
  } = {}): Promise<{ data: ChapterData[]; total: number }> {
    const chapters = mockChapters[mangaId] || [];
    
    // Apply sorting
    let sortedChapters = [...chapters];
    if (params.order) {
      const orderKey = Object.keys(params.order)[0];
      const orderDir = params.order[orderKey];
      
      if (orderKey === 'chapter') {
        sortedChapters.sort((a, b) => {
          const aChapter = parseFloat(a.attributes.chapter);
          const bChapter = parseFloat(b.attributes.chapter);
          return orderDir === 'desc' ? bChapter - aChapter : aChapter - bChapter;
        });
      }
    }
    
    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || 100;
    const paginatedData = sortedChapters.slice(offset, offset + limit);
    
    return this.mockRequest({
      data: paginatedData,
      total: sortedChapters.length
    });
  }

  // Get chapter pages
  async getChapterPages(chapterId: string): Promise<{
    baseUrl: string;
    chapter: {
      hash: string;
      data: string[];
      dataSaver: string[];
    };
  }> {
    // Generate mock page data
    const pageCount = Math.floor(Math.random() * 20) + 10; // 10-30 pages
    const pages = Array.from({ length: pageCount }, (_, i) => `page-${i + 1}.jpg`);
    
    return this.mockRequest({
      baseUrl: 'https://picsum.photos',
      chapter: {
        hash: 'mock-hash',
        data: pages,
        dataSaver: pages
      }
    });
  }

  // Get all tags/genres
  async getTags(): Promise<TagData[]> {
    return this.mockRequest(mockTags);
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
      ...filters,
      order: { updatedAt: 'desc' }
    });
  }

  // Get trending manga (by popularity simulation)
  async getTrendingManga(limit = 20): Promise<{ data: MangaData[]; total: number }> {
    // Simulate trending by taking popular manga
    const trending = mockManga.slice(0, limit);
    return this.mockRequest({
      data: trending,
      total: trending.length
    });
  }

  // Get recently updated manga
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
      order: { updatedAt: 'desc' }
    });
  }

  // Utility function to get cover image URL (using placeholders)
  getCoverUrl(mangaId: string, fileName: string, size: 'original' | '512' | '256' = 'original'): string {
    // Use placeholder images that work in browser
    const sizeMap = {
      'original': '600/800',
      '512': '512/683',
      '256': '256/341'
    };
    
    // Create consistent images based on manga ID
    const seed = mangaId.split('-')[1] || '1';
    return `https://picsum.photos/${sizeMap[size]}?random=${seed}`;
  }

  // Get cover art filename from manga relationships
  getCoverArt(manga: MangaData): string | null {
    const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
    return coverArt?.attributes?.fileName || null;
  }

  // Get author name from manga relationships
  getAuthor(manga: MangaData): string {
    const author = manga.relationships.find(rel => rel.type === 'author');
    return author?.attributes?.name || 'Unknown Author';
  }

  // Utility to get title in preferred language
  getTitle(titleObj: { [key: string]: string }, preferredLang = 'en'): string {
    return titleObj[preferredLang] || titleObj['en'] || Object.values(titleObj)[0] || 'Unknown Title';
  }

  // Utility to get description in preferred language
  getDescription(descObj: { [key: string]: string }, preferredLang = 'en'): string {
    return descObj[preferredLang] || descObj['en'] || Object.values(descObj)[0] || 'No description available.';
  }
}

export const mangadxApi = new MangaDxAPI();