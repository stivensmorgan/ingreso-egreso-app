import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import * as firebase from 'firebase';

import { map  } from 'rxjs/operators';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afAuth: AngularFireAuth,
               private afDB: AngularFirestore,
               private router: Router ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      
      console.log( fbUser );

    });
  }

  crearUsuario ( nombre: string, email: string, password: string ) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then( resp => {
        //const user: User = new User( nombre, email, resp.user.uid );

        const user: User = {
          nombre,
          email: resp.user.email,
          uid: resp.user.uid
        };

        this.afDB.doc(`${ user.uid }/usuario`)
          .set( user )
          .then( () => {
            this.router.navigate(['/']);
          });
      })
      .catch( error => {
        Swal.fire({
          title: 'Error en el Registro!',
          text: error.message,
          type: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
  }

  login( email: string, password: string ) {
    this.afAuth.auth
       .signInWithEmailAndPassword( email, password )
      .then( resp => {
        this.router.navigate(['/']);
      })
      .catch ( error => { 
        Swal.fire({
          title: 'Error en el login!',
          text: error.message,
          type: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.afAuth.authState
    .pipe(
      map( fbUser => {

        if ( fbUser == null ) {
          this.router.navigate(['/login']);
        }

        return fbUser != null;
      })
    );
  }
}
