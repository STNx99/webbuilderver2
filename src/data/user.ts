import { User } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export const UserDAL = {
  createUser: async (user: User) => {
    try {
      return await prisma.user.create({
        data: {
          Id: user.Id,
          Email: user.Email,
          FirstName: user.FirstName,
          LastName: user.LastName,
          ImageUrl: user.ImageUrl,
          CreatedAt: user.CreatedAt,
          UpdatedAt: user.UpdatedAt,
        },
      });
    } catch (error) {
      console.error("Error when creating user", error);
      throw error;
    }
  },

  updateUser: async (user: User) => {
    try {
      return await prisma.user.update({
        where: { Id: user.Id },
        data: {
          Email: user.Email,
          FirstName: user.FirstName,
          LastName: user.LastName,
          ImageUrl: user.ImageUrl,
          UpdatedAt: user.UpdatedAt,
        },
      });
    } catch (error) {
      console.error("Error when updating user", error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      return await prisma.user.delete({
        where: { Id: userId },
      });
    } catch (error) {
      console.error("Error when deleting user", error);
      throw error;
    }
  },
};
