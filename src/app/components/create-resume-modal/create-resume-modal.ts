import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-create-resume-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="close()">
        <div class="modal-card" (click)="$event.stopPropagation()">

          <div class="modal-header">
            <h2 class="modal-header-title">Create New Resume</h2>
            <button class="close-btn" (click)="close()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            @if (errorMsg()) {
              <div class="error-banner">{{ errorMsg() }}</div>
            }

            <div class="inner-card">
              <h3 class="inner-title">Create New Resume</h3>
              <p class="inner-subtitle">Give your resume a title to get started. You can customize everything later.</p>

              <form (ngSubmit)="onSubmit()">
                <label class="form-label">Resume Title</label>
                <div class="input-wrapper">
                  <input type="text" class="form-input"
                         placeholder="e.g., John Doe - Software Engineer"
                         [(ngModel)]="resumeTitle" name="resumeTitle"
                         required autofocus />
                </div>

                <button type="submit" class="submit-btn" [disabled]="loading()">
                  {{ loading() ? 'Creating...' : 'Create Resume' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.25s ease;
      padding: 1rem;
    }

    .modal-card {
      background: #f8fafc;
      border-radius: 24px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
    }

    .modal-header-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-dark);
    }

    .close-btn {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #f1f5f9;
      color: #475569;
      transform: none;
      box-shadow: none;
    }

    .modal-body {
      padding: 0 1.5rem 1.5rem;
    }

    .error-banner {
      background: #fef2f2;
      color: #dc2626;
      padding: 0.625rem 1rem;
      font-size: 0.85rem;
      font-weight: 500;
      text-align: center;
      border-radius: 10px;
      margin-bottom: 1rem;
    }

    .inner-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }

    .inner-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .inner-subtitle {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1.75rem;
      line-height: 1.5;
    }

    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary-purple);
      margin-bottom: 0.5rem;
    }

    .input-wrapper {
      margin-bottom: 1.25rem;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: inherit;
      color: var(--text-dark);
      background: white;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .form-input::placeholder {
      color: #94a3b8;
    }

    .form-input:focus {
      border-color: var(--primary-purple);
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
    }

    .submit-btn {
      width: 100%;
      padding: 0.925rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      color: white;
      cursor: pointer;
      background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
      filter: brightness(1.05);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `],
})
export class CreateResumeModal {
    @Input() isOpen = false;
    @Output() closed = new EventEmitter<void>();
    @Output() created = new EventEmitter<string>();

    resumeTitle = '';
    loading = signal(false);
    errorMsg = signal('');

    onSubmit() {
        if (!this.resumeTitle.trim()) {
            this.errorMsg.set('Please enter a resume title');
            return;
        }

        this.loading.set(true);
        this.errorMsg.set('');
        this.created.emit(this.resumeTitle.trim());
    }

    /** Called by parent after API finishes */
    reset() {
        this.resumeTitle = '';
        this.loading.set(false);
        this.errorMsg.set('');
    }

    showError(msg: string) {
        this.errorMsg.set(msg);
        this.loading.set(false);
    }

    close() {
        this.closed.emit();
        setTimeout(() => this.reset(), 300);
    }
}
