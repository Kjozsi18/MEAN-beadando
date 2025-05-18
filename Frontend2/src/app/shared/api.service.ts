import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../model/post';
import { User } from '../model/user';
import { Plant } from '../model/plant';
import { Project } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url:string = 'http://localhost:3000/post';
  url_user:string = 'http://localhost:3000/user';
  url_plant:string = 'http://localhost:3000/plant';
  url_project:string = 'http://localhost:3000/project';
  url_project_all:string = 'http://localhost:3000/project/all';
  constructor(private http:HttpClient) { }

  // összes post adat lekérése
  getAllPosts():Observable<Post[]>{
    return this.http.get<Post[]>(this.url);
  }
  // post adat kérése ID alapján
  getPostById(id:string):Observable<Post>{
    return this.http.get<Post>(this.url+'/'+id);
  }
  // post adat törlése
  deletePost(id:string):Observable<Post>{
    return this.http.delete<Post>(this.url+'/'+id);
  }
  // post adat frissítése
  updatePost(post:Post):Observable<Post>{
    return this.http.put<Post>(this.url+'/'+post._id,post);
  }
  // post adat készítése
  createPost(post:Post):Observable<Post>{
    return this.http.post<Post>(this.url,post);
  }
  // user adat készítése
  createUser(user:User):Observable<User>{
    return this.http.post<User>(this.url_user,user);
  }
  // login
  loginUser(email: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.url_user}/login`, { email, password });
  }


  getAllPlants():Observable<Plant[]>{
    return this.http.get<Plant[]>(this.url_plant);
  }
  getPlantById(id:string):Observable<Plant>{
    return this.http.get<Plant>(this.url_plant+'/'+id);
  }
  deletePlant(id:string):Observable<Plant>{
    return this.http.delete<Plant>(this.url_plant+'/'+id);
  }
  updatePlant(plant:Plant):Observable<Plant>{
    return this.http.put<Plant>(this.url_plant+'/'+plant._id,plant);
  }
  createPlant(plant:Plant):Observable<Plant>{
    return this.http.post<Plant>(this.url_plant,plant);
  }


  getAllProjects(userId:string):Observable<Project[]>{
    return this.http.get<Project[]>(this.url_project_all+'/'+userId);
  }
  getProjectById(id:string):Observable<Project>{
    return this.http.get<Project>(this.url_project+'/'+id);
  }
  deleteProject(id:string):Observable<Project>{
    return this.http.delete<Project>(this.url_project+'/'+id);
  }
  updateProject(project:Project):Observable<Project>{
    return this.http.put<Project>(this.url_project+'/'+project._id,project);
  }
  createProject(project:Project):Observable<Project>{
    return this.http.post<Project>(this.url_project,project);
  }

  


}
