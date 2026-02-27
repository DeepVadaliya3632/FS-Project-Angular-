import { Injectable, signal } from '@angular/core';

export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:4000/api/auth';
    currentUser = signal<AuthUser | null>(this.loadUser());

    private loadUser(): AuthUser | null {
        const data = localStorage.getItem('skillsnap_user');
        return data ? JSON.parse(data) : null;
    }

    private saveUser(user: AuthUser): void {
        localStorage.setItem('skillsnap_user', JSON.stringify(user));
        this.currentUser.set(user);
    }

    async register(name: string, email: string, password: string): Promise<AuthUser> {
        const res = await fetch(`${this.API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        this.saveUser(data);
        return data;
    }

    async login(email: string, password: string): Promise<AuthUser> {
        const res = await fetch(`${this.API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Login failed');
        }

        this.saveUser(data);
        return data;
    }

    async getProfile(): Promise<any> {
        const user = this.currentUser();
        if (!user) throw new Error('Not authenticated');

        const res = await fetch(`${this.API_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch profile');
        }

        return data;
    }

    getToken(): string | null {
        return this.currentUser()?.token || null;
    }

    isLoggedIn(): boolean {
        return !!this.currentUser();
    }

    logout(): void {
        localStorage.removeItem('skillsnap_user');
        this.currentUser.set(null);
    }
}
