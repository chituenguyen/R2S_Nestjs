import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'default_name',
  port: parseInt(process.env.APP_PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
}));
