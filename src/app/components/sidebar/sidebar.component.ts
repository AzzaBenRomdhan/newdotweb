import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SharedUserService } from 'app/services/sharedUser/shared-user.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/documents', title: 'Documents',  icon: 'description', class: '' },
    { path: '/history',   title: 'Historique', icon: 'history',     class: '' },
    { path: '/users',     title: 'Utilisateurs', icon: 'group',     class: '' },

    /*{ path: '/edit-profile', title: 'Mon profil',  icon:'person', class: 'active-pro'},

     { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' }, */
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  username: string | null = null;
  isMobile: boolean = false;  

  constructor(private sharedUserService: SharedUserService, private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
     this.sharedUserService.username$.subscribe(name => {
    this.username = name;
  });
      this.checkMobile(); // vérification initiale

  }
   // 👉 Détecte automatiquement MOBILE / DESKTOP en temps réel
  @HostListener('window:resize', [])
  onResize() {
    this.checkMobile();
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 991;
  }
    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        this.sharedUserService.clear();
    }
}
