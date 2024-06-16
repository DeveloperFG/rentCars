import React, { useEffect, useState, useContext } from 'react'

import { UserContext } from '@/context/userContext';

import { Box, Button, Input, Heading, Text, InputGroup, InputRightElement, CircularProgress, Textarea } from "@chakra-ui/react";

import firebase, { storage } from '../../db/db';

import Link from "next/link";
import Image from "next/image"

import * as BsIcons from 'react-icons/bs';

import { toast } from 'react-toastify';

import Header from './Header';


import * as AiIcons from 'react-icons/ai';


export default function Registro() {

    let { controlStep, setControlStep, imgExtras, setImgExtras, urls, setUrls } = useContext(UserContext);

    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [cpf, setCpf] = useState('')
    const [contato, setContato] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const [imgDoc, setImagDoc] = useState([])
    const [urlDoc, setUrlDoc] = useState('')
    const [inputDoc, setInputDoc] = useState()


    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false)
    const [inputImgs, setInputImgs] = useState()

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


    // const handleFile = (e) => {

    //     setInputDoc()

    //     if (e.target.files[0]) {

    //         const image = e.target.files[0];

    //         if (image.type === 'image/jpeg' || image.type === 'image/png') {

    //             setImagDoc(image)
    //             setUrlDoc(URL.createObjectURL(e.target.files[0]))

    //         } else {
    //             toast.warn("envie uma imagem do tipo PNG ou JPEG", {
    //                 icon: "🚫"
    //             });
    //             setImagDoc('');
    //             setInputDoc('');
    //             return;
    //         }

    //     }
    // }



    const handleFiles = (e) => {
        // console.log(e.target.files[0])

        // setInputImgs()

        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();
            setImagDoc((prevState) => [...prevState, newImage]);
        }

    }


    async function handleUpload() {

        if (imgDoc == '') {
            toast.warn('Selecione o arquivo!')
            return;
        }

        const promises = [];
        imgDoc.map((image) => {
            const uploadTask = storage.ref(`img/Clientes/${image.name}`).put(image);
            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    await firebase.storage()
                        .ref('img/Clientes')
                        .child(image.name)
                        .getDownloadURL()
                        .then(async (url) => {
                            setUrls((prevState) => [...prevState, url]);
                            setImgExtras((prevState) => [...prevState, url]);


                        });
                    setControlStep(controlStep + 1)
                    setLoading(false)
                }
            );
        });

        Promise.all(promises)
            .then(() => toast.success("Upload com sucesso!"))
            .catch((err) => {
                toast.error('Ops! parace que deu algum erro!')
                console.log(err);
            })
    };



    function refreshPage() {
        window.location.reload()
    }


    return (
        <>
            {/* <Header /> */}


            <Box width='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column' height='100vh' >

                <Box display='flex' alignItems='start' justifyContent='start' className='query-login' flexDirection='column'>
                    <Text fontSize={22} color='#126180 ' fontFamily='sans-serif'>Olá! queremos te conhecer melhor</Text>
                    <Text fontSize={22} color='#126180 ' fontFamily='sans-serif'>Selecione uma foto do seu </Text>
                    <Text fontSize={22} color='#126180 ' fontFamily='sans-serif'> Documento de identificação. </Text>
                </Box>

                <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' className='query-input-login'>

                    <Box width='90%' display='flex' alignItems='center' marginTop='3%' flexDirection='column' >


                        <Box marginTop='25%' width='100%' display='flex' flexDirection='column'>
                            <Box width='100%' >
                                <Heading fontSize={16} marginBottom='3%'>Documento</Heading>
                            </Box>

                            <span style={{ fontSize: '10px' }}>Rg / Habilitação </span>
                            < label className='label-avatar'>
                                <input type='file' multiple accept='image/*' value={inputDoc} onChange={handleFiles} /> <br />
                            </label>


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
                    <Button backgroundColor='#367588' color='#fff' width='90%' onClick={handleUpload}>Prosseguir...{load ? <CircularProgress size={6} isIndeterminate color='green.300' marginLeft='2%' /> : ''}</Button>
                </Box>

            </Box>


        </>
    )
}
