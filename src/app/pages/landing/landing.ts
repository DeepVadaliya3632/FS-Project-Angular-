import { Component, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { Hero } from '../../components/hero/hero';
import { Features } from '../../components/features/features';
import { Cta } from '../../components/cta/cta';
import { Footer } from '../../components/footer/footer';
import { AuthModal } from '../../components/auth-modal/auth-modal';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [Header, Hero, Features, Cta, Footer, AuthModal],
    template: `
    <app-header (getStartedClick)="openModal()"></app-header>
    <main>
      <app-hero (startBuildingClick)="openModal()"></app-hero>
      <app-features></app-features>
      <app-cta (startBuildingNowClick)="openModal()"></app-cta>
    </main>
    <app-footer></app-footer>

    <app-auth-modal
      [isOpen]="showAuthModal()"
      (closed)="closeModal()"
      (loggedIn)="onLoggedIn()">
    </app-auth-modal>
  `,
    styles: [],
})
export class LandingPage {
    showAuthModal = signal(false);

    constructor(private router: Router) { }

    openModal() {
        this.showAuthModal.set(true);
    }

    closeModal() {
        this.showAuthModal.set(false);
    }

    onLoggedIn() {
        this.showAuthModal.set(false);
        this.router.navigate(['/dashboard']);
    }
}
