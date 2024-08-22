import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

  deleteClicked:boolean=false
  newListContent: string =""
  newListTitle: string=""
  showaddlist:boolean= false;

  List: Array<any>=[]

showAddList(){
  this.showaddlist= !this.showaddlist
}

  addList(){
    this.List.push({"title": this.newListTitle, "content": this.newListContent})
  }
  deleteList( index:number){
    this.deleteClicked= true
    this.List.splice(index, 1)
  }
}
