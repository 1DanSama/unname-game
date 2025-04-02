import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {HeaderComponent} from './header/header.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrl: './app.component.scss'

})
export class AppComponent {

}
