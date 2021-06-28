import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent{


  miFormulario: FormGroup = this.fb.group({
    name: ['Mario', [Validators.required, Validators.minLength(3)]],
    email: ['test1@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  })

  constructor(private fb:FormBuilder,
    private router:Router, private authService:AuthService) { }

  registro(){

    const {name, email, password} = this.miFormulario.value;

    this.authService.registro(name,email,password).subscribe(ok => {

      //console.log(resp);
      if(ok === true){
        this.router.navigateByUrl('/dashboard');
      }else{
        //en el ok aparece la info(string) el ultimo 'error' hace que aparezca algo bonito
        Swal.fire('Error', ok, 'error');
      }
    });
    
    this.router.navigateByUrl('/dashboard');
  }

  

  

}
