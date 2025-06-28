import bcrypt from 'bcrypt';
import config from '../../config';
export const hashedPassword = async (password: string) => {
  const saltRounds = Number(config.saltRound) || 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};
