module.exports = {
  apps: [
    {
      name: "kalyang-backend",
      cwd: "/var/www/NewWebsite/backend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
