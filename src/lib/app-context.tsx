'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Event, Category, User, Ticket, TicketType, Order, UserRole, OrderItem } from '@/types';
import {
  MOCK_EVENTS as INITIAL_EVENTS,
  CATEGORIES as INITIAL_CATEGORIES,
  MOCK_USERS as INITIAL_USERS,
  MOCK_TICKETS as INITIAL_TICKETS,
  MOCK_TICKET_TYPES as INITIAL_TICKET_TYPES,
  MOCK_ORDERS as INITIAL_ORDERS,
} from '@/lib/mock-data';
import { generateOrderCode, generateTicketCode, generateQRData } from '@/lib/utils';

interface AppContextType {
  events: Event[];
  categories: Category[];
  users: User[];
  tickets: Ticket[];
  ticketTypes: TicketType[];
  orders: Order[];
  
  // Event actions (Admin & Organizer)
  createEvent: (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'> & {
    ticket_types: { name: string; price: number; quota: number; description?: string; max_per_order: number }[];
  }) => Event;
  updateEventStatus: (eventId: string, status: Event['status']) => void;
  toggleEventFeatured: (eventId: string) => void;
  deleteEvent: (eventId: string) => void;
  
  // Category actions (Admin)
  addCategory: (category: Omit<Category, 'id'>) => Category;
  deleteCategory: (categoryId: string) => void;
  
  // User actions (Admin)
  updateUserRole: (userId: string, newRole: UserRole) => void;
  
  // Booking & Ticket actions (User & Organizer)
  bookTickets: (booking: {
    userId: string;
    eventId: string;
    items: { ticket_type_id: string; quantity: number }[];
    attendees: { name: string; email: string }[];
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    paymentMethod: string;
  }) => { order: Order; tickets: Ticket[] };
  checkInTicket: (ticketCode: string) => { success: boolean; message: string; ticket?: Ticket };
  
  // Helpers
  getEventById: (id: string) => Event | undefined;
  getTicketTypesForEvent: (eventId: string) => TicketType[];
  getCategoryById: (id: string) => Category | undefined;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'eventku_app_state_v2';

