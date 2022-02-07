// 外部import
import { Component } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  SnapshotAction,
} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 内部import
import { Comment } from './class/comment';
import { User } from './class/user';

const CURRENT_USER: User = new User(1, '城戸 拓也');
const ANOTHER_USER: User = new User(2, '中村 勇斗');

@Component({
  selector: 'ac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  comments$: Observable<Comment[]>;
  commentsRef: AngularFireList<Comment>;
  currentUser = CURRENT_USER;
  comment = '';
  item$: Observable<any>;

  constructor(private db: AngularFireDatabase) {
    this.item$ = db.object('/item').valueChanges();
    this.commentsRef = db.list('/comments');
    this.comments$ = this.commentsRef.snapshotChanges().pipe(
      map((snapshots: SnapshotAction<Comment>[]) => {
        return snapshots.map((snapshot) => {
          const value = snapshot.payload.val();
          return new Comment({ key: snapshot.payload.key, ...value });
        });
      })
    );
  }

  addComment(comment: string): void {
    if (comment) {
      this.commentsRef.push(
        new Comment({ user: this.currentUser, message: comment })
      );
      this.comment = '';
    } else {
      alert('コメントを入力してください!');
    }
  }
}
