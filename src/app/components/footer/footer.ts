import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <p>Crafted with <span class="heart">❤️</span> by <span class="brand">SkillSnap</span></p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 3rem 0;
      border-top: 1px solid #f1f5f9;
      text-align: center;
      background: var(--bg-white);
    }
    .footer-content {
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .heart {
      color: #ef4444;
      margin: 0 0.25rem;
    }
    .brand {
      color: var(--secondary-purple);
      font-weight: 600;
      border-bottom: 1px solid var(--secondary-purple);
      padding-bottom: 1px;
    }
  `],
})
export class Footer { }
