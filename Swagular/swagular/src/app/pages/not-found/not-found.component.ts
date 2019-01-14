import { Component, OnInit, PLATFORM_ID, Inject, APP_ID, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

@Component({
  selector: 'swag-not-found',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  path: string;

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    @Optional() @Inject(RESPONSE) private response: Response,
    private titleService: Title
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.response.status(404);
    }

    this.route.data.pipe(take(1))
      .subscribe((data: { path: string }) => {
        this.path = data.path;
      });
  }
}
