import bcrypt from 'bcrypt'; // se utiliza para seguridad de contraseña
    export const hashPassword = async ( password : string ) => { 
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt); // se le pasa la contraseña y el salt

}

export const checkPassword = async (enteredPassword: string, hash: string) => { // se le pasa la contraseña ingresada y la contraseña hasheada
    return await bcrypt.compare(enteredPassword, hash) // se compara la contraseña ingresada con la contraseña hasheada

}