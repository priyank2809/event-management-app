import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [];
  private eventsSubject = new BehaviorSubject<Event[]>(this.events);

  constructor() {
    this.events = [
      {
        id: 1,
        title: 'Test Event',
        date: new Date(2025, 4, 15),
        location: 'Surat',
        description: 'Annual students conference'
      },
      {
        id: 2,
        title: 'Event test',
        date: new Date(2025, 5, 10),
        location: 'Mumbai',
        description: 'Team meeting monitring'
      },
      {
        id: 3,
        title: 'Team building',
        date: new Date(2025, 3, 28),
        location: 'Ahmedabad',
        description: 'Company team building event'
      },
    ];
    this.eventsSubject.next(this.events);
  }

  getEvents(): Observable<Event[]> {
    return this.eventsSubject.asObservable();
  }

  getEvent(id: number): Observable<Event | undefined> {
    const event = this.events.find(e => e.id === id);
    return of(event);
  }

  addEvent(event: Omit<Event, 'id'>): void {
    const newEvent = {
      ...event,
      id: this.getNextId()
    };

    this.events = [...this.events, newEvent];
    this.eventsSubject.next(this.events);
  }

  updateEvent(updatedEvent: Event): void {
    this.events = this.events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    this.eventsSubject.next(this.events);
  }

  deleteEvent(id: number): void {
    this.events = this.events.filter(event => event.id !== id);
    this.eventsSubject.next(this.events);
  }

  searchEvents(term: string): Event[] {
    term = term.toLowerCase();
    return this.events.filter(event =>
      event.title.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term)
    );
  }

  private getNextId(): number {
    return Math.max(...this.events.map(event => event.id)) + 1;
  }
}