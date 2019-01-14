import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { paths } from '../routing/paths';
import { HomeComponent } from '../pages/home/home.component';
import { PathResolveService } from '../services/path-resolve.service';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { LoadingComponent } from '../pages/loading/loading.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: paths.home, component: HomeComponent, pathMatch: 'full' },
  { path: paths.login, component: LoginComponent },
  { path: paths.loading, component: LoadingComponent },
  { path: '**', resolve: { path: PathResolveService }, component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'enabled',
    // anchorScrolling: 'enabled' // <-- messes with auth0
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
