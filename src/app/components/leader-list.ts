import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GymLeaderService } from '../services/gym-leader';
import { Region } from '../models/gym-leader.model';
import { LeaderCard } from './leader-card';

type RegionFilter = 'All' | Region;

@Component({
  selector: 'app-leader-list',
  imports: [LeaderCard, RouterLink],

  template: `
    <main class="leaders-page">

      <!-- Page Header -->
      <section class="leaders-banner">
        <div class="banner-content">
          <span class="eyebrow">POKÉMON TRAINER DATABASE</span>

          <h1>Gym Leaders</h1>

          <p>
            Meet the strongest trainers across Kanto, Johto, and Hoenn.
            Manage your registry and keep track of every Gym Leader.
          </p>

          <div class="banner-stats">
            <div class="banner-stat">
              <span class="banner-stat-number">
                {{ leaderService.leaders().length }}
              </span>
              <span class="banner-stat-label">Registered Leaders</span>
            </div>

            <div class="banner-divider"></div>

            <div class="banner-stat">
              <span class="banner-stat-number">{{ regions.length - 1 }}</span>
              <span class="banner-stat-label">Regions</span>
            </div>
          </div>
        </div>

        <div class="banner-decoration" aria-hidden="true">
          <div class="pokeball">
            <div class="pokeball-center"></div>
          </div>
        </div>
      </section>

      <!-- Leader Registry -->
      <section class="registry-section">

        <div class="section-heading">
          <div>
            <span class="eyebrow">YOUR COLLECTION</span>
            <h2>Trainer Registry</h2>
            <p>Browse and manage your registered Gym Leaders.</p>
          </div>

          <a routerLink="/leaders/new" class="add-button">
            <span class="add-icon">+</span>
            Add Gym Leader
          </a>
        </div>

        <!-- Region Filters -->
        <div class="filter-panel">
          <div class="filter-heading">
            <h3>Filter by Region</h3>
            <span class="result-count">
              {{ filteredLeaders().length }}
              {{ filteredLeaders().length === 1 ? 'leader' : 'leaders' }}
            </span>
          </div>

          <div class="filters" role="group" aria-label="Filter by region">
            @for (region of regions; track region) {
              <button
                type="button"
                class="filter-button"
                [class.filter-active]="selectedRegion() === region"
                [class.filter-kanto]="selectedRegion() === region && region === 'Kanto'"
                [class.filter-johto]="selectedRegion() === region && region === 'Johto'"
                [class.filter-hoenn]="selectedRegion() === region && region === 'Hoenn'"
                [attr.aria-pressed]="selectedRegion() === region"
                (click)="selectedRegion.set(region)"
              >
                @if (region === 'All') {
                  <span class="filter-icon">🌐</span>
                } @else if (region === 'Kanto') {
                  <span class="filter-icon">🔥</span>
                } @else if (region === 'Johto') {
                  <span class="filter-icon">⚡</span>
                } @else {
                  <span class="filter-icon">🌿</span>
                }

                {{ region }}
              </button>
            }
          </div>
        </div>

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="error-message" role="alert">
            <span>⚠️</span>
            {{ errorMessage() }}
          </div>
        }

        <!-- Gym Leader Cards -->
        <div class="grid">
          @for (leader of filteredLeaders(); track leader._id) {
            <app-leader-card
              [leader]="leader"
              (edit)="editLeader($event)"
              (remove)="removeLeader($event)"
            />
          } @empty {
            <div class="empty-state">
              <div class="empty-icon">🔍</div>

              <h3>No Gym Leaders Found</h3>

              @if (selectedRegion() === 'All') {
                <p>Your registry is empty. Add your first Gym Leader to get started!</p>
              } @else {
                <p>
                  There are no registered Gym Leaders in {{ selectedRegion() }} yet.
                  Try another region or add a new leader.
                </p>
              }

              <a routerLink="/leaders/new" class="add-button">
                + Register a Gym Leader
              </a>
            </div>
          }
        </div>

      </section>

      <!-- Footer -->
      <footer class="leaders-footer">
        <span>POKÉMON GYM LEADER REGISTRY</span>
        <span>Every region has a champion.</span>
      </footer>

    </main>
  `,

  styles: `
    :host {
      display: block;
      min-height: 100%;
      background: #f3f6fc;
      color: #17233f;
      font-family: 'Segoe UI', Arial, sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    .leaders-page {
      width: min(1200px, calc(100% - 40px));
      margin: 0 auto;
      padding: 35px 0;
    }

    /* Header banner */

    .leaders-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
      position: relative;
      min-height: 260px;
      padding: 40px;
      overflow: hidden;
      border: 1px solid #dbe5f6;
      border-radius: 20px;
      background: linear-gradient(120deg, #ffffff, #e3edff);
      box-shadow: 0 8px 30px rgba(23, 35, 63, 0.06);
    }

    .banner-content {
      position: relative;
      z-index: 1;
      max-width: 720px;
    }

    .eyebrow {
      color: #3563e9;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .leaders-banner h1 {
      margin: 12px 0;
      color: #17233f;
      font-size: clamp(32px, 4vw, 44px);
      font-weight: 800;
      line-height: 1.2;
    }

    .leaders-banner p {
      max-width: 650px;
      margin: 0;
      color: #64748b;
      font-size: 14px;
      line-height: 1.8;
    }

    .banner-stats {
      display: flex;
      align-items: center;
      gap: 25px;
      margin-top: 25px;
    }

    .banner-stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .banner-stat-number {
      color: #17233f;
      font-size: 25px;
      font-weight: 800;
    }

    .banner-stat-label {
      color: #64748b;
      font-size: 12px;
    }

    .banner-divider {
      width: 1px;
      height: 40px;
      background: #d3deef;
    }

    /* Poké Ball */

    .banner-decoration {
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .pokeball {
      display: grid;
      place-items: center;
      width: 145px;
      height: 145px;
      border: 9px solid white;
      border-radius: 50%;
      background: linear-gradient(
        to bottom,
        #ef4444 0%,
        #ef4444 46%,
        #17233f 46%,
        #17233f 54%,
        white 54%,
        white 100%
      );
      box-shadow: 0 12px 30px rgba(23, 35, 63, 0.15);
    }

    .pokeball-center {
      width: 45px;
      height: 45px;
      border: 8px solid #17233f;
      border-radius: 50%;
      background: white;
    }

    /* Section heading */

    .registry-section {
      margin-top: 38px;
    }

    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 25px;
    }

    .section-heading h2 {
      margin: 8px 0;
      font-size: 27px;
      font-weight: 800;
    }

    .section-heading p {
      margin: 0;
      color: #718096;
      font-size: 14px;
      line-height: 1.7;
    }

    /* Add button */

    .add-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 9px;
      padding: 12px 18px;
      border: 1px solid transparent;
      border-radius: 9px;
      background: #3563e9;
      color: white;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.2s, transform 0.2s;
    }

    .add-button:hover {
      background: #2449b8;
      transform: translateY(-2px);
    }

    .add-icon {
      font-size: 20px;
      line-height: 1;
    }

    /* Filter panel */

    .filter-panel {
      margin-bottom: 25px;
      padding: 22px;
      border: 1px solid #e1e8f3;
      border-radius: 15px;
      background: white;
      box-shadow: 0 5px 20px rgba(23, 35, 63, 0.04);
    }

    .filter-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 18px;
    }

    .filter-heading h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
    }

    .result-count {
      padding: 6px 11px;
      border-radius: 20px;
      background: #edf2ff;
      color: #3563e9;
      font-size: 12px;
      font-weight: 800;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .filter-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border: 1px solid #dbe3f0;
      border-radius: 9px;
      background: #ffffff;
      color: #475569;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }

    .filter-button:hover {
      border-color: #3563e9;
      color: #3563e9;
    }

    .filter-button.filter-active {
      border-color: #3563e9;
      background: #3563e9;
      color: white;
    }

    .filter-button.filter-kanto {
      border-color: #ef4444;
      background: #ef4444;
      color: white;
    }

    .filter-button.filter-johto {
      border-color: #d99a16;
      background: #d99a16;
      color: white;
    }

    .filter-button.filter-hoenn {
      border-color: #22a06b;
      background: #22a06b;
      color: white;
    }

    .filter-icon {
      font-size: 15px;
    }

    /* Leader cards grid */

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      align-items: start;
      gap: 22px;
    }

    app-leader-card {
      display: block;
      min-width: 0;
    }

    /* Error message */

    .error-message {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding: 15px 18px;
      border: 1px solid #fecaca;
      border-radius: 10px;
      background: #fef2f2;
      color: #b91c1c;
      font-size: 13px;
      line-height: 1.6;
    }

    /* Empty state */

    .empty-state {
      grid-column: 1 / -1;
      padding: 55px 25px;
      border: 1px dashed #cbd5e1;
      border-radius: 16px;
      background: white;
      text-align: center;
    }

    .empty-icon {
      margin-bottom: 15px;
      font-size: 42px;
    }

    .empty-state h3 {
      margin: 0 0 10px;
      font-size: 22px;
    }

    .empty-state p {
      max-width: 500px;
      margin: 0 auto 22px;
      color: #718096;
      font-size: 14px;
      line-height: 1.8;
    }

    /* Footer */

    .leaders-footer {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 35px;
      padding: 20px 0;
      border-top: 1px solid #dfe6f1;
      color: #8793a7;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    /* Tablet */

    @media (max-width: 1000px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pokeball {
        width: 115px;
        height: 115px;
      }
    }

    /* Mobile */

    @media (max-width: 600px) {
      .leaders-page {
        width: calc(100% - 24px);
        padding: 20px 0;
      }

      .leaders-banner {
        min-height: auto;
        padding: 25px;
      }

      .banner-decoration {
        display: none;
      }

      .section-heading {
        align-items: stretch;
        flex-direction: column;
      }

      .section-heading .add-button {
        align-self: flex-start;
      }

      .filter-panel {
        padding: 18px;
      }

      .filters {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .filter-button {
        padding: 11px 8px;
      }

      .grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .leaders-footer {
        flex-direction: column;
      }
    }
  `,
})
export class LeaderList implements OnInit {
  protected readonly leaderService = inject(GymLeaderService);
  private readonly router = inject(Router);

  protected readonly regions: RegionFilter[] = [
    'All',
    'Kanto',
    'Johto',
    'Hoenn',
  ];

  protected readonly selectedRegion = signal<RegionFilter>('All');
  protected readonly errorMessage = signal('');

  protected readonly filteredLeaders = computed(() => {
    const region = this.selectedRegion();
    const all = this.leaderService.leaders();

    return region === 'All'
      ? all
      : all.filter((leader) => leader.region === region);
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

 this.leaderService.deleteLeader(id).subscribe({
  next: () => {
    this.errorMessage.set('');
  },
  error: (err) => {
    console.error('Failed to delete Gym Leader:', err);

    console.error('Status code:', err.status);
    console.error('Backend response:', err.error);

    this.errorMessage.set(
      `Could not remove ${leader.name}. Status: ${err.status}. ${
        err.error?.message ?? err.message ?? 'Unknown error'
      }`
    );
  },
});
  }
}