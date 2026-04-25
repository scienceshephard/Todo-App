import {
  Component, AfterViewInit, OnDestroy,
  ElementRef, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';

export interface TodoItem {
  title: string;
  content: string;
  completed: boolean;
  completing: boolean;
}

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements AfterViewInit, OnDestroy {

  List: TodoItem[] = [];
  newListTitle = '';
  newListContent = '';
  sheetOpen = false;
  displayCount = 0;
  today = this.formatDate();

  @ViewChild('header') headerRef!: ElementRef;
  @ViewChild('hero') heroRef!: ElementRef;
  @ViewChild('heroCounter') heroCounterRef!: ElementRef;
  @ViewChild('heroSub') heroSubRef!: ElementRef;
  @ViewChild('bottomBar') bottomBarRef!: ElementRef;
  @ViewChild('sheet') sheetRef!: ElementRef;
  @ViewChild('overlay') overlayRef!: ElementRef;
  @ViewChild('barPlus') barPlusRef!: ElementRef;
  @ViewChild('barLabel') barLabelRef!: ElementRef;
  @ViewChild('titleInput') titleInputRef!: ElementRef;
  @ViewChildren('activeRow') activeRowRefs!: QueryList<ElementRef>;
  @ViewChildren('dividerLine') dividerLineRefs!: QueryList<ElementRef>;

  private heartbeatTween: gsap.core.Tween | null = null;

  get activeTasks(): TodoItem[] {
    return this.List.filter(t => !t.completed);
  }

  get completedTasks(): TodoItem[] {
    return this.List.filter(t => t.completed);
  }

  get activeCount(): number {
    return this.activeTasks.length;
  }

  get completedCount(): number {
    return this.completedTasks.length;
  }

  addList(): void {
    if (!this.newListTitle.trim()) return;
    this.List.push({
      title: this.newListTitle.trim(),
      content: this.newListContent.trim(),
      completed: false,
      completing: false
    });
    this.newListTitle = '';
    this.newListContent = '';
    this.closeSheet();
    this.animateCounter(this.activeCount);
    setTimeout(() => this.animateNewRow(), 50);
  }

  deleteList(activeIndex: number): void {
    const task = this.activeTasks[activeIndex];
    const listIndex = this.List.indexOf(task);
    if (listIndex === -1) return;
    const rowEl = this.activeRowRefs.toArray()[activeIndex]?.nativeElement;
    if (rowEl) {
      gsap.to(rowEl, {
        height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0,
        duration: 0.28, ease: 'power2.in',
        onComplete: () => {
          this.List.splice(listIndex, 1);
          this.animateCounter(this.activeCount);
        }
      });
    } else {
      this.List.splice(listIndex, 1);
      this.animateCounter(this.activeCount);
    }
  }

  completeTask(activeIndex: number): void {
    const task = this.activeTasks[activeIndex];
    if (!task || task.completing) return;
    const listIndex = this.List.indexOf(task);
    task.completing = true;
    const rowEl = this.activeRowRefs.toArray()[activeIndex]?.nativeElement;
    if (rowEl) {
      rowEl.classList.add('completing');
    }
    setTimeout(() => {
      this.List[listIndex].completed = true;
      this.List[listIndex].completing = false;
      this.animateCounter(this.activeCount);
    }, 700);
  }

  toggleSheet(): void {
    this.sheetOpen ? this.closeSheet() : this.openSheet();
  }

  openSheet(): void {
    this.sheetOpen = true;
    const sheet = this.sheetRef.nativeElement;
    const overlay = this.overlayRef.nativeElement;
    gsap.set(sheet, { y: '100%', display: 'flex' });
    gsap.set(overlay, { opacity: 0, display: 'block' });
    gsap.to(sheet, { y: 0, duration: 0.35, ease: 'power3.out' });
    gsap.to(overlay, { opacity: 1, duration: 0.3 });
    gsap.to(this.barPlusRef.nativeElement, { rotation: 45, duration: 0.2, ease: 'power2.inOut' });
    this.barLabelRef.nativeElement.textContent = 'Close';
    setTimeout(() => this.titleInputRef?.nativeElement.focus(), 360);
  }

  closeSheet(): void {
    if (!this.sheetOpen) return;
    this.sheetOpen = false;
    const sheet = this.sheetRef.nativeElement;
    const overlay = this.overlayRef.nativeElement;
    gsap.to(sheet, {
      y: '100%', duration: 0.3, ease: 'power2.in',
      onComplete: () => gsap.set(sheet, { display: 'none' })
    });
    gsap.to(overlay, {
      opacity: 0, duration: 0.25,
      onComplete: () => gsap.set(overlay, { display: 'none' })
    });
    gsap.to(this.barPlusRef.nativeElement, { rotation: 0, duration: 0.2, ease: 'power2.inOut' });
    this.barLabelRef.nativeElement.textContent = 'New Task';
  }

  ngAfterViewInit(): void {
    this.runPageLoadTimeline();
    this.startHeartbeat();
  }

  ngOnDestroy(): void {
    this.heartbeatTween?.kill();
  }

  runPageLoadTimeline(): void {
    if (!this.headerRef) return;
    const header = this.headerRef.nativeElement;
    const hero = this.heroRef.nativeElement;
    const heroSub = this.heroSubRef.nativeElement;
    const bottomBar = this.bottomBarRef.nativeElement;
    const divLines = this.dividerLineRefs.toArray().map(r => r.nativeElement);
    const rows = this.activeRowRefs.toArray().map(r => r.nativeElement);

    gsap.set(header, { y: -80, opacity: 0 });
    gsap.set(hero, { opacity: 0 });
    gsap.set(heroSub, { y: 8, opacity: 0 });
    gsap.set(bottomBar, { y: 80, opacity: 0 });
    if (divLines.length) gsap.set(divLines, { scaleX: 0, transformOrigin: 'center' });
    if (rows.length) gsap.set(rows, { y: 20, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(header, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
      .to(divLines, { scaleX: 1, duration: 0.3, ease: 'power2.out', stagger: 0.05 }, 0.15)
      .to(hero, { opacity: 1, duration: 0.25 }, 0.3)
      .to(heroSub, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }, 0.4)
      .add(() => this.animateCounter(this.activeCount, 0.7), 0.4)
      .to(rows, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', stagger: 0.08 }, 0.5)
      .to(bottomBar, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }, 0.9);
  }

  animateCounter(to: number, duration = 0.4): void {
    const obj = { val: this.displayCount };
    gsap.to(obj, {
      val: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => { this.displayCount = Math.round(obj.val); }
    });
  }

  private animateNewRow(): void {
    const rows = this.activeRowRefs.toArray();
    if (!rows.length) return;
    const newRow = rows[rows.length - 1].nativeElement;
    gsap.fromTo(newRow,
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }
    );
  }

  private startHeartbeat(): void {
    if (!this.heroCounterRef) return;
    this.heartbeatTween = gsap.to(this.heroCounterRef.nativeElement, {
      scale: 1.012, duration: 0.4, ease: 'power1.inOut',
      yoyo: true, repeat: 1,
      repeatDelay: 4,
      delay: 4
    });
    this.heartbeatTween.then(() => this.startHeartbeat());
  }

  private formatDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  }
}