export function AppProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(INITIAL_TICKET_TYPES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(`${STORAGE_KEY_PREFIX}_events`);
      const storedCategories = localStorage.getItem(`${STORAGE_KEY_PREFIX}_categories`);
      const storedUsers = localStorage.getItem(`${STORAGE_KEY_PREFIX}_users`);
      const storedTickets = localStorage.getItem(`${STORAGE_KEY_PREFIX}_tickets`);
      const storedTicketTypes = localStorage.getItem(`${STORAGE_KEY_PREFIX}_ticket_types`);
      const storedOrders = localStorage.getItem(`${STORAGE_KEY_PREFIX}_orders`);

      if (storedEvents) setEvents(JSON.parse(storedEvents));
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedTickets) setTickets(JSON.parse(storedTickets));
      if (storedTicketTypes) setTicketTypes(JSON.parse(storedTicketTypes));
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_events`, JSON.stringify(events));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_categories`, JSON.stringify(categories));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_tickets`, JSON.stringify(tickets));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_ticket_types`, JSON.stringify(ticketTypes));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_orders`, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [events, categories, users, tickets, ticketTypes, orders, isLoaded]);

  // 1. Create Event
  const createEvent = useCallback<AppContextType['createEvent']>((eventData) => {
    const newId = `evt-${Date.now()}`;
    const now = new Date().toISOString();

    const createdEvent: Event = {
      ...eventData,
      id: newId,
      created_at: now,
      updated_at: now,
    };

    const newTicketTypes: TicketType[] = eventData.ticket_types.map((tt, idx) => ({
      id: `tt-${Date.now()}-${idx}`,
      event_id: newId,
      name: tt.name,
      description: tt.description,
      price: tt.price,
      currency: 'IDR',
      quota: tt.quota,
      sold: 0,
      max_per_order: tt.max_per_order,
      sale_start: now,
      sale_end: new Date(new Date(eventData.end_date).getTime() + 86400000).toISOString(),
      status: 'available',
    }));

    setEvents((prev) => [createdEvent, ...prev]);
    setTicketTypes((prev) => [...prev, ...newTicketTypes]);

    return createdEvent;
  }, []);

  // 2. Update Event Status (Admin / Organizer)
  const updateEventStatus = useCallback((eventId: string, status: Event['status']) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status, updated_at: new Date().toISOString() } : e))
    );
  }, []);

  // 3. Toggle Event Featured (Admin)
  const toggleEventFeatured = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, is_featured: !e.is_featured, updated_at: new Date().toISOString() } : e))
    );
  }, []);

  // 4. Delete Event
  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setTicketTypes((prev) => prev.filter((tt) => tt.event_id !== eventId));
  }, []);

  // 5. Add Category (Admin)
  const addCategory = useCallback<AppContextType['addCategory']>((categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }, []);

  // 6. Delete Category
  const deleteCategory = useCallback((categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  }, []);

  // 7. Update User Role (Admin)
  const updateUserRole = useCallback((userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }, []);

  // 8. Book Tickets (User)
  const bookTickets = useCallback<AppContextType['bookTickets']>((booking) => {
    const orderCode = generateOrderCode();
    const orderId = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    booking.items.forEach((item) => {
      const tt = ticketTypes.find((t) => t.id === item.ticket_type_id);
      if (tt) {
        const subtotal = tt.price * item.quantity;
        totalAmount += subtotal;
        orderItems.push({
          id: `oi-${Date.now()}-${item.ticket_type_id}`,
          order_id: orderId,
          ticket_type_id: item.ticket_type_id,
          quantity: item.quantity,
          unit_price: tt.price,
          subtotal,
        });
      }
    });

    const newOrder: Order = {
      id: orderId,
      order_code: orderCode,
      user_id: booking.userId,
      event_id: booking.eventId,
      total_amount: totalAmount,
      currency: 'IDR',
      status: 'paid',
      payment_method: booking.paymentMethod || 'bank_transfer',
      paid_at: now,
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      created_at: now,
    };

    // Create tickets for each attendee
    const createdTickets: Ticket[] = [];
    let attendeeIdx = 0;

    booking.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const attendee = booking.attendees[attendeeIdx] || {
          name: booking.contactName,
          email: booking.contactEmail,
        };
        const ticketCode = generateTicketCode();
        const qrData = generateQRData(ticketCode, booking.eventId);

        createdTickets.push({
          id: `tix-${Date.now()}-${attendeeIdx}`,
          order_id: orderId,
          order_item_id: `oi-${Date.now()}-${item.ticket_type_id}`,
          ticket_type_id: item.ticket_type_id,
          event_id: booking.eventId,
          user_id: booking.userId,
          attendee_name: attendee.name,
          attendee_email: attendee.email,
          ticket_code: ticketCode,
          qr_data: qrData,
          status: 'valid',
          created_at: now,
        });

        attendeeIdx++;
      }
    });

    // Update ticket types sold count
    setTicketTypes((prev) =>
      prev.map((tt) => {
        const boughtItem = booking.items.find((item) => item.ticket_type_id === tt.id);
        if (boughtItem) {
          const newSold = tt.sold + boughtItem.quantity;
          return {
            ...tt,
            sold: newSold,
            status: newSold >= tt.quota ? 'sold_out' : tt.status,
          };
        }
        return tt;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setTickets((prev) => [...createdTickets, ...prev]);

    return { order: newOrder, tickets: createdTickets };
  }, [ticketTypes]);

  // 9. Gate Check-in Ticket (Organizer / Gate Staff)
  const checkInTicket = useCallback<AppContextType['checkInTicket']>((rawInput) => {
    let targetCode = rawInput.trim();

    // Check if input is base64 encoded QR payload
    try {
      if (targetCode.length > 20 && !targetCode.startsWith('TIX-')) {
        const decoded = JSON.parse(atob(targetCode));
        if (decoded && decoded.code) {
          targetCode = decoded.code;
        }
      }
    } catch {
      // not base64 JSON
    }

    const found = tickets.find((t) => t.ticket_code === targetCode || t.id === targetCode);

    if (!found) {
      return { success: false, message: `Tiket dengan kode "${targetCode}" tidak terdaftar dalam sistem.` };
    }

    if (found.status === 'used') {
      return {
        success: false,
        message: `Tiket SUDAH DIGUNAKAN pada ${found.checked_in_at || 'sebelumnya'}. Ditolak di pintu gerbang.`,
        ticket: found,
      };
    }

    if (found.status !== 'valid') {
      return {
        success: false,
        message: `Status tiket: ${found.status.toUpperCase()}. Tidak memenuhi syarat masuk.`,
        ticket: found,
      };
    }

    const checkInTime = new Date().toLocaleString('id-ID');
    const updatedTicket: Ticket = {
      ...found,
      status: 'used',
      checked_in_at: checkInTime,
    };

    setTickets((prev) => prev.map((t) => (t.id === found.id ? updatedTicket : t)));

    return {
      success: true,
      message: `Tiket VALID. Check-in berhasil pada ${checkInTime}. Gelang akses dapat diberikan.`,
      ticket: updatedTicket,
    };
  }, [tickets]);

  // Helpers
  const getEventById = useCallback((id: string) => events.find((e) => e.id === id || e.slug === id), [events]);
  const getTicketTypesForEvent = useCallback((eventId: string) => ticketTypes.filter((tt) => tt.event_id === eventId), [ticketTypes]);
  const getCategoryById = useCallback((id: string) => categories.find((c) => c.id === id || c.slug === id), [categories]);

  // Reset to default mock data
  const resetToDefaultData = useCallback(() => {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}_events`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}_categories`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}_users`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}_tickets`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}_ticket_types`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}_orders`);
    } catch (e) {
      // ignore
    }
    setEvents(INITIAL_EVENTS);
    setCategories(INITIAL_CATEGORIES);
    setUsers(INITIAL_USERS);
    setTickets(INITIAL_TICKETS);
    setTicketTypes(INITIAL_TICKET_TYPES);
    setOrders(INITIAL_ORDERS);
  }, []);

  return (
    <AppContext.Provider
      value={{
        events,
        categories,
        users,
        tickets,
        ticketTypes,
        orders,
        createEvent,
        updateEventStatus,
        toggleEventFeatured,
        deleteEvent,
        addCategory,
        deleteCategory,
        updateUserRole,
        bookTickets,
        checkInTicket,
        getEventById,
        getTicketTypesForEvent,
        getCategoryById,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

