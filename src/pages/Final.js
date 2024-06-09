import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '@/context/userContext';

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Final() {

    let { nome, setNome, sobrenome, setSobrenome, cpf, setCpf } = useContext(UserContext);

    const [ClienteAtual, setClienteAtual] = useState([])

    const [dadosLocacao, setDadosLocacao] = useState([])

    const [userProtocoll, setUserProtocoll] = useState('')


    useEffect(() => {
        const storageAuth = localStorage.getItem('userVisitante');

        if (storageAuth) {
            setClienteAtual(JSON.parse(storageAuth))
        } else {
            console.log('Não há usuários logados!')
        }

    }, [])

    useEffect(() => {
        const storageInfosLocacao = localStorage.getItem('dadosCar');

        if (storageInfosLocacao) {
            setDadosLocacao(JSON.parse(storageInfosLocacao))
        } else {
            console.log('Não há locação!')
        }

    }, [])

    useEffect(() => {
        const storageProtocoll = localStorage.getItem('userProtocoll');

        if (storageProtocoll) {
            setUserProtocoll(JSON.parse(storageProtocoll))
        } else {
            console.log('Não há protocolos!')
        }

    }, [])



    function handleInicio() {
        window.location.href = "./"
        localStorage.removeItem("userVisitante");
        localStorage.removeItem("dadosCar");
        localStorage.removeItem("userProtocoll");
    }

    return (
        <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' height='100vh'>
            <Heading color='#367588'>Parabéns!!!</Heading>


            {ClienteAtual == '' && (
                <>
                    <Text color='#367588'>Usuário criado com sucesso</Text>
                    <Text color='#367588'>Faça seu <Link href='/Login' style={{ textDecoration: 'underline' }}>LOGIN</Link> </Text>
                </>

            )}

            {ClienteAtual.map((item) => item.status == 'Visitantes' && (
                <>
                    <Text color='#367588'>Sua locação foi realizada com secesso</Text>

                    {dadosLocacao.map((item) => {
                        return (
                            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='5%'>
                                <Text color='#367588'>Carro: {item.nome} </Text>
                                <Text color='#367588'>Você ficará: {item.diasTotal} {item.diasTotal < 2 ? 'dia' : 'dias'} </Text>
                                <Text color='#367588'>Total: R$ {item.valor},00 </Text>
                                <Text color='#367588'>Total c/ desconto: R$ {item.desconto},00</Text>
                                <Text color='#367588'>Reservas:</Text>
                                <span style={{ fontSize: '11px', color: '#367588' }}> {item.reservas[0]}</span>
                                <span style={{ fontSize: '11px', color: '#367588' }}> {item.reservas[1]}</span>
                                <span style={{ fontSize: '11px', color: '#367588' }}> {item.reservas[2]}</span>
                                <span style={{ fontSize: '11px', color: '#367588' }}> {item.reservas[3]}</span>
                                <span style={{ fontSize: '11px', color: '#367588' }}> {item.reservas[4]}</span>
                            </Box>
                        )

                    })}


                    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' backgroundColor='green' color='#fff' padding='1.5%' marginTop='10%'>
                        <Text> NUMERO DA SUA RESERVA</Text>
                        {ClienteAtual != '' ? <Text>{ClienteAtual.map((item) => item.protocolo)} </Text> : userProtocoll}
                    </Box>
                    <Text color='#367588'>Aguarde nosso contato...</Text>
                    <Text color='red' fontSize={12}>Atenção visitante: </Text>
                    <Text color='red' fontSize={12}> Faça o print da tela!</Text>
                </>
            ))}


            <Box marginTop='25%' color='blue'>
                <Button backgroundColor='#367588' color='#fff' onClick={handleInicio}>Pagina Inicial... </Button>
            </Box>

        </Box>
    )
}
