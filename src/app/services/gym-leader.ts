import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymLeaderModel } from './gym-leader.model';

@Service()
export class GymLeaderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/leaders';

  leaders = signal<GymLeaderModel[]>([]);

  kantoCount = computed(() => this.leaders().filter((l) => l.region === 'Kanto').length);
  johtoCount = computed(() => this.leaders().filter((l) => l.region === 'Johto').length);
  hoennCount = computed(() => this.leaders().filter((l) => l.region === 'Hoenn').length);

  // READ ALL
  fetchLeaders(): void {
    this.http.get<GymLeaderModel[]>(this.apiUrl).subscribe((data) => this.leaders.set(data));
  }

  // READ ONE
  getLeader(id: string): Observable<GymLeaderModel> {
    return this.http.get<GymLeaderModel>(`${this.apiUrl}/${id}`);
  }

  // CREATE 
  addLeader(data: Omit<GymLeaderModel, '_id'>): Observable<GymLeaderModel> {
    return this.http.post<GymLeaderModel>(this.apiUrl, data).pipe(
      tap((saved) => this.leaders.update((list) => [...list, saved])),
    );
  }

  // UPDATE
  updateLeader(id: string, data: Omit<GymLeaderModel, '_id'>): Observable<GymLeaderModel> {
    return this.http.put<GymLeaderModel>(`${this.apiUrl}/${id}`, data).pipe(
      tap((updated) =>
        this.leaders.update((list) => list.map((l) => (l._id === id ? updated : l))),
      ),
    );
  }

  // DELETE (backend returns 200 + a message, not an empty body)
  deleteLeader(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.leaders.update((list) => list.filter((l) => l._id !== id))),
    );
  }
}