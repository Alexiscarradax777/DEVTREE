import { Request, Response } from "express"; // ponerlo cuando estes tres puntitos
import { validationResult } from "express-validator";
import slug from "slug";
import formidable from "formidable"
import {v4 as uuid} from "uuid"
import User from "../models/User";
import { Error } from "mongoose";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";

//Registro de Usuario
 export const createAccount = async (req: Request, res: Response) => {


    const { email, password } = req.body;

    const userExists = await User.findOne({ email }); //findOne es un metodo de mongoose            
    if(userExists) {
        const error = new Error('Un usuario con ese email ya esta registrado');
        res.status(409).json({ error: error.message });
        return;
    }

    const handle = slug(req.body.handle, ''); //convertimos el handle a minusculas y quitamos los caracteres especiales
    const handleExists = await User.findOne({ handle }); //buscamos handle
    if(handleExists) {
        const error =  new Error('Nombre de usuario ya existe');
        res.status(409).json({ error: error.message });
        return;
    } 


    const user = new User(req.body);
    
    user.password = await hashPassword(password); // hashear la contraseña llamamos la funcion user nuestro objeto y passaword
    user.handle = handle; // asignamos el handle a user

    await user.save(); // save to database
    res.status(201).send('Registro Creado Correctamente');

}

    //Exportamos la funcion login a router Autenticacion de Usuario 
    export const login = async (req: Request, res: Response ) => {
    
    //Mabejar Errores    
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()})
        return
    }

    const {email, password} = req.body;
    
    //Revisar si el usuario esta registrado
    const user = await User.findOne({email})
    if(!user) { // si no existe el usuario
        const error = new Error('Usuario no existe')
        res.status(404).json({error: error.message})
        return;
    }
    // Comprobar el password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('Contraseña Incorrecta')
        res.status(401).json({error: error.message})
        return;
    }
    const token = generateJWT({id: user._id})

    res.send(token)



}


    export  const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
    }

    export const updateProfile = async (req: Request, res: Response) => {
        try {
            const { description, links } = req.body

            const handle = slug(req.body.handle, ''); //convertimos el handle a minusculas y quitamos los caracteres especiales
            const handleExists = await User.findOne({ handle }); //buscamos handle
            if(handleExists && handleExists.email !== req.user.email) {
                const error =  new Error('Nombre de usuario ya existe');
                res.status(409).json({ error: error.message });
                return;
            }

            //Actualizar el usuario
            req.user.description = description
            req.user.handle = handle
            req.user.links = links
            await req.user.save()
            res.send('Perfil Actualizado Correctamente')
        } catch (e) {
            const error = new Error('Hubo un error')
            res.status(500).json({error: error.message})
            return
        }
    }

    export const uploadImage = async (req: Request, res: Response) => {
        const form = formidable({multiples: false})
            
        
        try {
            form.parse(req, (error, filds, files) => {
                cloudinary.uploader.upload(files.file[0].filepath, {public_id: uuid()}, async function(error, result){
                    if(error) {
                        const error = new Error('Hubo un error al subir la imagen')
                        res.status(500).json({error: error.message})
                        return
                    }
                    if(result){
                        req.user.image = result.secure_url
                        await req.user.save()
                        res.json({image: result.secure_url})
                    }
                })
            })
            
            
        } catch (e) {
            const error = new Error('Hubo un error')
            res.status(500).json({error: error.message})
            return
            
        }
    }
    
    export const getUserByHandle = async (req: Request, res: Response) => {
        try {
            const {handle} = req.params // handle es el nombre de usuario que se pasa por la url es un parametro
            //hacemos una consulta en la base de datos para obtener el usuario que tenga el nombre de usuario que se pasa por la url
            //findOne es un metodo de mongoose que nos permite buscar un documento en la base de datos en este caso handle es el nombre de usuario que se pasa por la url
            const user = await User.findOne({handle}).select('-_id -__v -email -password') // se seleccionan todos los campos menos el id, el __v, el email y el password
            //si no se encuentra el usuario se devuelve un error
            if(!user) {
                const error = new Error('El Usuario no existe')
                res.status(404).json({error: error.message}) // se muestra el error en la consola
            }
            res.json(user) // se devuelve el usuario en formato json
            
        } catch (e) {
            const error =  new Error('Hubo un error')
            res.status(500).json({error: error.message})
            return
            
        }
    } 

    export const searchByHandle = async (req: Request, res: Response) => {
        try {
            const {handle} = req.body
            const userExists = await User.findOne({handle})
            if(userExists) {
                const error = new Error(`${handle} ya esta registrado`)
                res.status(409).json({error: error.message})
                return
            }
            res.send(`${handle} esta disponible`)
            
        } catch (e) {
            const error =  new Error('Hubo un error')
            res.status(500).json({error: error.message})
            return
            
        }
    }




