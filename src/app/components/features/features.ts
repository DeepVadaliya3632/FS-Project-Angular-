import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [],
  template: `
    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Choose <span class="gradient-text">SkillSnap?</span></h2>
          <p class="section-subtitle">Everything you need to create a professional resume that stands out</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="icon-box purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <h3 class="feature-name">Lightning Fast</h3>
            <p class="feature-text">Create professional resumes in under 5 minutes with our streamlined process.</p>
          </div>
          
          <div class="feature-card">
            <div class="icon-box pink">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </div>
            <h3 class="feature-name">Pro Templates</h3>
            <p class="feature-text">Choose from dozens of recruiter-approved, industry-specific templates.</p>
          </div>
          
          <div class="feature-card">
            <div class="icon-box orange">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </div>
            <h3 class="feature-name">Instant Export</h3>
            <p class="feature-text">Download high-quality PDFs instantly with perfect formatting every time.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .features {
      padding: 8rem 0;
      background-color: var(--bg-section);
    }
    .section-header {
      text-align: center;
      margin-bottom: 5rem;
    }
    .section-title {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .section-subtitle {
      color: var(--text-muted);
      font-size: 1.125rem;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }
    .feature-card {
      background: white;
      padding: 3rem 2rem;
      border-radius: 24px;
      transition: all 0.3s ease;
      border: 1px solid rgba(0,0,0,0.03);
    }
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    }
    .icon-box {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
    }
    .icon-box.purple { background: rgba(168, 85, 247, 0.1); color: var(--primary-purple); }
    .icon-box.pink { background: rgba(236, 72, 153, 0.1); color: var(--primary-pink); }
    .icon-box.orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }
    
    .feature-name {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    .feature-text {
      color: var(--text-muted);
      line-height: 1.6;
    }

    @media (max-width: 1024px) {
      .features-grid {
        grid-template-columns: 1fr;
        max-width: 500px;
        margin: 0 auto;
      }
      .section-title {
        font-size: 2.5rem;
      }
    }
  `],
})
export class Features { }
