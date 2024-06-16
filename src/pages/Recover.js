import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '@/context/userContext';


import firebase from "../../db/db";

import { Box, Button, Flex, Heading, Text, Input, CircularProgress } from "@chakra-ui/react";
import Link from "next/link";


import * as SiIcons from 'react-icons/si';


export default function Recover() {

    let { nome, setNome, sobrenome, setSobrenome, cpf, setCpf } = useContext(UserContext);

    const [email, setEmail] = useState('')
    const [load, setLoad] = useState(false)


    function RecoverPassword() {
        setLoad(true)

        firebase.auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                alert('Enviamos um e-mail para você!')
                setEmail('')
                setLoad(false)
                window.location.href = "./Login";
            })
            .catch((error) => {
                alert('Erro ao enviar e-mail')
                console.log(error)
                setEmail('')

            }).finally(() => setLoad(false))
    }

    return (
        <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' width='100%' height='100vh'>
            <Box display='flex' flexDirection='column' className='div-recover'>
                <Box display='flex' alignItems='center' justifyContent='center'>
                    <Heading color='#126180'>Recupere sua senha...</Heading>
                    <SiIcons.SiMinutemailer className='icon' color='#367588 ' size={50} />
                </Box>
                <Input value={email} onChange={(text) => setEmail(text.target.value)} marginTop='2%' placeholder='Digite seu email' />
                <Button marginTop='2%' color='#126180' onClick={RecoverPassword}>Enviar email {load ? <CircularProgress size={6} isIndeterminate color='green.300' marginLeft='2%' /> : ''}</Button>
            </Box>

        </Box>
    )
}
