import React, { useState } from 'react';
import { ArrowLeft, Edit, Settings, Book, Heart, Clock, Trophy, User, Bell, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data (in real app this would come from authentication system)
  const mockUser = {
    id: "user-1",
    username: "MangaReader123",
    email: "user@example.com",
    avatar: "https://picsum.photos/200/200?random=1",
    joinDate: "2023-06-15",
    readingLevel: "Manga Master",
    totalChapters: 1247,
    seriesFollowed: 45,
    readingStreak: 28
  };

  // Mock reading history
  const mockReadingHistory = [
    {
      id: "history-1",
      manga: {
        title: "Attack on Titan",
        cover: "https://picsum.photos/100/150?random=10"
      },
      chapter: "Chapter 139",
      lastRead: "2024-01-15T14:30:00Z",
      progress: 100
    },
    {
      id: "history-2", 
      manga: {
        title: "One Piece",
        cover: "https://picsum.photos/100/150?random=11"
      },
      chapter: "Chapter 1100",
      lastRead: "2024-01-14T20:15:00Z",
      progress: 65
    },
    {
      id: "history-3",
      manga: {
        title: "Demon Slayer", 
        cover: "https://picsum.photos/100/150?random=12"
      },
      chapter: "Chapter 205",
      lastRead: "2024-01-13T16:45:00Z",
      progress: 100
    }
  ];

  // Mock followed series
  const mockFollowedSeries = [
    {
      id: "follow-1",
      title: "Solo Leveling",
      cover: "https://picsum.photos/120/160?random=20",
      status: "ongoing",
      newChapters: 2
    },
    {
      id: "follow-2",
      title: "Tower of God",
      cover: "https://picsum.photos/120/160?random=21", 
      status: "ongoing",
      newChapters: 0
    },
    {
      id: "follow-3",
      title: "The God of High School",
      cover: "https://picsum.photos/120/160?random=22",
      status: "completed",
      newChapters: 0
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage src={mockUser.avatar} alt={mockUser.username} />
                <AvatarFallback className="text-2xl">
                  {mockUser.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{mockUser.username}</h1>
                  <p className="text-gray-600">{mockUser.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {formatDate(mockUser.joinDate)}
                  </p>
                </div>
                
                <Button variant="outline" className="mt-4 sm:mt-0">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Reading Level Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-[#00d564] text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  {mockUser.readingLevel}
                </Badge>
                <Badge variant="outline">
                  {mockUser.readingStreak} day streak 🔥
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00d564]">
                    {mockUser.totalChapters}
                  </div>
                  <div className="text-sm text-gray-600">Chapters Read</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00d564]">
                    {mockUser.seriesFollowed}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00d564]">
                    {mockUser.readingStreak}
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reading Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Reading Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReadingHistory.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <ImageWithFallback
                        src={item.manga.cover}
                        alt={item.manga.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.manga.title}</p>
                        <p className="text-sm text-gray-600">{item.chapter}</p>
                        <Progress value={item.progress} className="mt-1 h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Reading Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chapters this week</span>
                    <span className="font-semibold">28</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average per day</span>
                    <span className="font-semibold">4.2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Favorite genre</span>
                    <Badge variant="secondary">Action</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total reading time</span>
                    <span className="font-semibold">142h 30m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Reading History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReadingHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <ImageWithFallback
                      src={item.manga.cover}
                      alt={item.manga.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{item.manga.title}</h4>
                      <p className="text-sm text-gray-600">{item.chapter}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={item.progress} className="flex-1 h-1" />
                        <span className="text-xs text-gray-500">
                          {item.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {getTimeAgo(item.lastRead)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Following Tab */}
        <TabsContent value="following" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Following ({mockFollowedSeries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockFollowedSeries.map((series) => (
                  <div key={series.id} className="relative group cursor-pointer">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative">
                          <ImageWithFallback
                            src={series.cover}
                            alt={series.title}
                            className="w-full aspect-[3/4] object-cover"
                          />
                          
                          {/* New chapters badge */}
                          {series.newChapters > 0 && (
                            <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                              +{series.newChapters}
                            </Badge>
                          )}
                          
                          {/* Status badge */}
                          <Badge 
                            variant={series.status === 'ongoing' ? 'default' : 'secondary'}
                            className={`absolute bottom-2 left-2 text-xs ${
                              series.status === 'ongoing' ? 'bg-[#00d564]' : ''
                            }`}
                          >
                            {series.status}
                          </Badge>
                        </div>
                        
                        <div className="p-2">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {series.title}
                          </h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample achievements */}
            {[
              { 
                title: "Speed Reader", 
                description: "Read 100 chapters in a week",
                icon: "🏃‍♂️",
                unlocked: true,
                progress: 100
              },
              {
                title: "Bookworm",
                description: "Follow 50 different series", 
                icon: "🐛",
                unlocked: false,
                progress: 90
              },
              {
                title: "Streak Master",
                description: "30-day reading streak",
                icon: "🔥", 
                unlocked: false,
                progress: 93
              },
              {
                title: "Genre Explorer",
                description: "Read from 10 different genres",
                icon: "🗺️",
                unlocked: true,
                progress: 100
              }
            ].map((achievement, index) => (
              <Card key={index} className={`${achievement.unlocked ? 'bg-[#00d564] bg-opacity-10 border-[#00d564]' : 'bg-gray-50'}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                  
                  {achievement.unlocked ? (
                    <Badge className="bg-[#00d564] text-white">
                      Unlocked!
                    </Badge>
                  ) : (
                    <div>
                      <Progress value={achievement.progress} className="mb-2" />
                      <span className="text-xs text-gray-500">
                        {achievement.progress}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}