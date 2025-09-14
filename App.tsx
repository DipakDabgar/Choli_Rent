import React, { useState, useEffect, useCallback } from 'react';
import { ChaniyaCholi, Booking, Page } from './types';
import Header from './components/Header';
import ChaniyaCholiList from './components/ChaniyaCholiList';
import ChaniyaCholiDetail from './components/ChaniyaCholiDetail';
import AdminPanel from './components/AdminPanel';

const generateIdFromName = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const INITIAL_CHOLIS: ChaniyaCholi[] = [
  { id: 'peacock-dream-lehenga', name: 'Peacock Dream Lehenga', pricePerDay: 3500, imageUrl: 'https://picsum.photos/seed/choli1/720/1280' },
  { id: 'royal-velvet-choli', name: 'Royal Velvet Choli', pricePerDay: 5000, imageUrl: 'https://picsum.photos/seed/choli2/720/1280' },
  { id: 'sunshine-bandhani', name: 'Sunshine Bandhani', pricePerDay: 2500, imageUrl: 'https://picsum.photos/seed/choli3/720/1280' },
  { id: 'pastel-floral-glory', name: 'Pastel Floral Glory', pricePerDay: 4000, imageUrl: 'https://picsum.photos/seed/choli4/720/1280' },
];

const INITIAL_BOOKINGS: Booking[] = [
  // This booking will mark circles 3, 4, 5 as booked for Royal Velvet Choli
  { id: 1, choliId: 'royal-velvet-choli', customerName: 'Priya Patel', customerContact: '9876543210', startDate: '2025-09-24', endDate: '2025-09-26' },
  // This booking will mark circles 6, 7, 8, 9 as booked for Sunshine Bandhani
  { id: 2, choliId: 'sunshine-bandhani', customerName: 'Anjali Sharma', customerContact: '8765432109', startDate: '2025-09-27', endDate: '2025-09-30' },
];


const App: React.FC = () => {
  const [page, setPage] = useState<Page>('list');
  const [selectedCholiId, setSelectedCholiId] = useState<string | null>(null);

  const [cholis, setCholis] = useState<ChaniyaCholi[]>(() => {
    try {
      const savedCholis = localStorage.getItem('cholis');
      return savedCholis ? JSON.parse(savedCholis) : INITIAL_CHOLIS;
    } catch (error) {
      console.error("Failed to parse cholis from localStorage", error);
      return INITIAL_CHOLIS;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const savedBookings = localStorage.getItem('bookings');
      return savedBookings ? JSON.parse(savedBookings) : INITIAL_BOOKINGS;
    } catch (error) {
      console.error("Failed to parse bookings from localStorage", error);
      return INITIAL_BOOKINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('cholis', JSON.stringify(cholis));
  }, [cholis]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);


  const handleSelectCholi = (id: string) => {
    setSelectedCholiId(id);
    setPage('detail');
  };
  
  const handleNavigate = (newPage: Page) => {
    setPage(newPage);
  }

  const addCholi = (choli: Omit<ChaniyaCholi, 'id'>) => {
    const newId = generateIdFromName(choli.name);
    if (cholis.some(c => c.id === newId)) {
        alert('A Chaniya Choli with this name already exists. Please use a different name.');
        return;
    }
    setCholis(prev => [...prev, { ...choli, id: newId }]);
  };

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    setBookings(prev => [...prev, { ...booking, id: Date.now() }]);
    alert('Booking successful!');
    setPage('list');
  };

  const deleteBooking = (bookingId: number) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        alert('Booking deleted successfully!');
    }
  };

  const deleteCholi = (choliId: string) => {
    const hasBookings = bookings.some(booking => booking.choliId === choliId);
    if (hasBookings) {
        alert('Cannot delete this item as it has active bookings. Please delete the associated bookings first.');
        return;
    }

    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        setCholis(prev => prev.filter(c => c.id !== choliId));
        alert('Item deleted successfully!');
    }
  };

  const handleUnbookDate = (choliId: string, dateToUnbook: Date) => {
    const dateStr = dateToUnbook.toISOString().split('T')[0];

    const bookingToDelete = bookings.find(booking => 
        booking.choliId === choliId &&
        dateStr >= booking.startDate &&
        dateStr <= booking.endDate
    );

    if (bookingToDelete) {
        deleteBooking(bookingToDelete.id);
    } else {
        console.warn("Could not find booking for the selected date to unbook.");
    }
  };

  const renderContent = () => {
    if (page === 'detail' && selectedCholiId) {
      const selectedCholi = cholis.find(c => c.id === selectedCholiId);
      if (selectedCholi) {
        return (
          <ChaniyaCholiDetail
            choli={selectedCholi}
            bookings={bookings.filter(b => b.choliId === selectedCholiId)}
            onAddBooking={addBooking}
            onBack={() => {
              setPage('list');
              setSelectedCholiId(null);
            }}
          />
        );
      }
    }

    if (page === 'admin') {
      return <AdminPanel cholis={cholis} bookings={bookings} onAddCholi={addCholi} onDeleteBooking={deleteBooking} onDeleteCholi={deleteCholi} />;
    }

    return <ChaniyaCholiList cholis={cholis} bookings={bookings} onSelectCholi={handleSelectCholi} onUnbookDate={handleUnbookDate} />;
  };

  return (
    <div className="min-h-screen bg-pink-50 font-sans">
      <Header currentPage={page} onNavigate={handleNavigate} />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;