import { Component, Observable } from '@angular/core';
import 'rxjs/add/operator/first';
import { PlayerDataService } from './player-data.service';

@Component({
  templateUrl: 'app/leaderboard.component.html',
  styleUrls: ['app/leaderboard.component.css']
})

export class LeaderboardComponent {

	leaderboardView: string;
	duellingList = [];
	archeryBegList = [];
	archeryIntList = [];
	archeryExpList = [];
	duellingPlayers: any;
	beginnerPlayers: any;
	intermediatePlayers: any;
	expertPlayers: any;

	constructor(private playerDataService: PlayerDataService) {
		
		this.duellingPlayers = this.playerDataService.getLeaderboard('duel').subscribe(duelinfo => {
			duelinfo.reverse();
			for (let info of duelinfo) {
				if (info.type === 'knight') {
					this.duellingList.push(info);
				}
			}
		});

		this.beginnerPlayers = this.playerDataService.getLeaderboard('beginner').subscribe(shootinfo => {
			shootinfo.reverse();
			for (let info of shootinfo) {
				if (info.type === 'archer') {
					this.archeryBegList.push(info);
				}
			}
		});

		this.intermediatePlayers = this.playerDataService.getLeaderboard('intermediate').subscribe(shootinfo => {
			shootinfo.reverse();
			for (let info of shootinfo) {
				if (info.type === 'archer') {
					this.archeryIntList.push(info);
				}
			}
		});

		this.expertPlayers = this.playerDataService.getLeaderboard('expert').subscribe(shootinfo => {
			shootinfo.reverse();
			for (let info of shootinfo) {
				if (info.type === 'archer') {
					this.archeryExpList.push(info);
				}
			}
		});
	}

	viewLeaderboard(scope) {

		switch(scope) {

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
	}

	ngOnInit() {
		this.leaderboardView = 'duel';
	}

	ngOnDestroy() {
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
	}
}
