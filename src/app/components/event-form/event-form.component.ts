import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  eventForm!: FormGroup;
  isEditMode = false;
  eventId?: number;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.checkRouteParams();
  }

  createForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  checkRouteParams(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = +id;
      this.loadEventData(this.eventId);
    }
  }

  loadEventData(id: number): void {
    this.eventService.getEvent(id).subscribe(event => {
      if (event) {
        this.eventForm.patchValue({
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.description
        });
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;

      if (this.isEditMode && this.eventId) {
        const updatedEvent: Event = {
          id: this.eventId,
          ...eventData
        };
        this.eventService.updateEvent(updatedEvent);
      } else {
        this.eventService.addEvent(eventData);
      }

      this.router.navigate(['/events']);
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

}
