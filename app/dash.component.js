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
var store_1 = require('@ngrx/store');
require('rxjs/add/operator/first');
var player_data_service_1 = require('./player-data.service');
var angularfire2_1 = require('angularfire2');
var router_1 = require('@angular/router');
var player_component_1 = require('./player.component');
var DashComponent = (function () {
    function DashComponent(playerDataService, af, store, router) {
        var _this = this;
        this.playerDataService = playerDataService;
        this.af = af;
        this.store = store;
        this.router = router;
        this.player = {
            title: '',
            name: '',
            descriptor: ''
        };
        store.select('user')
            .subscribe(function (user) {
            if (user.id === '') {
                _this.router.navigate(['/join']);
            }
            else {
                _this.loggedUser = user;
                var playerSnapshot = af.database.object('/players/' + _this.loggedUser.id);
                playerSnapshot.subscribe(function (snapshot) {
                    _this.player = snapshot;
                    if (_this.player.type == "knight") {
                        var duelSnapshot = af.database.list('/duels/' + _this.loggedUser.id);
                        _this.player.duels = [];
                        duelSnapshot.subscribe(function (dSnapshots) {
                            for (var _i = 0, dSnapshots_1 = dSnapshots; _i < dSnapshots_1.length; _i++) {
                                var dSnapshot = dSnapshots_1[_i];
                                _this.player.duels.push(dSnapshot);
                            }
                        });
                    }
                    else {
                        var shootSnapshot = af.database.list('/shoots/' + _this.loggedUser.id);
                        _this.player.shoots = [];
                        shootSnapshot.subscribe(function (dSnapshots) {
                            for (var _i = 0, dSnapshots_2 = dSnapshots; _i < dSnapshots_2.length; _i++) {
                                var dSnapshot = dSnapshots_2[_i];
                                _this.player.shoots.push(dSnapshot);
                            }
                        });
                    }
                });
            }
        });
    }
    DashComponent.prototype.logout = function () {
        this.store.dispatch({ type: 'REMOVE_LOGGEDUSER' });
        this.router.navigate(['/']);
    };
    DashComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/dash.component.html',
            styleUrls: ['app/dash.component.css'],
            directives: [player_component_1.PlayerComponent]
        }), 
        __metadata('design:paramtypes', [player_data_service_1.PlayerDataService, angularfire2_1.AngularFire, store_1.Store, router_1.Router])
    ], DashComponent);
    return DashComponent;
}());
exports.DashComponent = DashComponent;
//# sourceMappingURL=dash.component.js.map