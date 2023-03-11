import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-customerinfo',
  templateUrl: './customerinfo.component.html',
  styleUrls: ['./customerinfo.component.css']
})
export class CustomerinfoComponent implements OnInit {
  userService: any;
  doExist: boolean = false;
  email: any;
  uid: any;
  password: string = '';
  docRef: any;
  updateObject: any;
  fullName: any;
  mobNum:number=0;
  constructor(private firestore: AngularFirestore, public auths: AngularFireAuth) { }
  ngOnInit(): void {
    this.auths.user.subscribe(user => {
      //   
      this.uid = user?.uid;
      //   this.fullName=user?.fullName;

      this.firestore.collection<any>('users').doc(user?.uid).valueChanges().subscribe((doc) => {
        this.email = doc?.email;
        this.fullName=doc?.fullName;
        this.mobNum=doc?.mobNum;

      });
    })

    // this.docRef = this.firestore.collection<any>('users').doc(this.uid).collection('kyc').doc('details').get().subscribe((doc: any) => {

    // console.log('url is ' + this.back_adhar_exist_String);
  }


}
