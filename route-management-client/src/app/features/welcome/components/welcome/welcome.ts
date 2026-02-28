import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {

  features = [
    { icon: 'route',         label: 'Manage Routes & Seasons' },
    { icon: 'business',      label: 'Tour Operator Management' },
    { icon: 'attach_money',  label: 'Dynamic Pricing Tables' },
    { icon: 'file_download', label: 'Excel Export with Progress Tracking' }
  ];
  
}
