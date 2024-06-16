import React, { useEffect, useState, useContext } from 'react'

import { UserContext } from '@/context/userContext';

import { Box, Button, Input, Heading, Text, InputGroup, InputRightElement, CircularProgress, Textarea, useTab } from "@chakra-ui/react";

import firebase, { storage } from "../../db/db";

import Link from "next/link";
import Image from "next/image"

import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';

import { toast } from 'react-toastify';

import Header from './Header';

export default function Visitante() {

    let { controlStep, setControlStep } = useContext(UserContext);

    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [cpf, setCpf] = useState('')
    const [contato, setContato] = useState('')
    const [load, setLoad] = useState(false)

    const [openEye, setOpenEye] = useState(false)

    const [imgDoc, setImagDoc] = useState([])
    const [urlDoc, setUrlDoc] = useState('')
    const [inputDoc, setInputDoc] = useState()

    const [listaSorteados, setListaSorteados] = useState([])

    const [protocolo, setProtocolo] = useState([])
    const [detalhes, setDetalhes] = useState([])

    const [listCars, setListCars] = useState([])

    const [atualizada, setAtualizada] = useState([])
    const [dataVisitante, setDataVisitante] = useState([])

    // Data
    let timeElapsed = Date.now();
    let today = new Date(timeElapsed).toLocaleString();

    let data = new Date();
    let dia = data.getDate();
    let mesatual = data.getMonth()
    let ano = data.getFullYear();

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const mesFormatado = meses[mesatual]

    function handleOpenEye() {
        setOpenEye(!openEye)
    }


    useEffect(() => {
        const storageCars = localStorage.getItem('dadosCar');

        if (storageCars) {
            setListCars(JSON.parse(storageCars))
        } else {
            console.log('Sem lista de carros.')
        }

    }, [])


    function gerarProtocolo() {
        // gerar dentro de um intervalo
        // let teste = Math.floor(Math.random() * (200 - 100 + 1)) + 100;

        let NumeroSorteado = Math.floor(Math.random() * 1000000);

        let validando = listaSorteados.includes(NumeroSorteado)

        if (validando) {

            alert('numero ja foi sorteado')
            return;

        } else (

            listaSorteados.push(NumeroSorteado),
            setProtocolo(NumeroSorteado)

        )

    }


    const handleFile = (e) => {

        pegarDate()
        gerarProtocolo()
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



    function deleteImg() {
        setImagDoc('')
        setUrlDoc('')
        setInputDoc('')
    }


    async function handleAcesso() {

        // cadastrar empresa com foto de perfil

        setLoad(true)

        if (nome == '' || sobrenome == '' || cpf == '' || contato == '') {
            toast.info("Preencha todos os campos!", {
                icon: "😒"
            });
            setLoad(false)
            return;
        }

        if (imgDoc == '') {
            toast.info("Selecione seu documento de identificação!", {
                icon: "😒"
            });
            setLoad(false)
            return;
        }

        const uploadTask = await firebase.storage()
            .ref(`img/Visitantes/${imgDoc.name}`)
            .put(imgDoc)
            .then(async () => {

                toast.success("Upload sucesso!", {
                    icon: "😁"
                });

                await firebase.storage().ref('img/Visitantes')
                    .child(imgDoc.name).getDownloadURL()
                    .then(async (ul) => {
                        let urlFoto = ul;

                        await firebase.firestore().collection('Visitantes')
                            .doc()
                            .set({
                                cpf: cpf,
                                nome: nome,
                                sobrenome: sobrenome,
                                protocolo: protocolo,
                                contato: contato,
                                detalhes: [{ nome: listCars.map((dados) => dados.nome).toString(), reservas: dataVisitante, diasTotal: listCars.map((dados) => dados.diasTotal), total: listCars.map((dados) => dados.valor), desconto: listCars.map((dados) => dados.desconto) }],
                                status: 'Visitantes',
                                situacao: 'Solicitado',
                                imagem: ul,

                            })
                            .then(() => {

                                let DataUser = []

                                DataUser.push({
                                    nome: nome,
                                    sobrenome: sobrenome,
                                    protocolo: protocolo,
                                    detalhes: detalhes,
                                    status: 'Visitantes',
                                })

                                setLoad(false)
                                setControlStep(controlStep + 1)
                                localStorage.setItem('userVisitante', JSON.stringify(DataUser))
                                handleCarsReservas()

                                toast.success("Parabéns!!!", {
                                    icon: "✅"
                                });

                                setTimeout(pegarDate, 2500)
                                handleHistorico()

                            })
                            .catch((error) => {
                                console.log(error + 'Deu algum erro')
                                toast.error("Deu algum erro!", {
                                    icon: "❌"
                                });

                                setLoad(false)
                            })
                    })
            })

    }



    function pegarDate() {

        for (const obj of listCars) {
            setAtualizada(obj.datasDB)
        }

        for (const obj of listCars) {
            setDataVisitante(obj.dataCliente)
        }

    }

    async function handleHistorico() {

        let carro = listCars.map((item) => item.nome).toString()
        let diaAtual = dia

        await firebase.firestore().collection('Historico')
            .doc()
            .set({
                cliente: nome,
                status: 'visitante',
                carro: carro,
                dia: diaAtual,
                mes: mesFormatado,
                locacao: dataVisitante

            })
            .then(() => {
                console.lo("Histórico criado!");
            })
            .catch((error) => {
                console.log(error + 'Deu algum erro')
            })
    }



    function handleCarsReservas() {

        let idSelected = listCars.map((item) => item.id).toString()
        // console.log(datasAtualizada)

        firebase.firestore().collection('Garagem')
            .doc(idSelected)
            .update({
                reservas: atualizada
            })

            .then(() => {
                console.log("Reserva atualizada!")
            })
            .catch((error) => {
                console.log(error + 'Deu algum erro')
            })


    }


    return (
        <Box width='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column' height='100vh' >
            <Box width='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                <Text fontSize={22} color='#126180 ' fontFamily='sans-serif'>Olá! queremos te conhecer melhor</Text>
                <Text fontSize={18} color='#126180 ' fontFamily='sans-serif'>Por favor preencha todos os campos! </Text>
            </Box>

            <Box width='80%' display='flex' flexDirection='column' marginTop='5%'>
                <Input onChange={((text) => setNome(text.target.value))} placeholder='NOME' />
                <Input onChange={((text) => setSobrenome(text.target.value))} placeholder='SOBRENOME' marginTop='3%' />
                <Input onChange={((text) => setCpf(text.target.value))} placeholder='CPF' marginTop='3%' />
                <Input onChange={((text) => setContato(text.target.value))} placeholder='CONTATO' marginTop='3%' />


                <Box marginTop='25%' width='100%' display='flex' flexDirection='column'>
                    <Box width='100%' >
                        <Heading fontSize={16} marginBottom='3%'>Documento</Heading>
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

                <Button display='flex' width='100%' marginTop='3%' color='#126180 ' fontWeight='bolder' onClick={handleAcesso}>Avançar</Button>

            </Box>



        </Box>


    )
}
