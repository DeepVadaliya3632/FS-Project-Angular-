import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  template: `
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="badge">Professional Resume Builder</div>
          <h1 class="hero-title">
            Craft <br>
            <span class="gradient-text">Professional</span> <br>
            Resumes
          </h1>
          <p class="hero-description">
            Create job-winning resumes with expertly designed templates. 
            ATS-friendly, Recruiter-approved, and tailored to your career goals.
          </p>
          <div class="hero-actions">
            <button class="btn-primary" (click)="startBuildingClick.emit()">Start Building <span>→</span></button>
            <button class="btn-outline">View Templates</button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-value purple">50K+</span>
            </div>
            <div class="stat-item">
              <span class="stat-value orange">4.9★</span>
            </div>
            <div class="stat-item">
              <span class="stat-value teal">5 Min</span>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="document-preview">
            <div class="doc-header">
              <div class="doc-circle"></div>
              <div class="doc-lines">
                <div class="doc-line short"></div>
                <div class="doc-line long"></div>
              </div>
            </div>
            <div class="doc-body">
              <div class="doc-line full"></div>
              <div class="doc-line full"></div>
              <div class="doc-line full"></div>
              <div class="doc-line-group">
                <div class="doc-line-box active"></div>
                <div class="doc-line-box"></div>
                <div class="doc-line-box"></div>
              </div>
              <div class="doc-line full"></div>
              <div class="doc-line full"></div>
            </div>
          </div>
          <div class="glow glow-1"></div>
          <div class="glow glow-2"></div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: 5rem 0;
      overflow: hidden;
      background: radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.05) 0%, transparent 50%);
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    .badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: rgba(168, 85, 247, 0.1);
      color: var(--primary-purple);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .hero-title {
      font-size: 4.5rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      letter-spacing: -0.02em;
    }
    .hero-description {
      font-size: 1.125rem;
      color: var(--text-muted);
      max-width: 480px;
      margin-bottom: 2.5rem;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
    }
    .hero-actions .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .hero-stats {
      display: flex;
      gap: 2.5rem;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 800;
    }
    .stat-value.purple { color: var(--primary-purple); }
    .stat-value.orange { color: #f97316; }
    .stat-value.teal { color: #14b8a6; }

    .hero-visual {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .document-preview {
      width: 320px;
      height: 420px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      position: relative;
      z-index: 2;
      border: 1px solid rgba(0,0,0,0.03);
    }
    .doc-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .doc-circle {
      width: 48px;
      height: 48px;
      background: var(--primary-purple);
      border-radius: 50%;
      opacity: 0.8;
    }
    .doc-lines {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      justify-content: center;
    }
    .doc-line {
      height: 6px;
      background: #f1f5f9;
      border-radius: 3px;
    }
    .doc-line.short { width: 60%; background: var(--primary-purple); opacity: 0.6; }
    .doc-line.long { width: 100%; }
    .doc-line.full { width: 100%; margin-bottom: 0.75rem; }
    .doc-line-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .doc-line-box {
      height: 10px;
      flex: 1;
      background: #f1f5f9;
      border-radius: 2px;
    }
    .doc-line-box.active {
      background: var(--primary-purple);
      opacity: 0.4;
    }
    
    .glow {
      position: absolute;
      width: 400px;
      height: 400px;
      filter: blur(80px);
      border-radius: 50%;
      z-index: 1;
      opacity: 0.2;
    }
    .glow-1 {
      background: var(--primary-purple);
      top: -100px;
      right: -100px;
    }
    .glow-2 {
      background: var(--primary-pink);
      bottom: -100px;
      left: -100px;
    }

    @media (max-width: 1024px) {
      .hero-grid {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 3rem;
      }
      .hero-description {
        margin: 0 auto 2.5rem;
      }
      .hero-actions {
        justify-content: center;
      }
      .hero-stats {
        justify-content: center;
      }
      .hero-title {
        font-size: 3.5rem;
      }
    }
  `],
})
export class Hero {
  @Output() startBuildingClick = new EventEmitter<void>();
}
