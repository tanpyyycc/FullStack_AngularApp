import { Component, inject, OnInit } from '@angular/core';
import { GymLeaderService } from '../gym-leader';

@Component({
    selector: 'app-home',
    template: `
    <section class="page">
      <h1>Welcome to the Gym Leader Registry</h1>
      <p>Browse, add, and manage the Gym Leaders of Kanto, Johto, and Hoenn.</p>
 
      <h2>Leaders per region</h2>
      <ul class="counts">
        <li><strong>Kanto:</strong> {{ leaderService.kantoCount() }}</li>
        <li><strong>Johto:</strong> {{ leaderService.johtoCount() }}</li>
        <li><strong>Hoenn:</strong> {{ leaderService.hoennCount() }}</li>
      </ul>
    </section>
  `,
  styles: '
    .counts {
        list-styles: none;
        padding: 0;
        display: grid;
        gap: 0.5rem;
    }
  '
})
export class Home implements OnInit {
    protected readonly leaderService = inject(GymLeaderService);

    ngOnInit(): void {
        this.leaderService.fetchLeaders();
    }
}