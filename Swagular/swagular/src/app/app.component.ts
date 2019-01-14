import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'swag-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'swagular';

  constructor(public auth: AuthService) {
    this.auth.handleAuthentication();
  }

  ngOnInit() {

    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.scheduleRenewal();
    }
  }

}
