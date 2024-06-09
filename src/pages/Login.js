import React, { useEffect, useState, useContext } from 'react'

import { Box, Button, Input, Flex, Heading, Text, Stack, InputGroup, InputLeftElement, InputRightElement, PhoneIcon, CheckIcon, Menu, MenuItem, CircularProgress } from "@chakra-ui/react";

import { UserContext } from '@/context/userContext';

import firebase from "../../connection/db";

import Link from "next/link";
import Image from "next/image"

import { toast } from 'react-toastify';

import Header from './Header';


import * as AiIcons from 'react-icons/ai';

import whats from '../img/comp.png'


export default function Login() {

    let { user, setUser } = useContext(UserContext);


    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const [load, setLoad] = useState(false)

    const [openEye, setOpenEye] = useState(false)


    function handleOpenEye() {
        setOpenEye(!openEye)
    }


    async function handleLogin() {

        setLoad(true)

        await firebase.auth().signInWithEmailAndPassword(email, senha)
            .then(async (value) => {

                await firebase.firestore().collection('Clientes')
                    .doc(value.user.uid)
                    .get()
                    .then((snapshot) => {

                        let DataUser = [];

                        DataUser.push({
                            uid: snapshot.data().uid,
                            nome: snapshot.data().nome,
                            sobrenome: snapshot.data().sobrenome,
                            // cpf: snapshot.data().cpf,
                            email: snapshot.data().email,
                        })

                        setUser(value.user)
                        setLoad(false)
                        localStorage.setItem('userLogged', JSON.stringify(DataUser))
                        toast.success('Logado com sucesso!')

                    })
                window.location.href = "./";
                // <Redirect to='/Cadastrar' />
            })
            .catch((error) => {
                toast.error('Erro ao logar!!!')
                setLoad(false)

            })
    }



    return (
        <>
            <Header />

            <Box width='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column' height='100vh' >

                <Box display='flex' alignItems='start' justifyContent='start' flexDirection='column' className='query-login'>
                    <Heading fontSize={22} color='#126180 ' fontFamily='sans-serif'>Faça seu login!</Heading>
                    <small> <strong> Atenção! </strong> Digite um e-mail válido, que esteja em uso!</small>
                </Box>

                <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' className='query-input-login'>

                    <Box width='90%' display='flex' alignItems='center' marginTop='3%' flexDirection='column' >

                        <InputGroup>
                            <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <InputRightElement>
                                <AiIcons.AiTwotoneMail className='icon' color='#367588 ' size={20} onClick={handleOpenEye} />
                            </InputRightElement>
                        </InputGroup>

                        <InputGroup mt={3}>
                            <Input type={openEye == false ? 'password' : 'text'} placeholder='Senha' value={senha} onChange={(e) => setSenha(e.target.value)} />
                            <InputRightElement>
                                {openEye ? <AiIcons.AiTwotoneEye className='icon' color='#367588 ' size={20} onClick={handleOpenEye} /> : <AiIcons.AiTwotoneEyeInvisible className='icon' color='#367588 ' size={20} onClick={handleOpenEye} />}
                            </InputRightElement>
                        </InputGroup>

                    </Box>

                </Box>


                <Box display='flex' alignItems='center' justifyContent='center' className='query-button-login'>
                    <Button backgroundColor='#367588' color='#fff' width='90%' onClick={handleLogin}>Entrar {load ? <CircularProgress size={6} isIndeterminate color='green.300' marginLeft='2%' /> : ''} </Button>

                </Box>

                <Box display='flex' justifyContent='space-between' color='blue' className='query-opcao'>
                    <Box>
                        <Link style={{ color: '#126180', textDecoration: 'underline' }} href='./EtapasClientes'> Ainda não sou cliente </Link>
                    </Box>


                    <Box>
                        <Link style={{ color: '#126180', textDecoration: 'underline' }} href='./Recover' > Esqueci minha senha </Link>
                    </Box>

                </Box>


            </Box>

            <Box width='100%'>
                <Box className='query-link'>
                    <Link href="https://api.whatsapp.com/send?text=[https://rc-locacao.vercel.app/]" target='_blank'><Image src={whats} className='query-whats' /></Link>
                </Box>
            </Box>

        </>
    )
}
