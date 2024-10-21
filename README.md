# Dependencias
- dotenv
- mysql2

# Que hace el script
1. Transforma el log de nginx a un formato concreto para trabajarlo
2. Mete cada petición a la DB
3. Juzga cada una basado en un sistem de reputación.
4. Banea las IP por un tiempo proporcional al nivel de peligro que se haya dectectado.
5. Revisa las IPs baneadas para verificar si hay que retirar el ban a alguna.
6. Limpia la DB y los logs dejando todo listo para la siguiente ejecución.

# Setup
Se necesitan los siguientes paquetes:
- [ ] ufw

Se necesita lo siguiente en el archivo .env
- [ ] LOG => Ruta al log de nginx
- [ ] DB_HOST => Direccion db ("localhost")
- [ ] DB_USER => Usuario de la DB
- [ ] DB_PASS => Contraseña del user
- [ ] DB => Base de datos

**¡Se tiene que ejecutar con sudo!**
