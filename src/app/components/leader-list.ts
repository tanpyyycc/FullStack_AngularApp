import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GymLeaderService } from '../gym-leader';
import { Region } from '../gym-leader.model';
import { LeaderCard } from '../leader-card/leader-card';

type RegionFilter = 'All' | Region;

@Component({
  selector: 'app-leader-list',
  imports: [LeaderCard],
  template: `
    <section class="page">
      <h1>Gym Leaders</h1>

      <div class="filters" role="group" aria-label="Filter by region">
        @for (region of regions; track region) {
          <button
            type="button"
            class="btn"
            [class.btn-primary]="selectedRegion() === region"
            [attr.aria-pressed]="selectedRegion() === region"
            (click)="selectedRegion.set(region)"
          >
            {{ region }}
          </button>
        }
      </div>

      @if (errorMessage()) {
        <p class="error" role="alert">{{ errorMessage() }}</p>
      }

      <div class="grid">
        @for (leader of filteredLeaders(); track leader._id) {
          <app-leader-card
            [leader]="leader"
            (edit)="editLeader($event)"
            (remove)="removeLeader($event)"
          />
        } @empty {
          <p>No Gym Leaders registered yet.</p>
        }
      </div>
    </section>
  `,
  styles: `
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1rem;
    }
  `,
})
export class LeaderList implements OnInit {
  private readonly leaderService = inject(GymLeaderService);
  private readonly router = inject(Router);

  protected readonly regions: RegionFilter[] = ['All', 'Kanto', 'Johto', 'Hoenn'];
  protected readonly selectedRegion = signal<RegionFilter>('All');
  protected readonly errorMessage = signal('');

  protected readonly filteredLeaders = computed(() => {
    const region = this.selectedRegion();
    const all = this.leaderService.leaders();
    return region === 'All' ? all : all.filter((l) => l.region === region);
  });

  ngOnInit(): void {
    this.leaderService.fetchLeaders();
  }

  protected editLeader(id: string): void {
    this.router.navigate(['/leaders', id, 'edit']);
  }

  protected removeLeader(id: string): void {
    const leader = this.leaderService.leaders().find((l) => l._id === id);
    if (!leader || !confirm(`Remove ${leader.name} from the registry?`)) {
      return;
    }

    this.errorMessage.set('');
    // The service updates the leaders signal after a successful delete,
    // so the list refreshes without a page reload.
    this.leaderService.deleteLeader(id).subscribe({
      error: () => this.errorMessage.set(`Could not remove ${leader.name}. Please try again.`),
    });
  }
}