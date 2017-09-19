import {Component, HostBinding} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FlakeyHttpConfigService} from '../../services/flakey-http-config.service';

@Component({
  selector: 'app-flakey-http-config',
  templateUrl: './flakey-http-config.component.html',
  styles: [`
    .dropdown-menu{
      min-width: 12rem;
      right:0;
      left:inherit;
    }
  `]
})
export class FlakeyHttpConfigComponent {

  isOpen = false
  delayRequestMs$
  delayResponseMs$

  configForm: FormGroup

  @HostBinding('class')
  hostClass = 'dropdown'

  constructor(fb: FormBuilder, private fHC: FlakeyHttpConfigService) {

    this.configForm = fb.group({
      requestDelayMs: 0,
      responseDelayMs: 0
    })

    this.delayRequestMs$ = fHC.delayRequestMs$
    this.delayResponseMs$ = fHC.delayResponseMs$

    this.configForm
      .valueChanges
      .subscribe(
        (settings: {requestDelayMs: number, responseDelayMs: number}) => {
          this.fHC.setDelayRequestMs$(settings.requestDelayMs)
          this.fHC.setDelayResponseMs$(settings.responseDelayMs)
        }
      )

  }

  toggleOpen() {
    this.isOpen = !this.isOpen
  }

}
