import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {

  event?: Event;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getEvent();
  }

  getEvent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(id).subscribe(event => {
      this.event = event;
    });
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  editEvent(): void {
    if (this.event) {
      this.router.navigate(['/edit', this.event.id]);
    }
  }

  deleteEvent(): void {
    if (this.event) {
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
        if (result && this.event) {
          this.eventService.deleteEvent(this.event.id);
          this.router.navigate(['/events']);
        }
      });
    }
  }

}
