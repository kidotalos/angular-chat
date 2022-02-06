// 外部import
import { Component } from '@angular/core';

// 内部import
import { Comment } from './class/comment';
import { User } from './class/user';

const CURRENT_USER: User = new User(1, '城戸 拓也');
const ANOTHER_USER: User = new User(2, '中村 勇斗');

const COMMENTS: Comment[] = [
  new Comment(ANOTHER_USER, 'おつかれっす'),
  new Comment(ANOTHER_USER, '既読無視？'),
  new Comment(CURRENT_USER, 'あ、ごめん寝てた'),
  new Comment(CURRENT_USER, 'まだ寝ていい？'),
];

@Component({
  selector: 'ac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  comments = COMMENTS;
  currentUser = CURRENT_USER;
  comment = '';

  addComment(comment: string): void {
    if (comment) {
      this.comments.push(new Comment(this.currentUser, comment));
    } else {
      alert('コメントを入力してください!');
    }
  }
}
