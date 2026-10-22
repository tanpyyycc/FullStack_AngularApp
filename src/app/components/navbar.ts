import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
 
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" aria-label="Main navigation">
      <a
        routerLink="/home"
        routerLinkActive="active"
        ariaCurrentWhenActive="page"
        >Home</a
      >
      <a
        routerLink="/leaders"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }"
        ariaCurrentWhenActive="page"
        >Leaders</a
      >
      <a
        routerLink="/leaders/new"
        routerLinkActive="active"
        ariaCurrentWhenActive="page"
        >Add Leader</a
      >
    </nav>
  `,
  styles: `
    .navbar {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #111827;
    }
    a {
      color: #f9fafb;
      text-decoration: none;
      padding: 0.4rem 0.9rem;
      border-radius: 6px;
    }
    a:hover {
      background: #374151;
    }
    a.active {
      background: #ffffff;
      color: #111827;
      font-weight: 600;
    }
  `,
})
export class Navbar {}