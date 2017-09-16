import {Location} from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {FlightResource} from '../../../../core/api/resources/flight.resource';

@Component({
  selector: 'flight-create',
  templateUrl: './create.component.html'
})
export class CreateComponent {

  flightForm: FormGroup;
  message: string;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private fs: FlightResource,
    private router: Router
  ) {
    this.flightForm = this.fb.group({
      from: [''],
      to: [''],
      date: ['']
    })
  }

  goBack() {
    this.location.back()
  }

  create(form) {

    if (form.valid) {
      this.fs.post(form.value)
        .subscribe(
          (response) => {
            this.router.navigate(['flight', response.id]);
          },
          (e) => {
            this.message = e.message
          }
        )
    } else {
      Object.keys(form.controls)
        .forEach((key) => { form.controls[key].markAsTouched() })
    }
  }

}
