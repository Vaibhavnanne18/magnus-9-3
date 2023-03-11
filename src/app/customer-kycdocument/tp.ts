import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-customer-kycdocument',
  templateUrl: './customer-kycdocument.component.html',
  styleUrls: ['./customer-kycdocument.component.css']
})
export class CustomerKYCDocumentComponent implements OnInit {
  userService: any;
  doExist: boolean = true;
  email: any;
  uid: any;
  password: string = '';
  docRef: any;
  updateObject: any;
  back_adhar_exist: boolean = false;
  back_adhar_exist_String: string = '';
  front_adhar_exist: boolean = false;
  front_adhar_exist_String: string = 'https://wealthgenics.com/Content/KycDocuments/WG1881881_Aadhaar Card Front.jpeg?638132031453858395?638132031453858395';
  pancard_exist: boolean = false;
  pancard_exist_String: string = '';
  profile_exist: boolean = false;
  profile_exist_String: string = '';
  cancelled_check_exist: boolean = false;
  cancelled_check_exist_String: string = '';
  url_main: any = {};
  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, public auths: AngularFireAuth, private auth: AuthService) { }
  ngOnInit(): void {
    this.uid = sessionStorage.getItem('firebaseUserId');
    // this.docRef = this.firestore.collection<any>('users').doc(this.uid).collection('kyc').doc('details').get().subscribe((doc: any) => {
    this.firestore.collection<any>('users').doc(this.uid).collection('kyc').doc('details').get().subscribe((doc: any) => {
      if (doc.exists) {
        console.log("doc is ");
        if (doc.front_adhar.exists) {
          this.front_adhar_exist = true;
          this.front_adhar_exist_String = doc.front_adhar;
          //  console.log('url is inside ' + this.front_adhar_exist_String);
        }
        if (doc.back_adhar.exists) {
          this.back_adhar_exist = true;
          this.back_adhar_exist_String = doc.back_adhar;
          // console.log('url is inside ' + this.back_adhar_exist_String);
        }
        if (doc.pancard.exists) {
          this.pancard_exist = true;
          this.pancard_exist_String = doc.pancard;
          // console.log('url is inside ' + this.back_adhar_exist_String);
        }
        if (doc.profile.exists) {
          this.profile_exist = true;
          this.profile_exist_String = doc.profile;
          // console.log('url is inside ' + this.back_adhar_exist_String);
        }
        if (doc.cancelled_check.exists) {
          this.cancelled_check_exist = true;
          this.cancelled_check_exist_String = doc.cancelled_check;
          // console.log('url is inside ' + this.back_adhar_exist_String);
        }
        this.email = doc.data().email;

        console.log(doc.data());

      }
      else {
        this.doExist = false;
      }
    });
    console.log('url is ' + this.back_adhar_exist_String);
  }

  uploadFrontAdhar(event: any) {
    this.uploadFile(event, "front_adhar", "front_adhar_time")
  }

  uploadBackAdhar(event: any) {
    this.uploadFile(event, "back_adhar", "back_adhar_time")
  }
  uploadPanCard(event: any) {
    this.uploadFile(event, "pancard", "pancard_time")
  }
  uploadProfile(event: any) {
    this.uploadFile(event, "profile", "profile_time")
  }
  uploadCancelledCheck(event: any) {
    this.uploadFile(event, "cancelled_check", "cancelled_check_time")
  }
  uploadFile(event: any, value: string, time: string) {
    const file = event.target.files[0];

    const filePath = `uploads/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          console.log('url is ' + url); // the download URL of the file
          this.firestore.collection('users').doc(this.uid).collection('kyc').doc('details').set({ "value":"url" }, { merge: true })

          // this.firestore.collection('users').doc(this.uid).collection('kyc').doc('details').set({ [value]: url, [time]: new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear() + "  " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() }, { merge: true })
        });
      })

    ).subscribe();

  }
}
