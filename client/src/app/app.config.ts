// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { routes } from './app.routes';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// // Angular Material
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatSnackBarModule } from '@angular/material/snack-bar';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideAnimations(),
//     provideHttpClient(withInterceptorsFromDi()),
//     provideAnimationsAsync(),
    
//     // Form Providers
//     importProvidersFrom(FormsModule),
//     importProvidersFrom(ReactiveFormsModule),
    
//     // Angular Material Providers
//     importProvidersFrom(
//       MatToolbarModule,
//       MatButtonModule,
//       MatCardModule,
//       MatInputModule,
//       MatFormFieldModule,
//       MatIconModule,
//       MatMenuModule,
//       MatTableModule,
//       MatPaginatorModule,
//       MatDialogModule,
//       MatSnackBarModule
//     ),
//   ]
// };
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration()
  ]
};