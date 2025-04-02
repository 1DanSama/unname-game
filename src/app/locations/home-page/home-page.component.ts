import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  title = 'Location menu';
  regions = [
    { name: 'City', description: 'Main city' },
    { name: 'Map-region', description: 'City region with fort posts' },
    { name: 'Dialog', description: 'Dialog chapter test' },
    { name: 'Dungeon', description: 'Base dungeon' },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  goToRegion(building: string) {
    if(building === 'Dialog') {
      this.router.navigate([building.toLowerCase()], {
        relativeTo: this.route,
        queryParams: { chapterCount: 0 }
      });
    } else {
      this.router.navigate([building.toLowerCase()], { relativeTo: this.route });
    }
  }
}
