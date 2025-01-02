export interface Database {
  public: {
    Tables: {
      saved_tours: {
        Row: {
          id: string;
          tour_code: string;
          tour_data: any;
          extras_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tour_code: string;
          tour_data: any;
          extras_data?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tour_code?: string;
          tour_data?: any;
          extras_data?: any;
          updated_at?: string;
        };
      };
      tour_bookings: {
        Row: {
          id: string;
          tour_code: string;
          booking_data: any;
          customer_data: any;
          created_at: string;
          status: 'pending' | 'confirmed' | 'cancelled';
        };
        Insert: {
          id?: string;
          tour_code: string;
          booking_data: any;
          customer_data: any;
          created_at?: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
        };
        Update: {
          id?: string;
          tour_code?: string;
          booking_data?: any;
          customer_data?: any;
          status?: 'pending' | 'confirmed' | 'cancelled';
        };
      };
    };
  };
}