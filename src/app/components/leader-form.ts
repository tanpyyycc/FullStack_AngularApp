import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GymLeaderService } from '../services/gym-leader';
import { Region } from '../models/gym-leader.model';

type FieldName = 'name' | 'region' | 'town' | 'badge' | 'specialty' | 'aceLevel' | 'motto';

@Component({
  selector: 'app-leader-form',
  imports: [ReactiveFormsModule],
  templateUrl: './leader-form.html',
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

    .form-page {
      width: min(900px, calc(100% - 32px));
      margin: 0 auto;
      padding: 35px 0;
    }

    .form-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 30px 35px;
      border: 1px solid #dbe5f6;
      border-radius: 18px;
      background: linear-gradient(120deg, #fff, #e3edff);
    }

    .eyebrow {
      color: #3563e9;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.8px;
    }

    .banner-text h1 {
      margin: 12px 0 8px;
      font-size: clamp(27px, 4vw, 36px);
      font-weight: 800;
      line-height: 1.2;
    }

    .banner-text p,
    .form-card-heading p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
      line-height: 1.8;
    }

    .banner-pokeball {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 90px;
      height: 90px;
      border: 6px solid white;
      border-radius: 50%;
      background: linear-gradient(
        to bottom,
        #ef4444 0%,
        #ef4444 45%,
        #17233f 45%,
        #17233f 55%,
        white 55%,
        white 100%
      );
      box-shadow: 0 8px 20px #17233f1a;
    }

    .banner-pokeball-center {
      width: 30px;
      height: 30px;
      border: 5px solid #17233f;
      border-radius: 50%;
      background: white;
    }

    .form-card {
      margin-top: 25px;
      padding: 30px;
      border: 1px solid #e1e8f3;
      border-radius: 16px;
      background: white;
      box-shadow: 0 8px 30px #17233f0a;
    }

    .form-card-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 28px;
    }

    .form-card-heading h2 {
      margin: 8px 0;
      font-size: 23px;
      font-weight: 800;
    }

    .required-note {
      color: #8793a7;
      font-size: 12px;
      white-space: nowrap;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 23px 22px;
    }

    .field {
      display: flex;
      flex-direction: column;
      min-width: 0;
      gap: 9px;
    }

    .field-full {
      grid-column: 1 / -1;
    }

    .field label {
      color: #24324d;
      font-size: 13px;
      font-weight: 700;
    }

    .field label > span:not(.optional) {
      color: #ef4444;
    }

    .field label .optional {
      color: #8793a7;
      font-size: 12px;
      font-weight: 400;
    }

    .field input,
    .field select,
    .field textarea {
      display: block;
      width: 100%;
      min-width: 0;
      padding: 12px 14px;
      border: 1px solid #d7dfec;
      border-radius: 9px;
      outline: none;
      background: #fbfcff;
      color: #17233f;
      font: inherit;
      font-size: 14px;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }

    .field input,
    .field select {
      min-height: 45px;
    }

    .field textarea {
      resize: vertical;
      min-height: 100px;
      line-height: 1.6;
    }

    .field input::placeholder,
    .field textarea::placeholder {
      color: #a0aabe;
    }

    .field input:focus,
    .field select:focus,
    .field textarea:focus {
      border-color: #3563e9;
      background: white;
      box-shadow: 0 0 0 3px #3563e91a;
    }

    .field input[aria-invalid='true'],
    .field textarea[aria-invalid='true'],
    .field select[aria-invalid='true'] {
      border-color: #dc2626;
    }

    .field-hint {
      color: #8793a7;
      font-size: 11px;
      line-height: 1.5;
    }

    .error {
      margin: 0;
      color: #dc2626;
      font-size: 12px;
      line-height: 1.5;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 20px;
      padding: 14px 17px;
      border: 1px solid #fecaca;
      border-radius: 10px;
      background: #fef2f2;
      color: #b91c1c;
      font-size: 13px;
      line-height: 1.6;
    }

    .form-divider {
      height: 1px;
      margin: 30px 0 22px;
      background: #e8edf5;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-cancel,
    .btn-submit {
      min-height: 44px;
      padding: 0 20px;
      border: 1px solid transparent;
      border-radius: 9px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }

    .btn-cancel {
      border-color: #d7dfec;
      background: white;
      color: #475569;
    }

    .btn-cancel:hover:not(:disabled) {
      background: #f1f5f9;
    }

    .btn-submit {
      background: #3563e9;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background: #2449b8;
      transform: translateY(-1px);
    }

    .btn-cancel:disabled,
    .btn-submit:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .form-footer {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 28px;
      padding: 20px 0;
      border-top: 1px solid #dfe6f1;
      color: #8793a7;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    @media (max-width: 600px) {
      .form-page {
        width: calc(100% - 24px);
        padding: 20px 0;
      }

      .form-banner {
        padding: 24px;
      }

      .banner-pokeball {
        width: 65px;
        height: 65px;
        border-width: 4px;
      }

      .banner-pokeball-center {
        width: 23px;
        height: 23px;
        border-width: 4px;
      }

      .form-card {
        padding: 22px 18px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .field-full {
        grid-column: auto;
      }

      .form-card-heading {
        flex-direction: column;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn-cancel,
      .btn-submit {
        width: 100%;
      }

      .form-footer {
        flex-direction: column;
        line-height: 1.6;
      }
    }
  `,
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