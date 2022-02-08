import { Component, OnInit } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  SnapshotAction,
} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 内部import
import { Comment } from '../core/models/comment';
import { User } from '../core/models/user';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'ac-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  comments$: Observable<Comment[]>;
  commentsRef: AngularFireList<Comment>;
  currentUser: User;
  comment = '';

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.commentsRef = db.list('/comments');
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user: firebase.User | null) => {
      if (user) {
        this.currentUser = new User(user);
      }
    });

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

  updateComment(comment: Comment): void {
    const { key, message } = comment;

    this.commentsRef.update(key, { message });
  }

  deleteComment(comment: Comment): void {
    this.commentsRef.remove(comment.key);
  }
}
