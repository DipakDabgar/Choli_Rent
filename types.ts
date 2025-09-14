export interface ChaniyaCholi {
  id: string; // Changed from number to string for unique name-based IDs
  name: string;
  pricePerDay: number;
  imageUrl: string; // Can be a URL or a Base64 data URL
}

export interface Booking {
  id: number;
  choliId: string; // Changed from number to string to match ChaniyaCholi ID
  customerName: string;
  customerContact: string;
  startDate: string; // Storing as ISO string 'YYYY-MM-DD' for easier handling
  endDate: string;
}

export type Page = 'list' | 'detail' | 'admin';