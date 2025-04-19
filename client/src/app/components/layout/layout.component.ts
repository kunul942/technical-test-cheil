// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-layout',
//   templateUrl: './layout.component.html',
//   styleUrls: ['./layout.component.scss']
// })
// export class LayoutComponent implements OnInit {
//   isAdmin = false;

//   constructor(private authService: AuthService) { }

//   ngOnInit(): void {
//     this.isAdmin = this.authService.isAdmin;
//   }

//   logout(): void {
//     this.authService.logout();
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(public authService: AuthService) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  logout(): void {
    this.authService.logout();
  }
}