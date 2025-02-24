import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, getUser, getUserByHandle, login, searchByHandle, updateProfile, uploadImage } from './handlers';
import { handleInputErrors } from './middleware/validation';
import { authenticate } from './middleware/auth';


const router = Router()

//Router
router.post('/auth/register', 
    body('handle')
        .notEmpty() //que el campo no este vacio
        .withMessage('El campo handle no puede estar vacio'), //mensajae de error
    body('name')
        .notEmpty() 
        .withMessage('El campo name no puede estar vacio'),
    body('email')
        .isEmail() // que el campo sea un email
        .withMessage('E-mail no válido'),
    body('password')
        .isLength({min: 8}) //que el campo tenga al menos 8 caracteres
        .withMessage('El password debe tener al menos 8 caracteres'),    
    handleInputErrors,
    createAccount
);
    //Ruta del login Autenticacion de Usuario Inicio de Sesion
router.post('/auth/login',
    body('email')
        .isEmail() // que el campo sea un email
        .withMessage('E-mail no válido'),
    body('password')
        .notEmpty() //que el campo no este vacio
        .withMessage('El Password es Obligatorio'),
        handleInputErrors,
        login
);

router.get('/user', authenticate, getUser)
router.patch('/user', 
    body('handle')
        .notEmpty() //que el campo no este vacio
        .withMessage('El campo handle no puede estar vacio'), //mensajae de error
        handleInputErrors,
        authenticate, 
        updateProfile
    )

    router.post('/user/image', authenticate, uploadImage)

    //URL dinamica y llamamos la funcion getUserByHandle
    router.get('/:handle', getUserByHandle)

    router.post('/search',
        body('handle')
        .notEmpty() 
        .withMessage('El handle no puede ir vacio'),
        handleInputErrors,
        searchByHandle
    )
    
export default router;
