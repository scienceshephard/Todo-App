import { Component, AfterViewInit } from '@angular/core';
import { MainContentComponent } from './main-content/main-content.component';
import { FooterComponent } from './footer/footer.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainContentComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const cursor = document.querySelector('.cursor') as HTMLElement;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.04, ease: 'power2' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.04, ease: 'power2' });

    document.addEventListener('mousemove', (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    document.addEventListener('mousedown', () => {
      gsap.to(cursor, { scale: 0.6, duration: 0.06, ease: 'power1.in' });
    });

    document.addEventListener('mouseup', () => {
      gsap.to(cursor, { scale: 1, duration: 0.08, ease: 'power1.out' });
    });
  }
}
