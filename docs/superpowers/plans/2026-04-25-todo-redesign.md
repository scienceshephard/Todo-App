# Todo App UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Angular 17 Todo App into a Bold Editorial, pure-monochrome, GSAP-animated portfolio piece with cinematic page-load sequences and snappy micro-interactions.

**Architecture:** All three existing components are rewritten in-place (templates + CSS). A new `TodoItem` interface replaces `Array<any>`. GSAP is installed via npm and called in `ngAfterViewInit` hooks. Custom cursor lives in `AppComponent`. All animation logic stays in the component class — no animation services.

**Tech Stack:** Angular 17 standalone, GSAP 3, Google Fonts (Playfair Display + Inter), pure CSS micro-interactions, Jasmine/Karma for unit tests.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `package.json` | Modify | Add GSAP dependency |
| `src/index.html` | Modify | Add Google Fonts `<link>` tags |
| `src/styles.css` | Modify | Global reset, cursor div, CSS custom properties |
| `src/app/app.component.html` | Modify | Add `.cursor` div |
| `src/app/app.component.ts` | Modify | GSAP cursor follower in `ngAfterViewInit` |
| `src/app/app.component.css` | Modify | Cursor styles, flex layout |
| `src/app/main-content/main-content.component.ts` | Modify | `TodoItem` interface, getters, `completeTask()`, GSAP timeline methods |
| `src/app/main-content/main-content.component.html` | Modify | Full editorial layout: header, hero, task list, sheet, bottom bar |
| `src/app/main-content/main-content.component.css` | Modify | Full design system CSS |
| `src/app/main-content/main-content.component.spec.ts` | Modify | Unit tests for data logic |
| `src/app/footer/footer.component.html` | Modify | Updated copyright text |
| `src/app/footer/footer.component.css` | Modify | Footer styling |

---

## Task 1: Install GSAP

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install GSAP via npm**

```bash
cd "/home/shephard/Desktop/Work/Web Apps/Todo-App"
npm install gsap
```

Expected output: `added N packages` with no errors. GSAP ships its own TypeScript types — no `@types/gsap` needed.

- [ ] **Step 2: Verify GSAP is in dependencies**

```bash
grep '"gsap"' package.json
```

Expected: `"gsap": "^3.x.x"` appears under `dependencies`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install gsap for animation system"
```

---

## Task 2: Google Fonts + Global Reset

**Files:**
- Modify: `src/index.html`
- Modify: `src/styles.css`

- [ ] **Step 1: Add Google Fonts to index.html**

Replace the entire contents of `src/index.html` with:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Shephard · Tasks</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,900;1,400;1,900&display=swap" rel="stylesheet">
</head>
<body>
  <div class="cursor"></div>
  <app-root></app-root>
</body>
</html>
```

- [ ] **Step 2: Replace src/styles.css with global reset and CSS properties**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --black: #111111;
  --white: #ffffff;
  --gray-1: #666666;
  --gray-2: #999999;
  --gray-3: #bbbbbb;
  --gray-4: #dddddd;
  --gray-5: #eeeeee;
  --gray-6: #f4f4f4;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-ui: 'Inter', -apple-system, sans-serif;
}

html, body {
  height: 100%;
}

body {
  font-family: var(--font-ui);
  background: var(--white);
  color: var(--black);
  -webkit-font-smoothing: antialiased;
  cursor: none;
}

.cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  background: var(--black);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: none;
}

