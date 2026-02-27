import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [],
  template: `
    <section class="cta">
      <div class="container">
        <div class="cta-card">
          <h2 class="cta-title">Ready to Build Your <span class="gradient-text">Standout Resume?</span></h2>
          <p class="cta-subtitle">Join thousands of professionals who have landed their dream jobs with SkillSnap</p>
          <button class="btn-primary btn-large" (click)="startBuildingNowClick.emit()">Start Building Now</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta {
      padding: 6rem 0;
      background-color: var(--bg-white);
    }
    .cta-card {
      background: #f8fafc;
      border: 1px solid rgba(168, 85, 247, 0.1);
      border-radius: 32px;
      padding: 5rem 2rem;
      text-align: center;
      max-width: 900px;
      margin: 0 auto;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
    }
    .cta-title {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }
    .cta-subtitle {
      color: var(--text-muted);
      font-size: 1.125rem;
      margin-bottom: 2.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    .btn-large {
      padding: 1rem 2.5rem;
      font-size: 1.125rem;
    }

    @media (max-width: 768px) {
      .cta-title {
        font-size: 2.25rem;
      }
      .cta-card {
        padding: 3rem 1.5rem;
      }
    }
  `],
})
export class Cta {
  @Output() startBuildingNowClick = new EventEmitter<void>();
}
