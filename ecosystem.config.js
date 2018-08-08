module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: "busapi",
      script: "./bin/www",
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      watch: true,
      merge_logs: true,
      exec_mode: "cluster",
      ignore_watch: ["./logs/*", "./dashbord/*", "./app/web/*"],
      env: {
        NODE_ENV: "production",
        PORT: "8500"
      },
      env_production: {
        NODE_ENV: "production"
      },
      instances: "max",
      instance_var: "INSTANCE_ID"
    }

    // Second application
    // {
    //   name: "WEB",
    //   script: "web.js"
    // }
  ]
  // Cluster environment variablelink
  // The NODE_APP_INSTANCE environment variable is used to make a difference between cluster.

  // For example, if you want to run a cronjob only on one cluster, you can check if process.env.NODE_APP_INSTANCE === 0.

  // This variable can be renamed in the ecosystem file:
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  // deploy: {
  //   production: {
  //     user: "node",
  //     host: "212.83.163.1",
  //     ref: "origin/master",
  //     repo: "git@github.com:repo.git",
  //     path: "/var/www/production",
  //     "post-deploy":
  //       "npm install && pm2 reload ecosystem.config.js --env production"
  //   },
  //   dev: {
  //     user: "node",
  //     host: "212.83.163.1",
  //     ref: "origin/master",
  //     repo: "git@github.com:repo.git",
  //     path: "/var/www/development",
  //     "post-deploy": "npm install && pm2 reload ecosystem.config.js --env dev",
  //     env: {
  //       NODE_ENV: "dev"
  //     }
  //   }
  // }

  //   use admin
  // db.createUser(
  //   {
  //     user: "padmin",
  //     pwd: "padmin123",
  //     roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  //   }
  // )
  // user h5db
  // db.createUser(
  //   {
  //     user: "h5dbadmin",
  //     pwd: "admin123",
  //     roles: [ { role: "readWrite", db: "h5db" } ]
  //   }
  // )
};
