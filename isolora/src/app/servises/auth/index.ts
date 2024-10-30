import { sql } from "@vercel/postgres";
import crypto from "crypto";
import bcrypt from "bcrypt";

// Environment variables for encryption
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes for AES-256
const iv = Buffer.from(process.env.ENCRYPTION_IV!, "hex"); // 16 bytes for IV

// Encrypt email function using AES-256-CBC
function encryptEmail(email: string): string {
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(email, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Decrypt email function using AES-256-CBC
function decryptEmail(encryptedEmail: string): string {
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
    let decrypted = decipher.update(encryptedEmail, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
  

// Define User interface
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export default class AuthService {
  // Signup function for user registration
  static async signup(
    name: string,
    email: string,
    password: string,
    role: "vendor" | "customer"
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Encrypt email and hash password
      const encryptedEmail = encryptEmail(email);
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the users table, specifying all fields in RETURNING
      const result = await sql<{ id: number; name: string; email: string; password: string; role: string; }>`
        INSERT INTO users (name, emailid, password, role)
        VALUES (${name}, ${encryptedEmail}, ${hashedPassword}, ${role})
        RETURNING id, name, emailid AS email, password, role;
      `;

      // Retrieve and structure the user data
      const user = result.rows[0] as User; // Type assertion to match User interface
      return {
        success: true,
        message: "User registered successfully",
        user,
      };
    } catch (error) {
      console.error("Error during user registration:", error);
      return { success: false, message: "Error registering user" };
    }
  }

  // Login function for user authentication
  // Login function for user authentication
static async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Encrypt email to match stored email format
      const encryptedEmail = encryptEmail(email);
  
      // Query the user by encrypted email
      const result = await sql<{ id: number; name: string; email: string; password: string; role: string; }>`
        SELECT id, name, emailid AS email, password, role
        FROM users
        WHERE emailid = ${encryptedEmail};
      `;
  
      // Check if user exists
      if (result.rowCount === 0) {
        return { success: false, message: "User not found" };
      }
  
      const user = result.rows[0] as User;
  
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { success: false, message: "Incorrect password" };
      }
  
      // Decrypt email before returning
      const decryptedEmail = decryptEmail(user.email);
      user.email = decryptedEmail; // Replace encrypted email with decrypted version
  
      // If login is successful
      return {
        success: true,
        message: "Login successful",
        user,
      };
    } catch (error) {
      console.error("Error during user login:", error);
      return { success: false, message: "Error logging in" };
    }
  }
  
}


