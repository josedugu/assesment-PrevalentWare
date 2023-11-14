import { Prisma } from "../db/dbconnection.js";
import { GraphQLError } from 'graphql';

export const validateToken = async (token: string) => {
    try {
        const session = await Prisma.session.findUnique({
            where: {
                sessionToken: token
            },
            include: {
                User: true
            }
        })
        if (session) {
            return session
        } else { return false }
    } catch (error) {
        console.log(error);
        return false
    }
};

export const findRole = async (id: string) => {
    try {
        const role = await Prisma.role.findUnique({
            where: {
                id: String(id)
            }
        })
        if (role) {
            return role
        } else { return false }
    } catch (error) {
        console.log(error);
        return false
    }
}