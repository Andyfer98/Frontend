import { routes } from '../routes/app.routes';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter, withViewTransitions } from '@angular/router';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: "sistemaeleccionreinafacu-e49fa",
        appId: "1:94830678683:web:e0b6c113541d2758a62c3e",
        storageBucket: "sistemaeleccionreinafacu-e49fa.appspot.com",
        apiKey: "AIzaSyALtwhy-FJQanutvQPjYK3gq_SLaX7cWSI",
        authDomain: "sistemaeleccionreinafacu-e49fa.firebaseapp.com",
        messagingSenderId: "94830678683"
      })), provideStorage(() => getStorage()),
  ]
};
