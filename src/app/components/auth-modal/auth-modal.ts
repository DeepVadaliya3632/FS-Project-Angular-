import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-auth-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="close()">
        <div class="modal-card" (click)="$event.stopPropagation()"
             [class.slide-in]="isOpen">

          <!-- Close Button -->
          <button class="close-btn" (click)="close()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Error Message -->
          @if (errorMsg()) {
            <div class="error-banner">{{ errorMsg() }}</div>
          }

          <!-- Sign In View -->
          @if (mode() === 'signin') {
            <div class="modal-body">
              <h2 class="modal-title">Welcome Back</h2>
              <p class="modal-subtitle">Sign in to continue building amazing resumes</p>

              <form (ngSubmit)="onSignIn()">
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <div class="input-wrapper">
                    <input type="email" class="form-input" placeholder="skillsnap@gmail.com"
                           [(ngModel)]="signinEmail" name="signinEmail" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Password</label>
                  <div class="input-wrapper">
                    <input [type]="showPassword() ? 'text' : 'password'" class="form-input" placeholder="min 8 characters"
                           [(ngModel)]="signinPassword" name="signinPassword" required />
                    <button type="button" class="eye-btn" (click)="togglePassword()">
                      @if (showPassword()) {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      } @else {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      }
                    </button>
                  </div>
                </div>

                <button type="submit" class="submit-btn signin-btn" [disabled]="loading()">
                  {{ loading() ? 'Signing in...' : 'Sign In' }}
                </button>
              </form>

              <p class="modal-footer-text">
                Don't have an account?
                <a class="link-text" (click)="switchToSignUp()">Sign Up</a>
              </p>
            </div>
          }

          <!-- Sign Up View -->
          @if (mode() === 'signup') {
            <div class="modal-body">
              <h2 class="modal-title">Create Account</h2>
              <p class="modal-subtitle">Join thousands of professionals today</p>

              <form (ngSubmit)="onSignUp()">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <div class="input-wrapper">
                    <input type="text" class="form-input" placeholder="John Doe"
                           [(ngModel)]="signupName" name="signupName" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Email</label>
                  <div class="input-wrapper">
                    <input type="email" class="form-input" placeholder="john.doe@example.com"
                           [(ngModel)]="signupEmail" name="signupEmail" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Password</label>
                  <div class="input-wrapper">
                    <input [type]="showPassword() ? 'text' : 'password'" class="form-input" placeholder="Minimum 8 characters"
                           [(ngModel)]="signupPassword" name="signupPassword" required />
                    <button type="button" class="eye-btn" (click)="togglePassword()">
                      @if (showPassword()) {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      } @else {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      }
                    </button>
                  </div>
                </div>

                <button type="submit" class="submit-btn signup-btn" [disabled]="loading()">
                  {{ loading() ? 'Creating account...' : 'Create Account' }}
                </button>
              </form>

              <p class="modal-footer-text">
                Already have an account?
                <a class="link-text" (click)="switchToSignIn()">Sign In</a>
              </p>
            </div>
          }
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
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 420px;
      position: relative;
      box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }

    .modal-card::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 120px;
      background: linear-gradient(to top, rgba(255, 240, 245, 0.5), transparent);
      pointer-events: none;
      z-index: 0;
    }

    .modal-card.slide-in {
      animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .close-btn {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 2;
    }

    .close-btn:hover {
      background: #f8fafc;
      color: #475569;
      transform: none;
      box-shadow: none;
    }

    .error-banner {
      background: #fef2f2;
      color: #dc2626;
      padding: 0.75rem 1.25rem;
      font-size: 0.85rem;
      font-weight: 500;
      text-align: center;
      border-bottom: 1px solid #fecaca;
    }

    .modal-body {
      padding: 2.5rem 2rem 2rem;
      position: relative;
      z-index: 1;
    }

    .modal-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .modal-subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .input-wrapper {
      position: relative;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1.125rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
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
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
    }

    .eye-btn {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .eye-btn:hover {
      transform: translateY(-50%);
      box-shadow: none;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 14px;
      font-size: 1.05rem;
      font-weight: 700;
      color: white;
      cursor: pointer;
      margin-top: 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      filter: brightness(1.05);
    }

    .signin-btn {
      background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.35);
    }

    .signin-btn:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(168, 85, 247, 0.45);
    }

    .signup-btn {
      background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.35);
    }

    .signup-btn:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.45);
    }

    .modal-footer-text {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-top: 1.5rem;
      padding-bottom: 0.5rem;
    }

    .link-text {
      color: var(--primary-purple);
      font-weight: 700;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .link-text:hover {
      color: var(--secondary-purple);
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
export class AuthModal {
    @Input() isOpen = false;
    @Output() closed = new EventEmitter<void>();
    @Output() loggedIn = new EventEmitter<void>();

    mode = signal<'signin' | 'signup'>('signin');
    showPassword = signal(false);
    loading = signal(false);
    errorMsg = signal('');

    // Sign In fields
    signinEmail = '';
    signinPassword = '';

    // Sign Up fields
    signupName = '';
    signupEmail = '';
    signupPassword = '';

    constructor(private authService: AuthService) { }

    async onSignIn() {
        if (!this.signinEmail || !this.signinPassword) {
            this.errorMsg.set('Please fill in all fields');
            return;
        }

        this.loading.set(true);
        this.errorMsg.set('');

        try {
            await this.authService.login(this.signinEmail, this.signinPassword);
            this.resetForm();
            this.loggedIn.emit();
        } catch (err: any) {
            this.errorMsg.set(err.message || 'Login failed');
        } finally {
            this.loading.set(false);
        }
    }

    async onSignUp() {
        if (!this.signupName || !this.signupEmail || !this.signupPassword) {
            this.errorMsg.set('Please fill in all fields');
            return;
        }

        this.loading.set(true);
        this.errorMsg.set('');

        try {
            await this.authService.register(this.signupName, this.signupEmail, this.signupPassword);
            this.resetForm();
            this.loggedIn.emit();
        } catch (err: any) {
            this.errorMsg.set(err.message || 'Registration failed');
        } finally {
            this.loading.set(false);
        }
    }

    close() {
        this.closed.emit();
        setTimeout(() => {
            this.resetForm();
            this.mode.set('signin');
        }, 300);
    }

    togglePassword() {
        this.showPassword.update(v => !v);
    }

    switchToSignUp() {
        this.showPassword.set(false);
        this.errorMsg.set('');
        this.mode.set('signup');
    }

    switchToSignIn() {
        this.showPassword.set(false);
        this.errorMsg.set('');
        this.mode.set('signin');
    }

    private resetForm() {
        this.signinEmail = '';
        this.signinPassword = '';
        this.signupName = '';
        this.signupEmail = '';
        this.signupPassword = '';
        this.showPassword.set(false);
        this.errorMsg.set('');
    }
}
