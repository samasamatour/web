export interface Database {
  public: {
    Tables: {
      destinations: {
        Row: {
          id: string
          title: string
          location: string
          price: string
          image: string
          description: string
          coordinates: { lat: number; lng: number } | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          location: string
          price: string
          image: string
          description: string
          coordinates?: { lat: number; lng: number } | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          location?: string
          price?: string
          image?: string
          description?: string
          coordinates?: { lat: number; lng: number } | null
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          location: string
          text: string
          avatar: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          text: string
          avatar: string
          rating?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          text?: string
          avatar?: string
          rating?: number
          created_at?: string
        }
      }
    }
  }
}

export type Destination = Database['public']['Tables']['destinations']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']