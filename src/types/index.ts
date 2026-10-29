// Database & domain types for the event ticketing platform

export type UserRole = 'user' | 'organizer' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: string;
  category?: Category;
  organizer_id: string;
  organizer?: User;
  poster_url: string;
  gallery?: string[];
  venue_name: string;
  venue_address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  is_featured: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quota: number;
  sold: number;
  max_per_order: number;
  sale_start: string;
  sale_end: string;
  status: 'available' | 'sold_out' | 'closed';
}

export interface Order {
  id: string;
  order_code: string;
  user_id: string;
  user?: User;
  event_id: string;
  event?: Event;
  total_amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded' | 'expired';
  payment_method?: string;
  payment_id?: string;
  paid_at?: string;
  expires_at: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  ticket_type_id: string;
  ticket_type?: TicketType;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Ticket {
  id: string;
  order_id: string;
  order_item_id: string;
  ticket_type_id: string;
  ticket_type?: TicketType;
  event_id: string;
  event?: Event;
  user_id: string;
  attendee_name: string;
  attendee_email: string;
  ticket_code: string;
  qr_data: string;
  status: 'valid' | 'used' | 'cancelled' | 'expired';
  checked_in_at?: string;
  created_at: string;
}

export interface EventWithDetails extends Event {
  category: Category;
  organizer: User;
  ticket_types: TicketType[];
  total_tickets: number;
  tickets_sold: number;
}

export interface OrderWithDetails extends Order {
  event: Event;
  user: User;
  items: (OrderItem & { ticket_type: TicketType })[];
  tickets: Ticket[];
}

// Form types
export interface BookingFormData {
  items: { ticket_type_id: string; quantity: number }[];
  attendees: { name: string; email: string }[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

export interface EventFormData {
  title: string;
  description: string;
  short_description: string;
  category_id: string;
  poster_url: string;
  venue_name: string;
  venue_address: string;
  city: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  tags: string[];
  ticket_types: Omit<TicketType, 'id' | 'event_id' | 'sold' | 'status'>[];
}

// Filter types
export interface EventFilters {
  category?: string;
  city?: string;
  date_from?: string;
  date_to?: string;
  price_min?: number;
  price_max?: number;
  search?: string;
  sort?: 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc' | 'popular';
}

// Dashboard stats
export interface OrganizerStats {
  total_events: number;
  active_events: number;
  total_tickets_sold: number;
  total_revenue: number;
  recent_orders: OrderWithDetails[];
}

export interface AdminStats {
  total_users: number;
  total_events: number;
  total_orders: number;
  total_revenue: number;
  users_by_role: { role: UserRole; count: number }[];
  events_by_status: { status: string; count: number }[];
}

