import { PLAYER } from './mocks';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

// look into these
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PlayerDataService {

	constructor(private http: Http, public af: AngularFire) { }

	getPlayerGithubInfo(gUserName): Observable {
		return this.http.get('https://api.github.com/users/'+gUserName)
			.map(response => response.json())
			.catch(err => {
				if (err.status === 404) {
					return Observable.throw('No User found');
				}
				else {
					return Observable.throw("We're sorry, but there was an issue processing your request.");
				}
			});
	}

	getPlayerRepos(gUserName): Observable {
		return this.http.get('https://api.github.com/users/'+gUserName+'/repos?per_page=100')
			.map(repos => repos.json())
			.catch(err => {
				if (err.status === 404) {
					return Observable.throw('No User found');
				}
				else {
					return Observable.throw("We're sorry, but there was an issue processing your request.");
				}
			});
	}

	getAvailablePlayers(): Observable {
		return this.af.database.list('/players', {preserveSnapshot: true});
	}

	addPlayer(thePlayer): Observable {
		var playerSnapshot = this.af.database.list('/players', {preserveSnapshot: true});
		return playerSnapshot.push(thePlayer).key;
	}

	updatePlayer(key, thePlayer): Observable {
		var playerSnapshot = this.af.database.list('/players', {preserveSnapshot: true});
		return playerSnapshot.update(key, thePlayer);
	}

	getLeaderboard(scope): Observable {

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
	}

	getMockPlayer() {
	    return PLAYER;
	}
}