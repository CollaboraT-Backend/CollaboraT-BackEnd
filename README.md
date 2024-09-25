# CollaboraT
Project merely focused on the teams activities!


## 1. inicializacion de repositorio

Ve a tu consola de comandos, cmd, bash o cualquiera de preferencia y copia el siguiente comando

`git clone https://github.com/CollaboraT-Backend/CollaboraT-BackEnd.git`

abre en Visual studio code o cualquier gestor de preferencia la carpeta del proyecto, en mi caso lo clone en una carpeta del escritorio

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/db777aa5-b266-4d1e-adcf-3652d171f24d">


crea un archivo .env con los datos para tu base de datos, en una URL, aqui la referencia

<img width="794" alt="image" src="https://github.com/user-attachments/assets/c5540bc7-fa87-41cb-abfb-7c2f941dd3f3">

Tambien, agregar los siguientes parametros, de valor puedes poner el valor que quieras, preferibemente para el de "salt" dejarlo en 12 y el "jwt-secret" poner un secreto que sea dificil de descifrar

<img width="494" alt="image" src="https://github.com/user-attachments/assets/aa13e083-92e5-4af1-9965-8f4aa4e99f9c">

tambien agregar las siguientes variables, de preferencia crear un propio bucket de S3 AWS y crear un usuario de IAM para que pueda entrar sin problema de las politicas del bucket

<img width="407" alt="image" src="https://github.com/user-attachments/assets/c6ec2b0d-959e-4fe0-bdda-09c5455bd762">




despues de haber creado la base de datos, desde cero usa el comando `npx prisma migrate deploy`. Antes de este, asegurate de no tener nada en la carpeta migrations de prisma

<img width="273" alt="image" src="https://github.com/user-attachments/assets/3247db19-54c9-4e72-acfc-98ee9abce760">

un ejemplo de como NO debe encontrarse la carpeta migrations, si este es el caso, borra todas las carpetas y vuelve a correr el comando `npx prisma migrate deploy`.

junto al anterior comando, correr el comando `npx prisma generate`

<img width="965" alt="image" src="https://github.com/user-attachments/assets/07473be3-ae0d-47a2-859b-3edd98abba59">

si llegaste a este punto sin errores, ya estas casi que listo!

Corre el comando `npm i` en la terminal para instalar las ultimas dependencias que no tengas instaladas del proyecto

una vez hecho lo anterior, corre el comando `npm run start:dev` o `npm run start` si deseas que se te compile el proyecto y te genere el resultado en una carpeta dist.

<img width="693" alt="image" src="https://github.com/user-attachments/assets/52dab438-cb6b-4e5b-bba2-ddd652541810">

[Enlace a Confluence](https://collaborat.atlassian.net/l/cp/hVcxSbvY)
