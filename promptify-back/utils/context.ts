import { Request } from "express";
import { Document } from "mongoose";
import { User } from "../types";
import jwt from "jsonwebtoken";
import UserCollection from "../models/User";
import { GraphQLError } from "graphql";

interface JwtPayload {
  username: string;
  id: string;
  iat: number;
}

export const getCurrentUser = async (
  req: Request
): Promise<Document<User> | null> => {
  try {
    if (!req) {
      return null;
    }
    // ! ALERTA: debo enviar el token sin comillas desde apollo-server sino llegaran con comillas extras y el startsWith no va a funcionar
    const auth = req.headers.authorization;
    if (!auth) {
      return null;
    }

    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.SECRET || ""
      ) as JwtPayload;

      const current = await UserCollection.findById(decodedToken.id);
      return current;
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLError(error.message, {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    } else {
      throw new GraphQLError("An unknown error occurred", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
};
