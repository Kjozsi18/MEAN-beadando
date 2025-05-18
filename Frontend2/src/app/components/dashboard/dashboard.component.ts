import { Component, OnInit } from '@angular/core';
import { Post } from '../../model/post';
import { ApiService } from '../../shared/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  post:Post = {
    _id: '',
    title: '',
    content: '',
    username: ''
  }
  _id:string = "";
  title:string = '';
  content:string = '';
  username:string = '';

  allPosts:Post[] =[];
  constructor(private api:ApiService, private router:Router){

  }

  ngOnInit():void{
    this._id = "";
    this.title = '';
    this.content = '';
    this.username = '';
    this.getAllPost();
  }
  // feliratkozás az összes adatra
  getAllPost(){
    this.api.getAllPosts().subscribe(res=>{
      this.allPosts = res;
    },err=>{
      console.log(err);
    })
  }
  // post adatlekérdezés id alapján
  getPostById(post:Post){
    this.api.getPostById(post._id).subscribe(res=>{
      post = res;
    },err=>{
      console.log(err);
    })
  }
  // post törlés
  deletePostData(post:Post){
    if(window.confirm('Biztosan törölni akarod a következő bejegyzést:'+post.title)){
      this.api.deletePost(post._id).subscribe(res=>{
      this.allPosts = [];
      this.getAllPost();
    },err=>{
      console.log(err);
    })
    }
  }
  // post írása
  createPostData(){
    this.post.title = this.title;
    this.post.content = this.content;
    this.post.username = this.username;
    this.api.createPost(this.post).subscribe(res=>{
      this.allPosts = [];
      this.ngOnInit();
    },err=>{
      console.log(err);
    })
  }
  // post adatok szerkesztése id alapján
  editPost(post:Post){
    this.getPostById(post);
    this._id = post._id;
    this.title = post.title;
    this.content = post.content;
    this.username = post.username;
  }
  // post adatok frissítése
  updatePost(){
    if(this.title == '' || this.content == '' || this.username == ''){
      alert('Kérlek adj meg minden adatot!');
      return;
    }
    this.post._id = this._id;
    this.post.title = this.title;
    this.post.content = this.content;
    this.post.username = this.username;

    this.api.updatePost(this.post).subscribe(res=>{
      this.ngOnInit();
    },err=>{
      console.log(err);
    })
  }


  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goPlants() {
    this.router.navigate(['/plants']);
  }

  goProject() {
    this.router.navigate(['/project']);
  }


}
