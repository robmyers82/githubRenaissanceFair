import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent }  from './main.component';
import { JoinComponent }  from './join.component';
import { DashComponent }  from './dash.component';
import { ShootComponent }  from './shoot.component';
import { DuelComponent } from './duel.component';
import { LeaderboardComponent } from './leaderboard.component';

const appRoutes: Routes = [
  { path: '', name='Home', component: MainComponent, useAsDefault: true },
  { path: 'join', name='Join', component: JoinComponent },
  { path: 'dash', name='Dashboard', component: DashComponent },
  { path: 'shoot', name='Shoot', component: ShootComponent },
  { path: 'duel', name='Duel', component: DuelComponent },
  { path: 'leaderboard', name='Leaderboard', component: LeaderboardComponent },
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);