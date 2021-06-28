import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenGuard } from './guards/validar-token.guard';

const routes: Routes = [

  //Lazyload
    {
      path: 'auth',
      loadChildren: ()=> import('./auth/auth.module').then(m=> m.AuthModule)

    },
    {
      path:'dashboard', 
      loadChildren: ()=> import('./protected/protected.module').then(m=> m.ProtectedModule),
      //Activamos guards
      canActivate:[ ValidarTokenGuard],
      canLoad:[ValidarTokenGuard]
    },
    {
      path: '**',
      redirectTo:"auth"
    }

];
//modificamos para que funcione con node en produccion ( el fallo del htaccess)
@NgModule({
  imports: [RouterModule.forRoot(routes,{

    useHash:false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
