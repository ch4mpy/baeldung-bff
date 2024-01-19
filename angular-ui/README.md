# AngularUi

Initiate a project with:
```bash
npm i -g @angular/cli
ng new --routing --style=scss angular-ui
cd angular-ui
ng g c --flat -s -t --skip-tests --type=View Home
ng g c --flat -s -t --skip-tests --type=View About
```

## Application Routes
Edit `src/app/app.routes.ts` to define the following routes:
```typescript
export const routes: Routes = [
  { path: 'home', component: HomeView },
  { path: 'about', component: AboutView },
  { path: '**',   redirectTo: '/home' }
];
```

## Serve Configuration with SSL
Edit `angular.json` to:
- add `"baseHref": "/angular-ui/"` to `projects.angular-ui.architect.build.options`
- edit `projects.angular-ui.architect.serve.configurations.local` with the path to your own certificate files:
```json
            "local": {
              "buildTarget": "angular-ui:build:development",
              "host": "0.0.0.0",
              "port": 4201,
              "ssl": true,
              "sslCert": "C:/Users/jwaco/.ssh/JW_self_signed.crt",
              "sslKey": "C:/Users/jwaco/.ssh/JW_req_key.pem"
            }
```

## Development server

Run `ng serve -c local`
