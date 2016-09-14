import { Component, Observable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';
import { PlayerDataService } from './player-data.service';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { PlayerComponent } from './player.component';

@Component({
  templateUrl: 'app/dash.component.html',
  styleUrls: ['app/dash.component.css'],
  directives: [PlayerComponent]
})

export class DashComponent {

	player = {
		title: '',
		name: '',
		descriptor: ''
	};
	loggedUser: Observable<any>;

	constructor(private playerDataService: PlayerDataService, public af: AngularFire, public store: Store<AppState>, private router: Router) {
		store.select('user')
			.subscribe(user => {
				if (user.id === '') {
					this.router.navigate(['/join']);
				}
				else {
					this.loggedUser = user;
					let playerSnapshot = af.database.object('/players/'+this.loggedUser.id);
					playerSnapshot.subscribe(snapshot => {
						this.player = snapshot;

						if (this.player.type == "knight") {
							let duelSnapshot = af.database.list('/duels/'+this.loggedUser.id);
							this.player.duels = [];

							duelSnapshot.subscribe(dSnapshots => {
								for (let dSnapshot of dSnapshots) {
									this.player.duels.push(dSnapshot);
								}
							});
						}
						else {
							let shootSnapshot = af.database.list('/shoots/'+this.loggedUser.id);
							this.player.shoots = [];

							shootSnapshot.subscribe(dSnapshots => {
								for (let dSnapshot of dSnapshots) {
									this.player.shoots.push(dSnapshot);
								}
							});
						}
					});
				}
			});
	}

  logout() {
    this.store.dispatch({ type: 'REMOVE_LOGGEDUSER' });
    this.router.navigate(['/']);
  }
}
