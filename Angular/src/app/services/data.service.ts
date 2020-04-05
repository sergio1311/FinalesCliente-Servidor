import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';

let apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private updateZombies$ = new Subject<any>();
  private updateCerebros$ = new Subject<any>();
  zombiesObservable = this.updateZombies$.asObservable();
  cerebrosObservable = this.updateCerebros$.asObservable();
  constructor(private _client: HttpClient) { }

async obtenerZombies() {
  let tipoUsr = localStorage.getItem('tipoUsuario');
  let ususarioId = localStorage.getItem('userId');
  let zombies = await this._client.get(apiUrl + 'zombies?q='+ tipoUsr +'&' + 'p='+ususarioId);
  return this.updateZombies$.next(zombies);
}

async obtenerCerebros() {
  let tipoUsr = localStorage.getItem('tipoUsuario');
  let ususarioId = localStorage.getItem('userId');
  let cerebros = await this._client.get<any>(apiUrl + 'cerebros?q=' + tipoUsr +'&' + 'p='+ususarioId);
  return this.updateCerebros$.next(cerebros);
}

graficaCerebros() {
  let sabores = this._client.post(apiUrl + 'graficaCerebro', '');
  return sabores;
}

cuentaCerebros(sabor: string){
  let cer = {
    sabor: sabor
  }
  let cuenta = this._client.post(apiUrl + 'cuentaCerebro', cer);
  return cuenta;
}

graficaUsuarios() {
  let usuarios = this._client.post(apiUrl + 'graficaUsuario', '');
  return usuarios;
}

cuentaPorUsuario(_id: string) {
   let usr = {
     _id: _id
   }
   let cuenta = this._client.post(apiUrl + 'cuentaPorUsuario', usr);
   return cuenta;
}

traeUsuario(_id: string) {
  let usr = {
    _id: _id
  }
  let nombre = this._client.post(apiUrl + 'traeUsuario', usr);
  return nombre;
}

async obtenerUsuario() {
  let usuarios = await this._client.get<any>(apiUrl + 'users');
  return usuarios;
}

agregarZombie(nombre: string, correo: string, tipo: string, userId: string) {
  let nuevoZombie = {
    name: nombre,
    email: correo,
    type: tipo,
    userId: userId
  };
  return this._client.post(apiUrl + 'zombies/new', nuevoZombie);
}

eliminarZombie(id: string) {
  let _id = id;
  return this._client.delete(apiUrl + 'zombies/delete/' + _id);
}

actualizarZombie(id: string, nombre: string, correo: string, tipo: string) {
  let _id = id;
  let zombieModificado = {
    name: nombre,
    email: correo,
    type: tipo
  };
  return this._client.put(apiUrl + 'zombies/edit/' + _id, zombieModificado);
}

agregarCerebro(sabor: string, descripcion: string, Iq: number, foto: string, usuarioId: string) {
  let nuevoCerebro = {
    flavor: sabor,
    description: descripcion,
    iq: Iq,
    picture: foto,
    usuarioId : usuarioId
  };
  return this._client.post(apiUrl + 'cerebros/new', nuevoCerebro);
}

eliminarCerebro(id: string) {
  let _id = id;
  return this._client.delete(apiUrl + 'cerebros/delete/' + _id);
}

actualizarCerebro(id: string, sabor: string, descripcion: string, Iq: number, foto: string) {
  let _id = id;
  let cerebroModificado = {
    flavor: sabor,
    description: descripcion,
    iq: Iq,
    picture: foto
  };
  return this._client.put(apiUrl + 'cerebros/edit/' + _id, cerebroModificado);
}

agregarUsuario(_username: string, _password: string, _email: string, _tipo: string) {
  let nuevoUsuario = {
      username: _username,
      password: _password,
      email: _email,
      tipo: _tipo
  };
  return this._client.post(apiUrl + 'users/new', nuevoUsuario);
}

iniciarSesion(_username: string, _password: string) {
  let usuario = {
    username: _username,
    password: _password
  };
  return this._client.post(apiUrl + 'users/login', usuario);
}


}
