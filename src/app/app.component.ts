<<<<<<< HEAD
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'akira-tech';
}
=======
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector:    'app-root',
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'akira-tech';

  isAdminRoute = false;
  isLoginRoute = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkRoute(this.router.url);

    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => this.checkRoute(e.urlAfterRedirects));
  }

  private checkRoute(url: string) {
    this.isLoginRoute = url.startsWith('/login');
    this.isAdminRoute = url.startsWith('/admin')
      || this.isLoginRoute
      || url.startsWith('/dashboard')
      || url.startsWith('/registrations');
  }
}
>>>>>>> 099fdc74fd5256915004f084e838813b64f02078
