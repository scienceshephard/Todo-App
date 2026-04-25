import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

  it('completeTask() should mark the active task at given index as completed', fakeAsync(() => {
    component.List = [
      { title: 'A', content: '', completed: false, completing: false },
      { title: 'B', content: '', completed: false, completing: false }
    ];
    component.completeTask(0);
    tick(700);
    expect(component.List[0].completed).toBeTrue();
  }));
});
