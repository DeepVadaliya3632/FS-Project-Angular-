import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResumeService, Resume } from '../../services/resume.service';
import { CreateResumeModal } from '../../components/create-resume-modal/create-resume-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CreateResumeModal],
  template: `
    <!-- Success toast -->
    @if (showToast()) {
      <div class="toast-bar">
        <div class="toast-inner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#22c55e"/>
            <polyline points="8 12 11 15 16 9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <span class="toast-text">Resume Updated Successfully</span>
        </div>
      </div>
    }
    <div class="dashboard">
      <header class="dash-header">
        <div class="container dash-header-inner">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#dash_logo)" />
              <path d="M8 12C8 9.79086 9.79086 8 12 8H20C22.2091 8 24 9.79086 24 12V20C24 22.2091 22.2091 24 20 24H12C9.79086 24 8 22.2091 8 20V12Z" stroke="white" stroke-width="2"/>
              <path d="M12 14H20M12 18H17" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <defs>
                <linearGradient id="dash_logo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#a855f7"/>
                  <stop offset="1" stop-color="#ec4899"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="logo-text">SkillSnap</span>
          </div>
          <div class="dash-user-area">
            <div class="user-avatar">{{ userInitial() }}</div>
            <button class="logout-btn" (click)="logout()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main class="dash-main">
        <div class="container">
          <div class="welcome-section">
            <div class="welcome-left">
              <h1 class="welcome-title">
                Welcome back, <span class="gradient-text">{{ userName() }}</span>
              </h1>
              <p class="welcome-subtitle">Ready to create your next standout resume?</p>
            </div>
            <button class="btn-create" (click)="openCreateModal()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Resume
            </button>
          </div>

          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ resumes().length }}</span>
                <span class="stat-label">My Resumes</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon pink">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-number">Multiple</span>
                <span class="stat-label">Templates</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-number">ATS</span>
                <span class="stat-label">Optimized</span>
              </div>
            </div>
          </div>

          <div class="resumes-section">
            <h2 class="section-title">My Resumes</h2>

            <!-- Empty state when no resumes -->
            @if (resumes().length === 0 && !loadingResumes()) {
              <div class="empty-state">
                <div class="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h3 class="empty-title">No resumes yet</h3>
                <p class="empty-text">Create your first professional resume — it takes less than 5 minutes!</p>
                <button class="btn-primary btn-empty-cta" (click)="openCreateModal()">
                  Start Building
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            }

            <!-- Loading state -->
            @if (loadingResumes()) {
              <div class="loading-state">
                <p>Loading resumes...</p>
              </div>
            }

            <!-- Resume cards grid -->
            @if (resumes().length > 0) {
              <div class="resumes-grid">
                <!-- Create new resume card (dashed) -->
                <div class="create-card" (click)="openCreateModal()">
                  <div class="create-card-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="11" x2="12" y2="17"></line>
                      <line x1="9" y1="14" x2="15" y2="14"></line>
                    </svg>
                  </div>
                  <h3 class="create-card-title">Create New Resume</h3>
                  <p class="create-card-text">Start building your professional resume</p>
                </div>

                <!-- Resume cards -->
                @for (resume of resumes(); track resume._id) {
                  <div class="resume-card">
                    <div class="card-top">
                      <div class="card-top-badge">
                        <span class="completion-dot" [class.active]="getCompletion(resume) > 0"></span>
                        <span class="completion-pct">{{ getCompletion(resume) }}%</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                      </div>
                      <div class="card-resume-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-purple)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </div>
                      <h3 class="card-title">{{ resume.title }}</h3>
                      <p class="card-subtitle">Start building</p>

                      <!-- Hover overlay with action buttons -->
                      <div class="card-hover-overlay">
                        <button class="action-btn edit-btn" (click)="onEditResume(resume._id); $event.stopPropagation()" title="Edit Resume">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button class="action-btn delete-btn" (click)="confirmDelete(resume); $event.stopPropagation()" title="Delete Resume">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="card-bottom">
                      <h4 class="card-bottom-title">{{ resume.title }}</h4>
                      <div class="card-dates">
                        <div class="card-date">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>Created At: {{ formatDate(resume.createdAt) }}</span>
                        </div>
                        <div class="card-date">
                          <span>Updated At: {{ formatDate(resume.updatedAt) }}</span>
                        </div>
                      </div>
                      <div class="card-progress-row">
                        <span class="progress-label">{{ getCompletion(resume) > 0 ? 'In Progress' : 'Getting Started' }}</span>
                        <span class="progress-pct">{{ getCompletion(resume) }}% Complete</span>
                      </div>
                      <div class="progress-bar">
                        <div class="progress-fill" [style.width.%]="getCompletion(resume)"></div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </main>
    </div>

    <app-create-resume-modal
      [isOpen]="showCreateModal()"
      (closed)="closeCreateModal()"
      (created)="onResumeCreated($event)">
    </app-create-resume-modal>

    <!-- Confirm Delete Modal -->
    @if (showDeleteModal()) {
      <div class="delete-backdrop" (click)="cancelDelete()">
        <div class="delete-modal" (click)="$event.stopPropagation()">
          <div class="delete-modal-header">
            <h3 class="delete-header-title">confirm deletion</h3>
            <div class="delete-header-actions">
              <button class="delete-confirm-btn" (click)="executeDelete()" [disabled]="deleting()">
                {{ deleting() ? 'deleting...' : 'delete' }}
              </button>
              <button class="delete-close-btn" (click)="cancelDelete()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div class="delete-modal-body">
            <div class="delete-icon-circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <h4 class="delete-body-title">Delete Resume?</h4>
            <p class="delete-body-text">Are you sure you want to delete this resume? This action cannot be undone.</p>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .toast-bar {
      position: fixed;
      top: 1.25rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10001;
      animation: toastSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .toast-inner {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.7rem 1.25rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .toast-text {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-dark);
      white-space: nowrap;
    }

    @keyframes toastSlideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    .dashboard {
      min-height: 100vh;
      background: #f8fafc;
    }

    .dash-header {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .dash-header-inner {
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

    .dash-user-area {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--primary-gradient);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: white;
      border: 1px solid #e2e8f0;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #fef2f2;
      border-color: #fecaca;
      color: #ef4444;
      transform: none;
      box-shadow: none;
    }

    .dash-main {
      padding: 3rem 0;
    }

    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
    }

    .welcome-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 0.35rem;
    }

    .welcome-subtitle {
      color: var(--text-muted);
      font-size: 1.05rem;
    }

    .btn-create {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--primary-gradient);
      color: white;
      padding: 0.7rem 1.4rem;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(168, 85, 247, 0.25);
      white-space: nowrap;
    }

    .btn-create:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.35);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      border: 1px solid rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.purple { background: rgba(168, 85, 247, 0.1); color: var(--primary-purple); }
    .stat-icon.pink { background: rgba(236, 72, 153, 0.1); color: var(--primary-pink); }
    .stat-icon.orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-dark);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .resumes-section {
      margin-top: 0.5rem;
    }

    .section-title {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    /* Empty state */
    .empty-state {
      background: white;
      border-radius: 24px;
      text-align: center;
      padding: 4rem 2rem;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }

    .empty-icon { margin-bottom: 1.5rem; opacity: 0.6; }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .empty-text {
      color: var(--text-muted);
      font-size: 0.95rem;
      max-width: 400px;
      margin: 0 auto 1.5rem;
    }

    .btn-empty-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }

    /* Resume grid */
    .resumes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    /* Create new card (dashed) */
    .create-card {
      border: 2px dashed #cbd5e1;
      border-radius: 20px;
      padding: 2.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.02) 0%, rgba(236, 72, 153, 0.02) 100%);
      min-height: 320px;
    }

    .create-card:hover {
      border-color: var(--primary-purple);
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.06) 0%, rgba(236, 72, 153, 0.06) 100%);
      transform: translateY(-4px);
    }

    .create-card-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.12) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-purple);
      margin-bottom: 1.25rem;
    }

    .create-card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 0.35rem;
    }

    .create-card-text {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Resume card */
    .resume-card {
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.05);
      background: white;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .resume-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    }

    .resume-card:hover .card-hover-overlay {
      opacity: 1;
      pointer-events: auto;
    }

    /* Hover overlay */
    .card-hover-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
      background: rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }

    .action-btn {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }

    .action-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .edit-btn {
      background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
    }

    .delete-btn {
      background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
    }

    /* Confirm delete modal */
    .delete-backdrop {
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

    .delete-modal {
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .delete-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
    }

    .delete-header-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-dark);
    }

    .delete-header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .delete-confirm-btn {
      background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .delete-confirm-btn:hover:not(:disabled) {
      filter: brightness(1.08);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
    }

    .delete-confirm-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .delete-close-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: white;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .delete-close-btn:hover {
      background: #f1f5f9;
      color: #475569;
      transform: none;
      box-shadow: none;
    }

    .delete-modal-body {
      background: #f8fafc;
      padding: 2.5rem 2rem;
      text-align: center;
    }

    .delete-icon-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
    }

    .delete-body-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .delete-body-text {
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.5;
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

    .card-top {
      background: linear-gradient(135deg, rgba(236, 72, 153, 0.14) 0%, rgba(168, 85, 247, 0.10) 100%);
      padding: 2rem 1.5rem 1.75rem;
      text-align: center;
      position: relative;
    }

    .card-top-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .completion-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
    }

    .completion-dot.active {
      background: #22c55e;
    }

    .completion-pct {
      font-weight: 700;
    }

    .card-resume-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.75rem;
      border: 1px solid rgba(168, 85, 247, 0.15);
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 0.2rem;
    }

    .card-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }



    .card-bottom {
      padding: 1.25rem 1.5rem 1.5rem;
    }

    .card-bottom-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .card-dates {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .card-date {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .card-progress-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
    }

    .progress-label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .progress-pct {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-gradient);
      border-radius: 3px;
      transition: width 0.4s ease;
      min-width: 0;
    }

    .gradient-text {
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }

    @media (max-width: 768px) {
      .stats-row {
        grid-template-columns: 1fr;
      }
      .welcome-section {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
      .welcome-title {
        font-size: 1.5rem;
      }
      .resumes-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class Dashboard implements OnInit {
  userName = signal('');
  userInitial = signal('');
  resumes = signal<Resume[]>([]);
  loadingResumes = signal(true);
  showCreateModal = signal(false);
  showDeleteModal = signal(false);
  deleting = signal(false);
  resumeToDelete = signal<Resume | null>(null);
  showToast = signal(false);

  @ViewChild(CreateResumeModal) createModal!: CreateResumeModal;

  constructor(
    private authService: AuthService,
    private resumeService: ResumeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.userName.set(user.name);
      this.userInitial.set(user.name.charAt(0).toUpperCase());
    }
    this.loadResumes();

    // Show toast if redirected from Save & Exit
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['saved'] === 'true') {
        this.showToast.set(true);
        setTimeout(() => this.showToast.set(false), 3000);
        // Clean up the URL
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      }
    });
  }

  async loadResumes() {
    this.loadingResumes.set(true);
    try {
      const data = await this.resumeService.getUserResumes();
      this.resumes.set(data);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      this.loadingResumes.set(false);
    }
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  async onResumeCreated(title: string) {
    try {
      await this.resumeService.createResume(title);
      this.createModal.reset();
      this.showCreateModal.set(false);
      await this.loadResumes();
    } catch (err: any) {
      this.createModal.showError(err.message || 'Failed to create resume');
    }
  }

  onEditResume(resumeId: string) {
    this.router.navigate(['/resume', resumeId, 'edit']);
  }

  confirmDelete(resume: Resume) {
    this.resumeToDelete.set(resume);
    this.showDeleteModal.set(true);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.resumeToDelete.set(null);
  }

  async executeDelete() {
    const resume = this.resumeToDelete();
    if (!resume) return;

    this.deleting.set(true);
    try {
      await this.resumeService.deleteResume(resume._id);
      this.showDeleteModal.set(false);
      this.resumeToDelete.set(null);
      await this.loadResumes();
    } catch (err) {
      console.error('Failed to delete resume:', err);
    } finally {
      this.deleting.set(false);
    }
  }

  getCompletion(resume: Resume): number {
    return this.resumeService.getCompletionPercentage(resume);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
