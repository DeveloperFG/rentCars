import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '@/context/userContext';

import * as BsIcons from 'react-icons/bs';

import firebase from "../../db/db";

import { Box, Button, Flex, Heading, Text, Input, CircularProgress } from "@chakra-ui/react";
import Link from "next/link";


export default function Historico() {

    const [mesSelecionado, setMesSelecionado] = useState('')
    const [diaSelecionado, setDiaSelecionado] = useState('')
    const [filtrar, setFiltrar] = useState('')

    const [historico, setHistorico] = useState([])
    const [histFiltrado, setHistFiltrado] = useState([])

    const dia = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]



    function handleChangeSelect(e) {
        setMesSelecionado(e.target.value);
    }

    function handleChangeSelectDia(e) {
        let diaConvert = parseInt(e.target.value)
        setDiaSelecionado(diaConvert);
    }


    useEffect(() => {

        // setLoad(true)

        async function loadHistorico() {

            await firebase.firestore().collection('Historico').onSnapshot((doc) => {
                let DataHistorico = [];

                doc.forEach((doc) => {
                    DataHistorico.push({
                        id: doc.id,
                        cliente: doc.data().cliente,
                        status: doc.data().status,
                        carro: doc.data().carro,
                        dia: doc.data().dia,
                        mes: doc.data().mes,
                        locacao: doc.data().locacao,
                    })

                })

                let selecttMes = DataHistorico.filter((item) => {
                    return (item.mes === mesSelecionado)

                })

                // let selecttDia = selecttMes.filter((item) => {
                //     return (item.dia === diaSelecionado)

                // })

                setHistorico(selecttMes)
                // setLoad(false)

            })

        }

        loadHistorico()

    }, [mesSelecionado])



    useEffect(() => {
        setHistFiltrado(
            Object.values(historico).filter((items) =>
                items.locacao[0].includes(filtrar)
            ))

    }, [filtrar])


    return (
        <Box display='flex' alignItems='center' justifyContent='start' flexDirection='column' height='100vh'>

            <Box width='100%' display='flex' alignItems='star' marginTop='5%' marginLeft='5%'>
                <Link href='./'>
                    <BsIcons.BsFillArrowLeftCircleFill className='icon' color="black" size={22} />
                </Link>
            </Box>

            <Heading color='gray.600'>Histórico</Heading>

            <Box display='flex' marginTop='5%' marginBottom='5%'>
                {/* <select className='select' value={diaSelecionado} onChange={handleChangeSelectDia} >
                    <option value="Dia">Dia</option>
                    {dia.map((item) => {
                        return (
                            <>
                                <option value={item}>{item}</option>

                            </>
                        )
                    })}
                </select> */}

                <select className='select' value={mesSelecionado} onChange={handleChangeSelect} >
                    <option value="Mês">Mês</option>
                    <option value="Janeiro">Janeiro</option>
                    <option value="Fevereiro">Fevereiro</option>
                    <option value="Abril">Abril </option>
                    <option value="Maio">Maio </option>
                    <option value="Junho">Junho </option>
                    <option value="Julho">Julho </option>
                    <option value="Agosto">Agosto </option>
                    <option value="Setembro">Setembro </option>
                    <option value="Outubro">Outubro </option>
                    <option value="Novembro">Novembro </option>
                    <option value="Dezembro">Dezembro </option>
                </select>
            </Box>

            <Box>
                {/* <small>Filtrar:</small> */}
                <Box display='flex'>
                    <Input name='search' placeholder='ex: 12/09/2023' value={filtrar} onChange={(e) => setFiltrar(e.target.value)} />
                    {/* <Button marginLeft='1%' onClick={filtrarBusca}>Buscar</Button> */}
                </Box>

            </Box>


            {filtrar.length > 0 ? (
                histFiltrado.map((item) => {
                    return (
                        <Box key={item.id} display='flex' width='50%' backgroundColor='#000' color='#fff' flexDirection='column' padding='2%' marginTop='2%' >
                            <small><strong>Cliente:</strong> {item.cliente}</small>
                            <small><strong>Status:</strong> {item.status}</small>
                            <small><strong>Carro:</strong> {item.carro}</small>
                            <small><strong>Dia:</strong> {item.locacao[0]}</small>
                            {(item.locacao).length > 1 && (
                                <small><strong>Dia:</strong> {item.locacao[1]}</small>
                            )}
                            {(item.locacao).length > 2 && (
                                <small><strong>Dia:</strong> {item.locacao[2]}</small>
                            )}
                            {(item.locacao).length > 3 && (
                                <small><strong>Dia:</strong> {item.locacao[3]}</small>
                            )}
                            {(item.locacao).length > 4 && (
                                <small><strong>Dia:</strong> {item.locacao[4]}</small>
                            )}
                            {(item.locacao).length > 5 && (
                                <small><strong>Dia:</strong> {item.locacao[5]}</small>
                            )}

                            <Box marginTop='3%' background='green' padding='1%'>
                                Total: {(item.locacao).length} dias
                            </Box>

                        </Box>
                    )
                })
            )
                :
                <Box width='40%' height='3vh' display='flex' alignItems='center' justifyContent='center' color='#fff' marginTop='3%' backgroundColor='#000'>
                    <small>Nenhuma busca realizada </small>
                </Box>

            }

            <Box border='1px solid gray' width='80%' marginTop='10%'></Box>

            <Box marginTop='2%'>Histórico completo </Box>

            {historico.map((item) => {
                return (
                    <Box width='100%' height='30%' padding='5%' display='flex' alignItems='center' justifyContent='start' flexDirection='column' marginTop='1%' >
                        <small style={{ backgroundColor: 'black', color: '#fff', padding: '1%' }}>Realizado: {item.dia} de {item.mes} </small>
                        <small>Cliente: {item.cliente}</small>
                        <small>Carro: {item.carro}</small>
                        <small>Dia: {item.locacao[0]}</small>

                        {(item.locacao).length > 1 && (
                            <small>Dia: {item.locacao[1]}</small>
                        )}
                        {(item.locacao).length > 2 && (
                            <small>Dia: {item.locacao[2]}</small>
                        )}
                        {(item.locacao).length > 3 && (
                            <small>Dia: {item.locacao[3]}</small>
                        )}
                        {(item.locacao).length > 4 && (
                            <small>Dia: {item.locacao[4]}</small>
                        )}
                        {(item.locacao).length > 5 && (
                            <small>Dia: {item.locacao[5]}</small>
                        )}

                        <Box marginTop='3%' padding='1%' color='#000'>
                            <strong> Total: {(item.locacao).length} dias </strong>
                        </Box>

                    </Box>
                )

            })}

            {/* <video controls autoPlay>
                <source src="../../public/teste/intro.mp4" ></source>
            </video> */}

        </Box>
    )
}

