import { Component, OnInit } from '@angular/core';
import { Project } from '../../model/project';
import { ApiService } from '../../shared/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  project: Project = {
    _id: '',
    userId: '',
    title: '',
    description: '',
    startDate: '',
    relatedPlants: []
  }

  _id: string = '';
  userId: string = '';
  title: string = '';
  description: string = '';
  startDate: string = '';
  relatedPlants: string[] = [];

  newPlant: string = '';
  allProjects: Project[] = [];
  userIdLocalStorage: string = '';

  constructor(private api: ApiService, private router: Router) {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userIdLocalStorage = parsedUser.user?._id;
    }
    
  }
  
  ngOnInit(): void {
    this.clearForm();
    this.getAllProjects();
  }

  clearForm() {
    this._id = '';
    this.userId = '';
    this.title = '';
    this.description = '';
    this.startDate = '';
    this.relatedPlants = [];
    this.newPlant = '';
  }

  

  getAllProjects() {
    this.api.getAllProjects(this.userIdLocalStorage).subscribe(res => {
      this.allProjects = res;
    }, err => {
      console.log(err);
    });
  }

  getProjectById(project: Project) {
    this.api.getProjectById(project._id).subscribe(res => {
      project = res;
    }, err => {
      console.log(err);
    });
  }

  deleteProjectData(project: Project) {
    if (window.confirm('Biztosan törölni akarod a következő projektet: ' + project.title)) {
      this.api.deleteProject(project._id).subscribe(res => {
        this.getAllProjects();
      }, err => {
        console.log(err);
      });
    }
  }

  createProjectData() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const parsedUser = JSON.parse(userString);
      const userId = parsedUser.user?._id;

      if (userId) {
        this.project.userId = userId;
        console.log('User ID:', userId);
      } else {
        console.error('Nem található _id a user objektumban');
      }
    } else {
      console.error('Nincs user adat a localStorage-ban');
    }

    this.project.title = this.title;
    this.project.description = this.description;
    this.project.startDate = this.startDate;
    this.project.relatedPlants = this.relatedPlants;

    this.api.createProject(this.project).subscribe(res => {
      this.clearForm();
      this.getAllProjects();
    }, err => {
      console.log(err);
    });
  }


  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goPlants() {
    this.router.navigate(['/plants']);
  }

  goProject() {
    this.router.navigate(['/dashboard']);
  }

  addPlant() {
    const trimmedPlant = this.newPlant.trim();
    if (trimmedPlant && !this.relatedPlants.includes(trimmedPlant)) {
      this.relatedPlants.push(trimmedPlant);
      this.newPlant = '';  // input törlése hozzáadás után
    }
  }

  removePlant(index: number) {
    this.relatedPlants.splice(index, 1);
  }

}
