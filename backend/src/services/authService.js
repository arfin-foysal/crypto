const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { STATUS, ROLES } = require("../constants/constant");
const { sendEmail } = require("../emails/emailService");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

class AuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// **User Registration**
const register = async (
  full_name,
  email,
  password,
  country_id,
  verification_type,
  id_number,
  verification_image1,
  verification_image2
) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new AuthError("User already exists", 409);

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate unique user code
  let userCode = `USR-${Date.now().toString().slice(-6)}${Math.floor(
    Math.random() * 1000
  )}`;

  // Check if code already exists
  const existingCode = await prisma.user.findFirst({
    where: { code: userCode },
  });

  // If code exists, regenerate with a different random number
  if (existingCode) {
    userCode = `USR-${Date.now().toString().slice(-6)}${
      Math.floor(Math.random() * 9000) + 1000
    }`;
  }

  // Start a transaction to ensure both user creation and bank account assignment succeed or fail together
  return await prisma.$transaction(async (prisma) => {
    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        country_id: BigInt(country_id),
        verification_type,
        id_number,
        verification_image1,
        verification_image2,
        code: userCode,
      },
    });

    // Find an available bank account (null user_id and is_open = true)
    // const availableBankAccount = await prisma.bankAccount.findFirst({
    //   where: {
    //     user_id: null,
    //     is_open: true,
    //   },
    //   include: {
    //     bank: true,
    //   },
    // });

    // If an available bank account is found, assign it to the user
    // if (availableBankAccount) {
    //   await prisma.bankAccount.update({
    //     where: { id: availableBankAccount.id },
    //     data: { user_id: newUser.id },
    //   });
    // }

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    //send email asynct
    await sendEmail(newUser, {
      subject: "Welcome to Qacent!",
      message: "Your account was created successfully! Please wait for your account to be approved.",
    });

    // Return response with user info and bank account details if assigned
    return {
      access_token: token,
      token_type: "Bearer",
      expires_in: JWT_EXPIRES_IN,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    };
  });
};

// **User Login**
const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AuthError("Invalid credentials: User not found", 403);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthError("Invalid credentials: User not found", 403);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    access_token: token,
    token_type: "Bearer",
    expires_in: JWT_EXPIRES_IN,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

const adminLogin = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AuthError(" Invalid credentials: User not found", 409);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthError("Invalid credentials: User not found", 409);

  if (user.status !== STATUS.ACTIVE)
    throw new AuthError("Account is FROZEN", 409);
  if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPERADMIN)
    throw new AuthError("Access denied", 409);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    access_token: token,
    token_type: "Bearer",
    expires_in: JWT_EXPIRES_IN,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

module.exports = { register, login, adminLogin };