button, a {
  cursor: none;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/index.html src/styles.css
git commit -m "feat: add google fonts and global design reset"
```

---

## Task 3: Custom Cursor (AppComponent)

**Files:**
- Modify: `src/app/app.component.html`
- Modify: `src/app/app.component.ts`
- Modify: `src/app/app.component.css`

- [ ] **Step 1: Update app.component.html**

```html
<app-main-content></app-main-content>
<app-footer></app-footer>
```

(No change needed — cursor div is in `index.html` body, outside `app-root`.)

- [ ] **Step 2: Replace app.component.ts**

```typescript
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
```

- [ ] **Step 3: Replace app.component.css**

```css
:host {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

app-main-content {
  flex: 1;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/app.component.ts src/app/app.component.html src/app/app.component.css
git commit -m "feat: add custom gsap cursor follower"
```

---

## Task 4: TodoItem Data Model & Component Logic

**Files:**
- Modify: `src/app/main-content/main-content.component.ts`
- Modify: `src/app/main-content/main-content.component.spec.ts`

- [ ] **Step 1: Write failing unit tests first**

Replace `src/app/main-content/main-content.component.spec.ts` with:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainContentComponent } from './main-content.component';
import { FormsModule } from '@angular/forms';

describe('MainContentComponent', () => {
  let component: MainContentComponent;
  let fixture: ComponentFixture<MainContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addList() should add a task with completed false', () => {
    component.newListTitle = 'Buy milk';
    component.newListContent = 'From the corner shop';
    component.addList();
    expect(component.List.length).toBe(1);
    expect(component.List[0].completed).toBeFalse();
    expect(component.List[0].title).toBe('Buy milk');
  });

  it('addList() should not add a task with empty title', () => {
    component.newListTitle = '';
    component.addList();
    expect(component.List.length).toBe(0);
  });

  it('activeTasks getter should return only incomplete tasks', () => {
    component.List = [
      { title: 'A', content: '', completed: false, completing: false },
      { title: 'B', content: '', completed: true, completing: false }
    ];
    expect(component.activeTasks.length).toBe(1);
    expect(component.activeTasks[0].title).toBe('A');
  });

  it('completedTasks getter should return only completed tasks', () => {
    component.List = [
      { title: 'A', content: '', completed: false, completing: false },
      { title: 'B', content: '', completed: true, completing: false }
    ];
    expect(component.completedTasks.length).toBe(1);
    expect(component.completedTasks[0].title).toBe('B');
  });

  it('deleteList() should remove the task at the given active index', () => {
    component.List = [
      { title: 'A', content: '', completed: false, completing: false },
      { title: 'B', content: '', completed: false, completing: false }
    ];
    component.deleteList(0);
    expect(component.List.length).toBe(1);
    expect(component.List[0].title).toBe('B');
  });

  it('completeTask() should mark the active task at given index as completed', () => {
    component.List = [
      { title: 'A', content: '', completed: false, completing: false },
      { title: 'B', content: '', completed: false, completing: false }
    ];
    component.completeTask(0);
    expect(component.List[0].completed).toBeTrue();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd "/home/shephard/Desktop/Work/Web Apps/Todo-App"
npx ng test --watch=false --browsers=ChromeHeadless 2>&1 | tail -20
```

Expected: Several failures — `completeTask`, `activeTasks`, `completedTasks`, `addList` empty check all missing.

- [ ] **Step 3: Replace main-content.component.ts with the new model and logic**

```typescript
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
  private rowsSubscription: any;

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
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd "/home/shephard/Desktop/Work/Web Apps/Todo-App"
npx ng test --watch=false --browsers=ChromeHeadless 2>&1 | tail -20
```

Expected: All tests pass. (GSAP calls inside `ngAfterViewInit` are safe because `ViewChild` refs aren't available yet in unit test without `fixture.detectChanges()` called after.)

- [ ] **Step 5: Commit**

```bash
git add src/app/main-content/main-content.component.ts src/app/main-content/main-content.component.spec.ts
git commit -m "feat: add TodoItem model, completeTask, activeTasks/completedTasks getters"
```

---

## Task 5: Main Content HTML Template

**Files:**
- Modify: `src/app/main-content/main-content.component.html`

- [ ] **Step 1: Replace the entire template**

```html
<!-- HEADER -->
<header class="header" #header>
  <div class="header-inner">
    <div class="logo"><em>Tasks</em></div>
    <div class="header-date">{{ today }}</div>
  </div>
</header>

<!-- HERO -->
<section class="hero" #hero>
  <div class="hero-inner">
    <div class="hero-eyebrow">Today's Focus</div>
    <div class="hero-counter" #heroCounter>{{ displayCount.toString().padStart(2, '0') }}</div>
    <div class="hero-sub" #heroSub>
      {{ activeCount }} task{{ activeCount !== 1 ? 's' : '' }} remaining
      @if (completedCount > 0) {
        · {{ completedCount }} completed
      }
    </div>
  </div>
</section>

<!-- TASK LIST -->
<main class="task-list">

  <!-- ACTIVE DIVIDER -->
  <div class="divider">
    <div class="divider-line" #dividerLine></div>
    <span class="divider-label"><em>Active</em></span>
    <div class="divider-line" #dividerLine></div>
  </div>

  <!-- EMPTY STATE -->
  @if (activeTasks.length === 0) {
    <div class="empty-state">
      <span>Nothing here — add a task below</span>
    </div>
  }

  <!-- ACTIVE ROWS -->
  @for (task of activeTasks; track task; let i = $index) {
    <div class="task-row" #activeRow [class.completing]="task.completing">
      <span class="task-num">{{ (i + 1).toString().padStart(2, '0') }}</span>
      <div class="task-body" (click)="completeTask(i)">
        <div class="task-title">
          {{ task.title || 'Untitled' }}
          <span class="strikethrough"></span>
        </div>
        @if (task.content) {
          <div class="task-note">{{ task.content }}</div>
        }
      </div>
      <div class="task-meta-group">
        <button class="task-delete" (click)="$event.stopPropagation(); deleteList(i)">×</button>
      </div>
    </div>
  }

  <!-- DONE SECTION -->
  @if (completedTasks.length > 0) {
    <div class="divider">
      <div class="divider-line" #dividerLine></div>
      <span class="divider-label"><em>Done</em></span>
      <div class="divider-line" #dividerLine></div>
    </div>

    @for (task of completedTasks; track task) {
      <div class="task-row task-row--done">
        <span class="task-num">—</span>
        <div class="task-body">
          <div class="task-title task-title--done">{{ task.title || 'Untitled' }}</div>
          @if (task.content) {
            <div class="task-note task-note--done">{{ task.content }}</div>
          }
        </div>
      </div>
    }
  }

</main>

<!-- OVERLAY -->
<div class="overlay" #overlay (click)="closeSheet()"></div>

<!-- ADD TASK SHEET -->
<div class="sheet" #sheet>
  <button class="sheet-close" (click)="closeSheet()">×</button>
  <input
    #titleInput
    type="text"
    class="sheet-title-input"
    [(ngModel)]="newListTitle"
    placeholder="Task title…"
    (keydown.enter)="addList()"
  >
  <input
    type="text"
    class="sheet-note-input"
    [(ngModel)]="newListContent"
    placeholder="Add a note…"
    (keydown.enter)="addList()"
  >
  <button class="sheet-add-btn" (click)="addList()">Add Task</button>
</div>

<!-- BOTTOM ACTION BAR -->
<div class="bottom-bar" #bottomBar (click)="toggleSheet()">
  <span class="bottom-bar-label" #barLabel>New Task</span>
  <span class="bottom-bar-plus" #barPlus>+</span>
</div>
```

- [ ] **Step 2: Serve the app and confirm it renders without console errors**

```bash
cd "/home/shephard/Desktop/Work/Web Apps/Todo-App"
npx ng serve --open
```

The page will look unstyled at this point — that is expected. Check browser console for zero errors. Stop the server with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/app/main-content/main-content.component.html
git commit -m "feat: rewrite main-content template with editorial layout"
```

---

## Task 6: Main Content CSS

**Files:**
- Modify: `src/app/main-content/main-content.component.css`

- [ ] **Step 1: Replace the entire CSS file**

```css
/* ── HOST ── */
:host {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
  padding-bottom: 72px;
}

/* ── HEADER ── */
.header {
  background: var(--black);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 3px solid var(--white);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 40px;
}

.logo {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 900;
  font-style: italic;
  color: var(--white);
  letter-spacing: -0.03em;
}

.logo em {
  font-style: italic;
}

.header-date {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
}

/* ── HERO ── */
.hero {
  border-bottom: 1px solid var(--gray-5);
}

.hero-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px 40px 22px;
}

.hero-eyebrow {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray-2);
  margin-bottom: 8px;
}

.hero-counter {
  font-family: var(--font-display);
  font-size: 72px;
  font-weight: 900;
  color: var(--black);
  line-height: 1;
  letter-spacing: -0.04em;
}

.hero-sub {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-3);
  margin-top: 8px;
}

/* ── TASK LIST ── */
.task-list {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
  flex: 1;
}

/* ── DIVIDERS ── */
.divider {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 0 12px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--gray-5);
  transform-origin: center;
}

