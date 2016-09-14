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
var mocks_1 = require('./mocks');
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var angularfire2_1 = require('angularfire2');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
require('rxjs/add/observable/throw');
// look into these
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/toPromise');
var PlayerDataService = (function () {
    function PlayerDataService(http, af) {
        this.http = http;
        this.af = af;
    }
    PlayerDataService.prototype.getPlayerGithubInfo = function (gUserName) {
        return this.http.get('https://api.github.com/users/' + gUserName)
            .map(function (response) { return response.json(); })
            .catch(function (err) {
            if (err.status === 404) {
                return Observable_1.Observable.throw('No User found');
            }
            else {
                return Observable_1.Observable.throw("We're sorry, but there was an issue processing your request.");
            }
        });
    };
    PlayerDataService.prototype.getPlayerRepos = function (gUserName) {
        return this.http.get('https://api.github.com/users/' + gUserName + '/repos?per_page=100')
            .map(function (repos) { return repos.json(); })
            .catch(function (err) {
            if (err.status === 404) {
                return Observable_1.Observable.throw('No User found');
            }
            else {
                return Observable_1.Observable.throw("We're sorry, but there was an issue processing your request.");
            }
        });
    };
    PlayerDataService.prototype.getAvailablePlayers = function () {
        return this.af.database.list('/players', { preserveSnapshot: true });
    };
    PlayerDataService.prototype.addPlayer = function (thePlayer) {
        var playerSnapshot = this.af.database.list('/players', { preserveSnapshot: true });
        return playerSnapshot.push(thePlayer).key;
    };
    PlayerDataService.prototype.updatePlayer = function (key, thePlayer) {
        var playerSnapshot = this.af.database.list('/players', { preserveSnapshot: true });
        return playerSnapshot.update(key, thePlayer);
    };
    PlayerDataService.prototype.getLeaderboard = function (scope) {
        var selType;
        switch (scope) {
            case "beginner":
                selType = 'beginnerbest';
                break;
            case "intermediate":
                selType = 'intermediatebest';
                break;
            case "expert":
                selType = 'expertbest';
                break;
            case "duel":
            default:
                selType = 'wins';
        }
        return this.af.database.list('/players', {
            query: {
                orderByChild: selType
            }
        });
    };
    PlayerDataService.prototype.getMockPlayer = function () {
        return mocks_1.PLAYER;
    };
    PlayerDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, angularfire2_1.AngularFire])
    ], PlayerDataService);
    return PlayerDataService;
}());
exports.PlayerDataService = PlayerDataService;
//# sourceMappingURL=player-data.service.js.map