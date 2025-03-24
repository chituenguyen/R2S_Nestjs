module.exports = {
  apps: [
    {
      name: 'nestjs-api',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 5123,
      },
      env_file: '.env',
    },
  ],
};
