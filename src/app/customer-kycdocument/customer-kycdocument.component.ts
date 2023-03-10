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
  docRef:any;
  updateObject:any;
  back_adhar_exist:boolean = false;
  back_adhar_exist_String:string = '';
  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, public auths: AngularFireAuth, private auth: AuthService) { }
  ngOnInit(): void {
    this.uid = sessionStorage.getItem('firebaseUserId');
    this.docRef = this.firestore.collection<any>('users').doc(this.uid).get().subscribe((doc: any) => {
      if (doc.exists) {
        if(doc.back_adhar.exists){
          this.back_adhar_exist=true;
          this.back_adhar_exist_String = doc.back_adhar;
        }
        this.email = doc.data().email;
        
        console.log(doc.data());

      }
      else {
        this.doExist = false;
      }
    });

  }

  uploadFrontAdhar(event: any) {
    this.firestore.collection('users').doc(this.uid).set({"front_adhar":this.uploadFile(event)},{merge:true})
  }

  uploadBackAdhar(event: any) {
    this.firestore.collection('users').doc(this.uid).set({"back_adhar":this.uploadFile(event)},{merge:true})
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    const filePath = `uploads/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          console.log(url); // the download URL of the file
          this.updateObject = {};
          this.updateObject['adharcard'] = url;
          return url;
        });
      })
    ).subscribe();
  }
}
