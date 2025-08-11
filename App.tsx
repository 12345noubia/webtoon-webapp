import React, { useState } from 'react';
import { Header } from './components/Header';
import { Homepage } from './components/Homepage';
import { SearchPage } from './components/SearchPage';
import { SeriesDetail } from './components/SeriesDetail';
import { Reader } from './components/Reader';
import { UserProfile } from './components/UserProfile';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <SearchPage searchQuery={searchQuery} onSeriesSelect={(series) => {
          setSelectedSeries(series);
          setCurrentPage('series');
        }} />;
      case 'series':
        return <SeriesDetail series={selectedSeries} onChapterSelect={(chapter) => {
          setSelectedChapter(chapter);
          setCurrentPage('reader');
        }} onBack={() => setCurrentPage('home')} />;
      case 'reader':
        return <Reader chapter={selectedChapter} onBack={() => setCurrentPage('series')} />;
      case 'profile':
        return <UserProfile onBack={() => setCurrentPage('home')} />;
      default:
        return <Homepage onSeriesSelect={(series) => {
          setSelectedSeries(series);
          setCurrentPage('series');
        }} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onNavigate={setCurrentPage}
        onSearch={(query) => {
          setSearchQuery(query);
          setCurrentPage('search');
        }}
        currentPage={currentPage}
      />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
}