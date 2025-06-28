import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  port: process.env.PORT,
  saltRound: process.env.SALT_ROUNDS,
  node: process.env.NODE_ENV,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  databaseUrl: process.env.DATABASE_URL,
  jwtAccess:{
    jwtSecret: process.env.JWT_SECRET,
  jwtExpireIn : process.env.JWT_EXPIRES_IN
  },
  jwtRefresh: {
    jwtSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpireIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
