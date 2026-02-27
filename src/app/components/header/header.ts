import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <header class="header">
      <div class="container nav-container">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#logo_grad)" />
            <path d="M8 12C8 9.79086 9.79086 8 12 8H20C22.2091 8 24 9.79086 24 12V20C24 22.2091 22.2091 24 20 24H12C9.79086 24 8 22.2091 8 20V12Z" stroke="white" stroke-width="2"/>
            <path d="M12 14H20M12 18H17" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <defs>
              <linearGradient id="logo_grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stop-color="#a855f7"/>
                <stop offset="1" stop-color="#ec4899"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="logo-text">SkillSnap</span>
        </div>
        <button class="btn-primary" (click)="getStartedClick.emit()">Get Started</button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      padding: 1rem 0;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo-text {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--secondary-purple);
      letter-spacing: -0.025em;
    }
    .btn-primary {
      padding: 0.5rem 1.25rem;
      font-size: 0.875rem;
    }
  `],
})
export class Header {
  @Output() getStartedClick = new EventEmitter<void>();
}

