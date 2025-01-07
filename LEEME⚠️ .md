Esta es una aplicación web en Flask-Next.js y una conexión a una base de datos PostgreSQL la cual corre en el host local (localhost). LA APLICACIÓN ESTÁ DOCKERIZADA. La app tiene un sistemas de recomendacion en dos servicios: Hoteles y Paquetes Turísticos. El sistema de recomendaciones es realmente simple, consiste en sugerir los productos disponibles en orden de acuerdo a la mayor tasa de visitas y compras hacia la menor. Las cuentas de visitas y compras se actualizan automáticamente en el frontend.
 
## Para correr la aplicación

1. Clonar este repositorio.

2. Instalar [Docker](https://www.docker.com/products/docker-desktop) y [Docker Compose](https://docs.docker.com/compose/) en tu PC.

3. Dentro del directorio del proyecto, ejecutar el comando:
🚨 docker compose up -d --build 🚨. Este comando deberá crear los contenedores de los servicios del backend y frontend, además del contenedor del PostgreSQL.

4. Ingresar a [localhost:3000](http://localhost:3000) en su navegador web. El backend en el puerto [localhost:5000](http://localhost:5000) está configurado para conectarse automáticamente a la base de datos en PostgreSQL a través de la URL `postgresql://postgres:password@db_botrip:5432/db_botrip`, que es accesible dentro de los contenedores de Docker. 

5. La aplicación debería de funcionar en ese punto. 👌

🚨🚨🚨🚨🚨 AL CORRER LA OTRA APLICACIÓN RECUERDA ELIMINAR TODOS LOS CONTENEDORES PORQUE TODOS ESTAN CORRIENDO EN LOS MISMOS PUERTOS.