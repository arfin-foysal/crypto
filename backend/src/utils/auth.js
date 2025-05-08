const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");

class Auth {
  static async user(req) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) return null;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          full_name: true,
          email: true,
          role: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });

      return user;
    } catch (error) {
      return null;
    }
  }

  static async check(req) {
    const user = await this.user(req);
    return !!user;
  }

  static async id(req) {
    const user = await this.user(req);
    return user?.id;
  }
}

module.exports = Auth;
