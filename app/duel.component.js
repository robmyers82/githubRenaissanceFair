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
var DuelComponent = (function () {
    function DuelComponent(playerDataService, af, store, router) {
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
                _this.opponentsList = af.database.list('/players');
            }
        });
    }
    DuelComponent.prototype.rollDice = function () {
        return 1 + Math.floor(Math.random() * 6);
    };
    DuelComponent.prototype.chooseOpponent = function (theOpponent) {
        this.opponent = theOpponent;
        this.screenState = "yourOpponent";
    };
    DuelComponent.prototype.runAway = function () {
        this.screenState = "chooseOpponent";
    };
    DuelComponent.prototype.loadDuel = function () {
        this.screenState = "duelLoading";
    };
    DuelComponent.prototype.performDuel = function () {
        var yourHealth = this.player.power * 10, opponentHealth = this.opponent.power * 10;
        // begin the battle; the logic works as follows:
        // each attack is 3 rolls * accuracy, highest total scores the blow
        // blow is 1 roll * power, total is deducted from HP
        // first to reach a health of 0 loses
        while (yourHealth > 0 && opponentHealth > 0) {
            // initiate an attack
            var opponentRoll = 0, yourRoll = 0;
            for (var i = 0; i < 3; i++) {
                yourRoll += this.rollDice();
                opponentRoll += this.rollDice();
            }
            opponentRoll *= this.opponent.accuracy;
            yourRoll *= this.player.accuracy;
            // Note: a tie is a push
            if (yourRoll > opponentRoll) {
                opponentHealth -= (this.player.power * this.rollDice());
            }
            else if (opponentRoll > yourRoll) {
                yourHealth -= (this.opponent.power * this.rollDice());
            }
        }
        var yourStats = {
            name: this.opponent.title + " " + this.opponent.name + " the " + this.opponent.descriptor,
            result: ''
        }, opponentStats = {
            name: this.player.title + " " + this.player.name + " the " + this.player.descriptor,
            result: ''
        };
        this.player.totalduels++;
        this.opponent.totalduels++;
        if (yourHealth <= 0) {
            this.duelResult = "lost";
            yourStats.result = "lost";
            opponentStats.result = "won";
            this.opponent.wins++;
            this.player.losses++;
        }
        else {
            this.duelResult = "won";
            yourStats.result = "won";
            opponentStats.result = "lost";
            this.player.wins++;
            this.opponent.losses++;
        }
        var updatePlayerObject = this.af.database.object('/players/' + this.loggedUser.id);
        updatePlayerObject.update({ wins: this.player.wins, losses: this.player.losses, totalduels: this.player.totalduels });
        var updateOpponentObject = this.af.database.object('/players/' + this.opponent.$key);
        updateOpponentObject.update({ wins: this.opponent.wins, losses: this.opponent.losses, totalduels: this.opponent.totalduels });
        var yourDuelList = this.af.database.list('/duels/' + this.loggedUser.id);
        yourDuelList.push(yourStats);
        var opponentDuelList = this.af.database.list('/duels/' + this.opponent.$key);
        opponentDuelList.push(opponentStats);
        this.screenState = "duelResults";
    };
    DuelComponent.prototype.ngOnInit = function () {
        this.screenState = 'chooseOpponent';
    };
    DuelComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/duel.component.html',
            styleUrls: ['app/duel.component.css'],
            directives: [player_component_1.PlayerComponent]
        }), 
        __metadata('design:paramtypes', [player_data_service_1.PlayerDataService, angularfire2_1.AngularFire, store_1.Store, router_1.Router])
    ], DuelComponent);
    return DuelComponent;
}());
exports.DuelComponent = DuelComponent;
//# sourceMappingURL=duel.component.js.map