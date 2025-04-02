import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-city',
  standalone: true,
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent {
  title = 'City';
  buildings = [
    {
      name: 'Guild-Hall',
      description: 'Build rooms for adventurers',
      iconAvatar: '/assets/locations/icons/city-buildings/guild-hall.png',
      x: '50vw',
      y: '9vh'
    },
    {
      name: 'Arena',
      description: 'Try your recruters in battle!',
      iconAvatar: '/assets/locations/icons/city-buildings/arena.webp',
      x: '47vw',
      y: '42vh',

    },
    {
      name: 'Marketplace',
      description: 'Buy and sell equipment, potions, and other items',
      iconAvatar: '/assets/locations/icons/city-buildings/marketplace.jpg',
      x: '16vw',
      y: '21vh'
    },
    {
      name: 'Forging',
      description: 'Upgrade and craft weapons/armor',
      iconAvatar: '/assets/locations/icons/city-buildings/blacksmith.jpg',
      x: '15vw',
      y: '60vh'
    },
    {
      name: 'Training',
      description: 'Train soldiers to improve their stats',
      iconAvatar: '/assets/locations/icons/city-buildings/traning-center.jpg',
      x: '45vw',
      y: '60vh'
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute)
  {}


  enterBuilding(building: string) {
    this.router.navigate([building.toLowerCase()], { relativeTo: this.route });
  }
}
