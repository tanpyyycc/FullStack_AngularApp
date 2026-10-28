import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GymLeaderService } from '../services/gym-leader';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],

  template: `
    <main class="dashboard">

      <!-- Welcome Banner -->
      <section class="welcome-banner">
        <div class="welcome-content">
          <span class="eyebrow">POKÉMON TRAINER DATABASE</span>

          <h1>Welcome to the<br />Gym Leader Registry!</h1>

          <p>
            Discover, manage, and keep track of the Gym Leaders
            across the Pokémon regions.
          </p>

          <div class="welcome-actions">
            <a routerLink="/leaders" class="btn btn-primary">
              Explore Leaders →
            </a>

            <a routerLink="/leaders/new" class="btn btn-secondary">
              + Add Leader
            </a>
          </div>
        </div>

        <div class="pokeball-decoration" aria-hidden="true">
          <div class="pokeball-center"></div>
        </div>
      </section>

      <!-- Statistics Heading -->
      <section class="statistics-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">YOUR COLLECTION</span>
            <h2>Registry Overview</h2>
            <p>Here's the current status of your Gym Leaders.</p>
          </div>

          <span class="live-badge">
            <span class="live-dot"></span>
            Registry Dashboard
          </span>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">

          <!-- Total Leaders -->
          <article class="stat-card total-card">
            <div class="stat-top">
              <div class="stat-icon total-icon">🏆</div>
              <span class="stat-tag">ALL REGIONS</span>
            </div>

            <p class="stat-label">Total Gym Leaders</p>

            <div class="stat-number">
              {{ totalLeaders }}
            </div>

            <div class="stat-footer">
              <span>Across all regions</span>
              <span class="footer-arrow">↗</span>
            </div>
          </article>

          <!-- Kanto -->
          <article class="stat-card kanto-card">
            <div class="stat-top">
              <div class="stat-icon kanto-icon">🔥</div>
              <span class="region-tag kanto-tag">KANTO</span>
            </div>

            <p class="stat-label">Kanto Leaders</p>

            <div class="stat-number">
              {{ leaderService.kantoCount() }}
            </div>

            <div class="stat-progress">
              <div class="progress-track">
                <div
                  class="progress-fill kanto-fill"
                  [style.width.%]="regionPercentage(leaderService.kantoCount())"
                ></div>
              </div>

              <span>
                {{ regionPercentage(leaderService.kantoCount()) }}%
              </span>
            </div>

            <div class="stat-footer">
              <span>Red region theme</span>
              <span class="footer-arrow">↗</span>
            </div>
          </article>

          <!-- Johto -->
          <article class="stat-card johto-card">
            <div class="stat-top">
              <div class="stat-icon johto-icon">⚡</div>
              <span class="region-tag johto-tag">JOHTO</span>
            </div>

            <p class="stat-label">Johto Leaders</p>

            <div class="stat-number">
              {{ leaderService.johtoCount() }}
            </div>

            <div class="stat-progress">
              <div class="progress-track">
                <div
                  class="progress-fill johto-fill"
                  [style.width.%]="regionPercentage(leaderService.johtoCount())"
                ></div>
              </div>

              <span>
                {{ regionPercentage(leaderService.johtoCount()) }}%
              </span>
            </div>

            <div class="stat-footer">
              <span>Golden region theme</span>
              <span class="footer-arrow">↗</span>
            </div>
          </article>

          <!-- Hoenn -->
          <article class="stat-card hoenn-card">
            <div class="stat-top">
              <div class="stat-icon hoenn-icon">🌿</div>
              <span class="region-tag hoenn-tag">HOENN</span>
            </div>

            <p class="stat-label">Hoenn Leaders</p>

            <div class="stat-number">
              {{ leaderService.hoennCount() }}
            </div>

            <div class="stat-progress">
              <div class="progress-track">
                <div
                  class="progress-fill hoenn-fill"
                  [style.width.%]="regionPercentage(leaderService.hoennCount())"
                ></div>
              </div>

              <span>
                {{ regionPercentage(leaderService.hoennCount()) }}%
              </span>
            </div>

            <div class="stat-footer">
              <span>Green region theme</span>
              <span class="footer-arrow">↗</span>
            </div>
          </article>

        </div>
      </section>

      <!-- Quick Action Panel -->
      <section class="quick-actions">
        <div class="quick-action-icon">📋</div>

        <div class="quick-action-content">
          <h2>Ready for your next challenge?</h2>
          <p>
            Keep your registry updated by adding a new Gym Leader
            or reviewing your existing collection.
          </p>
        </div>

        <a routerLink="/leaders/new" class="btn btn-primary">
          Register a Leader →
        </a>
      </section>

      <!-- Footer -->
      <footer class="dashboard-footer">
        <span>POKÉMON GYM LEADER REGISTRY</span>
        <span>Gotta track 'em all!</span>
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

    .dashboard {
      width: min(1200px, calc(100% - 40px));
      margin: 0 auto;
      padding: 35px 0;
    }

    /* Welcome banner */

    .welcome-banner {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
      min-height: 280px;
      padding: 42px;
      overflow: hidden;
      border: 1px solid #dbe5f6;
      border-radius: 20px;
      background: linear-gradient(120deg, #ffffff, #e3edff);
      box-shadow: 0 8px 30px rgba(23, 35, 63, 0.06);
    }

    .welcome-content {
      position: relative;
      z-index: 1;
      max-width: 690px;
    }

    .eyebrow {
      color: #3563e9;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .welcome-banner h1 {
      margin: 15px 0;
      color: #17233f;
      font-size: clamp(30px, 4vw, 43px);
      font-weight: 800;
      line-height: 1.2;
    }

    .welcome-banner p {
      max-width: 560px;
      margin-bottom: 25px;
      color: #64748b;
      font-size: 15px;
      line-height: 1.8;
    }

    .welcome-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    /* Buttons */

    .btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 12px 18px;
      border: 1px solid transparent;
      border-radius: 9px;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn-primary {
      color: white;
      background: #3563e9;
    }

    .btn-primary:hover {
      background: #2449b8;
    }

    .btn-secondary {
      color: #263754;
      background: white;
      border-color: #d8e1f0;
    }

    .btn-secondary:hover {
      background: #f1f5ff;
    }

    /* Poké Ball decoration */

    .pokeball-decoration {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 155px;
      height: 155px;
      border: 9px solid white;
      border-radius: 50%;
      background: linear-gradient(
        to bottom,
        #ef4444 0%,
        #ef4444 46%,
        #17233f 46%,
        #17233f 54%,
        #ffffff 54%,
        #ffffff 100%
      );
      box-shadow: 0 12px 30px rgba(23, 35, 63, 0.15);
    }

    .pokeball-center {
      width: 48px;
      height: 48px;
      border: 8px solid #17233f;
      border-radius: 50%;
      background: white;
    }

    /* Section heading */

    .statistics-section {
      margin-top: 38px;
    }

    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 22px;
    }

    .section-heading h2 {
      margin: 8px 0;
      font-size: 26px;
      font-weight: 800;
    }

    .section-heading p {
      margin: 0;
      color: #718096;
      font-size: 14px;
    }

    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 13px;
      border: 1px solid #dbe5f6;
      border-radius: 20px;
      background: white;
      color: #64748b;
      font-size: 12px;
      font-weight: 700;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22a06b;
    }

    /* Statistics grid */

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 20px;
    }

    .stat-card {
      min-width: 0;
      padding: 23px;
      border: 1px solid #e1e8f3;
      border-top: 5px solid #3563e9;
      border-radius: 15px;
      background: white;
      box-shadow: 0 5px 20px rgba(23, 35, 63, 0.04);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 28px rgba(23, 35, 63, 0.09);
    }

    .total-card {
      border-top-color: #3563e9;
    }

    .kanto-card {
      border-top-color: #ef4444;
    }

    .johto-card {
      border-top-color: #e9a323;
    }

    .hoenn-card {
      border-top-color: #22a06b;
    }

    .stat-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 22px;
    }

    .stat-icon {
      display: grid;
      place-items: center;
      width: 47px;
      height: 47px;
      border-radius: 12px;
      font-size: 24px;
    }

    .total-icon {
      background: #e8efff;
    }

    .kanto-icon {
      background: #fee2e2;
    }

    .johto-icon {
      background: #fef3c7;
    }

    .hoenn-icon {
      background: #dcfce7;
    }

    .stat-tag,
    .region-tag {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.6px;
    }

    .stat-tag {
      color: #64748b;
    }

    .region-tag {
      padding: 6px 9px;
      border-radius: 20px;
    }

    .kanto-tag {
      color: #b91c1c;
      background: #fee2e2;
    }

    .johto-tag {
      color: #92400e;
      background: #fef3c7;
    }

    .hoenn-tag {
      color: #166534;
      background: #dcfce7;
    }

    .stat-label {
      margin: 0 0 8px;
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
    }

    .stat-number {
      margin: 0 0 22px;
      color: #17233f;
      font-size: clamp(36px, 4vw, 48px);
      font-weight: 800;
      line-height: 1.2;
    }

    /* Progress bars */

    .stat-progress {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .progress-track {
      flex: 1;
      height: 8px;
      overflow: hidden;
      border-radius: 10px;
      background: #edf1f7;
    }

    .progress-fill {
      height: 100%;
      border-radius: 10px;
      transition: width 0.3s ease;
    }

    .kanto-fill {
      background: #ef4444;
    }

    .johto-fill {
      background: #e9a323;
    }

    .hoenn-fill {
      background: #22a06b;
    }

    .stat-progress > span {
      min-width: 35px;
      color: #64748b;
      font-size: 12px;
      font-weight: 800;
      text-align: right;
    }

    .stat-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding-top: 14px;
      border-top: 1px solid #edf1f7;
      color: #718096;
      font-size: 11px;
    }

    .footer-arrow {
      color: #3563e9;
      font-size: 17px;
      font-weight: 800;
    }

    /* Quick action panel */

    .quick-actions {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-top: 28px;
      padding: 25px 28px;
      border: 1px solid #e1e8f3;
      border-radius: 15px;
      background: white;
      box-shadow: 0 5px 20px rgba(23, 35, 63, 0.04);
    }

    .quick-action-icon {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 52px;
      height: 52px;
      border-radius: 13px;
      background: #e8efff;
      font-size: 25px;
    }

    .quick-action-content {
      flex: 1;
    }

    .quick-action-content h2 {
      margin: 0 0 7px;
      font-size: 18px;
    }

    .quick-action-content p {
      margin: 0;
      color: #718096;
      font-size: 13px;
      line-height: 1.7;
    }

    /* Footer */

    .dashboard-footer {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 28px;
      padding: 18px 0;
      border-top: 1px solid #dfe6f1;
      color: #8793a7;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    /* Tablet */

    @media (max-width: 1000px) {
      .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pokeball-decoration {
        width: 120px;
        height: 120px;
      }
    }

    /* Mobile */

    @media (max-width: 600px) {
      .dashboard {
        width: calc(100% - 24px);
        padding: 20px 0;
      }

      .welcome-banner {
        min-height: auto;
        padding: 25px;
      }

      .pokeball-decoration {
        display: none;
      }

      .section-heading {
        align-items: flex-start;
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 14px;
      }

      .stat-card {
        padding: 20px;
      }

      .quick-actions {
        align-items: flex-start;
        flex-direction: column;
        padding: 22px;
      }

      .dashboard-footer {
        flex-direction: column;
      }
    }
  `,
})
export class Home implements OnInit {
  protected readonly leaderService = inject(GymLeaderService);

  get totalLeaders(): number {
    return (
      this.leaderService.kantoCount() +
      this.leaderService.johtoCount() +
      this.leaderService.hoennCount()
    );
  }

  regionPercentage(count: number): number {
    if (this.totalLeaders === 0) {
      return 0;
    }

    return Math.round((count / this.totalLeaders) * 100);
  }

  ngOnInit(): void {
    this.leaderService.fetchLeaders();
  }
}