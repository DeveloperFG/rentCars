import React, { useEffect, useState, useContext } from 'react'

import { Box, Button, Input, Heading, Text, InputGroup, InputRightElement, CircularProgress } from "@chakra-ui/react";

import firebase, { storage } from "../../connection/db";

import Link from "next/link";
import Image from "next/image"

import * as BsIcons from 'react-icons/bs';

import { toast } from 'react-toastify';

import Header from './Header';


import * as AiIcons from 'react-icons/ai';

import whats from '../img/comp.png'

export default function NovoCliente() {

    // let { nome, setNome, sobrenome, setSobrenome, cpf, setCpf } = useContext(UserContext);

    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [cpf, setCpf] = useState('')
    const [contato, setContato] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const [imgDoc, setImagDoc] = useState('')
    const [urlDoc, setUrlDoc] = useState('')
    const [inputDoc, setInputDoc] = useState()

    const [openEye, setOpenEye] = useState(false)
    const [load, setLoad] = useState(false)




    function handleOpenEye() {
        setOpenEye(!openEye)
    }

    function deleteImg() {
        setImagDoc('')
        setUrlDoc('')
        setInputDoc('')
    }



    const handleFile = (e) => {

        setInputDoc()

        if (e.target.files[0]) {

            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {

                setImagDoc(image)
                setUrlDoc(URL.createObjectURL(e.target.files[0]))

            } else {
                toast.warn("envie uma imagem do tipo PNG ou JPEG", {
                    icon: "🚫"
                });
                setImagDoc('');
                setInputDoc('');
                return;
            }

        }
    }



    async function handleLogin() {

        // cadastrar empresa com foto de perfil

        setLoad(true)

        if (nome == '' || sobrenome == '' || cpf == '' || contato == '' || email == '' || senha == '' || imgDoc == '') {
            toast.info("Preencha todos os campos!", {
                icon: "😒"
            });
            setLoad(false)
            return;
        }

        const uploadTask = await firebase.storage()
            .ref(`img/Clientes/${imgDoc.name}`)
            .put(imgDoc)
            .then(async () => {

                toast.success("Upload sucesso!", {
                    icon: "😁"
                });

                await firebase.storage().ref('img/Clientes')
                    .child(imgDoc.name).getDownloadURL()
                    .then(async (ul) => {
                        let urlFoto = ul;

                        await firebase.firestore().collection('Clientes')
                            .doc()
                            .set({
                                cpf: cpf,
                                nome: nome,
                                sobrenome: sobrenome,
                                contato: contato,
                                email: email,
                                profile: ul,
                            })
                            .then(() => {
                                setLoad(false)
                                toast.success("Cadastrado com sucesso!", {
                                    icon: "✅"
                                });

                                setTimeout(refreshPage, 2500)

                            })
                            .catch((error) => {
                                console.log(error + 'Deu algum erro')
                                toast.error("Deus algum erro!", {
                                    icon: "❌"
                                });

                                setLoad(false)
                            })
                    })
            })

    }


    function refreshPage() {
        window.location.reload()
    }


    return (
        <>
            <Header />


            <Box width='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column' height='100vh' >

                <Heading fontSize={22} color='#126180 ' fontFamily='sans-serif'>Olá!</Heading>
                <Box display='flex' alignItems='center' justifyContent='center' className='query-login'>
                    <Heading fontSize={22} color='#126180 ' fontFamily='sans-serif'>Para começar, preencha com seus dados!</Heading>
                </Box>

                <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' className='query-input-login'>

                    <Box width='90%' display='flex' alignItems='center' marginTop='3%' flexDirection='column' >

                        <Box width='100%'>
                            <Heading fontSize={16} marginBottom='3%'>Dados pessoais</Heading>
                        </Box>


                        <InputGroup>
                            <Input placeholder='Nome'
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup mt={3}>
                            <Input placeholder='Sobrenome'
                                value={sobrenome}
                                onChange={(e) => setSobrenome(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup mt={3}>
                            <Input placeholder='Cpf'
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup mt={3}>
                            <Input placeholder='Contato'
                                value={contato}
                                onChange={(e) => setContato(e.target.value)}
                            />
                        </InputGroup>


                        <InputGroup mt={3}>
                            <Input placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup mt={3}>
                            <Input type={openEye == false ? 'password' : 'text'}
                                placeholder='Senha'
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)} />

                            <InputRightElement>
                                {openEye ? <AiIcons.AiTwotoneEye className='icon' color='#367588 ' size={20} onClick={handleOpenEye} /> : <AiIcons.AiTwotoneEyeInvisible className='icon' color='#367588 ' size={20} onClick={handleOpenEye} />}
                            </InputRightElement>
                        </InputGroup>


                        <Box marginTop='5%' width='100%' display='flex' flexDirection='column'>
                            <Box width='100%' >
                                <Heading fontSize={16} marginBottom='3%'>Documentos</Heading>
                            </Box>

                            <span style={{ fontSize: '10px' }}>Rg / Habilitação </span>
                            < label className='label-avatar'>
                                <input type='file' multiple accept='image/*' value={inputDoc} onChange={handleFile} /> <br />
                            </label>

                            {/* <span style={{ fontSize: '10px' }}>Selfie com documento </span>
                            < label className='label-avatar'>
                                <input type='file' multiple accept='image/*' value={inputDoc} onChange={handleFile} /> <br />
                            </label> */}

                            <Box>
                                {imgDoc.length != '' && (
                                    <Box display='flex' alignItems='center' justifyContent='start' height='10'>
                                        <BsIcons.BsXCircle className='icon' color="red" onClick={deleteImg} />
                                        <span style={{ margin: '2%', color: 'red' }}>excluir imagem</span>
                                    </Box>

                                )}
                            </Box>

                        </Box>

                    </Box>

                </Box>


                <Box display='flex' alignItems='center' justifyContent='center' className='query-button-login'>
                    <Button backgroundColor='#367588' color='#fff' width='90%' onClick={handleLogin}>Finalizar Cadastro {load ? <CircularProgress size={6} isIndeterminate color='green.300' marginLeft='2%' /> : ''}</Button>

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