.divider-label {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 12px;
  color: var(--gray-3);
  white-space: nowrap;
}

/* ── EMPTY STATE ── */
.empty-state {
  padding: 32px 0;
  text-align: center;
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--gray-3);
  font-style: italic;
}

/* ── TASK ROWS ── */
.task-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--gray-6);
  border-left: 2px solid transparent;
  padding-left: 0;
  transition:
    transform 80ms ease-out,
    border-left-color 80ms ease-out,
    padding-left 80ms ease-out;
  overflow: hidden;
  position: relative;
}

.task-row:hover {
  transform: translateX(-4px);
  border-left-color: var(--black);
  padding-left: 4px;
}

.task-row:hover .task-delete {
  opacity: 1;
  transform: translateX(0);
}

.task-row--done {
  opacity: 0.45;
}

.task-row--done:hover {
  transform: none;
  border-left-color: transparent;
  padding-left: 0;
}

/* ── TASK NUMBER ── */
.task-num {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  color: var(--gray-4);
  width: 24px;
  flex-shrink: 0;
  padding-top: 2px;
}

/* ── TASK BODY ── */
.task-body {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 600;
  color: var(--black);
  line-height: 1.4;
  position: relative;
  display: inline-block;
}

.task-title .strikethrough {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  background: var(--black);
  transform: scaleX(0);
  transform-origin: left;
  transition: none;
}

