'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, UserPlus, UserCheck } from 'lucide-react';
import { getEvents, registerEvent, unregisterEvent, isUserRegisteredForEvent } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { Event } from '@/lib/types';

const MOCK_EVENTS: Event[] = [
  {
    event_id: 1,
    event_name: 'Bangkok Book Fair 2026',
    event_type: 'book_fair',
    description: 'Join thousands of readers and authors in the biggest book fair.',
    event_start_date: '2026-05-15',
    event_end_date: '2026-05-20',
    location_name: 'Impact Arena',
    location_address: 'Bangna Trad KM.1, Bangkok',
    latitude: 13.6624,
    longitude: 100.6064,
    organizer_name: 'BookHub Events',
    organizer_contact: '+66 1234 5678',
    organizer_email: 'events@bookhub.com',
    event_url: 'https://www.example.com/events/bangkok-book-fair-2026',
    image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1050&q=80',
    capacity: 5000,
    registration_count: 1200,
    travel_instructions: 'Take BTS to Bang Na station then shuttle bus available.',
    parking_info: 'Limited parking, use public transport recommended.',
    accessibility_info: 'Wheelchair accessible venue.',
    is_active: true,
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-02-01T08:00:00Z',
  },
  {
    event_id: 2,
    event_name: 'Author Reading: James Clear',
    event_type: 'author_reading',
    description: 'A live reading and Q&A with James Clear about Atomic Habits.',
    event_start_date: '2026-06-10',
    event_end_date: '2026-06-10',
    location_name: 'Amazon Bookstore',
    location_address: 'CentralWorld, Bangkok',
    latitude: 13.7462,
    longitude: 100.5398,
    organizer_name: 'BookHub Studio',
    organizer_contact: '+66 2345 6789',
    organizer_email: 'studio@bookhub.com',
    event_url: 'https://www.example.com/events/james-clear-reading',
    image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1050&q=80',
    capacity: 250,
    registration_count: 190,
    travel_instructions: 'Near BTS Chit Lom, 10-min walk from exit 6.',
    parking_info: 'Paid parking is available at CentralWorld.',
    accessibility_info: 'Ramp access available.',
    is_active: true,
    created_at: '2026-02-20T08:00:00Z',
    updated_at: '2026-02-20T08:00:00Z',
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationStatuses, setRegistrationStatuses] = useState<Record<number, boolean>>({});
  const [registeringEvents, setRegisteringEvents] = useState<Set<number>>(new Set());
  const { profile } = useAuth();

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getEvents({ startDate: new Date().toISOString().split('T')[0] });
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data as Event[]);
        } else {
          setEvents(MOCK_EVENTS);
        }
      } catch (fetchError) {
        console.error('Error fetching events:', fetchError);
        setError('Unable to load live events right now. Showing sample events.');
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadRegistrationStatuses = async () => {
      if (!profile || events.length === 0) return;

      const statuses: Record<number, boolean> = {};
      for (const event of events) {
        try {
          const isRegistered = await isUserRegisteredForEvent(profile.user_id, event.event_id);
          statuses[event.event_id] = isRegistered;
        } catch (error) {
          console.error(`Error checking registration for event ${event.event_id}:`, error);
          statuses[event.event_id] = false;
        }
      }
      setRegistrationStatuses(statuses);
    };

    loadRegistrationStatuses();
  }, [profile, events]);

  const handleRegistration = async (eventId: number) => {
    if (!profile) {
      // Redirect to login or show message
      alert('Please sign in to register for events.');
      return;
    }

    const isRegistered = registrationStatuses[eventId];
    setRegisteringEvents(prev => new Set(prev).add(eventId));

    try {
      if (isRegistered) {
        await unregisterEvent(profile.user_id, eventId);
        setRegistrationStatuses(prev => ({ ...prev, [eventId]: false }));
        // Update event registration count
        setEvents(prev => prev.map(event =>
          event.event_id === eventId
            ? { ...event, registration_count: (event.registration_count || 0) - 1 }
            : event
        ));
      } else {
        await registerEvent(profile.user_id, eventId);
        setRegistrationStatuses(prev => ({ ...prev, [eventId]: true }));
        // Update event registration count
        setEvents(prev => prev.map(event =>
          event.event_id === eventId
            ? { ...event, registration_count: (event.registration_count || 0) + 1 }
            : event
        ));
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      alert('Failed to update registration. Please try again.');
    } finally {
      setRegisteringEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900">Events</h1>
          <p className="text-neutral-600 mt-2">Discover upcoming book events, author sessions, and meetups.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 text-error-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <div key={event.event_id} className="card overflow-hidden">
              <div className="h-52 bg-neutral-200 overflow-hidden">
                <img
                  src={event.image_url || '/placeholder-event.jpg'}
                  alt={event.event_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-secondary-500 font-semibold uppercase tracking-wide">{event.event_type.replace('_', ' ')}</p>
                <h2 className="mt-2 text-xl font-bold text-neutral-900">{event.event_name}</h2>
                <p className="text-neutral-600 mt-3 line-clamp-3">{event.description}</p>

                <div className="mt-4 space-y-2 text-sm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.event_start_date).toLocaleDateString()} - {new Date(event.event_end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location_name}, {event.location_address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.registration_count} registered</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Link href={event.event_url || '#'} className="btn btn-outline text-sm px-4 py-2">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRegistration(event.event_id)}
                      disabled={registeringEvents.has(event.event_id)}
                      className={`btn text-sm px-4 py-2 flex items-center gap-2 ${
                        registrationStatuses[event.event_id]
                          ? 'btn-secondary'
                          : 'btn-primary'
                      }`}
                    >
                      {registeringEvents.has(event.event_id) ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : registrationStatuses[event.event_id] ? (
                        <UserCheck className="w-4 h-4" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      {registrationStatuses[event.event_id] ? 'Registered' : 'Register'}
                    </button>
                  </div>
                  <span className="text-xs text-neutral-400">Capacity: {event.capacity || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
