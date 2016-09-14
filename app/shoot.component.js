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
var ShootComponent = (function () {
    function ShootComponent(playerDataService, af, store, router) {
        var _this = this;
        this.playerDataService = playerDataService;
        this.af = af;
        this.store = store;
        this.router = router;
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
                });
            }
        });
    }
    ShootComponent.prototype.rollDice = function () {
        return 1 + Math.floor(Math.random() * 6);
    };
    ShootComponent.prototype.placeArrow = function (score) {
        var result = {
            placement: 0,
            score: 0
        };
        switch (this.shootingRangeLevel) {
            case "beginner":
                if (score > 75) {
                    result.placement = 1;
                    result.score = 100;
                }
                else if (score > 50 && score <= 75) {
                    result.placement = 3;
                    result.score = 25;
                }
                else if (score > 25 && score <= 50) {
                    result.placement = 2;
                    result.score = 50;
                }
                else {
                    result.placement = 4;
                    result.score = 0;
                }
                break;
            case "intermediate":
                if (score > 375) {
                    result.placement = 1;
                    result.score = 100;
                }
                else if (score > 250 && score <= 375) {
                    result.placement = 3;
                    result.score = 25;
                }
                else if (score > 125 && score <= 250) {
                    result.placement = 2;
                    result.score = 50;
                }
                else {
                    result.placement = 4;
                    result.score = 0;
                }
                break;
            case "expert":
                if (score > 750) {
                    result.placement = 1;
                    result.score = 100;
                }
                else if (score > 500 && score <= 750) {
                    result.placement = 3;
                    result.score = 25;
                }
                else if (score > 250 && score <= 500) {
                    result.placement = 2;
                    result.score = 50;
                }
                else {
                    result.placement = 4;
                    result.score = 0;
                }
                break;
        }
        return result;
    };
    ShootComponent.prototype.chooseRangeLevel = function (level) {
        this.shootingRangeLevel = level;
        this.screenState = "rangeLoading";
    };
    ShootComponent.prototype.shootTargets = function () {
        this.totalScore = {
            rangeResults: [],
            total: 0,
            level: this.shootingRangeLevel
        };
        // calculate each arrow's score (5 total arrows)
        for (var i = 0; i < 5; i++) {
            // calculate each arrow's score (3 dice rolls)
            var totalRoll = 0;
            for (var i_1 = 0; i_1 < 3; i_1++) {
                totalRoll += this.rollDice();
            }
            var arrow = this.placeArrow(totalRoll * this.player.accuracy);
            this.totalScore.total += arrow.score;
            this.totalScore.rangeResults.push(arrow);
        }
        this.screenState = "rangeResults";
        // update the user
        this.player.totalshoots++;
        var updatePlayerObject = this.af.database.object('/players/' + this.loggedUser.id);
        if (this.player.bestlevel === '') {
            this.player.bestlevel = this.shootingRangeLevel;
            this.player.bestscore = this.totalScore.total;
        }
        else {
            // place the total best
            if (this.player.bestlevel === "beginner" && this.player.bestscore <= this.totalScore.total) {
                this.player.bestlevel = this.shootingRangeLevel;
                this.player.bestscore = this.totalScore.total;
            }
            else if (this.player.bestlevel === "beginner" && this.shootingRangeLevel !== "beginner" && this.player.bestscore <= this.totalScore.total) {
                this.player.bestlevel = this.shootingRangeLevel;
                this.player.bestscore = this.totalScore.total;
            }
            else if (this.player.bestlevel === "expert" && this.shootingRangeLevel === "expert" && this.player.bestscore <= this.totalScore.total) {
                this.player.bestlevel = this.shootingRangeLevel;
                this.player.bestscore = this.totalScore.total;
            }
        }
        // place the individual best scores
        if (this.shootingRangeLevel === "beginner" && this.player.beginnerbest < this.totalScore.total) {
            this.player.beginnerbest = this.totalScore.total;
        }
        else if (this.shootingRangeLevel === "intermediate" && this.player.intermediatebest < this.totalScore.total) {
            this.player.intermediatebest = this.totalScore.total;
        }
        else if (this.shootingRangeLevel === "expert" && this.player.expertbest < this.totalScore.total) {
            this.player.expertbest = this.totalScore.total;
        }
        updatePlayerObject.update({ bestlevel: this.player.bestlevel, bestscore: this.player.bestscore, totalshoots: this.player.totalshoots, beginnerbest: this.player.beginnerbest, intermediatebest: this.player.intermediatebest, expertbest: this.player.expertbest });
        var shootsList = this.af.database.list('/shoots/' + this.loggedUser.id);
        shootsList.push(this.totalScore);
    };
    ShootComponent.prototype.ngOnInit = function () {
        this.screenState = 'chooseRange';
    };
    ShootComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/shoot.component.html',
            styleUrls: ['app/shoot.component.css']
        }), 
        __metadata('design:paramtypes', [player_data_service_1.PlayerDataService, angularfire2_1.AngularFire, store_1.Store, router_1.Router])
    ], ShootComponent);
    return ShootComponent;
}());
exports.ShootComponent = ShootComponent;
//# sourceMappingURL=shoot.component.js.map