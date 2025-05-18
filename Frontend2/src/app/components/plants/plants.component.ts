import { Component, OnInit } from '@angular/core';
import { Plant } from '../../model/plant';
import { User } from '../../model/user';
import { ApiService } from '../../shared/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plants',
  imports: [CommonModule, FormsModule],
  templateUrl: './plants.component.html',
  styleUrl: './plants.component.css'
})
export class PlantsComponent implements OnInit {
  plant: Plant = {
    _id: '',
    commonName: '',
    scientificName: '',
    description: '',
    careInstructions: '',
    pestInfo: '',
    userId: '',
    isVerified: false
  }
  _id: string = "";
  commonName: string = "";
  scientificName: string = "";
  description: string = "";
  careInstructions: string = "";
  pestInfo: string = "";
  isVerified: boolean = false;

  allPlants: Plant[] = [];
  userRole: Boolean = false;

  
  constructor(private api: ApiService, private router: Router) {


  const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userRole = parsedUser.user?.role;
      console.log("role:"+this.userRole);
    }
    
  }

  ngOnInit(): void {
    this._id = "";
    this.commonName = '';
    this.scientificName = '';
    this.description = '';
    this.careInstructions = "";
    this.pestInfo = "";
    this.getAllPlant();
  }
  // feliratkozás az összes adatra
  getAllPlant() {
    this.api.getAllPlants().subscribe(res => {
      this.allPlants = res;
    }, err => {
      console.log(err);
    })
  }

  deletePlantData(plant: Plant) {
    if (window.confirm('Biztosan törölni akarod a következő növényt:' + plant.commonName)) {
      this.api.deletePlant(plant._id).subscribe(res => {
        this.allPlants = [];
        this.getAllPlant();
      }, err => {
        console.log(err);
      })
    }
  }

  createPlantData() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const parsedUser = JSON.parse(userString);
      const userId = parsedUser.user?._id;

      if (userId) {
        this.plant.userId = userId;
        console.log('User ID:', userId);
      } else {
        console.error('Nem található _id a user objektumban');
      }
    } else {
      console.error('Nincs user adat a localStorage-ban');
    }

    this.plant.commonName = this.commonName;
    this.plant.scientificName = this.scientificName;
    this.plant.description = this.description;
    this.plant.careInstructions = this.careInstructions;
    this.plant.pestInfo = this.pestInfo;
    this.api.createPlant(this.plant).subscribe(res => {
      this.allPlants = [];
      this.ngOnInit();
    }, err => {
      console.log(err);
    })
  }

  getPlantById(plant: Plant) {
    this.api.getPlantById(plant._id).subscribe(res => {
      plant = res;
    }, err => {
      console.log(err);
    })
  }


  editPlant(plant: Plant) {
    this.getPlantById(plant);
    this._id = plant._id;
    this.commonName = plant.commonName;
    this.scientificName = plant.scientificName;
    this.description = plant.description;
    this.careInstructions = plant.careInstructions;
    this.pestInfo = plant.pestInfo;
    this.isVerified = plant.isVerified

  }

  updatePlant() {
    if (this.commonName == '' || this.scientificName == '' || this.description == '' || this.careInstructions == '' || this.pestInfo == '') {
      alert('Kérlek adj meg minden adatot!');
      return;
    }

    this.plant._id = this._id;
    this.plant.commonName = this.commonName;
    this.plant.scientificName = this.scientificName;
    this.plant.description = this.description;
    this.plant.careInstructions = this.careInstructions;
    this.plant.pestInfo = this.pestInfo;
    this.plant.isVerified = this.isVerified

    this.api.updatePlant(this.plant).subscribe(res => {
      this.ngOnInit();
    }, err => {
      console.log(err);
    })
  }


  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
  goProjekt() {
    this.router.navigate(['/project']);
  }


}
