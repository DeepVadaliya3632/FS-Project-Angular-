import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface Resume {
    _id: string;
    userId: string;
    title: string;
    thumbnail?: string;
    template?: { theme?: string; colorPalette?: string[] };
    profileInfo?: {
        profilePreviewUrl?: string;
        fullName?: string;
        designation?: string;
        summary?: string;
    };
    contactInfo?: {
        email?: string;
        phone?: string;
        location?: string;
        linkedin?: string;
        github?: string;
        website?: string;
    };
    workExperience?: { company?: string; role?: string; startDate?: string; endDate?: string; description?: string }[];
    education?: { degree?: string; institution?: string; startDate?: string; endDate?: string }[];
    skills?: { name?: string; progress?: number }[];
    projects?: { title?: string; description?: string; github?: string; liveDemo?: string }[];
    certifications?: { title?: string; issuer?: string; year?: string }[];
    languages?: { name?: string; progress?: number }[];
    interests?: string[];
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private readonly API_URL = 'http://localhost:4000/api/resume';

    constructor(private authService: AuthService) { }

    private getHeaders(): Record<string, string> {
        const token = this.authService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async createResume(title: string): Promise<Resume> {
        const res = await fetch(this.API_URL, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ title })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to create resume');
        }

        return data.newResume;
    }

    async getUserResumes(): Promise<Resume[]> {
        const res = await fetch(this.API_URL, {
            headers: this.getHeaders()
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch resumes');
        }

        return data;
    }

    async getResumeById(id: string): Promise<Resume> {
        const res = await fetch(`${this.API_URL}/${id}`, {
            headers: this.getHeaders()
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch resume');
        }

        return data;
    }

    async updateResume(id: string, updates: Partial<Resume>): Promise<Resume> {
        const res = await fetch(`${this.API_URL}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(updates)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to update resume');
        }

        return data;
    }

    async deleteResume(id: string): Promise<void> {
        const res = await fetch(`${this.API_URL}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to delete resume');
        }
    }

    getCompletionPercentage(resume: Resume): number {
        let filled = 0;
        let total = 8;

        if (resume.profileInfo?.fullName) filled++;
        if (resume.contactInfo?.email) filled++;
        if (resume.workExperience && resume.workExperience.some(w => w.company)) filled++;
        if (resume.education && resume.education.some(e => e.degree)) filled++;
        if (resume.skills && resume.skills.some(s => s.name)) filled++;
        if (resume.projects && resume.projects.some(p => p.title)) filled++;
        if (resume.certifications && resume.certifications.some(c => c.title)) filled++;
        if (resume.languages && resume.languages.some(l => l.name)) filled++;

        return Math.round((filled / total) * 100);
    }
}
