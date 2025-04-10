import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarEventTitleFormatter } from 'angular-calendar';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event as EventModel } from '../../models/event';
import { Subject } from 'rxjs';

class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  override monthTooltip(event: CalendarEvent): string {
    return event.title;
  }

  override weekTooltip(event: CalendarEvent): string {
    return event.title;
  }

  override dayTooltip(event: CalendarEvent): string {
    return event.title;
  }

  monthView(event: CalendarEvent): string {
    return event.title;
  }

  weekView(event: CalendarEvent): string {
    return event.title;
  }

  dayView(event: CalendarEvent): string {
    return event.title;
  }
}

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})
export class CalendarViewComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  activeDayIsOpen: boolean = false;

  constructor(
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = this.mapToCalendarEvents(events);
      this.refresh.next();
    });
  }

  mapToCalendarEvents(events: EventModel[]): CalendarEvent[] {
    return events.map(event => ({
      start: new Date(event.date),
      title: event.title,
      color: {
        primary: '#1976d2',
        secondary: '#d1e8ff'
      },
      meta: {
        id: event.id,
        location: event.location,
        description: event.description
      },
      allDay: true
    }));
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.router.navigate(['/events', event.meta.id]);
  }

  setView(view: CalendarView): void {
    this.view = view;
    this.activeDayIsOpen = false;
  }

  dayClicked({ day, sourceEvent }: { day: any; sourceEvent: MouseEvent | KeyboardEvent }): void {
    const date = day.date;
    const events = day.events;

    if (events.length === 0) {
      this.activeDayIsOpen = false;
      return;
    }

    const isSameDay = date.getDate() === this.viewDate.getDate() &&
      date.getMonth() === this.viewDate.getMonth() &&
      date.getFullYear() === this.viewDate.getFullYear();

    if (isSameDay) {
      this.activeDayIsOpen = !this.activeDayIsOpen;
    } else {
      this.activeDayIsOpen = true;
    }

    this.viewDate = date;
  }

  get currentViewTitle(): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[this.viewDate.getMonth()]} ${this.viewDate.getFullYear()}`;
  }

}
