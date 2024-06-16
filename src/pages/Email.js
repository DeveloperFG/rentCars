import React, { useEffect, useState, useContext } from 'react'

import { UserContext } from '@/context/userContext';

import { Box, Button, Input, Heading, Text, InputGroup, InputRightElement, CircularProgress, Textarea } from "@chakra-ui/react";

import firebase, { storage } from "../../db/db";

import Link from "next/link";
import Image from "next/image"

import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';

import { toast } from 'react-toastify';

import Header from './Header';

export default function Email() {

    let { controlStep, setControlStep, imgExtras, setImgExtras, urls, setUrls } = useContext(UserContext);

    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [cpf, setCpf] = useState('')
    const [contato, setContato] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const [openEye, setOpenEye] = useState(false)


    function handleOpenEye() {
        setOpenEye(!openEye)
    }


    async function handleEmail() {

        if (nome == '' || sobrenome == '' || cpf == '' || contato == '' || email == '' || senha == '') {
            toast.warn('Preencha todos os campos!')
            return;
        }

        await firebase.auth().createUserWithEmailAndPassword(email, senha)
            .then(async (value) => {

                await firebase.firestore().collection('Clientes')
                    .doc(value.user.uid)
                    .set({
                        protocolo: 0,
                        nome: nome,
                        sobrenome: sobrenome,
                        cpf: cpf,
                        contato: contato,
                        email: email,
                        senha: senha,
                        imagens: imgExtras,
                        detalhes: [{ nome: '', reservas: '', diasTotal: '', total: '' }],
                        status: 'Clientes',
                        situacao: 'Solicitado'
                    })
                    .then(() => {
                        setNome('');
                        setSobrenome('');
                        setCpf('');
                        setContato('');
                        setEmail('');
                        setSenha('');
                        setUrls('')
                        setControlStep(controlStep + 1)
                        toast.success('Criado com sucesso!!!')

                    })

            })
            .catch((error) => {
                if (error.code === 'auth/weak-password') {
                    toast.warn('Senha muito fraca..')
                } else if (error.code === 'auth/email-already-in-use') {
                    toast.warn('Esse email ja existe!');
                }

            })


    }



    return (
        <Box width='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column' height='100vh' >
            <Box width='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                <Text fontSize={18} color='#126180 ' fontFamily='sans-serif'>Agora vamos criar sua conta</Text>
                <Text fontSize={18} color='#126180 ' fontFamily='sans-serif'>Por favor preencha todos os campos! </Text>
            </Box>

            <Box width='80%' display='flex' flexDirection='column' marginTop='5%'>
                <Input onChange={((text) => setNome(text.target.value))} placeholder='NOME' />
                <Input onChange={((text) => setSobrenome(text.target.value))} placeholder='SOBRENOME' marginTop='3%' />
                <Input onChange={((text) => setCpf(text.target.value))} placeholder='CPF' marginTop='3%' />
                <Input onChange={((text) => setContato(text.target.value))} placeholder='CONTATO' marginTop='3%' />
                <Input onChange={((text) => setEmail(text.target.value))} placeholder='EMAIL' marginTop='3%' />

                <InputGroup mt={3}>
                    <Input type={openEye == false ? 'password' : 'text'}
                        placeholder='SENHA'
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)} />

                    <InputRightElement>
                        {openEye ? <AiIcons.AiTwotoneEye className='icon' color='#367588 ' size={20} onClick={handleOpenEye} /> : <AiIcons.AiTwotoneEyeInvisible className='icon' color='#367588 ' size={20} onClick={handleOpenEye} />}
                    </InputRightElement>
                </InputGroup>

                <Button display='flex' width='100%' marginTop='3%' color='#126180 ' fontWeight='bolder' onClick={handleEmail}>Criar</Button>
            </Box>



        </Box>


    )
}
