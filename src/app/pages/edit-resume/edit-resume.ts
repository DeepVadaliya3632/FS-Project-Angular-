import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResumeService, Resume } from '../../services/resume.service';

@Component({
  selector: 'app-edit-resume',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-page">
      <!-- Header (same as dashboard) -->
      <header class="dash-header">
        <div class="container dash-header-inner">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#edit_logo)" />
              <path d="M8 12C8 9.79086 9.79086 8 12 8H20C22.2091 8 24 9.79086 24 12V20C24 22.2091 22.2091 24 20 24H12C9.79086 24 8 22.2091 8 20V12Z" stroke="white" stroke-width="2"/>
              <path d="M12 14H20M12 18H17" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <defs>
                <linearGradient id="edit_logo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#a855f7"/>
                  <stop offset="1" stop-color="#ec4899"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="logo-text">SkillSnap</span>
          </div>
          <div class="dash-user-area">
            <div class="user-avatar">{{ userInitial() }}</div>
            <div class="user-info">
              <span class="user-name">{{ userName() }}</span>
              <button class="logout-link" (click)="logout()">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <!-- Title bar -->
      <div class="title-bar">
        <div class="container title-bar-inner">
          <div class="title-left">
            @if (editingTitle()) {
              <input
                type="text"
                class="title-input"
                [(ngModel)]="editTitleValue"
                (keyup.enter)="saveTitle()"
                (keyup.escape)="cancelEditTitle()"
                autofocus />
              <button class="title-action-btn save-title-btn" (click)="saveTitle()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button class="title-action-btn cancel-title-btn" (click)="cancelEditTitle()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            } @else {
              <h2 class="resume-title">{{ resume()?.title }}</h2>
              <button class="edit-title-btn" (click)="startEditTitle()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            }
          </div>
          <div class="title-right">
            <button class="bar-btn theme-btn" (click)="showThemeModal.set(true)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
              </svg>
              Theme
            </button>
            <button class="bar-btn delete-bar-btn" (click)="showDeleteConfirm.set(true)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </button>
            <button class="bar-btn preview-btn" (click)="openPreview()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Preview
            </button>
          </div>
        </div>
      </div>

      <!-- Two-column body -->
      <main class="edit-main">
        <div class="container edit-columns">
          <!-- Left: Form -->
          <div class="form-panel">
            <div class="form-card">
              <!-- Step progress bar -->
              <div class="step-bar">
                @for (step of steps; track step.id) {
                  <div class="step-segment" [class.completed]="currentStep() > step.id" [class.active]="currentStep() === step.id"></div>
                }
              </div>
              <div class="form-content">

                <!-- Step 1: Personal Information -->
                @if (currentStep() === 1) {
                  <h2 class="form-section-title">Personal Information</h2>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Full Name</label>
                      <input type="text" class="form-input" [class.input-error]="showErrors() && !formData.fullName.trim()" placeholder="John Doe"
                        [(ngModel)]="formData.fullName" />
                      @if (showErrors() && !formData.fullName.trim()) {
                        <span class="error-text">This field is required</span>
                      }
                    </div>
                    <div class="form-group">
                      <label class="form-label">Designation</label>
                      <input type="text" class="form-input" [class.input-error]="showErrors() && !formData.designation.trim()" placeholder="Full Stack Developer"
                        [(ngModel)]="formData.designation" />
                      @if (showErrors() && !formData.designation.trim()) {
                        <span class="error-text">This field is required</span>
                      }
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Summary</label>
                    <textarea class="form-textarea" [class.input-error]="showErrors() && !formData.summary.trim()" rows="5" placeholder="Short introduction about yourself"
                      [(ngModel)]="formData.summary"></textarea>
                    @if (showErrors() && !formData.summary.trim()) {
                      <span class="error-text">This field is required</span>
                    }
                  </div>
                }

                <!-- Step 2: Contact Information -->
                @if (currentStep() === 2) {
                  <h2 class="form-section-title">Contact Information</h2>

                  <div class="form-group">
                    <label class="form-label">Address</label>
                    <input type="text" class="form-input" [class.input-error]="showErrors() && !formData.location.trim()" placeholder="Short Address"
                      [(ngModel)]="formData.location" />
                    @if (showErrors() && !formData.location.trim()) {
                      <span class="error-text">This field is required</span>
                    }
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-input" [class.input-error]="showErrors() && !formData.email.trim()" placeholder="john@example.com"
                        [(ngModel)]="formData.email" />
                      @if (showErrors() && !formData.email.trim()) {
                        <span class="error-text">This field is required</span>
                      }
                    </div>
                    <div class="form-group">
                      <label class="form-label">Phone Number</label>
                      <input type="tel" class="form-input" [class.input-error]="showErrors() && !formData.phone.trim()" placeholder="1234567890"
                        [(ngModel)]="formData.phone" />
                      @if (showErrors() && !formData.phone.trim()) {
                        <span class="error-text">This field is required</span>
                      }
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">LinkedIn</label>
                      <input type="url" class="form-input" placeholder="https://linkedin.com/in/username"
                        [(ngModel)]="formData.linkedin" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">GitHub</label>
                      <input type="url" class="form-input" placeholder="https://github.com/username"
                        [(ngModel)]="formData.github" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Portfolio / Website</label>
                    <input type="url" class="form-input" placeholder="https://yourwebsite.com"
                      [(ngModel)]="formData.website" />
                  </div>
                }

                <!-- Step 3: Work Experience -->
                @if (currentStep() === 3) {
                  <h2 class="form-section-title">Work Experience</h2>

                  @for (exp of workExperiences; track $index; let i = $index) {
                    <div class="entry-card">
                      @if (workExperiences.length > 1) {
                        <button class="remove-entry-btn" (click)="removeWorkExperience(i)" title="Remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      }
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Company</label>
                          <input type="text" class="form-input" placeholder="ABC Corp"
                            [(ngModel)]="exp.company" />
                        </div>
                        <div class="form-group">
                          <label class="form-label">Role</label>
                          <input type="text" class="form-input" placeholder="Frontend Developer"
                            [(ngModel)]="exp.role" />
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Start Date</label>
                          <input type="date" class="form-input"
                            [class.input-error]="showErrors() && exp.startDate && exp.endDate && exp.startDate >= exp.endDate"
                            [(ngModel)]="exp.startDate" />
                        </div>
                        <div class="form-group">
                          <label class="form-label">End Date</label>
                          <input type="date" class="form-input"
                            [class.input-error]="showErrors() && exp.startDate && exp.endDate && exp.startDate >= exp.endDate"
                            [(ngModel)]="exp.endDate" />
                          @if (showErrors() && exp.startDate && exp.endDate && exp.startDate >= exp.endDate) {
                            <span class="error-text">End date must be after start date</span>
                          }
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-textarea" rows="4" placeholder="What did you do in this role?"
                          [(ngModel)]="exp.description"></textarea>
                      </div>
                    </div>
                  }

                  <button class="add-entry-btn" (click)="addWorkExperience()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Work Experience
                  </button>
                }

                <!-- Step 4: Education -->
                @if (currentStep() === 4) {
                  <h2 class="form-section-title">Education</h2>

                  @for (edu of educations; track $index; let i = $index) {
                    <div class="entry-card">
                      @if (educations.length > 1) {
                        <button class="remove-entry-btn" (click)="removeEducation(i)" title="Remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      }
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Degree</label>
                          <input type="text" class="form-input" [class.input-error]="showErrors() && !edu.degree.trim()" placeholder="BTech in Computer Science"
                            [(ngModel)]="edu.degree" />
                          @if (showErrors() && !edu.degree.trim()) {
                            <span class="error-text">This field is required</span>
                          }
                        </div>
                        <div class="form-group">
                          <label class="form-label">Institution</label>
                          <input type="text" class="form-input" [class.input-error]="showErrors() && !edu.institution.trim()" placeholder="XYZ University"
                            [(ngModel)]="edu.institution" />
                          @if (showErrors() && !edu.institution.trim()) {
                            <span class="error-text">This field is required</span>
                          }
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Start Date</label>
                          <input type="date" class="form-input"
                            [class.input-error]="showErrors() && (!edu.startDate || (edu.startDate && edu.endDate && edu.startDate >= edu.endDate))"
                            [(ngModel)]="edu.startDate" />
                          @if (showErrors() && !edu.startDate) {
                            <span class="error-text">This field is required</span>
                          }
                        </div>
                        <div class="form-group">
                          <label class="form-label">End Date</label>
                          <input type="date" class="form-input"
                            [class.input-error]="showErrors() && (!edu.endDate || (edu.startDate && edu.endDate && edu.startDate >= edu.endDate))"
                            [(ngModel)]="edu.endDate" />
                          @if (showErrors() && !edu.endDate) {
                            <span class="error-text">This field is required</span>
                          } @else if (showErrors() && edu.startDate && edu.endDate && edu.startDate >= edu.endDate) {
                            <span class="error-text">End date must be after start date</span>
                          }
                        </div>
                      </div>
                    </div>
                  }

                  <button class="add-entry-btn" (click)="addEducation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Education
                  </button>
                }

                <!-- Step 5: Skills -->
                @if (currentStep() === 5) {
                  <h2 class="form-section-title">Skills</h2>

                  @for (skill of skillsList; track $index; let i = $index) {
                    <div class="entry-card">
                      @if (skillsList.length > 1) {
                        <button class="remove-entry-btn" (click)="removeSkill(i)" title="Remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      }
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Skill Name</label>
                          <input type="text" class="form-input" placeholder="JavaScript"
                            [(ngModel)]="skill.name" />
                        </div>
                        <div class="form-group">
                          <label class="form-label">Proficiency ({{ skill.progress }}/5)</label>
                          <div class="proficiency-dots">
                            @for (dot of [1,2,3,4,5]; track dot) {
                              <button class="proficiency-dot" [class.active]="skill.progress >= dot"
                                (click)="skill.progress = dot" type="button"></button>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                  <button class="add-entry-btn" (click)="addSkill()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Skill
                  </button>
                }

                <!-- Step 6: Projects -->
                @if (currentStep() === 6) {
                  <h2 class="form-section-title">Projects</h2>

                  @for (proj of projectsList; track $index; let i = $index) {
                    <div class="entry-card">
                      @if (projectsList.length > 1) {
                        <button class="remove-entry-btn" (click)="removeProject(i)" title="Remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      }

                      <div class="form-group">
                        <label class="form-label">Project Title</label>
                        <input type="text" class="form-input" placeholder="Portfolio Website"
                          [(ngModel)]="proj.title" />
                      </div>

                      <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-textarea" rows="4" placeholder="Short description about the project"
                          [class.input-error]="showErrors() && proj.title.trim() && !proj.description.trim()"
                          [(ngModel)]="proj.description"></textarea>
                        @if (showErrors() && proj.title.trim() && !proj.description.trim()) {
                          <span class="error-text">This field is required</span>
                        }
                      </div>

                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">GitHub Link</label>
                          <input type="url" class="form-input" placeholder="https://github.com/username/project"
                            [class.input-error]="showErrors() && proj.title.trim() && !proj.github.trim()"
                            [(ngModel)]="proj.github" />
                          @if (showErrors() && proj.title.trim() && !proj.github.trim()) {
                            <span class="error-text">This field is required</span>
                          }
                        </div>
                        <div class="form-group">
                          <label class="form-label">Live Demo URL</label>
                          <input type="url" class="form-input" placeholder="https://yourproject.live"
                            [class.input-error]="showErrors() && proj.title.trim() && !proj.liveDemo.trim()"
                            [(ngModel)]="proj.liveDemo" />
                          @if (showErrors() && proj.title.trim() && !proj.liveDemo.trim()) {
                            <span class="error-text">This field is required</span>
                          }
                        </div>
                      </div>
                    </div>
                  }

                  <button class="add-entry-btn" (click)="addProject()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Project
                  </button>
                }

                <!-- Step 7: Certifications -->
                @if (currentStep() === 7) {
                  <h2 class="form-section-title">Certifications</h2>

                  @for (cert of certificationsList; track $index; let i = $index) {
                    <div class="entry-card">
                      @if (certificationsList.length > 1) {
                        <button class="remove-entry-btn" (click)="removeCertification(i)" title="Remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      }
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Certificate Title</label>
                          <input type="text" class="form-input" placeholder="Full Stack Web Developer"
                            [class.input-error]="showErrors() && !cert.title.trim()"
                            [(ngModel)]="cert.title" />
                          @if (showErrors() && !cert.title.trim()) {
                            <span class="error-text">This field is required</span>
                          }
                        </div>
                        <div class="form-group">
                          <label class="form-label">Issuer</label>
                          <input type="text" class="form-input" placeholder="Coursera / Google / etc."
                            [class.input-error]="showErrors() && !cert.issuer.trim()"
                            [(ngModel)]="cert.issuer" />
                          @if (showErrors() && !cert.issuer.trim()) {
                            <span class="error-text">This field is required</span>
                          }
                        </div>
                      </div>

                      <div class="form-group" style="max-width: 50%">
                        <label class="form-label">Year</label>
                        <input type="number" class="form-input" placeholder="2024" min="1900" max="2099" step="1"
                          [class.input-error]="showErrors() && !cert.year"
                          [(ngModel)]="cert.year" />
                        @if (showErrors() && !cert.year) {
                          <span class="error-text">This field is required</span>
                        }
                      </div>
                    </div>
                  }

                  <button class="add-entry-btn" (click)="addCertification()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Certification
                  </button>
                }

                <!-- Step 8: Additional Information -->
                @if (currentStep() === 8) {
                  <h2 class="form-section-title">Additional Information</h2>

                  <!-- Languages -->
                  <h3 class="sub-section-title"><span class="sub-dot purple"></span> Languages</h3>

                  @for (lang of languagesList; track $index; let i = $index) {
                    <div class="entry-card">
                      @if (languagesList.length > 1) {
                        <button class="remove-entry-btn" (click)="removeLanguage(i)" title="Remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      }
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Language</label>
                          <input type="text" class="form-input" placeholder="e.g. English"
                            [class.input-error]="showErrors() && !lang.name.trim()"
                            [(ngModel)]="lang.name" />
                          @if (showErrors() && !lang.name.trim()) {
                            <span class="error-text">This field is required</span>
                          }
                        </div>
                        <div class="form-group">
                          <label class="form-label">Proficiency</label>
                          <div class="proficiency-dots">
                            @for (dot of [1,2,3,4,5]; track dot) {
                              <button class="proficiency-dot" [class.active]="lang.progress >= dot"
                                (click)="lang.progress = dot" type="button"></button>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                  <button class="add-entry-btn" (click)="addLanguage()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Language
                  </button>

                  <!-- Interests -->
                  <h3 class="sub-section-title" style="margin-top: 2rem"><span class="sub-dot orange"></span> Interests</h3>

                  @for (interest of interestsList; track $index; let i = $index) {
                    <div class="interest-row">
                      <input type="text" class="form-input" placeholder="e.g. Reading, Photography"
                        [class.input-error]="showErrors() && !interest.trim()"
                        [(ngModel)]="interestsList[i]" />
                      @if (interestsList.length > 1) {
                        <button class="remove-entry-btn inline" (click)="removeInterest(i)" title="Remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      }
                    </div>
                    @if (showErrors() && !interest.trim()) {
                      <span class="error-text">This field is required</span>
                    }
                  }

                  <button class="add-entry-btn" style="margin-top: 0.75rem" (click)="addInterest()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Interest
                  </button>
                }

              </div>

              <div class="form-actions">
                <button class="action-btn-form back-btn" (click)="goBack()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
                <button class="action-btn-form save-exit-btn" (click)="saveAndExit()" [disabled]="saving()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  {{ saving() ? 'Saving...' : 'Save & Exit' }}
                </button>
                @if (currentStep() < totalSteps) {
                  <button class="action-btn-form next-btn" (click)="goNext()">
                    Next
                  </button>
                } @else {
                  <button class="action-btn-form preview-download-btn" (click)="openPreviewFromForm()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Preview & Download
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Right: Live Preview -->
          <div class="preview-panel" [attr.data-template]="activeTemplate()">
            <div class="preview-card">
              <div class="preview-header">
                <span class="preview-dot"></span>
                <span class="preview-completion">Preview - {{ getCompletion() }}% Complete</span>
              </div>
              <div class="preview-body">
                <!-- Profile -->
                @if (formData.fullName || formData.designation || formData.summary) {
                  <div class="preview-profile-section">
                    @if (formData.fullName) {
                      <h3 class="preview-name">{{ formData.fullName }}</h3>
                    }
                    @if (formData.designation) {
                      <p class="preview-designation">{{ formData.designation }}</p>
                    }
                    @if (formData.summary) {
                      <p class="preview-summary">{{ formData.summary }}</p>
                    }
                  </div>
                }

                <!-- Contact -->
                @if (formData.email || formData.phone || formData.location || formData.linkedin || formData.github || formData.website) {
                  <div class="preview-contact-row">
                    @if (formData.email) {
                      <a class="preview-contact-item" [href]="'mailto:' + formData.email">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        {{ formData.email }}
                      </a>
                    }
                    @if (formData.phone) {
                      <span class="preview-contact-item">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 2.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {{ formData.phone }}
                      </span>
                    }
                    @if (formData.location) {
                      <span class="preview-contact-item">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {{ formData.location }}
                      </span>
                    }
                    @if (formData.linkedin) {
                      <span class="preview-contact-item">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                        {{ formData.linkedin }}
                      </span>
                    }
                    @if (formData.github) {
                      <span class="preview-contact-item">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                        {{ formData.github }}
                      </span>
                    }
                    @if (formData.website) {
                      <span class="preview-contact-item">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        {{ formData.website }}
                      </span>
                    }
                  </div>
                }

                <!-- Work Experience -->
                @if (hasWorkExperience()) {
                  <div class="pv-section">
                    <div class="pv-section-title">WORK EXPERIENCE</div>
                    @for (exp of workExperiences; track $index) {
                      @if (exp.company || exp.role) {
                        <div class="pv-entry">
                          <div class="pv-entry-header">
                            <strong>{{ exp.role || 'Role' }}</strong>
                            <span class="pv-date">{{ exp.startDate }} – {{ exp.endDate || 'Present' }}</span>
                          </div>
                          <div class="pv-subtitle">{{ exp.company }}</div>
                          @if (exp.description) {
                            <p class="pv-desc">{{ exp.description }}</p>
                          }
                        </div>
                      }
                    }
                  </div>
                }

                <!-- Education -->
                @if (hasEducation()) {
                  <div class="pv-section">
                    <div class="pv-section-title">EDUCATION</div>
                    @for (edu of educations; track $index) {
                      @if (edu.degree || edu.institution) {
                        <div class="pv-entry">
                          <div class="pv-entry-header">
                            <strong>{{ edu.degree || 'Degree' }}</strong>
                            <span class="pv-date">{{ edu.startDate }} – {{ edu.endDate || 'Present' }}</span>
                          </div>
                          <div class="pv-subtitle">{{ edu.institution }}</div>
                        </div>
                      }
                    }
                  </div>
                }

                <!-- Skills -->
                @if (hasSkills()) {
                  <div class="pv-section">
                    <div class="pv-section-title">SKILLS</div>
                    <div class="pv-skills-grid">
                      @for (skill of skillsList; track $index) {
                        @if (skill.name) {
                          <div class="pv-skill-item">
                            <span class="pv-skill-name">{{ skill.name }}</span>
                            <div class="pv-skill-bar">
                              <div class="pv-skill-fill" [style.width.%]="skill.progress * 20"></div>
                            </div>
                          </div>
                        }
                      }
                    </div>
                  </div>
                }

                <!-- Projects -->
                @if (hasProjects()) {
                  <div class="pv-section">
                    <div class="pv-section-title">PROJECTS</div>
                    @for (proj of projectsList; track $index) {
                      @if (proj.title) {
                        <div class="pv-entry">
                          <strong>{{ proj.title }}</strong>
                          @if (proj.description) {
                            <p class="pv-desc">{{ proj.description }}</p>
                          }
                          <div class="pv-links">
                            @if (proj.github) {
                              <a class="pv-link" [href]="proj.github" target="_blank">GitHub</a>
                            }
                            @if (proj.liveDemo) {
                              <a class="pv-link" [href]="proj.liveDemo" target="_blank">Live Demo</a>
                            }
                          </div>
                        </div>
                      }
                    }
                  </div>
                }

                <!-- Certifications -->
                @if (hasCertifications()) {
                  <div class="pv-section">
                    <div class="pv-section-title">CERTIFICATIONS</div>
                    @for (cert of certificationsList; track $index) {
                      @if (cert.title) {
                        <div class="pv-entry">
                          <div class="pv-entry-header">
                            <strong>{{ cert.title }}</strong>
                            <span class="pv-date">{{ cert.year }}</span>
                          </div>
                          <div class="pv-subtitle">{{ cert.issuer }}</div>
                        </div>
                      }
                    }
                  </div>
                }

                <!-- Languages -->
                @if (hasLanguages()) {
                  <div class="pv-section">
                    <div class="pv-section-title">LANGUAGES</div>
                    <div class="pv-skills-grid">
                      @for (lang of languagesList; track $index) {
                        @if (lang.name) {
                          <div class="pv-skill-item">
                            <span class="pv-skill-name">{{ lang.name }}</span>
                            <div class="pv-skill-bar">
                              <div class="pv-skill-fill lang" [style.width.%]="lang.progress * 20"></div>
                            </div>
                          </div>
                        }
                      }
                    </div>
                  </div>
                }

                <!-- Interests -->
                @if (hasInterests()) {
                  <div class="pv-section">
                    <div class="pv-section-title">INTERESTS</div>
                    <div class="pv-tags">
                      @for (interest of interestsList; track $index) {
                        @if (interest.trim()) {
                          <span class="pv-tag">{{ interest }}</span>
                        }
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Theme Modal -->
      @if (showThemeModal()) {
        <div class="theme-overlay" (click)="showThemeModal.set(false)">
          <div class="theme-modal" (click)="$event.stopPropagation()">
            <div class="theme-header">
              <button class="theme-tab-btn" (click)="showThemeModal.set(false)">Templates</button>
              <button class="theme-apply-btn" (click)="applyTemplate()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Apply Changes
              </button>
            </div>
            <div class="theme-body">
              <div class="theme-list">
                @for (tpl of templates; track tpl.id) {
                  <div class="theme-thumb" [class.selected]="previewTemplate() === tpl.id" (click)="previewTemplate.set(tpl.id)">
                    <div class="thumb-preview" [attr.data-template]="tpl.id">
                      <div class="thumb-name">{{ tpl.name }}</div>
                    </div>
                    @if (previewTemplate() === tpl.id) {
                      <div class="thumb-check">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    }
                  </div>
                }
              </div>
              <div class="theme-preview-area">
                <div class="theme-full-preview" [attr.data-template]="previewTemplate()">
                  <div class="tfp-header">
                    <h2 class="tfp-name">{{ formData.fullName || 'Alex Johnson' }}</h2>
                    <p class="tfp-designation">{{ formData.designation || 'Senior Software Developer' }}</p>
                    <div class="tfp-contact">
                      @if (formData.phone || !formData.fullName) { <span>{{ formData.phone || '+1 (555) 123-4567' }}</span> }
                      @if (formData.email || !formData.fullName) { <span>{{ formData.email || 'alex@gmail.com' }}</span> }
                      @if (formData.location || !formData.fullName) { <span>{{ formData.location || 'San Francisco, CA' }}</span> }
                    </div>
                  </div>
                  @if (formData.summary || !formData.fullName) {
                    <div class="tfp-section">
                      <div class="tfp-section-title">SUMMARY</div>
                      <p class="tfp-text">{{ formData.summary || 'Full stack developer with 5+ years of experience building scalable web applications using modern JavaScript frameworks.' }}</p>
                    </div>
                  }
                  @if (hasWorkExperience() || !formData.fullName) {
                    <div class="tfp-section">
                      <div class="tfp-section-title">EXPERIENCE</div>
                      @if (hasWorkExperience()) {
                        @for (exp of workExperiences; track $index) {
                          @if (exp.company || exp.role) {
                            <div class="tfp-entry">
                              <div class="tfp-entry-row"><strong>{{ exp.role }}</strong><span>{{ exp.startDate }} - {{ exp.endDate || 'Present' }}</span></div>
                              <div class="tfp-entry-sub">{{ exp.company }}</div>
                              @if (exp.description) { <p class="tfp-text">{{ exp.description }}</p> }
                            </div>
                          }
                        }
                      } @else {
                        <div class="tfp-entry">
                          <div class="tfp-entry-row"><strong>Senior Software Engineer</strong><span>Jan 2020 - Dec 2023</span></div>
                          <div class="tfp-entry-sub">TechSolutions Inc.</div>
                          <p class="tfp-text">Led a team of 5 developers in building a SaaS platform serving 50,000+ users.</p>
                        </div>
                      }
                    </div>
                  }
                  @if (hasProjects() || !formData.fullName) {
                    <div class="tfp-section">
                      <div class="tfp-section-title">PROJECTS</div>
                      @if (hasProjects()) {
                        @for (proj of projectsList; track $index) {
                          @if (proj.title) {
                            <div class="tfp-entry">
                              <strong>{{ proj.title }}</strong>
                              @if (proj.description) { <p class="tfp-text">{{ proj.description }}</p> }
                            </div>
                          }
                        }
                      } @else {
                        <div class="tfp-entry"><strong>E-commerce Analytics Dashboard</strong><p class="tfp-text">Built a real-time analytics dashboard for e-commerce clients.</p></div>
                      }
                    </div>
                  }
                  @if (hasEducation() || !formData.fullName) {
                    <div class="tfp-section">
                      <div class="tfp-section-title">EDUCATION</div>
                      @if (hasEducation()) {
                        @for (edu of educations; track $index) {
                          @if (edu.degree || edu.institution) {
                            <div class="tfp-entry">
                              <div class="tfp-entry-row"><strong>{{ edu.degree }}</strong><span>{{ edu.startDate }} - {{ edu.endDate }}</span></div>
                              <div class="tfp-entry-sub">{{ edu.institution }}</div>
                            </div>
                          }
                        }
                      } @else {
                        <div class="tfp-entry"><div class="tfp-entry-row"><strong>Master of Science</strong></div><div class="tfp-entry-sub">Stanford University</div></div>
                      }
                    </div>
                  }
                  @if (hasSkills() || !formData.fullName) {
                    <div class="tfp-section">
                      <div class="tfp-section-title">SKILLS</div>
                      <div class="tfp-skills-wrap">
                        @if (hasSkills()) {
                          @for (s of skillsList; track $index) { @if (s.name) { <span class="tfp-skill-tag">{{ s.name }}</span> } }
                        } @else {
                          <span class="tfp-skill-tag">JavaScript</span><span class="tfp-skill-tag">TypeScript</span><span class="tfp-skill-tag">React</span><span class="tfp-skill-tag">Node.js</span><span class="tfp-skill-tag">Python</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirmation Modal -->
      @if (showDeleteConfirm()) {
        <div class="theme-overlay" (click)="showDeleteConfirm.set(false)">
          <div class="delete-modal" (click)="$event.stopPropagation()">
            <div class="delete-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            <h3 class="delete-title">Delete Resume</h3>
            <p class="delete-msg">Are you sure you want to delete <strong>"{{ resume()?.title }}"</strong>? This action cannot be undone.</p>
            <div class="delete-actions">
              <button class="delete-cancel-btn" (click)="showDeleteConfirm.set(false)">Cancel</button>
              <button class="delete-confirm-btn" (click)="executeDelete()" [disabled]="deleting()">
                {{ deleting() ? 'Deleting...' : 'Delete Permanently' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Preview Modal -->
      @if (showPreviewModal()) {
        <div class="prev-overlay">
          <div class="prev-modal">
            <div class="prev-top-bar">
              <h3 class="prev-resume-title">{{ resume()?.title }}</h3>
              <div class="prev-top-actions">
                <button class="prev-download-btn" (click)="downloadPDF()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download PDF
                </button>
                <button class="prev-close-btn" (click)="showPreviewModal.set(false)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div class="prev-completion-bar">
              <span class="prev-completion-badge">● Completion: {{ getCompletion() }}%</span>
            </div>
            <div class="prev-page-wrapper">
              <div class="prev-page" id="resume-pdf-content" [attr.data-template]="activeTemplate()">
                <!-- Header -->
                <div class="prev-page-header">
                  <h1 class="prev-page-name">{{ formData.fullName || 'Your Name' }}</h1>
                  <p class="prev-page-desig">{{ formData.designation || 'Your Designation' }}</p>
                </div>

                @if (formData.summary) {
                  <p class="prev-page-summary">{{ formData.summary }}</p>
                }

                <div class="prev-page-body">
                  <!-- Left Column -->
                  <div class="prev-col-left">
                    @if (formData.location || formData.phone || formData.email || formData.linkedin || formData.github || formData.website) {
                      <div class="prev-sec">
                        <div class="prev-sec-title">CONTACT</div>
                        <div class="prev-contact-list">
                          @if (formData.location) { <div class="prev-contact-row"><span class="prev-cl">Location:</span><span>{{ formData.location }}</span></div> }
                          @if (formData.phone) { <div class="prev-contact-row"><span class="prev-cl">Phone:</span><span>{{ formData.phone }}</span></div> }
                          @if (formData.email) { <div class="prev-contact-row"><span class="prev-cl">Email:</span><a [href]="'mailto:' + formData.email">{{ formData.email }}</a></div> }
                          @if (formData.linkedin) { <div class="prev-contact-row"><span class="prev-cl">LinkedIn:</span><a [href]="formData.linkedin" target="_blank">{{ formData.linkedin }}</a></div> }
                          @if (formData.github) { <div class="prev-contact-row"><span class="prev-cl">GitHub:</span><a [href]="formData.github" target="_blank">{{ formData.github }}</a></div> }
                          @if (formData.website) { <div class="prev-contact-row"><span class="prev-cl">Portfolio:</span><a [href]="formData.website" target="_blank">{{ formData.website }}</a></div> }
                        </div>
                      </div>
                    }
                    @if (hasSkills()) {
                      <div class="prev-sec">
                        <div class="prev-sec-title">SKILLS</div>
                        <div class="prev-skill-list">
                          @for (s of skillsList; track $index) { @if (s.name) { <span>{{ s.name }}</span> } }
                        </div>
                      </div>
                    }
                    @if (hasEducation()) {
                      <div class="prev-sec">
                        <div class="prev-sec-title">EDUCATION</div>
                        @for (edu of educations; track $index) {
                          @if (edu.degree || edu.institution) {
                            <div class="prev-edu-entry">
                              <strong>{{ edu.degree }}</strong>
                              <div class="prev-sub">{{ edu.institution }}</div>
                            </div>
                          }
                        }
                      </div>
                    }
                    @if (hasCertifications()) {
                      <div class="prev-sec">
                        <div class="prev-sec-title">CERTIFICATIONS</div>
                        @for (c of certificationsList; track $index) {
                          @if (c.title) { <div class="prev-cert">{{ c.title }} ({{ c.year }})</div> }
                        }
                      </div>
                    }
                    @if (hasLanguages()) {
                      <div class="prev-sec">
                        <div class="prev-sec-title">LANGUAGES</div>
                        @for (l of languagesList; track $index) { @if (l.name) { <span>{{ l.name }}</span> } }
                      </div>
                    }
                    @if (hasInterests()) {
                      <div class="prev-sec">
                        <div class="prev-sec-title">INTERESTS</div>
                        <ul class="prev-interest-list">
                          @for (i of interestsList; track $index) { @if (i.trim()) { <li>{{ i }}</li> } }
                        </ul>
                      </div>
                    }
                  </div>

                  <!-- Right Column -->
                  <div class="prev-col-right">
                    @if (hasWorkExperience()) {
                      <div class="prev-sec">
                        <div class="prev-sec-title">WORK EXPERIENCE</div>
                        @for (exp of workExperiences; track $index) {
                          @if (exp.company || exp.role) {
                            <div class="prev-work-entry">
                              <div class="prev-work-row"><strong>{{ exp.role }}</strong><em>{{ exp.startDate }} – {{ exp.endDate || 'Present' }}</em></div>
                              <div class="prev-sub">{{ exp.company }}</div>
                              @if (exp.description) {
                                <ul class="prev-desc-list"><li>{{ exp.description }}</li></ul>
                              }
                            </div>
                          }
                        }
                      </div>
                    }
                    @if (hasProjects()) {
                      <div class="prev-sec">
                        <div class="prev-sec-title">PROJECTS</div>
                        @for (p of projectsList; track $index) {
                          @if (p.title) {
                            <div class="prev-work-entry">
                              <strong>{{ p.title }}</strong>
                              @if (p.description) { <div class="prev-proj-desc">{{ p.description }}</div> }
                              <div class="prev-proj-links">
                                @if (p.github) { <a [href]="p.github" target="_blank">GitHub</a> }
                                @if (p.liveDemo) { <a [href]="p.liveDemo" target="_blank">Live Demo</a> }
                              </div>
                            </div>
                          }
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .edit-page {
      min-height: 100vh;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
    }

    /* Header */
    .dash-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding: 0.85rem 0;
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
      gap: 0.75rem;
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

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .logout-link {
      background: none;
      border: none;
      padding: 0;
      font-size: 0.7rem;
      color: var(--primary-purple);
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
    }

    .logout-link:hover {
      text-decoration: underline;
      transform: none;
      box-shadow: none;
    }

    /* Title bar */
    .title-bar {
      background: white;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      padding: 0.75rem 0;
    }

    .title-bar-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .resume-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .edit-title-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-purple);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .edit-title-btn:hover {
      background: rgba(168, 85, 247, 0.15);
      transform: none;
      box-shadow: none;
    }

    .title-input {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-dark);
      border: 2px solid var(--primary-purple);
      border-radius: 10px;
      padding: 0.4rem 0.75rem;
      outline: none;
      background: white;
      font-family: inherit;
      min-width: 200px;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
    }

    .title-action-btn {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .title-action-btn:hover {
      transform: none;
      box-shadow: none;
    }

    .save-title-btn {
      background: #22c55e;
      color: white;
    }

    .save-title-btn:hover {
      background: #16a34a;
    }

    .cancel-title-btn {
      background: #f1f5f9;
      color: #64748b;
    }

    .cancel-title-btn:hover {
      background: #e2e8f0;
    }

    .title-right {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .bar-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1.5px solid;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      background: white;
    }

    .bar-btn:hover {
      transform: translateY(-1px);
    }

    .theme-btn {
      color: var(--primary-purple);
      border-color: var(--primary-purple);
      background: rgba(168, 85, 247, 0.06);
    }

    .theme-btn:hover {
      background: rgba(168, 85, 247, 0.06);
      box-shadow: 0 2px 8px rgba(168, 85, 247, 0.15);
    }

    .delete-bar-btn {
      color: #ef4444;
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.06);
    }

    .delete-bar-btn:hover {
      background: rgba(239, 68, 68, 0.06);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
    }

    .preview-btn {
      color: #16a34a;
      border-color: #16a34a;
      background: rgba(22, 163, 74, 0.06);
    }

    .preview-btn:hover {
      background: rgba(22, 163, 74, 0.12);
      box-shadow: 0 2px 8px rgba(22, 163, 74, 0.15);
    }

    /* Main content area */
    .edit-main {
      padding: 1.5rem 0;
      flex: 1;
      display: flex;
    }

    .edit-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      align-items: stretch;
      flex: 1;
    }

    /* Form panel */
    .form-panel {
      min-width: 0;
      display: flex;
    }

    .form-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .step-bar {
      display: flex;
      gap: 3px;
      padding: 0;
    }

    .step-segment {
      flex: 1;
      height: 5px;
      background: #e2e8f0;
      transition: background 0.3s ease;
    }

    .step-segment:first-child {
      border-radius: 0;
    }

    .step-segment:last-child {
      border-radius: 0;
    }

    .step-segment.active {
      background: linear-gradient(90deg, #a855f7, #ec4899);
    }

    .step-segment.completed {
      background: linear-gradient(90deg, #a855f7, #ec4899);
    }

    .form-content {
      padding: 1.75rem 2rem;
      flex: 1;
    }

    .form-section-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-row .form-group {
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 0.45rem;
    }

    .form-input {
      width: 100%;
      padding: 0.65rem 0.9rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.85rem;
      font-family: inherit;
      color: var(--text-dark);
      background: #fafbfc;
      transition: all 0.2s ease;
      outline: none;
      box-sizing: border-box;
    }

    .form-input:focus {
      border-color: var(--primary-purple);
      background: white;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.08);
    }

    .form-input.input-error,
    .form-textarea.input-error {
      border-color: #ef4444;
    }

    .form-input.input-error:focus,
    .form-textarea.input-error:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
    }

    .error-text {
      display: block;
      font-size: 0.72rem;
      color: #ef4444;
      font-weight: 600;
      margin-top: 0.3rem;
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: #94a3b8;
    }

    .form-textarea {
      width: 100%;
      padding: 0.65rem 0.9rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.85rem;
      font-family: inherit;
      color: var(--text-dark);
      background: #fafbfc;
      transition: all 0.2s ease;
      outline: none;
      resize: vertical;
      min-height: 100px;
      box-sizing: border-box;
    }

    .form-textarea:focus {
      border-color: var(--primary-purple);
      background: white;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.08);
    }

    /* Form action buttons */
    .form-actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .action-btn-form {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 1.25rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      border: 1.5px solid;
    }

    .action-btn-form:hover {
      transform: translateY(-1px);
    }

    .back-btn {
      background: white;
      border-color: #e2e8f0;
      color: var(--text-muted);
    }

    .back-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    }

    .save-exit-btn {
      background: rgba(168, 85, 247, 0.06);
      border-color: var(--primary-purple);
      color: var(--primary-purple);
    }

    .save-exit-btn:hover:not(:disabled) {
      background: rgba(168, 85, 247, 0.12);
      box-shadow: 0 2px 8px rgba(168, 85, 247, 0.15);
    }

    .save-exit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .next-btn {
      background: var(--primary-gradient);
      border-color: transparent;
      color: white;
      padding: 0.55rem 1.75rem;
      box-shadow: 0 2px 8px rgba(168, 85, 247, 0.25);
    }

    .next-btn:hover {
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.35);
      filter: brightness(1.05);
    }

    /* Preview panel */
    .preview-panel {
      min-width: 0;
      display: flex;
    }

    .preview-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.05);
      flex: 1;
    }

    .preview-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
    }

    .preview-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #22c55e;
    }

    .preview-completion {
      font-size: 0.85rem;
      font-weight: 600;
      color: #22c55e;
    }

    .preview-body {
      padding: 0 1.5rem 1.5rem;
    }

    .preview-profile-section {
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .preview-name {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 0.2rem;
    }

    .preview-designation {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--primary-purple);
      margin-bottom: 0.5rem;
    }

    .preview-summary {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .preview-contact-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.65rem;
      padding-top: 0.65rem;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    }

    .preview-contact-item {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.7rem;
      color: var(--text-muted);
      text-decoration: none;
    }

    a.preview-contact-item:hover {
      color: var(--primary-purple);
    }

    .preview-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .preview-col {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .preview-section-label {
      font-size: 0.7rem;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.05em;
      padding-bottom: 0.35rem;
    }

    .preview-section-label.filled {
      color: var(--text-dark);
      border-bottom-color: var(--primary-purple);
    }

    @media (max-width: 900px) {
      .edit-columns {
        grid-template-columns: 1fr;
      }
      .preview-panel {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .title-bar-inner {
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
      }
      .title-right {
        width: 100%;
        justify-content: flex-start;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    /* Repeatable entry card */
    .entry-card {
      position: relative;
      background: #fafbfc;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1rem;
    }

    .remove-entry-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 1px solid #fecaca;
      background: #fef2f2;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .remove-entry-btn:hover {
      background: #fee2e2;
      transform: none;
      box-shadow: none;
    }

    .add-entry-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.5rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      border: 2px dashed #22c55e;
      background: rgba(34, 197, 94, 0.04);
      color: #16a34a;
    }

    .add-entry-btn:hover {
      background: rgba(34, 197, 94, 0.1);
      transform: none;
      box-shadow: none;
    }

    /* Proficiency dots */
    .proficiency-dots {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      padding-top: 0.5rem;
    }

    .proficiency-dot {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      border: 2px solid #cbd5e1;
      background: #f1f5f9;
      cursor: pointer;
      transition: all 0.15s ease;
      padding: 0;
    }

    .proficiency-dot:hover {
      border-color: var(--primary-purple);
      transform: none;
      box-shadow: none;
    }

    .proficiency-dot.active {
      background: linear-gradient(135deg, var(--primary-purple), var(--primary-pink));
      border-color: var(--primary-purple);
    }

    /* Sub-section titles */
    .sub-section-title {
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .sub-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }

    .sub-dot.purple { background: var(--primary-purple); }
    .sub-dot.orange { background: #f97316; }

    /* Interest row */
    .interest-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .interest-row .form-input {
      flex: 1;
    }

    .remove-entry-btn.inline {
      position: static;
      flex-shrink: 0;
    }

    /* Preview & Download button */
    .preview-download-btn {
      background: linear-gradient(135deg, var(--primary-purple), var(--primary-pink)) !important;
      color: #fff !important;
      border: none !important;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .preview-download-btn:hover {
      transform: none !important;
      box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3) !important;
    }

    /* ===== Live Preview Styles ===== */
    .preview-profile-section {
      text-align: center;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 0.75rem;
    }

    .preview-name {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 2px;
    }

    .preview-designation {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--primary-purple);
      margin: 0 0 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .preview-summary {
      font-size: 0.62rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0;
    }

    .preview-contact-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 0.75rem;
      justify-content: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 0.5rem;
    }

    .preview-contact-item {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 0.58rem;
      color: #475569;
      text-decoration: none;
    }

    .preview-contact-item:hover { color: var(--primary-purple); }
    .preview-contact-item svg { flex-shrink: 0; }

    .preview-body {
      padding: 0.75rem;
      overflow-y: auto;
      max-height: calc(100vh - 320px);
      scrollbar-width: thin;
    }

    .pv-section {
      margin-bottom: 0.65rem;
    }

    .pv-section-title {
      font-size: 0.6rem;
      font-weight: 800;
      color: var(--primary-purple);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding-bottom: 3px;
      border-bottom: 2px solid var(--primary-purple);
      margin-bottom: 0.4rem;
    }

    .pv-entry {
      margin-bottom: 0.45rem;
      padding-left: 0.5rem;
      border-left: 2px solid #e2e8f0;
    }

    .pv-entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.5rem;
    }

    .pv-entry-header strong {
      font-size: 0.62rem;
      color: #1e293b;
    }

    .pv-date {
      font-size: 0.55rem;
      color: #94a3b8;
      white-space: nowrap;
    }

    .pv-subtitle {
      font-size: 0.58rem;
      color: #64748b;
      font-style: italic;
    }

    .pv-desc {
      font-size: 0.55rem;
      color: #64748b;
      line-height: 1.45;
      margin: 2px 0 0;
    }

    .pv-skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.3rem 0.75rem;
    }

    .pv-skill-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .pv-skill-name {
      font-size: 0.58rem;
      color: #334155;
      white-space: nowrap;
      min-width: 50px;
    }

    .pv-skill-bar {
      flex: 1;
      height: 5px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .pv-skill-fill {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, var(--primary-purple), var(--primary-pink));
      transition: width 0.3s ease;
    }

    .pv-skill-fill.lang {
      background: linear-gradient(90deg, #3b82f6, #06b6d4);
    }

    .pv-links {
      display: flex;
      gap: 0.5rem;
      margin-top: 2px;
    }

    .pv-link {
      font-size: 0.52rem;
      color: var(--primary-purple);
      text-decoration: none;
      font-weight: 600;
    }

    .pv-link:hover { text-decoration: underline; }

    .pv-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .pv-tag {
      font-size: 0.52rem;
      padding: 2px 8px;
      border-radius: 10px;
      background: rgba(168, 85, 247, 0.08);
      color: var(--primary-purple);
      font-weight: 600;
    }

    /* ===== Theme Modal ===== */
    .theme-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }

    .theme-modal {
      background: white;
      border-radius: 20px;
      width: 90vw;
      max-width: 1100px;
      height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.25s ease;
    }

    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; } to { transform: none; opacity: 1; }
    }

    .theme-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .theme-tab-btn {
      padding: 0.5rem 1.25rem;
      border-radius: 25px;
      border: 2px solid var(--primary-pink);
      background: rgba(236, 72, 153, 0.06);
      color: var(--primary-pink);
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      font-family: inherit;
    }

    .theme-apply-btn {
      padding: 0.55rem 1.5rem;
      border-radius: 25px;
      border: none;
      background: var(--primary-gradient);
      color: white;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: inherit;
      transition: transform 0.15s ease;
    }

    .theme-apply-btn:hover {
      transform: scale(1.03);
    }

    .theme-body {
      display: grid;
      grid-template-columns: 260px 1fr;
      flex: 1;
      overflow: hidden;
    }

    .theme-list {
      padding: 1.25rem;
      overflow-y: auto;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .theme-thumb {
      position: relative;
      cursor: pointer;
      border-radius: 12px;
      overflow: hidden;
      border: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .theme-thumb:hover {
      border-color: #e2e8f0;
    }

    .theme-thumb.selected {
      border-color: var(--primary-purple);
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2);
    }

    .thumb-preview {
      aspect-ratio: 3 / 4;
      border-radius: 8px;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .thumb-preview[data-template="classic"] {
      background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    }
    .thumb-preview[data-template="modern"] {
      background: linear-gradient(135deg, #1e293b 0%, #334155 40%, #f1f5f9 40%, #f8fafc 100%);
    }
    .thumb-preview[data-template="creative"] {
      background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f3e8ff 100%);
    }

    .thumb-name {
      font-size: 0.7rem;
      font-weight: 700;
      color: #334155;
      text-align: center;
      background: rgba(255,255,255,0.85);
      border-radius: 6px;
      padding: 4px 8px;
    }

    .thumb-check {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--primary-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .theme-preview-area {
      padding: 1.5rem;
      overflow-y: auto;
      background: #f1f5f9;
    }

    .theme-full-preview {
      background: white;
      border-radius: 8px;
      padding: 2rem 2.5rem;
      min-height: 100%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* Full preview common */
    .tfp-header { text-align: center; margin-bottom: 1rem; }
    .tfp-name { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin: 0; }
    .tfp-designation { font-size: 0.85rem; color: #64748b; margin: 4px 0 8px; }
    .tfp-contact { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; font-size: 0.75rem; color: #475569; }
    .tfp-section { margin-bottom: 1rem; }
    .tfp-section-title { font-size: 0.85rem; font-weight: 800; color: #1e293b; letter-spacing: 0.05em; border-bottom: 2px solid #1e293b; padding-bottom: 3px; margin-bottom: 0.5rem; }
    .tfp-entry { margin-bottom: 0.5rem; }
    .tfp-entry-row { display: flex; justify-content: space-between; align-items: baseline; }
    .tfp-entry-row strong { font-size: 0.8rem; color: #1e293b; }
    .tfp-entry-row span { font-size: 0.7rem; color: #94a3b8; }
    .tfp-entry-sub { font-size: 0.72rem; color: #64748b; font-style: italic; }
    .tfp-text { font-size: 0.72rem; color: #475569; line-height: 1.5; margin: 3px 0 0; }
    .tfp-skills-wrap { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .tfp-skill-tag { font-size: 0.7rem; padding: 2px 10px; border-radius: 4px; background: #f1f5f9; color: #334155; }

    /* Template Classic */
    .theme-full-preview[data-template="classic"] .tfp-section-title { border-bottom-color: #1e293b; color: #1e293b; }

    /* Template Modern */
    .theme-full-preview[data-template="modern"] .tfp-header { background: #1e293b; color: white; margin: -2rem -2.5rem 1rem; padding: 1.5rem 2.5rem; }
    .theme-full-preview[data-template="modern"] .tfp-name { color: white; }
    .theme-full-preview[data-template="modern"] .tfp-designation { color: #94a3b8; }
    .theme-full-preview[data-template="modern"] .tfp-contact { color: #cbd5e1; }
    .theme-full-preview[data-template="modern"] .tfp-section-title { color: #1e293b; border-bottom-color: #3b82f6; }
    .theme-full-preview[data-template="modern"] .tfp-skill-tag { background: #dbeafe; color: #1e40af; }

    /* Template Creative */
    .theme-full-preview[data-template="creative"] .tfp-header { background: linear-gradient(135deg, #a855f7, #ec4899); color: white; margin: -2rem -2.5rem 1rem; padding: 1.5rem 2.5rem; border-radius: 0 0 20px 20px; }
    .theme-full-preview[data-template="creative"] .tfp-name { color: white; }
    .theme-full-preview[data-template="creative"] .tfp-designation { color: rgba(255,255,255,0.8); }
    .theme-full-preview[data-template="creative"] .tfp-contact { color: rgba(255,255,255,0.7); }
    .theme-full-preview[data-template="creative"] .tfp-section-title { color: var(--primary-purple); border-bottom-color: var(--primary-purple); }
    .theme-full-preview[data-template="creative"] .tfp-skill-tag { background: rgba(168, 85, 247, 0.1); color: var(--primary-purple); border-radius: 20px; }

    /* Live preview template variants */
    .preview-panel[data-template="modern"] .preview-profile-section {
      background: #1e293b;
      margin: -0.75rem -0.75rem 0.75rem;
      padding: 0.75rem;
      border-radius: 8px 8px 0 0;
    }
    .preview-panel[data-template="modern"] .preview-name { color: white; }
    .preview-panel[data-template="modern"] .preview-designation { color: #94a3b8; }
    .preview-panel[data-template="modern"] .preview-summary { color: #cbd5e1; }
    .preview-panel[data-template="modern"] .pv-section-title { color: #3b82f6; border-bottom-color: #3b82f6; }
    .preview-panel[data-template="modern"] .pv-skill-fill { background: linear-gradient(90deg, #3b82f6, #2563eb); }
    .preview-panel[data-template="modern"] .pv-tag { background: #dbeafe; color: #1e40af; }
    .preview-panel[data-template="modern"] .pv-entry { border-left-color: #3b82f6; }

    .preview-panel[data-template="creative"] .preview-profile-section {
      background: linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.08));
      margin: -0.75rem -0.75rem 0.75rem;
      padding: 0.75rem;
      border-radius: 8px 8px 0 0;
      border-bottom-color: var(--primary-purple);
    }
    .preview-panel[data-template="creative"] .pv-section-title { color: var(--primary-purple); border-bottom-color: var(--primary-pink); }
    .preview-panel[data-template="creative"] .pv-entry { border-left-color: var(--primary-pink); }
    .preview-panel[data-template="creative"] .pv-skill-fill { background: linear-gradient(90deg, #ec4899, #a855f7); }
    .preview-panel[data-template="creative"] .pv-tag { background: rgba(236, 72, 153, 0.1); color: var(--primary-pink); }
    .preview-panel[data-template="creative"] .pv-skill-fill.lang { background: linear-gradient(90deg, #a855f7, #6366f1); }

    /* ===== Delete Modal ===== */
    .delete-modal {
      background: white;
      border-radius: 20px;
      padding: 2rem 2.5rem;
      max-width: 420px;
      width: 90%;
      text-align: center;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.25s ease;
    }

    .delete-icon-wrap {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .delete-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 0.5rem;
    }

    .delete-msg {
      font-size: 0.85rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0 0 1.5rem;
    }

    .delete-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .delete-cancel-btn {
      padding: 0.55rem 1.5rem;
      border-radius: 10px;
      border: 1.5px solid #e2e8f0;
      background: white;
      color: #64748b;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .delete-cancel-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .delete-confirm-btn {
      padding: 0.55rem 1.5rem;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .delete-confirm-btn:hover:not(:disabled) {
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }

    .delete-confirm-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* ===== Preview Modal ===== */
    .prev-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(5px);
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }

    .prev-modal {
      background: #f1f5f9;
      border-radius: 20px;
      width: 95vw;
      max-width: 900px;
      height: 92vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
      animation: slideUp 0.25s ease;
    }

    .prev-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.5rem;
      background: white;
      border-bottom: 1px solid #e2e8f0;
    }

    .prev-resume-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0;
    }

    .prev-top-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .prev-download-btn {
      padding: 0.55rem 1.5rem;
      border-radius: 12px;
      border: none;
      background: var(--primary-gradient);
      color: white;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: inherit;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .prev-download-btn:hover {
      transform: scale(1.03);
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
    }

    .prev-close-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1.5px solid #e2e8f0;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      transition: all 0.15s ease;
    }

    .prev-close-btn:hover {
      background: #f8fafc;
      color: #1e293b;
    }

    .prev-completion-bar {
      text-align: center;
      padding: 0.5rem;
      background: linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.08));
    }

    .prev-completion-badge {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--primary-purple);
      background: rgba(168, 85, 247, 0.12);
      padding: 4px 16px;
      border-radius: 20px;
    }

    .prev-page-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      justify-content: center;
    }

    .prev-page {
      background: white;
      border-radius: 8px;
      padding: 2rem 2.5rem;
      width: 100%;
      max-width: 820px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    .prev-page-header {
      text-align: center;
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #1e293b;
    }

    .prev-page-name {
      font-size: 2rem;
      font-weight: 900;
      color: #1e293b;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .prev-page-desig {
      font-size: 0.95rem;
      color: #64748b;
      margin: 4px 0 0;
    }

    .prev-page-summary {
      font-size: 0.82rem;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 1rem;
    }

    .prev-page-body {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 1.5rem;
    }

    .prev-sec { margin-bottom: 1rem; }

    .prev-sec-title {
      font-size: 0.85rem;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: 0.06em;
      border-bottom: 2px solid #1e293b;
      padding-bottom: 4px;
      margin-bottom: 0.5rem;
    }

    .prev-contact-list { display: flex; flex-direction: column; gap: 0.3rem; }
    .prev-contact-row { display: flex; gap: 0.5rem; font-size: 0.78rem; }
    .prev-cl { font-weight: 600; color: #64748b; min-width: 70px; }
    .prev-contact-row a { color: #3b82f6; text-decoration: none; }
    .prev-contact-row a:hover { text-decoration: underline; }

    .prev-skill-list { display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.8rem; color: #334155; }
    .prev-edu-entry { margin-bottom: 0.4rem; }
    .prev-edu-entry strong { font-size: 0.82rem; color: #1e293b; }
    .prev-sub { font-size: 0.75rem; color: #64748b; font-style: italic; }
    .prev-cert { font-size: 0.8rem; color: #334155; margin-bottom: 0.25rem; }

    .prev-work-entry { margin-bottom: 0.6rem; }
    .prev-work-row { display: flex; justify-content: space-between; align-items: baseline; }
    .prev-work-row strong { font-size: 0.85rem; color: #1e293b; }
    .prev-work-row em { font-size: 0.72rem; color: #94a3b8; font-style: italic; }
    .prev-desc-list { margin: 4px 0 0 1rem; padding: 0; font-size: 0.78rem; color: #475569; line-height: 1.5; }
    .prev-proj-desc { font-size: 0.78rem; color: #475569; margin-top: 2px; }
    .prev-proj-links { display: flex; gap: 0.75rem; margin-top: 3px; }
    .prev-proj-links a { font-size: 0.72rem; color: #3b82f6; text-decoration: none; font-weight: 600; }
    .prev-proj-links a:hover { text-decoration: underline; }
    .prev-interest-list { margin: 0; padding-left: 1.2rem; font-size: 0.78rem; color: #334155; }

    /* Preview modal template variants */
    .prev-page[data-template="modern"] .prev-page-header { background: #1e293b; color: white; margin: -2rem -2.5rem 1rem; padding: 1.5rem 2.5rem; border-bottom: none; }
    .prev-page[data-template="modern"] .prev-page-name { color: white; }
    .prev-page[data-template="modern"] .prev-page-desig { color: #94a3b8; }
    .prev-page[data-template="modern"] .prev-sec-title { color: #1e293b; border-bottom-color: #3b82f6; }
    .prev-page[data-template="modern"] .prev-contact-row a { color: #2563eb; }

    .prev-page[data-template="creative"] .prev-page-header { background: linear-gradient(135deg, #a855f7, #ec4899); color: white; margin: -2rem -2.5rem 1rem; padding: 1.5rem 2.5rem; border-bottom: none; border-radius: 0 0 20px 20px; }
    .prev-page[data-template="creative"] .prev-page-name { color: white; }
    .prev-page[data-template="creative"] .prev-page-desig { color: rgba(255,255,255,0.8); }
    .prev-page[data-template="creative"] .prev-sec-title { color: var(--primary-purple); border-bottom-color: var(--primary-purple); }
    .prev-page[data-template="creative"] .prev-contact-row a { color: var(--primary-purple); }
  `],
})
export class EditResume implements OnInit {
  userName = signal('');
  userInitial = signal('');
  resume = signal<Resume | null>(null);
  editingTitle = signal(false);
  editTitleValue = '';
  saving = signal(false);
  currentStep = signal(1);
  showErrors = signal(false);
  showThemeModal = signal(false);
  previewTemplate = signal('classic');
  activeTemplate = signal('classic');
  showDeleteConfirm = signal(false);
  deleting = signal(false);
  showPreviewModal = signal(false);
  totalSteps = 8;

  templates = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'creative', name: 'Creative' }
  ];

  steps = [
    { id: 1, label: 'Personal Information' },
    { id: 2, label: 'Contact Information' },
    { id: 3, label: 'Work Experience' },
    { id: 4, label: 'Education' },
    { id: 5, label: 'Skills' },
    { id: 6, label: 'Projects' },
    { id: 7, label: 'Certifications' },
    { id: 8, label: 'Additional Info' }
  ];

  formData = {
    fullName: '',
    designation: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  };

  workExperiences: { company: string; role: string; startDate: string; endDate: string; description: string }[] = [
    { company: '', role: '', startDate: '', endDate: '', description: '' }
  ];

  educations: { degree: string; institution: string; startDate: string; endDate: string }[] = [
    { degree: '', institution: '', startDate: '', endDate: '' }
  ];

  skillsList: { name: string; progress: number }[] = [
    { name: '', progress: 0 }
  ];

  projectsList: { title: string; description: string; github: string; liveDemo: string }[] = [
    { title: '', description: '', github: '', liveDemo: '' }
  ];

  certificationsList: { title: string; issuer: string; year: string }[] = [
    { title: '', issuer: '', year: '' }
  ];

  languagesList: { name: string; progress: number }[] = [
    { name: '', progress: 0 }
  ];

  interestsList: string[] = [''];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private resumeService: ResumeService
  ) { }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.userName.set(user.name);
      this.userInitial.set(user.name.charAt(0).toUpperCase());
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadResume(id);
    }
  }

  async loadResume(id: string) {
    try {
      const data = await this.resumeService.getResumeById(id);
      this.resume.set(data);
      // Populate form with existing data
      if (data.profileInfo) {
        this.formData.fullName = data.profileInfo.fullName || '';
        this.formData.designation = data.profileInfo.designation || '';
        this.formData.summary = data.profileInfo.summary || '';
      }
      if (data.contactInfo) {
        this.formData.email = data.contactInfo.email || '';
        this.formData.phone = data.contactInfo.phone || '';
        this.formData.location = data.contactInfo.location || '';
        this.formData.linkedin = data.contactInfo.linkedin || '';
        this.formData.github = data.contactInfo.github || '';
        this.formData.website = data.contactInfo.website || '';
      }
      if (data.workExperience && data.workExperience.length > 0) {
        this.workExperiences = data.workExperience.map((exp: any) => ({
          company: exp.company || '',
          role: exp.role || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || ''
        }));
      }
      if (data.education && data.education.length > 0) {
        this.educations = data.education.map((edu: any) => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || ''
        }));
      }
      if (data.skills && data.skills.length > 0) {
        this.skillsList = data.skills.map((s: any) => ({
          name: s.name || '',
          progress: s.progress || 0
        }));
      }
      if (data.projects && data.projects.length > 0) {
        this.projectsList = data.projects.map((p: any) => ({
          title: p.title || '',
          description: p.description || '',
          github: p.github || '',
          liveDemo: p.liveDemo || ''
        }));
      }
      if (data.certifications && data.certifications.length > 0) {
        this.certificationsList = data.certifications.map((c: any) => ({
          title: c.title || '',
          issuer: c.issuer || '',
          year: c.year || ''
        }));
      }
      if (data.languages && data.languages.length > 0) {
        this.languagesList = data.languages.map((l: any) => ({
          name: l.name || '',
          progress: l.progress || 0
        }));
      }
      if (data.interests && data.interests.length > 0) {
        this.interestsList = data.interests.map((i: any) => i || '');
      }
    } catch (err) {
      console.error('Failed to load resume:', err);
      this.router.navigate(['/dashboard']);
    }
  }

  startEditTitle() {
    this.editTitleValue = this.resume()?.title || '';
    this.editingTitle.set(true);
  }

  cancelEditTitle() {
    this.editingTitle.set(false);
  }

  async saveTitle() {
    const r = this.resume();
    if (!r || !this.editTitleValue.trim()) return;

    try {
      await this.resumeService.updateResume(r._id, { title: this.editTitleValue.trim() });
      this.resume.set({ ...r, title: this.editTitleValue.trim() });
      this.editingTitle.set(false);
    } catch (err) {
      console.error('Failed to update title:', err);
    }
  }

  goBack() {
    this.showErrors.set(false);
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  goNext() {
    if (this.currentStep() === 1) {
      if (!this.formData.fullName.trim() || !this.formData.designation.trim() || !this.formData.summary.trim()) {
        this.showErrors.set(true);
        return;
      }
      this.showErrors.set(false);
    }
    if (this.currentStep() === 2) {
      if (!this.formData.location.trim() || !this.formData.email.trim() || !this.formData.phone.trim()) {
        this.showErrors.set(true);
        return;
      }
      this.showErrors.set(false);
    }
    if (this.currentStep() === 3) {
      const hasDateError = this.workExperiences.some(exp => exp.startDate && exp.endDate && exp.startDate >= exp.endDate);
      if (hasDateError) {
        this.showErrors.set(true);
        return;
      }
      this.showErrors.set(false);
    }
    if (this.currentStep() === 4) {
      const hasEmpty = this.educations.some(edu => !edu.degree.trim() || !edu.institution.trim() || !edu.startDate || !edu.endDate);
      const hasDateError = this.educations.some(edu => edu.startDate && edu.endDate && edu.startDate >= edu.endDate);
      if (hasEmpty || hasDateError) {
        this.showErrors.set(true);
        return;
      }
      this.showErrors.set(false);
    }
    if (this.currentStep() === 6) {
      const hasIncomplete = this.projectsList.some(p =>
        p.title.trim() && (!p.description.trim() || !p.github.trim() || !p.liveDemo.trim())
      );
      if (hasIncomplete) {
        this.showErrors.set(true);
        return;
      }
      this.showErrors.set(false);
    }
    if (this.currentStep() === 7) {
      const hasEmpty = this.certificationsList.some(c => !c.title.trim() || !c.issuer.trim() || !c.year);
      if (hasEmpty) {
        this.showErrors.set(true);
        return;
      }
      this.showErrors.set(false);
    }
    if (this.currentStep() === 8) {
      const hasEmptyLang = this.languagesList.some(l => !l.name.trim());
      const hasEmptyInterest = this.interestsList.some(i => !i.trim());
      if (hasEmptyLang || hasEmptyInterest) {
        this.showErrors.set(true);
        return;
      }
      this.showErrors.set(false);
    }
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  addWorkExperience() {
    this.workExperiences = [...this.workExperiences, { company: '', role: '', startDate: '', endDate: '', description: '' }];
  }

  removeWorkExperience(index: number) {
    this.workExperiences = this.workExperiences.filter((_, i) => i !== index);
  }

  addEducation() {
    this.educations = [...this.educations, { degree: '', institution: '', startDate: '', endDate: '' }];
  }

  removeEducation(index: number) {
    this.educations = this.educations.filter((_, i) => i !== index);
  }

  addSkill() {
    this.skillsList = [...this.skillsList, { name: '', progress: 0 }];
  }

  removeSkill(index: number) {
    this.skillsList = this.skillsList.filter((_, i) => i !== index);
  }

  addProject() {
    this.projectsList = [...this.projectsList, { title: '', description: '', github: '', liveDemo: '' }];
  }

  removeProject(index: number) {
    this.projectsList = this.projectsList.filter((_, i) => i !== index);
  }

  addCertification() {
    this.certificationsList = [...this.certificationsList, { title: '', issuer: '', year: '' }];
  }

  removeCertification(index: number) {
    this.certificationsList = this.certificationsList.filter((_, i) => i !== index);
  }

  addLanguage() {
    this.languagesList = [...this.languagesList, { name: '', progress: 0 }];
  }

  removeLanguage(index: number) {
    this.languagesList = this.languagesList.filter((_, i) => i !== index);
  }

  addInterest() {
    this.interestsList = [...this.interestsList, ''];
  }

  removeInterest(index: number) {
    this.interestsList = this.interestsList.filter((_, i) => i !== index);
  }

  private buildUpdatePayload(): Partial<Resume> {
    return {
      profileInfo: {
        fullName: this.formData.fullName,
        designation: this.formData.designation,
        summary: this.formData.summary
      },
      contactInfo: {
        email: this.formData.email,
        phone: this.formData.phone,
        location: this.formData.location,
        linkedin: this.formData.linkedin,
        github: this.formData.github,
        website: this.formData.website
      },
      workExperience: this.workExperiences.filter(exp => exp.company || exp.role),
      education: this.educations.filter(edu => edu.degree || edu.institution),
      skills: this.skillsList.filter(s => s.name),
      projects: this.projectsList.filter(p => p.title),
      certifications: this.certificationsList.filter(c => c.title),
      languages: this.languagesList.filter(l => l.name),
      interests: this.interestsList.filter(i => i.trim())
    } as Partial<Resume>;
  }

  async saveAndExit() {
    const r = this.resume();
    if (!r) return;

    this.saving.set(true);
    try {
      await this.resumeService.updateResume(r._id, this.buildUpdatePayload());
      this.router.navigate(['/dashboard'], { queryParams: { saved: 'true' } });
    } catch (err) {
      console.error('Failed to save resume:', err);
    } finally {
      this.saving.set(false);
    }
  }

  hasWorkExperience(): boolean {
    return this.workExperiences.some(e => e.company || e.role);
  }

  hasEducation(): boolean {
    return this.educations.some(e => e.degree || e.institution);
  }

  hasSkills(): boolean {
    return this.skillsList.some(s => s.name);
  }

  hasProjects(): boolean {
    return this.projectsList.some(p => p.title);
  }

  hasCertifications(): boolean {
    return this.certificationsList.some(c => c.title);
  }

  hasLanguages(): boolean {
    return this.languagesList.some(l => l.name);
  }

  hasInterests(): boolean {
    return this.interestsList.some(i => i.trim());
  }

  getCompletion(): number {
    let filled = 0;
    const total = 8;

    if (this.formData.fullName?.trim()) filled++;
    if (this.formData.email?.trim()) filled++;
    if (this.workExperiences.some(w => w.company?.trim())) filled++;
    if (this.educations.some(e => e.degree?.trim())) filled++;
    if (this.skillsList.some(s => s.name?.trim())) filled++;
    if (this.projectsList.some(p => p.title?.trim())) filled++;
    if (this.certificationsList.some(c => c.title?.trim())) filled++;
    if (this.languagesList.some(l => l.name?.trim())) filled++;

    return Math.round((filled / total) * 100);
  }

  applyTemplate() {
    this.activeTemplate.set(this.previewTemplate());
    this.showThemeModal.set(false);
  }

  async executeDelete() {
    const r = this.resume();
    if (!r) return;
    this.deleting.set(true);
    try {
      await this.resumeService.deleteResume(r._id);
      this.showDeleteConfirm.set(false);
      this.router.navigate(['/dashboard']);
    } catch (err) {
      console.error('Failed to delete resume:', err);
    } finally {
      this.deleting.set(false);
    }
  }

  openPreview() {
    this.showPreviewModal.set(true);
  }

  openPreviewFromForm() {
    if (this.currentStep() === 8) {
      const hasEmptyLang = this.languagesList.some(l => !l.name.trim());
      const hasEmptyInterest = this.interestsList.some(i => !i.trim());
      if (hasEmptyLang || hasEmptyInterest) {
        this.showErrors.set(true);
        return;
      }
    }
    this.showPreviewModal.set(true);
  }

  async downloadPDF() {
    const element = document.getElementById('resume-pdf-content');
    if (!element) return;

    // Dynamically load html2pdf.js from CDN
    if (!(window as any).html2pdf) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load html2pdf'));
        document.head.appendChild(script);
      });
    }

    const html2pdf = (window as any).html2pdf;
    const opt = {
      margin: 0,
      filename: (this.resume()?.title || 'resume') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };
    html2pdf().set(opt).from(element).save();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