.task-row.completing .task-title .strikethrough {
  transform: scaleX(1);
  transition: transform 300ms ease-out;
}

.task-title--done {
  color: var(--gray-3);
  text-decoration: line-through;
  text-decoration-color: var(--gray-3);
}

.task-note {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 400;
  color: var(--gray-1);
  margin-top: 3px;
  overflow-wrap: break-word;
}

.task-note--done {
  color: var(--gray-3);
}

/* ── TASK META / DELETE ── */
.task-meta-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  padding-top: 2px;
}

.task-delete {
  font-family: var(--font-ui);
  font-size: 18px;
  font-weight: 300;
  color: var(--gray-3);
  background: none;
  border: none;
  line-height: 1;
  padding: 0 4px;
  opacity: 0;
  transform: translateX(8px);
  transition:
    opacity 100ms ease-out,
    transform 100ms ease-out,
    color 80ms ease;
}

.task-delete:hover {
  color: var(--black);
}

/* ── OVERLAY ── */
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 200;
  backdrop-filter: blur(2px);
}

/* ── ADD TASK SHEET ── */
.sheet {
  display: none;
  flex-direction: column;
  gap: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--white);
  border-radius: 16px 16px 0 0;
  padding: 28px 40px 40px;
  z-index: 300;
  box-shadow: 0 -4px 40px rgba(0, 0, 0, 0.12);
  max-width: 900px;
  margin: 0 auto;
}

.sheet-close {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 22px;
  font-weight: 300;
  color: var(--gray-3);
  background: none;
  border: none;
  line-height: 1;
  padding: 4px 8px;
  transition: color 80ms ease;
}

.sheet-close:hover {
  color: var(--black);
}

.sheet-title-input {
  font-family: var(--font-ui);
  font-size: 22px;
  font-weight: 700;
  color: var(--black);
  border: none;
  outline: none;
  border-bottom: 1px solid var(--gray-5);
  padding-bottom: 12px;
  transition: border-bottom-color 100ms ease;
  width: 100%;
}

.sheet-title-input:focus {
  border-bottom-color: var(--black);
}

.sheet-title-input::placeholder {
  color: var(--gray-4);
  font-weight: 400;
}

.sheet-note-input {
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 400;
  color: var(--gray-1);
  border: none;
  outline: none;
  border-bottom: 1px solid var(--gray-6);
  padding-bottom: 10px;
  transition: border-bottom-color 100ms ease;
  width: 100%;
}

.sheet-note-input:focus {
  border-bottom-color: var(--gray-3);
}

.sheet-note-input::placeholder {
  color: var(--gray-4);
}

.sheet-add-btn {
  align-self: flex-end;
  background: var(--black);
  color: var(--white);
  border: none;
  border-radius: 100px;
  padding: 11px 26px;
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: transform 60ms ease, opacity 60ms ease;
}

