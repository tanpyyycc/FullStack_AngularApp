import { Component, computed, input, output } from '@angular/core';
import { GymLeader } from '../gym-leader.model';

@Component({
  selector: 'app-leader-card',
  template: `
    <article class="card" [class]="regionClass()">
      <header>
        <h2>{{ leader().name }}</h2>
        <span class="region">{{ leader().region }}</span>
      </header>

      <dl>
        <dt>Town</dt>
        <dd>{{ leader().town }}</dd>
        <dt>Badge</dt>
        <dd>{{ leader().badge }}</dd>
        <dt>Specialty</dt>
        <dd>{{ leader().specialty }}</dd>
        <dt>Ace level</dt>
        <dd>{{ leader().aceLevel }}</dd>
      </dl>

      @if (leader().motto) {
        <blockquote>“{{ leader().motto }}”</blockquote>
      }

      <div class="actions">
        <button
          type="button"
          class="btn"
          [attr.aria-label]="'Edit ' + leader().name"
          (click)="onEdit()"
        >
          Edit
        </button>
        <button
          type="button"
          class="btn btn-danger"
          [attr.aria-label]="'Remove ' + leader().name"
          (click)="onRemove()"
        >
          Remove
        </button>
      </div>
    </article>
  `,
  styles: `
    .card {
      border: 1px solid #d1d5db;
      border-top-width: 6px;
      border-radius: 8px;
      padding: 1rem;
      background: #ffffff;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }
    h2 {
      margin: 0;
      font-size: 1.25rem;
    }
    .region {
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.25rem 0.75rem;
      margin: 0.75rem 0;
    }
    dt {
      font-weight: 600;
    }
    dd {
      margin: 0;
    }
    blockquote {
      margin: 0 0 0.75rem;
      font-style: italic;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .card.kanto {
      border-top-color: #dc2626;
    }
    .kanto .region {
      background: #fee2e2;
      color: #7f1d1d;
    }
    .card.johto {
      border-top-color: #d97706;
    }
    .johto .region {
      background: #fef3c7;
      color: #78350f;
    }
    .card.hoenn {
      border-top-color: #2563eb;
    }
    .hoenn .region {
      background: #dbeafe;
      color: #1e3a8a;
    }
  `,
})
export class LeaderCard {
  leader = input.required<GymLeader>();
  edit = output<string>();
  remove = output<string>();

  protected regionClass = computed(() => this.leader().region.toLowerCase());

  protected onEdit(): void {
    const id = this.leader()._id;
    if (id) {
      this.edit.emit(id);
    }
  }

  protected onRemove(): void {
    const id = this.leader()._id;
    if (id) {
      this.remove.emit(id);
    }
  }
}