# Development Keycloak instance

## With Docker
Be aware that the configuration in the provided `docker-compose.yaml` keeps the internal database. If you delete and recreate the container, you'll loose clients, users, etc.

Copy your self-signed certificate and request key to `ssl` folder and name it respectively `self_signed.crt` and `req_key.pem`.

Create a `default.env` copy named `.env` and edit `KEYCLOAK_ADMIN_PASSWORD`

Run `docker compose up`

## Standalone
[Download the latest Keycloak "Distribution powered by Quarkus"](https://www.keycloak.org/downloads).

Unpack and edit the `conf/keycloak.conf` to set (edit the keystore properties with your own values):
```properties
hostname-url=https://localhost:7080/auth
hostname-admin-url=https://localhost:7080/auth
http-relative-path=/auth
https-key-store-file=/path/to/self_signed.jks
https-key-store-password=change-me
https-port=8443
```

Depending on your OS, run `bin\kc.bat start-dev` or `bash ./bin/kc.sh start-dev`

## `baeldung-confidential` client
After you first authenticated on [https://localhost:8443/auth/admin/master/console/](https://localhost:8443/auth/admin/master/console/)
1. Go to `Clients` and click `Create client`
2. set `baeldung-confidential` as Client ID and click `Next`
3. enable `Client authentication`, uncheck `Direct access grants` and click `Next`
4. as `Valid redirect URIs` in put a minimum of (you may input similar configuration for all your network interfaces):
  - `https://localhost:7080/login/oauth2/code/baeldung`
  - `https://127.0.0.1:7080/login/oauth2/code/baeldung`
5. set `+` as value for `Valid post logout redirect URIs` and `Web origins`
6. click `Save`