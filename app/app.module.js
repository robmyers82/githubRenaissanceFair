"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var app_component_1 = require('./app.component');
var app_routing_1 = require('./app.routing');
var main_component_1 = require('./main.component');
var join_component_1 = require('./join.component');
var dash_component_1 = require('./dash.component');
var player_component_1 = require('./player.component');
var shoot_component_1 = require('./shoot.component');
var duel_component_1 = require('./duel.component');
var leaderboard_component_1 = require('./leaderboard.component');
var player_data_service_1 = require('./player-data.service');
var angularfire2_1 = require('angularfire2');
var store_1 = require('@ngrx/store');
var user_1 = require('./user');
exports.firebaseConfig = {
    apiKey: "AIzaSyDCJtcvpuy4NLsfGkgNT-ax9Axeu5W_VJQ",
    authDomain: "githubrenfair.firebaseapp.com",
    databaseURL: "https://githubrenfair.firebaseio.com",
    storageBucket: "",
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                app_routing_1.routing,
                angularfire2_1.AngularFireModule.initializeApp(exports.firebaseConfig),
                store_1.StoreModule.provideStore({ user: user_1.userReducer })
            ],
            declarations: [
                app_component_1.AppComponent,
                main_component_1.MainComponent,
                join_component_1.JoinComponent,
                dash_component_1.DashComponent,
                player_component_1.PlayerComponent,
                shoot_component_1.ShootComponent,
                duel_component_1.DuelComponent,
                leaderboard_component_1.LeaderboardComponent,
            ],
            providers: [app_routing_1.appRoutingProviders, player_data_service_1.PlayerDataService],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map