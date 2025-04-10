import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  filterForm!: FormGroup;
  showFilters = false;

  pageSize = 5;
  currentPage = 0;
  totalEvents = 0;
  pageSizeOptions = [5, 10, 25];

  constructor(
    private eventService: EventService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      this.applyFilter();
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilter(): void {
    let filtered = [...this.events];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }

    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;

    if (startDate) {
      filtered = filtered.filter(event => new Date(event.date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(event => new Date(event.date) <= new Date(endDate));
    }

    this.filteredEvents = filtered;
    this.totalEvents = this.filteredEvents.length;
    this.currentPage = 0;
  }

  search(): void {
    this.applyFilter();
    this.currentPage = 0;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterForm.reset();
    this.applyFilter();
  }

  deleteEvent(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      disableClose: false,
      hasBackdrop: true,
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this event?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.deleteEvent(id);
      }
    });
  }

  get paginatedEvents(): Event[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredEvents.slice(startIndex, startIndex + this.pageSize);
  }

}
