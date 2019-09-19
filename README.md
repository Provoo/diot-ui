# Diot Front aplicación web progresiva en Ionic 4 Angular

Esta aplicación pertenece  al proyecto Diot Alarma Inteligente.

![App Front](diot-front.png)


## Requisitos
* Ionic 4
* Ionic-cli
* npm
* node

## Instalación
Instalar las dependencias del archivo package.json con:
``` bat
npm install
```
Para levantar la aplicación en modo desarrollador hay que tomar en cuenta en el archivo enviroments.ts y cambiar los hosts de **mosquitto** , **api diot back**

``` js
export const environment = {
  production: false,
  api: "http://0.0.0.0:8000/",
  mosquitto_hostname:"0.0.0.0"
};
```

Una vez estén configuradas las variables de entorno ejecutamos
``` bat
ionic serve
```
