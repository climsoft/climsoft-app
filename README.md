![OpenCDMS](http://dev3.opencdms.org/assets/img/brand/opencdms-signet.png) OpenCDMS App
OpenCDMS UI Application contains the frontend client application built using Angular Framework, Reactive Forms and Datam odels aligned with the PyOpen data models from API.


# ![OpenCDMS App](http://dev3.opencdms.org/assets/img/brand/opencdms-signet.png)

Additionally, there is an Angular 1.5 version of this codebase that you can [fork](https://github.com/opencdms/opencdms-app/tree/main).

## How to run it locally
1. [Download](https://github.com/opencdms/opencdms-app/tree/main) or clone the [repository](https://github.com/opencdms/opencdms-app.git) to your local machine:
```bash
$ git clone https://github.com/opencdms/opencdms-app.git
```

2. Run `npm install` inside the downloaded/cloned folder:
```bash
$ npm install
```

3. Start the dev server by running the command below. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
```bash
$ npm start
```

4. To run the Cypress BDD tests run the cypress scripts with below commands in a separate shell window.
```bash
$ npm run cy:open
```

## Production Deployment

1. Prepare your required environment y installing all the required dependencies including Nodejs, Git, Angular CLI etc. Clone the repository at https://github.com/opencdms/opencdms-app.git. Install the required dependencies using step-2 above. 

2. Install PM2 using the following command as a global package.
```bash
$ npm i -g pm2
```

3. Build the angular code using the npm script for the desired environment (for example climsoft or opencdms).
```bash
$ npm run build:{ENV}
```

4. To kill any existing running deployed processes from server, run the following command.
```bash
$ pm2 kill
```

5. To deploy the build generated in step-3 run the following command.
```bash
$ pm2 start server.js
```

# Documentation
The complete Climsoft application documentation will soon be available.

# License
Have a blast. [MIT](https://opensource.org/licenses/MIT).