.sheet-add-btn:active {
  transform: scale(0.96);
}

/* ── BOTTOM ACTION BAR ── */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--black);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px;
  z-index: 100;
  max-width: 100%;
  transition: background 150ms ease;
}

.bottom-bar:hover {
  background: #1a1a1a;
}

.bottom-bar-label {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--white);
}

.bottom-bar-plus {
  font-family: var(--font-ui);
  font-size: 24px;
  font-weight: 300;
  color: var(--white);
  line-height: 1;
  display: inline-block;
}
```

- [ ] **Step 2: Serve and visually verify the design**

```bash
cd "/home/shephard/Desktop/Work/Web Apps/Todo-App"
npx ng serve --open
```

Check:
- Black header with italic "Tasks" logo and date
- Large `00` counter with eyebrow label
- Bottom black action bar pinned to bottom
- Zero console errors. Stop server with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/app/main-content/main-content.component.css
git commit -m "feat: editorial css design system for main content"
```

---

## Task 7: Footer Component

**Files:**
- Modify: `src/app/footer/footer.component.html`
- Modify: `src/app/footer/footer.component.css`

- [ ] **Step 1: Update footer HTML**

```html
<footer class="footer">
  <span>&copy; 2026 Shephard · Tasks</span>
</footer>
```

- [ ] **Step 2: Update footer CSS**

```css
.footer {
  text-align: center;
  padding: 20px 40px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gray-3);
  border-top: 1px solid var(--gray-6);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/footer/footer.component.html src/app/footer/footer.component.css
git commit -m "feat: update footer with minimal editorial styling"
```

---

## Task 8: Full Visual QA Pass

**Files:** None (verification only)

- [ ] **Step 1: Serve the app and run through all interactions**

```bash
cd "/home/shephard/Desktop/Work/Web Apps/Todo-App"
npx ng serve --open
```

Run through this checklist in the browser:

| Check | Expected |
|---|---|
| Page loads | Cinematic entrance — header slides in, hero fades, rows stagger, bar rises |
| Hero counter | Counts up from 00 to active task count on load |
| Custom cursor | Black dot follows mouse with ~40ms lag, shrinks on click |
| Bottom bar click | Sheet slides up from bottom, overlay dims |
| Sheet `+` icon | Rotates 45° when sheet opens, back to 0° on close |
| Add task (Enter key) | Sheet closes, new row springs in at bottom of active list |
| Row hover | Row shifts left 4px, black left border appears, `×` slides in |
| Title click | Strikethrough draws left-to-right, row moves to Done section after 700ms |
| `×` click | Row collapses height to 0, rows shuffle up |
| Hero counter | Updates with spring animation on every add/complete/delete |
| Heartbeat | Counter pulses subtly every 4 seconds |
| Done section | Appears below divider when tasks are completed, faded out |
| Empty state | "Nothing here…" text shown when no active tasks |
| Footer | Small caps copyright at bottom |

- [ ] **Step 2: Fix any issues found during QA**

If any visual or interaction issue is found, fix it before proceeding.

- [ ] **Step 3: Run final unit tests**

```bash
npx ng test --watch=false --browsers=ChromeHeadless 2>&1 | tail -20
```

Expected: All tests pass.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete editorial todo redesign with gsap animation system"
```

---

## Self-Review Notes

- **Spec coverage:** All spec sections covered — layout (Tasks 5–6), typography (Task 6 CSS variables), components (Tasks 5–7), animation system (Task 4 TS), cursor (Task 3), page load timeline (Task 4 `runPageLoadTimeline`), micro-interactions (Task 6 CSS transitions + Task 4 TS), counter heartbeat (Task 4 `startHeartbeat`).
- **Placeholders:** None. All code is complete.
- **Type consistency:** `TodoItem` interface defined once in `main-content.component.ts` Task 4 and used throughout. `completeTask(activeIndex)` / `deleteList(activeIndex)` signatures consistent between spec tests and implementation. `displayCount` used in both TS and template.
- **One gap resolved:** `deleteClicked` flag from original component removed — it has no role in the new design (empty state is handled by `@if (activeTasks.length === 0)`).
