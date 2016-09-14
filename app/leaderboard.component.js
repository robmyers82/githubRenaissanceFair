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
require('rxjs/add/operator/first');
var player_data_service_1 = require('./player-data.service');
var LeaderboardComponent = (function () {
    function LeaderboardComponent(playerDataService) {
        var _this = this;
        this.playerDataService = playerDataService;
        this.duellingList = [];
        this.archeryBegList = [];
        this.archeryIntList = [];
        this.archeryExpList = [];
        this.duellingPlayers = this.playerDataService.getLeaderboard('duel').subscribe(function (duelinfo) {
            duelinfo.reverse();
            for (var _i = 0, duelinfo_1 = duelinfo; _i < duelinfo_1.length; _i++) {
                var info = duelinfo_1[_i];
                if (info.type === 'knight') {
                    _this.duellingList.push(info);
                }
            }
        });
        this.beginnerPlayers = this.playerDataService.getLeaderboard('beginner').subscribe(function (shootinfo) {
            shootinfo.reverse();
            for (var _i = 0, shootinfo_1 = shootinfo; _i < shootinfo_1.length; _i++) {
                var info = shootinfo_1[_i];
                if (info.type === 'archer') {
                    _this.archeryBegList.push(info);
                }
            }
        });
        this.intermediatePlayers = this.playerDataService.getLeaderboard('intermediate').subscribe(function (shootinfo) {
            shootinfo.reverse();
            for (var _i = 0, shootinfo_2 = shootinfo; _i < shootinfo_2.length; _i++) {
                var info = shootinfo_2[_i];
                if (info.type === 'archer') {
                    _this.archeryIntList.push(info);
                }
            }
        });
        this.expertPlayers = this.playerDataService.getLeaderboard('expert').subscribe(function (shootinfo) {
            shootinfo.reverse();
            for (var _i = 0, shootinfo_3 = shootinfo; _i < shootinfo_3.length; _i++) {
                var info = shootinfo_3[_i];
                if (info.type === 'archer') {
                    _this.archeryExpList.push(info);
                }
            }
        });
    }
    LeaderboardComponent.prototype.viewLeaderboard = function (scope) {
        switch (scope) {
            case 'archeryBeg':
                this.leaderboardView = 'rangebeg';
                break;
            case 'archeryInt':
                this.leaderboardView = 'rangeint';
                break;
            case 'archeryExp':
                this.leaderboardView = 'rangeexp';
                break;
            default:
                this.leaderboardView = 'duel';
        }
    };
    LeaderboardComponent.prototype.ngOnInit = function () {
        this.leaderboardView = 'duel';
    };
    LeaderboardComponent.prototype.ngOnDestroy = function () {
        if (this.duellingPlayers) {
            this.duellingPlayers.unsubscribe();
        }
        if (this.beginnerPlayers) {
            this.beginnerPlayers.unsubscribe();
        }
        if (this.intermediatePlayers) {
            this.intermediatePlayers.unsubscribe();
        }
        if (this.expertPlayers) {
            this.expertPlayers.unsubscribe();
        }
    };
    LeaderboardComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/leaderboard.component.html',
            styleUrls: ['app/leaderboard.component.css']
        }), 
        __metadata('design:paramtypes', [player_data_service_1.PlayerDataService])
    ], LeaderboardComponent);
    return LeaderboardComponent;
}());
exports.LeaderboardComponent = LeaderboardComponent;
//# sourceMappingURL=leaderboard.component.js.map