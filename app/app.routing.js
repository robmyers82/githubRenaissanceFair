"use strict";
var router_1 = require('@angular/router');
var main_component_1 = require('./main.component');
var join_component_1 = require('./join.component');
var dash_component_1 = require('./dash.component');
var shoot_component_1 = require('./shoot.component');
var duel_component_1 = require('./duel.component');
var leaderboard_component_1 = require('./leaderboard.component');
var appRoutes = [
    { path: '', name: name, component: main_component_1.MainComponent, useAsDefault: true },
    { path: 'join', name: name, component: join_component_1.JoinComponent },
    { path: 'dash', name: name, component: dash_component_1.DashComponent },
    { path: 'shoot', name: name, component: shoot_component_1.ShootComponent },
    { path: 'duel', name: name, component: duel_component_1.DuelComponent },
    { path: 'leaderboard', name: name, component: leaderboard_component_1.LeaderboardComponent },
];
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map