import bcrypt from "bcrypt";

export const hashPassword = async (password: string, saltRound: number): Promise<string> => await bcrypt.hash(password, saltRound);

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => await bcrypt.compare(password, hashedPassword);
