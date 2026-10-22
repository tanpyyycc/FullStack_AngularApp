import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GymLeaderService } from '../gym-leader';
import { Region } from '../gym-leader.model';

type FieldName = 'name' | 'region' | 'town' | 'badge' | 'specialty' | 'aceLevel' | 'motto';

@Component({
  selector: 'app-leader-form',
  imports: [ReactiveFormsModule],
  templateUrl: './leader-form.html',
})
export class LeaderForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly leaderService = inject(GymLeaderService);
  private readonly router = inject(Router);

  protected readonly leaderId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  protected readonly isEditMode = this.leaderId !== null;

  protected readonly regions: Region[] = ['Kanto', 'Johto', 'Hoenn'];
  protected readonly saving = signal(false);
  protected readonly serverError = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    region: ['Kanto' as Region, [Validators.required]],
    town: ['', [Validators.required]],
    badge: ['', [Validators.required]],
    specialty: ['', [Validators.required]],
    aceLevel: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    motto: ['', [Validators.maxLength(150)]],
  });

  private readonly labels: Record<FieldName, string> = {
    name: 'Name',
    region: 'Region',
    town: 'Town',
    badge: 'Badge',
    specialty: 'Specialty',
    aceLevel: 'Ace level',
    motto: 'Motto',
  };

  ngOnInit(): void {
    if (this.leaderId) {
      this.loadLeader(this.leaderId);
    }
  }

  private loadLeader(id: string): void {
    this.leaderService.getLeader(id).subscribe({
      next: (leader) => this.form.patchValue({ ...leader, motto: leader.motto ?? '' }),
      error: () => this.serverError.set('Gym Leader not found.'),
    });
  }

  /** Returns an error message once the field is touched and invalid, otherwise null. */
  protected errorFor(field: FieldName): string | null {
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) {
      return null;
    }

    switch (field) {
      case 'name':
        return control.hasError('minlength')
          ? 'Name must be at least 2 characters.'
          : 'Name is required.';
      case 'aceLevel':
        return 'Ace level must be between 1 and 100.';
      case 'motto':
        return 'Motto must be 150 characters or fewer.';
      default:
        return `${this.labels[field]} is required.`;
    }
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.serverError.set('');

    const leader = this.form.getRawValue();
    const request = this.leaderId
      ? this.leaderService.updateLeader(this.leaderId, leader)
      : this.leaderService.addLeader(leader);

    request.subscribe({
      next: () => {
        this.form.reset();
        this.saving.set(false);
        this.router.navigate(['/leaders']);
      },
      error: (err: HttpErrorResponse) => {
        this.serverError.set(err.error?.message ?? 'Something went wrong. Please try again.');
        this.saving.set(false);
      },
    });
  }

  protected cancel(): void {
    this.router.navigate(['/leaders']);
  }
}