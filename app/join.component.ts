import { Component, Observable } from '@angular/core';
import { Location } from '@angular/common';
import { Player } from './player';
import { PlayerDataService } from './player-data.service';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'app/join.component.html',
  styleUrls: ['app/join.component.css']
})

export class JoinComponent {

	loggedUser: Observable<any>;
	players: FirebaseListObservable<any[]>;
	playerSubscription: any;
  	constructor(private playerDataService: PlayerDataService, public store: Store<AppState>, private router: Router) {

  		store.select('user')
  			.subscribe(user => {
  				this.loggedUser = user;
  				if (this.loggedUser.id != "") {
  					this.router.navigate(['/dash']);
  				}
  			});
  	}

	isError = false;
	errorMessage = '';
	player: FirebaseListObservable<any>;
	newPlayer = {
		username: '',
		type: 'archer'
	}

	private descriptors = [
		'Chicken Chaser',
		'Hacker',
		'Commentor',
		'Modular',
		'Stickler',
		'Nerd',
		'Indentor',
		'Granular',
	];

	enterFair(newUser) {

		this.playerDataService.getPlayerGithubInfo(newUser.username)
          	.subscribe(response => {

          		this.playerDataService.getPlayerRepos(newUser.username)
          			.subscribe(repos => {

		          		let found = false, playerKey = '';
		          		// let playerSnapshot = this.af.database.list('/players', {preserveSnapshot: true}).first();
		          		this.playerSubscription = this.playerDataService.getAvailablePlayers().subscribe(snapshot => {

					        for (let thePlayer of snapshot) {
					        	let playerInfo = thePlayer.val();
					        	if (playerInfo.username.toLowerCase() === newUser.username.toLowerCase() && playerInfo.type === newUser.type) {
					    			found = true;
					    			this.player = playerInfo;
					    			playerKey = thePlayer.key;
					        	}
					        }

					        // update the player information
					    	this.player.username = response.login;
					    	this.player.type = newUser.type;
					    	this.player.avatar = response.avatar_url;
					    	this.player.name = response.name;
					    	if (this.player.name === null) {
					    		this.player.name = "blanky";
					    	}
					    	this.player.location = response.location;


					    	// add the optional descriptor
					    	if (!found) {
					    		var descIndex = Math.floor(Math.random() * this.descriptors.length);
					    		this.player.descriptor = this.descriptors[descIndex];

					    		// add build stats for the particular user
						    	if (this.player.type === 'knight') {
						    		this.player.totalduels = 0;
						    		this.player.wins = 0;
						    		this.player.losses = 0;
						    	}
						    	else {
						    		this.player.totalshoots = 0;
						    		this.player.bestscore = 0;
						    		this.player.bestlevel = '';
						    		this.player.beginnerbest = 0;
						    		this.player.intermediatebest = 0;
						    		this.player.expertbest = 0;
						    	}
					    	}

					    	// calculate the player stats
					    	this.player.accuracy = response.public_repos + (response.followers*2);
					    	if (this.player.accuracy < 5) {
					    		this.player.accuracy = 5;
					    	}

					    	// get the player strength
					    	this.player.power = 0;
					    	for (let repo of repos) {
					    		this.player.power += repo.watchers_count + (repo.stargazers_count * 3) + (repo.forks_count * 2);
					    	}
					    	if (this.player.power < 5) {
					    		this.player.power = 5;
					    	}

					    	if (!found) {
					    		try {
						    		playerKey = this.playerDataService.addPlayer(this.player);
						    	} catch(err) {
						    		alert("We're sorry, but there was an issue, please try again or check the console log.");
						    		console.log(err);
						    	}
					    	}
					    	else {
					    		this.playerDataService.updatePlayer(playerKey, this.player);
					    	}

					    	// log in the user
					    	this.store.dispatch({ type: 'SET_LOGGEDUSER', payload: { id: playerKey, username: this.player.username, type: this.player.type }});
					    	this.router.navigate(['/dash']);
					    });
					},
		          	err => {

			          	// update the error status and make sure that our alert is showing
			          	this.isError = true;
			          	this.errorMessage = err;
		          	})
          	},
          	err => {

	          	// update the error status and make sure that our alert is showing
	          	this.isError = true;
	          	this.errorMessage = err;
          	});
	}

	ngOnInit() {

		this.isError = false;
		this.player = this.playerDataService.getMockPlayer();
	}

	ngOnDestroy() {
		if (this.playerSubscription) {
			this.playerSubscription.unsubscribe();
		}
	}

}
