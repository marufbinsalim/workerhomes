module.exports = {
  apps : [{
    name: 'front',
    script: 'yarn',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000 // Or any other port you want to use
    }
  }]
};
