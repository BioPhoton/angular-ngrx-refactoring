import {DatePipe, Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Flight} from '../../../../core/api/models/flight';
import {FlightResource} from '../../../../core/api/resources/flight.resource';
import {FlightService} from '../../services/flight.service';

@Component({
  selector: 'flight-edit',
  templateUrl: './edit.component.html',
  providers: [DatePipe]
})
export class EditComponent implements OnInit {

  flightForm: FormGroup;
  errorMessage: string;
  successMessage: string;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private fs: FlightService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.flightForm = this.fb.group({
      id: [''],
      from: [''],
      to: [''],
      date: ['']
    })
  }

  ngOnInit() {
    this.route.data.pluck('flight')
      .subscribe((f: Flight) => {
        this.flightForm.patchValue(f, {emitEvent: false})
      })
  }

  goBack() {
    this.location.back()
  }

  setDateToNow() {
    this.flightForm.get('date').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ss'))
  }

  edit(form) {
    if (form.valid) {
      this.fs.edit(form.value)
        .subscribe(
          (n) => {
            this.successMessage = 'Flight edited'
            setTimeout(() => this.router.navigate(['/flight/search']), 3000)
          },
          (e) => {
            this.errorMessage = e.message
          }
        )
    }
  }

}
