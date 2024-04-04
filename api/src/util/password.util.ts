import bcrypt from 'bcrypt';

// Function to hash and salt a password
export const hashPassword = async (password: string) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

// Function to compare a plain text password with a hashed password
export const comparePassword = async (plainPassword: string, hashedPassword: string) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};