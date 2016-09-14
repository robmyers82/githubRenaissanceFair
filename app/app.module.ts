import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { MainComponent } from './main.component';
import { JoinComponent } from './join.component';
import { DashComponent } from './dash.component';
import { PlayerComponent } from './player.component';
import { ShootComponent } from './shoot.component';
import { DuelComponent } from './duel.component';
import { LeaderboardComponent } from './leaderboard.component';

import { PlayerDataService } from './player-data.service';

import { AngularFireModule } from 'angularfire2';

import { Store, StoreModule } from '@ngrx/store';
import { userReducer } from './user';

export const firebaseConfig = {
  	apiKey: "AIzaSyDCJtcvpuy4NLsfGkgNT-ax9Axeu5W_VJQ",
    authDomain: "githubrenfair.firebaseapp.com",
    databaseURL: "https://githubrenfair.firebaseio.com",
    storageBucket: "",
};

@NgModule({
  	imports: [ 
  		BrowserModule, 
  		FormsModule, 
  		HttpModule, 
  		routing, 
  		AngularFireModule.initializeApp(firebaseConfig),
  		StoreModule.provideStore({ user: userReducer })
  	],
  	declarations: [ 
  		AppComponent, 
  		MainComponent, 
  		JoinComponent,
  		DashComponent,
      PlayerComponent,
      ShootComponent,
      DuelComponent,
      LeaderboardComponent,
  	],
  	providers:	[ appRoutingProviders, PlayerDataService ],
  	bootstrap:	[ AppComponent ]
})

export class AppModule { }