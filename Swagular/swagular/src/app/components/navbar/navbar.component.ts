import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import { fromEvent, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { BrowserDetectionService } from 'src/app/services/browser-detection.service';
import { AuthService } from 'src/app/services/auth.service';

declare var $: any;

@Component({
  selector: 'swag-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private scrollSubscription: Subscription;
  private scrollPos: number;
  public shouldBeOpaque: boolean;

  constructor(@Inject(WINDOW) public window: Window, private bDetecter: BrowserDetectionService, public auth: AuthService) { }

  ngOnInit() {
    this.scrollSubscription = fromEvent(
      this.window,
      'scroll',
      { passive: true }
    )
      .pipe(startWith(null))
      .subscribe(() => {
        this.saveScrollPos();
        this.checkIfShouldBeOpaque();
      });

  }

  private saveScrollPos(): void {
    this.scrollPos = this.bDetecter.internetExplorer
      ? document.documentElement.scrollTop
      : this.window.scrollY;
  }

  private checkIfShouldBeOpaque(): any {
    this.shouldBeOpaque = this.scrollPos > 120 ? true : false;
  }

  public HideAfterClick() {
    $('.navbar-collapse').collapse('hide');
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

}
