import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tavern',
  templateUrl: './guild-hall.component.html',
  styleUrl: './guild-hall.component.scss'
})
export class GuildHallComponent {
  title = 'Guild Hall';
  buildings = [
    {
      name: 'Tavern',
      description: 'Try to recruit a solders',
      iconAvatar: '/assets/locations/icons/city-buildings/guild-hall.png',
      x: '2vw',
      y: '7vh'
    },
    {
      name: 'Barak', description: 'Check your recruted solders',
      iconAvatar: '/assets/locations/icons/city-buildings/arena.webp',
      x: '58vw',
      y: '48vh',
    },
    {
      name: 'Task-board', description: 'Check available quests',
      iconAvatar: '/assets/locations/icons/city-buildings/marketplace.jpg',
      x: '29vw',
      y: '51vh'
    },
  ];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  enterBuilding(action: string) {
    this.router.navigate([`${action.toLowerCase()}`], {relativeTo: this.route});
  }
}
