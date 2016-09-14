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
var player_data_service_1 = require('./player-data.service');
var store_1 = require('@ngrx/store');
require('rxjs/add/operator/first');
var router_1 = require('@angular/router');
var JoinComponent = (function () {
    function JoinComponent(playerDataService, store, router) {
        var _this = this;
        this.playerDataService = playerDataService;
        this.store = store;
        this.router = router;
        this.isError = false;
        this.errorMessage = '';
        this.newPlayer = {
            username: '',
            type: 'archer'
        };
        this.descriptors = [
            'Chicken Chaser',
            'Hacker',
            'Commentor',
            'Modular',
            'Stickler',
            'Nerd',
            'Indentor',
            'Granular',
        ];
        store.select('user')
            .subscribe(function (user) {
            _this.loggedUser = user;
            if (_this.loggedUser.id != "") {
                _this.router.navigate(['/dash']);
            }
        });
    }
    JoinComponent.prototype.enterFair = function (newUser) {
        var _this = this;
        this.playerDataService.getPlayerGithubInfo(newUser.username)
            .subscribe(function (response) {
            _this.playerDataService.getPlayerRepos(newUser.username)
                .subscribe(function (repos) {
                var found = false, playerKey = '';
                // let playerSnapshot = this.af.database.list('/players', {preserveSnapshot: true}).first();
                _this.playerSubscription = _this.playerDataService.getAvailablePlayers().subscribe(function (snapshot) {
                    for (var _i = 0, snapshot_1 = snapshot; _i < snapshot_1.length; _i++) {
                        var thePlayer = snapshot_1[_i];
                        var playerInfo = thePlayer.val();
                        if (playerInfo.username.toLowerCase() === newUser.username.toLowerCase() && playerInfo.type === newUser.type) {
                            found = true;
                            _this.player = playerInfo;
                            playerKey = thePlayer.key;
                        }
                    }
                    // update the player information
                    _this.player.username = response.login;
                    _this.player.type = newUser.type;
                    _this.player.avatar = response.avatar_url;
                    _this.player.name = response.name;
                    if (_this.player.name === null) {
                        _this.player.name = "blanky";
                    }
                    _this.player.location = response.location;
                    // add the optional descriptor
                    if (!found) {
                        var descIndex = Math.floor(Math.random() * _this.descriptors.length);
                        _this.player.descriptor = _this.descriptors[descIndex];
                        // add build stats for the particular user
                        if (_this.player.type === 'knight') {
                            _this.player.totalduels = 0;
                            _this.player.wins = 0;
                            _this.player.losses = 0;
                        }
                        else {
                            _this.player.totalshoots = 0;
                            _this.player.bestscore = 0;
                            _this.player.bestlevel = '';
                            _this.player.beginnerbest = 0;
                            _this.player.intermediatebest = 0;
                            _this.player.expertbest = 0;
                        }
                    }
                    // calculate the player stats
                    _this.player.accuracy = response.public_repos + (response.followers * 2);
                    if (_this.player.accuracy < 5) {
                        _this.player.accuracy = 5;
                    }
                    // get the player strength
                    _this.player.power = 0;
                    for (var _a = 0, repos_1 = repos; _a < repos_1.length; _a++) {
                        var repo = repos_1[_a];
                        _this.player.power += repo.watchers_count + (repo.stargazers_count * 3) + (repo.forks_count * 2);
                    }
                    if (_this.player.power < 5) {
                        _this.player.power = 5;
                    }
                    if (!found) {
                        try {
                            playerKey = _this.playerDataService.addPlayer(_this.player);
                        }
                        catch (err) {
                            alert("We're sorry, but there was an issue, please try again or check the console log.");
                            console.log(err);
                        }
                    }
                    else {
                        _this.playerDataService.updatePlayer(playerKey, _this.player);
                    }
                    // log in the user
                    _this.store.dispatch({ type: 'SET_LOGGEDUSER', payload: { id: playerKey, username: _this.player.username, type: _this.player.type } });
                    _this.router.navigate(['/dash']);
                });
            }, function (err) {
                // update the error status and make sure that our alert is showing
                _this.isError = true;
                _this.errorMessage = err;
            });
        }, function (err) {
            // update the error status and make sure that our alert is showing
            _this.isError = true;
            _this.errorMessage = err;
        });
    };
    JoinComponent.prototype.ngOnInit = function () {
        this.isError = false;
        this.player = this.playerDataService.getMockPlayer();
    };
    JoinComponent.prototype.ngOnDestroy = function () {
        if (this.playerSubscription) {
            this.playerSubscription.unsubscribe();
        }
    };
    JoinComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/join.component.html',
            styleUrls: ['app/join.component.css']
        }), 
        __metadata('design:paramtypes', [player_data_service_1.PlayerDataService, store_1.Store, router_1.Router])
    ], JoinComponent);
    return JoinComponent;
}());
exports.JoinComponent = JoinComponent;
//# sourceMappingURL=join.component.js.map