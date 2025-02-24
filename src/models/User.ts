import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {  // exportando la interfaz
    handle: string;
    name: string;
    email: string;
    password: string;
    description: string;
    image: string;
    links: string;

}



//codigo moongoose
const userShema = new Schema({
    handle: {
        type: String,
        required: true,
        trim: true,  //trim elimina espacios en blanco
        lowercase: true, //lowercase para convertir todo a minuscula
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true  //trim elimina espacios en blanco
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, //unique para que no se repita el email
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    links: {
        type: String,
        default: '[]'
    }
})

const User = mongoose.model<IUser>('User', userShema) //Aqui le pasamos el modelo que tendra el Usuario
export default User; // ya lo exporatamos