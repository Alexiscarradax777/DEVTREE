import mongoose from 'mongoose';
import colors from 'colors'
import User, { IUser } from '../models/User'


export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors.cyan.bold(`MongoDB conectado en ${url} `) )
    } catch (error) {
        console.log(colors.bgRed.white.bold(error.message) ) //message es el mensaje de error
        process.exit(1) // salir del proceso

    }
}