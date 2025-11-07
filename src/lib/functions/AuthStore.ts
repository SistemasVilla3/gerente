import { writable, derived} from "svelte/store";
import { browser } from "$app/environment";
import {jwtDecode} from "jwt-decode";

//Se crea mediante un funcion para poder añadir logica personalizada
export const jwtToken = createJwtToken();

//Tipado del payload que se espera recibir en el JWT
export interface JwtPayload {
    name: string;
    userId: number;
    employeeCode: number;
    isAdmin: boolean;
    fullName: string;
    roleId: number;
    roleName: string;
    departmentId: number;
    department: string;

    /*Estandar JWT*/
    exp: number; //Fecha de expiracion
    iss: string; //issuer
    aud: string; //audience

    //Cualquier claim adicional no tipado quedara como unknown
    [claim: string]:unknown;
}

//Objeto sujeto al payload, se calcula automaticamente cuando cambia jwtToken
//Si el JWT es invalido o no existe, el payload sera null
const validPayload = derived(jwtToken, ($jwt): JwtPayload | null => {
    if (!$jwt) return null
    
    try {
        const p = jwtDecode<JwtPayload>($jwt);
        console.log("roleName",p.roleName);
        console.log("Nombre",p.fullName);
        return p;
    } catch (error) {
      //Token corrupto, expirado o no-JWT
        return null;
    }
});

export const roleName = derived(validPayload, (p) => p?.roleName ?? null);

//Exportar el payload para usarlo en otros componentes
export const empleado = derived(validPayload, (p) => !!p && p.fullName || null);

//Obtener codigo de empleado desde el JWT
export function getEmployeeCode(raw: string): string | null {
    if (!raw) return null;
  
    // 1) Quita espacios y saltos de linea que rompen el formato base64url
    const clean = raw.trim().replace(/[\r\n]+/g, "");
  
    // 2) Aisla la porcion payload (header.payload.sgnatura)
    let payload = "";
    const dotParts = clean.split(".");
    if (dotParts.length >= 2) {
      // JWT estándar
      payload = dotParts[1];
    } else {
      // En caso de que llegue header.payload?sig
      const firstDot = clean.indexOf(".");
      const qmark    = clean.indexOf("?", firstDot + 1);
      if (firstDot === -1 || qmark === -1) return null;
      payload = clean.slice(firstDot + 1, qmark);
    }
  
    // 3) Normalizar base64url a base64 y añadir padding
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4) payload += "=";   // padding
  
    // 4) Decodificar y parsear el JSON
    try {
      const json = JSON.parse(atob(payload));
      return String(json.employeeCode ?? "");
    } catch {
      return null;
    }
  }

  //Toma el token del query-string
  function tokenFromUrl(): string | null {
    if (!browser) return null; //Solo en el navegador
    return new URL(location.href).searchParams.get('token') || null;
  }

  //Implementacion de createJwtToken
  function createJwtToken() {
    //Valor inicial: localStorage o ?token
    const initial = localStorage.getItem('token') ?? tokenFromUrl();
    const {subscribe, set: _set} = writable<string | null>(
      localStorage.getItem('token')
    );

    //Si el token venia por URL  y aun no esta guardado, persistirlo
    if (initial && !localStorage.getItem('token')) {
      localStorage.setItem('token', initial);
    }

    //Funcion interna para escribir en store + localStorage
    function write(value: string | null) {
      if (browser) {
          value ? localStorage.setItem('token', value)
                : localStorage.removeItem('token');
        }
        _set(value);
    }

    if (browser) {
      //Cambios hechos desde OTRAS pestañas/ventanas
      window.addEventListener('storage', (e) => {
        if (e.key === 'token') _set(e.newValue);
      });
    }
    //Cuando la pestaña recupera el foco, por si el login ocurrrio en otra pestaña
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) _set(localStorage.getItem('token'));
    })
    

    //Funcion que comprueba si el token en la URL es diferente al guardado
    function syncFromUrl() {
      if (!browser) return;
      const t = tokenFromUrl();
      //Si el token en la URL es diferente al guardado, actualizarlo
      if (t && t !== localStorage.getItem('token')) write(t);
    }
    //Publicar y sincronizar el token desde la URL
    return {
      subscribe, //Lectura reactiva
      set: write, //Actuañizacion manual del token
      clear: () => write(null), //Limpiar el token
      syncFromUrl //Funcion para sincronizacion del URL en el afterNavigate
    };
  }
