import React, { useEffect, useState, useContext } from 'react'

import firebase from "../../db/db";

import { UserContext } from '@/context/userContext';

import { Box, Button, Flex, Heading, Text, Stack, CircularProgress } from "@chakra-ui/react";

import { toast } from 'react-toastify';

import * as BsIcons from 'react-icons/bs';

import Link from "next/link";
import Image from "next/image"

import agenda from '../img/agendamento.png'
import Visitante from './Visitante';

export default function Solicitacoes() {

    let { nome, setNome, sobrenome, setSobrenome, cpf, setCpf } = useContext(UserContext);

    const [clientes, setClientes] = useState([])
    const [visitantes, setVisitantes] = useState([])
    const [qualificacao, setQualificacao] = useState('')
    const [load, setLoad] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadImg, setLoadImg] = useState(false)

    const [onChange, setOnChange] = useState('')


    const [clienteSolicitado, setClienteSolicitado] = useState([])
    const [ClienteAndamento, setClienteAndamento] = useState([])
    const [ClienteFinalizado, setClienteFinalizado] = useState([])

    const [VisitanteSolicitado, setVisitanteSolicitado] = useState([])
    const [VisitanteAndamento, setVisitanteAndamento] = useState([])
    const [VisitanteFinalizado, setVisitanteFinalizado] = useState([])

    const [dadosGaragem, setDadosGaragem] = useState([])
    const [datasGaragem, setDatasGaragem] = useState([])

    const [datasClientes, setDatasClientes] = useState([])
    const [datasVisitantes, setDatasVisitantes] = useState([])

    const [idUsuario, setIdUsuario] = useState('')
    const [idCar, setIdCar] = useState('')
    const [statusUser, setStatusUser] = useState('')

    const [render, setRender] = useState(false)

    const [etapas, setEtapas] = useState(0)

    const [salvo, setSalvo] = useState(false)

    function onChangeCliente(event) {
        setOnChange(event.target.value);
    }

    function handleChangeSelect(event) {
        setQualificacao(event.target.value);
    }


    useEffect(() => {

        async function loadDadosGaragem() {

            await firebase.firestore().collection('Garagem').onSnapshot((doc) => {
                let DataUser = [];

                doc.forEach((doc) => {
                    DataUser.push({
                        id: doc.id,
                        nome: doc.data().nome,
                        reservas: doc.data().reservas,
                        disponibilidade: doc.data().disponibilidade,
                    })

                })

                for (const obj of DataUser) {
                    setDatasGaragem(obj.reservas)
                }

                setDadosGaragem(DataUser)
            })
        }

        loadDadosGaragem()

    }, [])


    useEffect(() => {

        async function loadAgendamento() {

            setLoadImg(true)

            await firebase.firestore().collection('Clientes').onSnapshot((doc) => {
                let DataUser = [];

                doc.forEach((doc) => {
                    DataUser.push({
                        id: doc.id,
                        nome: doc.data().nome,
                        sobrenome: doc.data().sobrenome,
                        cpf: doc.data().cpf,
                        detalhes: doc.data().detalhes,
                        status: doc.data().status,
                        situacao: doc.data().situacao,
                        protocolo: doc.data().protocolo,
                        imagens: doc.data().imagens,
                    })

                })

                // for (const obj of DataUser) {
                //     setDatasClientes(obj)
                // }

                let listSolicitados = DataUser.filter((item) => {
                    return (item.situacao === 'Solicitado')

                })

                let listAndamento = DataUser.filter((item) => {
                    return (item.situacao === 'Andamento')

                })

                let listFinalizado = DataUser.filter((item) => {
                    return (item.situacao === 'Finalizado')

                })

                setClientes(DataUser)
                setClienteSolicitado(listSolicitados)
                setClienteAndamento(listAndamento)
                setClienteFinalizado(listFinalizado)
                setLoadImg(false)
            })
        }

        loadAgendamento()

    }, [])

    useEffect(() => {

        setLoadImg(true)

        async function loadAgendamento() {

            await firebase.firestore().collection('Visitantes').onSnapshot((doc) => {
                let DataUser = [];

                doc.forEach((doc) => {
                    DataUser.push({
                        id: doc.id,
                        nome: doc.data().nome,
                        sobrenome: doc.data().sobrenome,
                        cpf: doc.data().cpf,
                        detalhes: doc.data().detalhes,
                        status: doc.data().status,
                        situacao: doc.data().situacao,
                        protocolo: doc.data().protocolo,
                        imagem: doc.data().imagem,
                    })

                })

                for (const obj of DataUser) {
                    setDatasVisitantes(obj.detalhes[0].dataCliente)
                }

                let listSolicitados = DataUser.filter((item) => {
                    return (item.situacao === 'Solicitado')

                })

                let listAndamento = DataUser.filter((item) => {
                    return (item.situacao === 'Andamento')

                })

                let listFinalizado = DataUser.filter((item) => {
                    return (item.situacao === 'Finalizado')

                })

                setVisitantes(DataUser)
                setVisitanteSolicitado(listSolicitados)
                setVisitanteAndamento(listAndamento)
                setVisitanteFinalizado(listFinalizado)
                setLoadImg(false)

            })

        }

        loadAgendamento()

    }, [])



    async function handleAndamento(dados) {

        // setLoading(false)

        swal({
            title: "Valide Alteração",
            text: "Confirma mudar para andamento?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    firebase.firestore().collection(dados.status == 'Clientes' ? 'Clientes' : 'Visitantes')
                        .doc(dados.id)
                        .update({
                            situacao: 'Andamento',
                        })

                    // setLoading(false)
                    swal("Progresso em andamento!", {
                        icon: "success",
                    });
                } else {
                    swal("Cancelado");
                    // setLoading(false)

                }
            });
    }


    async function handleFinalizadas(dados) {

        // setLoading(false)

        swal({
            title: "Valide Alteração",
            text: "Confirma finalizar essa locação?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    firebase.firestore().collection(dados.status == 'Clientes' ? 'Clientes' : 'Visitantes')
                        .doc(dados.id)
                        .update({
                            situacao: 'Finalizado',
                        })

                    // setLoading(false)
                    swal("Progresso em finalizado!", {
                        icon: "success",
                    });
                } else {
                    swal("Cancelado");
                    // setLoading(false)

                }
            });
    }


    useEffect(() => {
        const storageAuth = localStorage.getItem('dataFiltrada');

        if (storageAuth) {
            setDatasClientes(JSON.parse(storageAuth))
        } else {
            console.log('Não há datas!')
        }

    }, [datasGaragem])



    function Sincronizar(idSelecionado) {

        setStatusUser(idSelecionado.status)

        let selectCar = dadosGaragem.filter((item) => {
            return (item.nome === idSelecionado.detalhes[0].nome)

        })

        for (const obj of selectCar) {
            console.log(obj.id)
            setDatasGaragem(obj.reservas)
            setIdCar(obj.id)
            localStorage.setItem('dataFiltrada', JSON.stringify(obj.reservas))
        }

        setEtapas(etapas + 1)
        toast.success('Dados sicronizados!')

    }

    function ExcluirDatas(idSelecionado) {


        setIdUsuario(idSelecionado.id)

        // const storageAuth = localStorage.getItem('userLogged');

        let dataUser = idSelecionado.detalhes[0].reservas

        let dataText = dataUser

        for (var i = 0; i < datasGaragem.length; i++) {

            var array = datasGaragem[i];

            if (dataText.includes(array)) {
                let indice = datasGaragem.indexOf(array)
                datasGaragem.splice(indice, 1)
                setDatasGaragem(datasGaragem)

            }

        }

        for (var i = 0; i < dataUser.length; i++) {

            var array = dataUser[i];

            if (dataText.includes(array)) {
                let indice = dataUser.indexOf(array)
                dataUser.splice(indice, 1)
                setDatasClientes(dataUser)

            }

            setRender(!render)
            setEtapas(etapas + 1)

        }


    }


    async function handleEdit() {


        await firebase.firestore().collection(`${statusUser}`)
            .doc(idUsuario)
            .update({
                detalhes: [{ reservas: datasClientes }],
                protocolo: 0
            })

            .then(() => {
                console.log("Reserva atualizada!")
            })
            .catch((error) => {
                console.log(error + 'Deu algum erro')
            })


        await firebase.firestore().collection('Garagem')
            .doc(idCar)
            .update({
                reservas: datasGaragem
            })

            .then(() => {
                console.log("Reserva atualizada!")
            })
            .catch((error) => {
                console.log(error + 'Deu algum erro')
            })


        setSalvo(true)
    }

    async function ExcluirSolicitacao(idClicado) {

        await firebase.firestore().collection(idClicado.status).doc(idClicado.id)
            .delete()
            .then(() => {
                toast.success('Excluido com sucesso!')

            })
            .catch((error) => {
                toast.error('Erro ao excluir!!!')
            })
    }


    // console.log(etapas)
    // console.log(salvo)
    // console.log(datasClientes)


    return (
        <Box width='100%' height='100vh' display='flex' alignItems='center' justifyContent='start' flexDirection='column' >

            <Box width='100%' display='flex' alignItems='star' marginTop='5%' marginLeft='5%'>
                <Link href='./'>
                    <BsIcons.BsFillArrowLeftCircleFill className='icon' color="black" size={22} />
                </Link>
            </Box>

            <Box width='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column' marginTop='5%' marginBottom='5%'>
                <Image width={200} height={200} src={agenda} />
                <span style={{ fontSize: '1.5rem', fontFamily: 'sans-serif', fontWeight: 'bolder', color: ' #367588' }}>Solicitações de Reservas</span>

                <Box width='100%' display='flex' alignItems='center' justifyContent='center' color='grey' fontSize={12}  >
                    <strong>Clientes: ({clientes.length}) </strong>  <Text marginLeft='3%'>Solicitados: {clienteSolicitado.length} </Text> <Text marginLeft='3%'>Andamento: {ClienteAndamento.length} </Text> <Text marginLeft='3%'>Finalizados: {ClienteFinalizado.length}</Text>
                </Box>

                <Box width='100%' display='flex' alignItems='center' justifyContent='center' color='grey' fontSize={12} >
                    <strong>Visitantes: ({visitantes.length})</strong>  <Text marginLeft='3%'>Solicitados: {VisitanteSolicitado.length} </Text> <Text marginLeft='3%'>Andamento: {VisitanteAndamento.length} </Text> <Text marginLeft='3%'>Finalizados: {VisitanteFinalizado.length} </Text>
                </Box>

                <Box width='100%' display='flex' alignItems='center' justifyContent='center' marginTop='2%' color='grey' fontSize={12} >
                    <strong marginLeft='3%'>Total: {clientes.length + visitantes.length} </strong>
                </Box>
            </Box>

            <Box display='flex' width='95%' marginBottom='5%' flexDirection='column' >
                <Box display='flex' alignItems='center' justifyContent='space-between' marginTop='2%'>

                    <Box display='flex' onChange={onChangeCliente} >
                        <Box display='flex' alignItems='center' justifyContent='center'>
                            <Text color='#367588' fontWeight='bold' >Cliente</Text>
                            <input type="radio" value='Cliente' name="tipoCliente" style={{ margin: '5px' }} />
                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='center'>
                            <Text color='#367588' fontWeight='bold' marginLeft='5%'>Visitante</Text>
                            <input type="radio" value='Visitante' name="tipoCliente" style={{ margin: '5px' }} />
                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='center'>
                            <Text color='#367588' fontWeight='bold' marginLeft='8%'>Todos</Text>
                            <input type="radio" value='Todos' name="tipoCliente" style={{ margin: '5px' }} />
                        </Box>

                    </Box>

                </Box>

                <select value={qualificacao} onChange={handleChangeSelect} style={{ width: '200px', color: 'gray', border: '1px solid gray' }} >
                    <option value=''> Selecionar...</option>
                    <option value="Solicitado">Solicitado</option>
                    <option value="Andamento">Andamento</option>
                    <option value="Finalizado">Finalizado</option>
                </select>

            </Box>


            {onChange == 'Cliente' && qualificacao == 'Solicitado' && (
                <>
                    {clienteSolicitado.map((item, index) => {
                        return (
                            <>
                                <Box className='infos-card' display='flex' alignItems='start' justifyContent='space-between'>
                                    <Box display='flex' >
                                        <strong>Solicitação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.protocolo}</span>
                                    </Box>

                                    <Box display='flex'>
                                        <strong>Situação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.situacao}</span>
                                    </Box>
                                </Box>

                                <Box key={index} display='flex' alignItems='center' justifyContent='start' padding='2%' fontSize={14} border='2px solid #367588' marginBottom='2%' className='border-card' >
                                    <Box width='50%' display='flex' flexDirection='column' color='#367588' >
                                        <span> <strong>Nome:</strong>  {item.nome}</span>
                                        <span><strong>Sobrenome:</strong> {item.sobrenome}</span>
                                        <span><strong>CPF:</strong> {item.cpf}</span>
                                        <span><strong>Tipo:</strong> {item.status}</span>
                                        <hr></hr>
                                        {item.detalhes.map((dados, index) => (
                                            <>
                                                <span><strong>Carro:</strong> {dados.nome}</span>
                                                {dados.reservas != '' ? <span><strong>Reserva 1:</strong> {dados.reservas[0]} </span> : ''}
                                                {dados.reservas.length > 1 ? <span><strong>Reserva 2:</strong> {dados.reservas[1]} </span> : ''}
                                                {dados.reservas.length > 2 ? <span><strong>Reserva 3:</strong> {dados.reservas[2]} </span> : ''}
                                                {dados.reservas.length > 3 ? <span><strong>Reserva 4:</strong> {dados.reservas[3]} </span> : ''}
                                                {dados.reservas.length > 4 ? <span><strong>Reserva 5:</strong> {dados.reservas[4]} </span> : ''}
                                                <span><strong>Dias total:</strong> {dados.diasTotal} {dados.diasTotal < 2 ? 'dia' : 'dias'} </span>
                                                <span><strong>Total :</strong> R$ {dados.total},00 </span>
                                                <span><strong>Com Desconto :</strong> R$ {dados.desconto},00 </span>
                                            </>

                                        ))}

                                        <Stack direction='row' spacing={4} align='center' marginTop='15%'>
                                            <Button
                                                isDisabled={item.situacao != 'Finalizado' ? true : false}
                                                isLoading={load}
                                                loadingText='Aguarde..'
                                                colorScheme='teal'
                                                variant='outline'
                                                spinnerPlacement='start'
                                                onClick={() => ExcluirSolicitacao(item)}
                                            >
                                                Excluir Solicitação
                                            </Button>

                                        </Stack>

                                    </Box>


                                    <Box width='50%' display='flex' alignItems='center' justifyContent='end'>
                                        {loadImg ? <CircularProgress size={8} isIndeterminate color='green.300' marginLeft='2%' /> : <img width={300} height={300} src={item.imagens} />}
                                    </Box>

                                </Box>

                                <Box marginBottom='5%'>
                                    <Button height={5} color='#fff' backgroundColor={item.situacao == 'Solicitado' ? 'green' : 'gray'}>Solicitado</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Andamento' ? 'green' : 'gray'} onClick={() => handleAndamento(item)} >Andamento</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Finalizado' ? 'green' : 'gray'} onClick={() => handleFinalizadas(item)}>Finalizadas</Button>
                                </Box>
                            </>
                        )
                    })}
                </>
            )}

            {onChange == 'Cliente' && qualificacao == 'Andamento' && (
                <>
                    {ClienteAndamento.map((item, index) => {
                        return (
                            <>
                                <Box width='95%' display='flex' alignItems='start' justifyContent='space-between'>
                                    <Box display='flex' >
                                        <strong>Solicitação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.protocolo}</span>
                                    </Box>

                                    <Box display='flex'>
                                        <strong>Situação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.situacao}</span>
                                    </Box>
                                </Box>

                                <Box key={index} display='flex' alignItems='center' justifyContent='start' padding='2%' fontSize={14} border='2px solid #367588' marginBottom='2%' className='border-card' >
                                    <Box width='50%' display='flex' flexDirection='column' color='#367588' >
                                        <span> <strong>Nome:</strong>  {item.nome}</span>
                                        <span><strong>Sobrenome:</strong> {item.sobrenome}</span>
                                        <span><strong>CPF:</strong> {item.cpf}</span>
                                        <span><strong>Tipo:</strong> {item.status}</span>
                                        <hr></hr>
                                        {item.detalhes.map((dados, index) => (
                                            <>
                                                <span><strong>Carro:</strong> {dados.nome}</span>
                                                {dados.reservas != '' ? <span><strong>Reserva 1:</strong> {dados.reservas[0]} </span> : ''}
                                                {dados.reservas.length > 1 ? <span><strong>Reserva 2:</strong> {dados.reservas[1]} </span> : ''}
                                                {dados.reservas.length > 2 ? <span><strong>Reserva 3:</strong> {dados.reservas[2]} </span> : ''}
                                                {dados.reservas.length > 3 ? <span><strong>Reserva 4:</strong> {dados.reservas[3]} </span> : ''}
                                                {dados.reservas.length > 4 ? <span><strong>Reserva 5:</strong> {dados.reservas[4]} </span> : ''}
                                                <span><strong>Dias total:</strong> {dados.diasTotal} {dados.diasTotal < 2 ? 'dia' : 'dias'} </span>
                                                <span><strong>Total :</strong> R$ {dados.total},00 </span>
                                                <span><strong>Com Desconto :</strong> R$ {dados.desconto},00 </span>
                                            </>

                                        ))}

                                        <Stack direction='row' spacing={4} align='center' marginTop='15%'>
                                            <Button
                                                isDisabled={item.situacao != 'Finalizado' ? true : false}
                                                isLoading={load}
                                                loadingText='Aguarde..'
                                                colorScheme='teal'
                                                variant='outline'
                                                spinnerPlacement='start'
                                                onClick={() => ExcluirSolicitacao(item)}
                                            >
                                                Excluir Solicitação
                                            </Button>
                                        </Stack>

                                    </Box>


                                    <Box width='50%' display='flex' alignItems='center' justifyContent='end'>
                                        {loadImg ? <CircularProgress size={8} isIndeterminate color='green.300' marginLeft='2%' /> : <img width={300} height={300} src={item.imagens} />}
                                    </Box>

                                </Box>

                                <Box marginBottom='5%'>
                                    <Button height={5} color='#fff' backgroundColor={item.situacao == 'Solicitado' ? 'green' : 'gray'}>Solicitado</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Andamento' ? 'green' : 'gray'} onClick={() => handleAndamento(item)} >Andamento</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Finalizado' ? 'green' : 'gray'} onClick={() => handleFinalizadas(item)}>Finalizadas</Button>
                                </Box>
                            </>
                        )
                    })}
                </>
            )}

            {onChange == 'Cliente' && qualificacao == 'Finalizado' && (
                <>
                    {ClienteFinalizado.map((item, index) => {
                        return (
                            <>
                                <Box width='95%' display='flex' alignItems='start' justifyContent='space-between'>
                                    <Box display='flex' >
                                        <strong>Solicitação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.protocolo}</span>
                                    </Box>

                                    <Box display='flex'>
                                        <strong>Situação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.situacao}</span>
                                    </Box>
                                </Box>

                                <Box key={index} display='flex' alignItems='center' justifyContent='start' padding='2%' fontSize={14} border='2px solid #367588' marginBottom='2%' className='border-card' >
                                    <Box width='50%' display='flex' flexDirection='column' color='#367588' >
                                        <span> <strong>Nome:</strong>  {item.nome}</span>
                                        <span><strong>Sobrenome:</strong> {item.sobrenome}</span>
                                        <span><strong>CPF:</strong> {item.cpf}</span>
                                        <span><strong>Tipo:</strong> {item.status}</span>
                                        <hr></hr>
                                        {item.detalhes.map((dados, index) => (
                                            <>
                                                <span><strong>Carro:</strong> {dados.nome}</span>
                                                {dados.reservas != '' ? <span><strong>Reserva 1:</strong> {dados.reservas[0]} </span> : ''}
                                                {dados.reservas.length > 1 ? <span><strong>Reserva 2:</strong> {dados.reservas[1]} </span> : ''}
                                                {dados.reservas.length > 2 ? <span><strong>Reserva 3:</strong> {dados.reservas[2]} </span> : ''}
                                                {dados.reservas.length > 3 ? <span><strong>Reserva 4:</strong> {dados.reservas[3]} </span> : ''}
                                                {dados.reservas.length > 4 ? <span><strong>Reserva 5:</strong> {dados.reservas[4]} </span> : ''}
                                                <span><strong>Dias total:</strong> {dados.diasTotal} {dados.diasTotal < 2 ? 'dia' : 'dias'} </span>
                                                <span><strong>Total :</strong> R$ {dados.total},00 </span>
                                                <span><strong>Com Desconto :</strong> R$ {dados.desconto},00 </span>
                                            </>

                                        ))}

                                        <Stack direction='row' spacing={4} align='center' marginTop='15%'>
                                            <Button
                                                isDisabled={item.situacao != 'Finalizado' ? true : false}
                                                isLoading={load}
                                                loadingText='Aguarde..'
                                                colorScheme='teal'
                                                variant='outline'
                                                spinnerPlacement='start'
                                                onClick={() => ExcluirSolicitacao(item)}
                                            >
                                                Excluir Solicitação
                                            </Button>
                                        </Stack>

                                    </Box>


                                    <Box width='50%' display='flex' alignItems='center' justifyContent='end'>
                                        {loadImg ? <CircularProgress size={8} isIndeterminate color='green.300' marginLeft='2%' /> : <img width={300} height={300} src={item.imagens} />}
                                    </Box>

                                </Box>

                                <Box marginBottom='5%'>
                                    <Button height={5} color='#fff' backgroundColor={item.situacao == 'Solicitado' ? 'green' : 'gray'}>Solicitado</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Andamento' ? 'green' : 'gray'} onClick={() => handleAndamento(item)} >Andamento</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Finalizado' ? 'green' : 'gray'} onClick={() => handleFinalizadas(item)}>Finalizadas</Button>
                                </Box>
                            </>
                        )
                    })}
                </>
            )}


            {onChange == 'Visitante' && qualificacao == 'Solicitado' && (
                <>
                    {VisitanteSolicitado.map((item, index) => {
                        return (
                            <>
                                <Box width='95%' display='flex' alignItems='start' justifyContent='space-between'>
                                    <Box display='flex' >
                                        <strong>Solicitação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.protocolo}</span>
                                    </Box>

                                    <Box display='flex'>
                                        <strong>Situação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.situacao}</span>
                                    </Box>
                                </Box>

                                <Box key={index} display='flex' alignItems='center' justifyContent='start' padding='2%' fontSize={14} border='2px solid #367588' marginBottom='2%' className='border-card' >
                                    <Box width='50%' display='flex' flexDirection='column' color='#367588' >
                                        <span> <strong>Nome:</strong>  {item.nome}</span>
                                        <span><strong>Sobrenome:</strong> {item.sobrenome}</span>
                                        <span><strong>CPF:</strong> {item.cpf}</span>
                                        <span><strong>Tipo:</strong> {item.status}</span>
                                        <hr></hr>
                                        {item.detalhes.map((dados, index) => (
                                            <>
                                                <span><strong>Carro:</strong> {dados.nome}</span>
                                                {dados.reservas != '' ? <span><strong>Reserva 1:</strong> {dados.reservas[0]} </span> : ''}
                                                {dados.reservas.length > 1 ? <span><strong>Reserva 2:</strong> {dados.reservas[1]} </span> : ''}
                                                {dados.reservas.length > 2 ? <span><strong>Reserva 3:</strong> {dados.reservas[2]} </span> : ''}
                                                {dados.reservas.length > 3 ? <span><strong>Reserva 4:</strong> {dados.reservas[3]} </span> : ''}
                                                {dados.reservas.length > 4 ? <span><strong>Reserva 5:</strong> {dados.reservas[4]} </span> : ''}
                                                <span><strong>Dias total:</strong> {dados.diasTotal} {dados.diasTotal < 2 ? 'dia' : 'dias'} </span>
                                                <span><strong>Total :</strong> R$ {dados.total},00 </span>
                                                <span><strong>Com Desconto :</strong> R$ {dados.desconto},00 </span>
                                            </>

                                        ))}


                                        <Stack direction='row' spacing={4} align='center' marginTop='15%'>
                                            <Button
                                                isDisabled={item.situacao != 'Finalizado' ? true : false}
                                                isLoading={load}
                                                loadingText='Aguarde..'
                                                colorScheme='teal'
                                                variant='outline'
                                                spinnerPlacement='start'
                                                onClick={() => ExcluirSolicitacao(item)}
                                            >
                                                Excluir Solicitação
                                            </Button>
                                        </Stack>

                                    </Box>


                                    <Box width='50%' display='flex' alignItems='center' justifyContent='end'>
                                        {loadImg ? <CircularProgress size={8} isIndeterminate color='green.300' marginLeft='2%' /> : <img width={300} height={300} src={item.imagem} />}
                                    </Box>

                                </Box>

                                <Box>
                                    <Button height={5} color='#fff' backgroundColor={item.situacao == 'Solicitado' ? 'green' : 'gray'}>Solicitado</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Andamento' ? 'green' : 'gray'} onClick={() => handleAndamento(item)} >Andamento</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Finalizado' ? 'green' : 'gray'} onClick={() => handleFinalizadas(item)}>Finalizado</Button>
                                </Box>
                            </>
                        )
                    })}
                </>
            )}

            {onChange == 'Visitante' && qualificacao == 'Andamento' && (
                <>
                    {VisitanteAndamento.map((item, index) => {
                        return (
                            <>
                                <Box width='95%' display='flex' alignItems='start' justifyContent='space-between'>
                                    <Box display='flex' >
                                        <strong>Solicitação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.protocolo}</span>
                                    </Box>

                                    <Box display='flex'>
                                        <strong>Situação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.situacao}</span>
                                    </Box>
                                </Box>

                                <Box key={index} display='flex' alignItems='center' justifyContent='start' padding='2%' fontSize={14} border='2px solid #367588' marginBottom='2%' className='border-card' >
                                    <Box width='50%' display='flex' flexDirection='column' color='#367588' >
                                        <span> <strong>Nome:</strong>  {item.nome}</span>
                                        <span><strong>Sobrenome:</strong> {item.sobrenome}</span>
                                        <span><strong>CPF:</strong> {item.cpf}</span>
                                        <span><strong>Tipo:</strong> {item.status}</span>
                                        <hr></hr>
                                        {item.detalhes.map((dados, index) => (
                                            <>
                                                <span><strong>Carro:</strong> {dados.nome}</span>
                                                {dados.reservas != '' ? <span><strong>Reserva 1:</strong> {dados.reservas[0]} </span> : ''}
                                                {dados.reservas.length > 1 ? <span><strong>Reserva 2:</strong> {dados.reservas[1]} </span> : ''}
                                                {dados.reservas.length > 2 ? <span><strong>Reserva 3:</strong> {dados.reservas[2]} </span> : ''}
                                                {dados.reservas.length > 3 ? <span><strong>Reserva 4:</strong> {dados.reservas[3]} </span> : ''}
                                                {dados.reservas.length > 4 ? <span><strong>Reserva 5:</strong> {dados.reservas[4]} </span> : ''}
                                                <span><strong>Dias total:</strong> {dados.diasTotal} {dados.diasTotal < 2 ? 'dia' : 'dias'} </span>
                                                <span><strong>Total :</strong> R$ {dados.total},00 </span>
                                                <span><strong>Com Desconto :</strong> R$ {dados.desconto},00 </span>
                                            </>

                                        ))}


                                        <Stack direction='row' spacing={4} align='center' marginTop='15%'>
                                            <Button
                                                isDisabled={item.situacao != 'Finalizado' ? true : false}
                                                isLoading={load}
                                                loadingText='Aguarde..'
                                                colorScheme='teal'
                                                variant='outline'
                                                spinnerPlacement='start'
                                                onClick={() => ExcluirSolicitacao(item)}
                                            >
                                                Excluir Solicitação
                                            </Button>
                                        </Stack>

                                    </Box>


                                    <Box width='50%' display='flex' alignItems='center' justifyContent='end'>
                                        {loadImg ? <CircularProgress size={8} isIndeterminate color='green.300' marginLeft='2%' /> : <img width={300} height={300} src={item.imagem} />}
                                    </Box>

                                </Box>

                                <Box>
                                    <Button height={5} color='#fff' backgroundColor={item.situacao == 'Solicitado' ? 'green' : 'gray'}>Solicitado</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Andamento' ? 'green' : 'gray'} onClick={() => handleAndamento(item)} >Andamento</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Finalizado' ? 'green' : 'gray'} onClick={() => handleFinalizadas(item)}>Finalizado</Button>
                                </Box>
                            </>
                        )
                    })}
                </>
            )}

            {onChange == 'Visitante' && qualificacao == 'Finalizado' && (
                <>
                    {VisitanteFinalizado.map((item, index) => {
                        return (
                            <>
                                <Box width='95%' display='flex' alignItems='start' justifyContent='space-between'>
                                    <Box display='flex' >
                                        <strong>Solicitação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.protocolo}</span>
                                    </Box>

                                    <Box display='flex'>
                                        <strong>Situação: </strong>
                                        <span style={{ marginLeft: '1%' }}> {item.situacao}</span>
                                    </Box>
                                </Box>

                                <Box key={index} display='flex' alignItems='center' justifyContent='start' padding='2%' fontSize={14} border='2px solid #367588' marginBottom='2%' className='border-card' >
                                    <Box width='50%' display='flex' flexDirection='column' color='#367588' >
                                        <span> <strong>Nome:</strong>  {item.nome}</span>
                                        <span><strong>Sobrenome:</strong> {item.sobrenome}</span>
                                        <span><strong>CPF:</strong> {item.cpf}</span>
                                        <span><strong>Tipo:</strong> {item.status}</span>
                                        <hr></hr>
                                        {item.detalhes.map((dados, index) => (
                                            <>
                                                <span><strong>Carro:</strong> {dados.nome}</span>
                                                {dados.reservas != '' ? <span><strong>Reserva 1:</strong> {dados.reservas[0]} </span> : ''}
                                                {dados.reservas.length > 1 ? <span><strong>Reserva 2:</strong> {dados.reservas[1]} </span> : ''}
                                                {dados.reservas.length > 2 ? <span><strong>Reserva 3:</strong> {dados.reservas[2]} </span> : ''}
                                                {dados.reservas.length > 3 ? <span><strong>Reserva 4:</strong> {dados.reservas[3]} </span> : ''}
                                                {dados.reservas.length > 4 ? <span><strong>Reserva 5:</strong> {dados.reservas[4]} </span> : ''}
                                                <span><strong>Dias total:</strong> {dados.diasTotal} {dados.diasTotal < 2 ? 'dia' : 'dias'} </span>
                                                <span><strong>Total :</strong> R$ {dados.total},00 </span>
                                                <span><strong>Com Desconto :</strong> R$ {dados.desconto},00 </span>
                                            </>

                                        ))}


                                        <Stack direction='row' spacing={4} align='center' marginTop='15%'>
                                            <Button
                                                isDisabled={item.situacao != 'Finalizado' ? true : false}
                                                isLoading={load}
                                                loadingText='Aguarde..'
                                                colorScheme='teal'
                                                variant='outline'
                                                spinnerPlacement='start'
                                                onClick={() => ExcluirSolicitacao(item)}
                                            >
                                                Excluir Solicitação
                                            </Button>
                                        </Stack>

                                    </Box>


                                    <Box width='50%' display='flex' alignItems='center' justifyContent='end'>
                                        {loadImg ? <CircularProgress size={8} isIndeterminate color='green.300' marginLeft='2%' /> : <img width={300} height={300} src={item.imagem} />}
                                    </Box>

                                </Box>

                                <Box>
                                    <Button height={5} color='#fff' backgroundColor={item.situacao == 'Solicitado' ? 'green' : 'gray'}>Solicitado</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Andamento' ? 'green' : 'gray'} onClick={() => handleAndamento(item)} >Andamento</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Finalizado' ? 'green' : 'gray'} onClick={() => handleFinalizadas(item)}>Finalizado</Button>
                                </Box>
                            </>
                        )
                    })}
                </>
            )}



            {onChange == 'Todos' && (
                <>

                    <>
                        {clientes.map((item, index) => {
                            return (
                                <>
                                    <Box width='95%' display='flex' alignItems='start' justifyContent='space-between'>
                                        <Box display='flex' >
                                            <strong>Solicitação: </strong>
                                            <span style={{ marginLeft: '1%' }}> {item.protocolo}</span>
                                        </Box>

                                        <Box display='flex'>
                                            <strong>Situação: </strong>
                                            <span style={{ marginLeft: '1%' }}> {item.situacao}</span>
                                        </Box>
                                    </Box>

                                    <Box key={index} display='flex' alignItems='center' justifyContent='start' padding='2%' fontSize={14} border='2px solid #367588' marginBottom='2%' className='border-card' >
                                        <Box width='50%' display='flex' flexDirection='column' color='#367588' >
                                            <span> <strong>Nome:</strong>  {item.nome}</span>
                                            <span><strong>Sobrenome:</strong> {item.sobrenome}</span>
                                            <span><strong>CPF:</strong> {item.cpf}</span>
                                            <span><strong>Tipo:</strong> {item.status}</span>
                                            <hr></hr>
                                            {item.detalhes.map((dados, index) => (
                                                <>
                                                    <span><strong>Carro:</strong> {dados.nome}</span>
                                                    {dados.reservas != '' ? <span><strong>Reserva 1:</strong> {dados.reservas[0]} </span> : ''}
                                                    {dados.reservas.length > 1 ? <span><strong>Reserva 2:</strong> {dados.reservas[1]} </span> : ''}
                                                    {dados.reservas.length > 2 ? <span><strong>Reserva 3:</strong> {dados.reservas[2]} </span> : ''}
                                                    {dados.reservas.length > 3 ? <span><strong>Reserva 4:</strong> {dados.reservas[3]} </span> : ''}
                                                    {dados.reservas.length > 4 ? <span><strong>Reserva 5:</strong> {dados.reservas[4]} </span> : ''}
                                                    <span><strong>Dias total:</strong> {dados.diasTotal} {dados.diasTotal < 2 ? 'dia' : 'dias'} </span>
                                                    <span><strong>Total :</strong> R$ {dados.total},00 </span>
                                                    <span><strong>Com Desconto :</strong> R$ {dados.desconto},00 </span>
                                                </>

                                            ))}

                                            <Stack direction='row' spacing={4} align='start' flexDirection='column' marginTop='15%'>

                                                <Button height='10%' padding={1}
                                                    isDisabled={etapas == 0 ? false : true}
                                                    isLoading={load}
                                                    loadingText='Aguarde..'
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    spinnerPlacement='start'
                                                    onClick={() => Sincronizar(item)}
                                                >
                                                    Sincronizar
                                                </Button>

                                                <Button height='10%' padding={1}
                                                    isDisabled={etapas >= 1 && datasClientes != '' ? false : true}
                                                    isLoading={load}
                                                    loadingText='Aguarde..'
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    spinnerPlacement='start'
                                                    onClick={() => ExcluirDatas(item)}
                                                >
                                                    Excluir datas
                                                </Button>

                                                <Button height='10%' padding={1}
                                                    isDisabled={etapas != 2 && datasClientes != '' ? true : false}
                                                    isLoading={load}
                                                    loadingText='Aguarde..'
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    spinnerPlacement='start'
                                                    onClick={handleEdit}
                                                >
                                                    Salvar Alterações
                                                </Button>

                                                <Button height='10%' padding={1}
                                                    isDisabled={item.situacao != 'Finalizado' && !salvo && datasClientes != [''] ? true : false}
                                                    isLoading={load}
                                                    loadingText='Aguarde..'
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    spinnerPlacement='start'
                                                    onClick={() => ExcluirSolicitacao(item)}
                                                >
                                                    Excluir Solicitação
                                                </Button>
                                            </Stack>

                                        </Box>


                                        <Box width='50%' display='flex' alignItems='center' justifyContent='end'>
                                            {loadImg ? <CircularProgress size={8} isIndeterminate color='green.300' marginLeft='2%' /> : <img width={300} height={300} src={item.imagens} />}
                                        </Box>

                                    </Box>

                                    <Box marginBottom='5%'>
                                        <Button height={5} color='#fff' backgroundColor={item.situacao == 'Solicitado' ? 'green' : 'gray'}>Solicitado</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Andamento' ? 'green' : 'gray'} onClick={() => handleAndamento(item)} >Andamento</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Finalizado' ? 'green' : 'gray'} onClick={() => handleFinalizadas(item)}>Finalizado</Button>
                                    </Box>
                                </>
                            )
                        })}
                    </>

                    <>
                        {visitantes.map((item, index) => {
                            return (
                                <>
                                    <Box width='95%' display='flex' alignItems='start' justifyContent='space-between'>
                                        <Box display='flex' >
                                            <strong>Solicitação: </strong>
                                            <span style={{ marginLeft: '1%' }}> {item.protocolo}</span>
                                        </Box>

                                        <Box display='flex'>
                                            <strong>Situação: </strong>
                                            <span style={{ marginLeft: '1%' }}> {item.situacao}</span>
                                        </Box>
                                    </Box>

                                    <Box key={index} display='flex' alignItems='center' justifyContent='start' padding='2%' fontSize={14} border='2px solid #367588' marginBottom='2%' className='border-card' >
                                        <Box width='50%' display='flex' flexDirection='column' color='#367588' >
                                            <span> <strong>Nome:</strong>  {item.nome}</span>
                                            <span><strong>Sobrenome:</strong> {item.sobrenome}</span>
                                            <span><strong>CPF:</strong> {item.cpf}</span>
                                            <span><strong>Tipo:</strong> {item.status}</span>
                                            <hr></hr>
                                            {item.detalhes.map((dados, index) => (
                                                <>
                                                    <span><strong>Carro:</strong> {dados.nome}</span>
                                                    {dados.reservas != '' ? <span><strong>Reserva 1:</strong> {dados.reservas[0]} </span> : ''}
                                                    {dados.reservas.length > 1 ? <span><strong>Reserva 2:</strong> {dados.reservas[1]} </span> : ''}
                                                    {dados.reservas.length > 2 ? <span><strong>Reserva 3:</strong> {dados.reservas[2]} </span> : ''}
                                                    {dados.reservas.length > 3 ? <span><strong>Reserva 4:</strong> {dados.reservas[3]} </span> : ''}
                                                    {dados.reservas.length > 4 ? <span><strong>Reserva 5:</strong> {dados.reservas[4]} </span> : ''}
                                                    <span><strong>Dias total:</strong> {dados.diasTotal} {dados.diasTotal < 2 ? 'dia' : 'dias'} </span>
                                                    <span><strong>Total :</strong> R$ {dados.total},00 </span>
                                                    <span><strong>Com Desconto :</strong> R$ {dados.desconto},00 </span>
                                                </>

                                            ))}

                                            <Stack direction='row' spacing={4} align='start' flexDirection='column' marginTop='15%'>
                                                <Button height='10%' padding={1}
                                                    isDisabled={etapas == 0 ? false : true}
                                                    isLoading={load}
                                                    loadingText='Aguarde..'
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    spinnerPlacement='start'
                                                    onClick={() => Sincronizar(item)}
                                                >
                                                    Sincronizar
                                                </Button>

                                                <Button height='10%' padding={1}
                                                    isDisabled={etapas >= 1 && datasClientes != '' ? false : true}
                                                    isLoading={load}
                                                    loadingText='Aguarde..'
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    spinnerPlacement='start'
                                                    onClick={() => ExcluirDatas(item)}
                                                >
                                                    Excluir datas
                                                </Button>

                                                <Button height='10%' padding={1}
                                                    isDisabled={etapas != 2 && datasClientes != '' ? true : false}
                                                    isLoading={load}
                                                    loadingText='Aguarde..'
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    spinnerPlacement='start'
                                                    onClick={handleEdit}
                                                >
                                                    Salvar Alterações
                                                </Button>

                                                <Button height='10%' padding={1}
                                                    isDisabled={item.situacao != 'Finalizado' && !salvo && datasClientes != [''] ? true : false}
                                                    isLoading={load}
                                                    loadingText='Aguarde..'
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    spinnerPlacement='start'
                                                    onClick={() => ExcluirSolicitacao(item)}
                                                >
                                                    Excluir Solicitação
                                                </Button>
                                            </Stack>
                                        </Box>


                                        <Box width='50%' display='flex' alignItems='center' justifyContent='end'>
                                            {loadImg ? <CircularProgress size={8} isIndeterminate color='green.300' marginLeft='2%' /> : <img width={300} height={300} src={item.imagem} />}
                                        </Box>

                                    </Box>

                                    <Box marginBottom='5%'>
                                        <Button height={5} color='#fff' backgroundColor={item.situacao == 'Solicitado' ? 'green' : 'gray'}>Solicitado</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Andamento' ? 'green' : 'gray'} onClick={() => handleAndamento(item)} >Andamento</Button> <Button height={5} color='#fff' backgroundColor={item.situacao == 'Finalizado' ? 'green' : 'gray'} onClick={() => handleFinalizadas(item)}>Finalizado</Button>
                                    </Box>
                                </>
                            )
                        })}


                    </>


                </>

            )}

            {/* {clientes != '' && (
                <CircularProgress size={6} isIndeterminate color='green.300' marginLeft='2%' />
            )} */}

            <Box height='5vh'>
                <Text color='#fff'>------------</Text>
            </Box>

        </Box>
    )
}
