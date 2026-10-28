import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GymLeader } from '../models/gym-leader.model';

@Service()
export class GymLeaderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/leaders';

  leaders = signal<GymLeader[]>([]);

  kantoCount = computed(() => this.leaders().filter((l) => l.region === 'Kanto').length);
  johtoCount = computed(() => this.leaders().filter((l) => l.region === 'Johto').length);
  hoennCount = computed(() => this.leaders().filter((l) => l.region === 'Hoenn').length);

  // READ ALL
  fetchLeaders(): void {
    this.http.get<GymLeader[]>(this.apiUrl).subscribe({
      next: (data) => this.leaders.set(data),
      error: (err) => console.error('Failed to load leaders', err),
    });
  }

  // READ ONE
  getLeader(id: string): Observable<GymLeader> {
    return this.http.get<GymLeader>(`${this.apiUrl}/${id}`);
  }

  // CREATE
  addLeader(leader: Omit<GymLeader, '_id'>): Observable<GymLeader> {
    return this.http
      .post<GymLeader>(this.apiUrl, leader)
      .pipe(tap((saved) => this.leaders.update((list) => [...list, saved])));
  }

  // UPDATE
  updateLeader(id: string, leader: Omit<GymLeader, '_id'>): Observable<GymLeader> {
    return this.http
      .put<GymLeader>(`${this.apiUrl}/${id}`, leader)
      .pipe(
        tap((updated) =>
          this.leaders.update((list) => list.map((l) => (l._id === id ? updated : l))),
        ),
      );
  }

  // DELETE (backend responds 200 + { message })
  deleteLeader(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.leaders.update((list) => list.filter((l) => l._id !== id))));
  }
}