import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainContentComponent } from "./main-content/main-content.component";
import { FooterComponent } from "./footer/footer.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainContentComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
