import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //la base url de desarrollo y produccion la cambiamos en la carpeta environments, como hacemos con el .env de node

  private baseUrl:string=environment.baseUrl;

  //login usuario, creamos otra interfaz usuario

  private _usuario!:Usuario;

  get usuario(){
    //ponemos el {...} para que accidentalmente no se le cambie ninguna propiedad
    return {...this._usuario};
  }

  registro(name:string, email:string, password:string){

    const url= `${this.baseUrl}/auth/new`;
    

    const body = {name, email, password};

    return this.http.post<AuthResponse>(url, body)   
      .pipe(
        
        tap(resp=>{
          if(resp.ok){
            localStorage.setItem('token', resp.token!);
            
          }
        }),
        
        map( resp=> resp.ok),
        catchError(err=>of(err.error.msg))
        )




  }

  login(email:string, password:string){

    //en el postman vemos que login es peticion post
    //Necesitamos URL
    const url= `${this.baseUrl}/auth`;
    
    const body = {email, password};
    
    //post pide, url, body de la peticion,authresponse es una interface con los datos que nos interesan

      return this.http.post<AuthResponse>(url, body)
      //queremos enseñar solo algunos datos de la peticion http, usamos pipe
      .pipe(
        //Aqui van los operadores RXJS, cuidado el orden

        tap(resp=>{
          if(resp.ok){
            //si la respuesta es ok, asignaremos a _usuario los datos, la ! es para decir que van a venir datos si o si
            localStorage.setItem('token', resp.token!);
            // this._usuario= {
            //   name:resp.name!,
            //   uid:resp.uid!
              
            // }
          }
        }),
        //map muta las respuestas, en este caso a un booleano
        //Ahora cuando mandemos la info del login, no saldran los datos, solo true o false
        map( resp=> resp.ok),
        //para que devuelva un observable que de false si la info no es correcta
        catchError(err=>of(err.error.msg))
        )

      
  }


  validarToken():Observable<boolean>{

    const url = `${this.baseUrl}/auth/renew`;
    //dogma de fe, todo esto es para validar el token, estos headers podemos personalizarlos
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

     return this.http.get<AuthResponse>(url, {headers} )
     .pipe
     (
       map(resp=> {
        localStorage.setItem('token', resp.token!);
            this._usuario= {
              name:resp.name!,
              uid:resp.uid!,
              email:resp.email
            }
        return resp.ok;
       }),
       catchError(err=>of(false))
     )
  }


  logout(){

    localStorage.clear();
  }

  constructor(private http:HttpClient) { }
}
