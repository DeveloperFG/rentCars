import React, { useState, useEffect } from 'react'

import { Button, Box, Heading, Menu, MenuButton, MenuList, MenuItem, Text, Toast } from '@chakra-ui/react'

import firebase from "../../db/db";

import ModalReserva from '@/components/modalReserva';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// Descontos


import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import * as MdIcons from 'react-icons/md';


import swal from 'sweetalert';

import "react-datepicker/dist/react-datepicker.css";

import { toast } from 'react-toastify';

import Link from 'next/link'

import Image from "next/image"

import logo from '../img/logo3.png'

export default function Header() {


    const [userLogged, setUserLogged] = useState({})

    const [situacao, setSituacao] = useState(false)
    const [ClienteAtual, setClienteAtual] = useState([])

    const [clientes, setClientes] = useState([])
    const [visitantes, setVisitantes] = useState([])
    const [dadosLocacao, setDadosLocacao] = useState([])
    const [dadosGaragem, setDadosGaragem] = useState([])

    const [datasGaragem, setDatasGaragem] = useState([])
    const [datasUser, setDatasUser] = useState([])

    const [isModal, setIsModal] = useState(false)

    const [indice, setIndice] = useState('')

    const [novas, setNovas] = useState([])


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

    }, [isModal])



    useEffect(() => {

        async function loadAgendamento() {

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

                let listSolicitados = DataUser.filter((item) => {
                    return (item.situacao === 'Solicitado')

                })

                let dadosUnico = DataUser.filter((item) => {
                    return (item.nome === ClienteAtual.map((dados) => dados.nome).toString())

                })

                let dadosReserva = dadosUnico.map((item) => item.detalhes)

                if (dadosReserva != '') {

                    for (const obj of dadosUnico) {
                        setDatasUser(obj.detalhes[0].reservas)
                    }
                }

                setDadosLocacao(dadosUnico)
                setClientes(listSolicitados)
            })
        }

        loadAgendamento()

    }, [dadosGaragem])


    useEffect(() => {

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
                        imagens: doc.data().imagens,
                    })

                })

                let listSolicitados = DataUser.filter((item) => {
                    return (item.situacao === 'Solicitado')

                })

                setVisitantes(listSolicitados)
            })
        }

        loadAgendamento()

    }, [])


    useEffect(() => {
        async function checkLogin() {
            await firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // usuario logado entra aqui
                    setUserLogged({
                        uid: user.uid,
                        email: user.email,

                    })

                } else {
                    // se não entra aqui
                    setUserLogged({})
                }
            })
        }

        checkLogin();

    }, [])


    useEffect(() => {

        const storageAuth = localStorage.getItem('userLogged');

        if (storageAuth) {
            setClienteAtual(JSON.parse(storageAuth))
            setSituacao(true)

        } else {
            console.log('Não há usuários logados!')
        }

    }, [])


    // Saindo da aplicação
    async function HandleLogin() {
        if (situacao == false) {
            window.location.href = "./Login";
        } else {
            // localStorage.clear();
            await firebase.auth().signOut();
            localStorage.removeItem("userLogged");
            window.location.href = "./";
        }
    }

    function notifySobre() {
        swal("Fast-CAR", "Empresa de locação de veículos, a mais conceituada no mercado!");

    }

    // pegando soma clientes e visitantes
    let user = clientes.length + visitantes.length


    function excluirReserva(e) {
        // pegando array dentro do array
        // console.log(dados.detalhes[0].nome)


        let teste = datasUser.length

        if (teste == 1) {
            setDatasUser([])
        } else {
            let idUser = datasUser.indexOf(e.target.innerText)
            let idGaragem = datasGaragem.indexOf(e.target.innerText)

            datasUser.splice(idUser, 1)
            datasGaragem.splice(idGaragem, 1)

            setNovas(datasUser)
        }



        // update no banco para limpar informacões

        // if (dados.status == 'Clientes') {

        //     firebase.firestore().collection('Clientes')
        //         .doc(dados.id)
        //         .update({
        //             detalhes: { reservas: datasUser },
        //             protocolo: 0,
        //             situacao: ''
        //         })

        //         .then(() => {
        //             toast.info('Reserva Excluida')
        //             console.log("Reserva excluida!")
        //         })
        //         .catch((error) => {
        //             console.log(error + 'Deu algum erro')
        //         })

        // } else (

        //     firebase.firestore().collection('Visitantes')
        //         .doc(dados.id)
        //         .update({
        //             detalhes: '',
        //             protocolo: 0,
        //             situacao: ''
        //         })

        //         .then(() => {
        //             toast.info('Reserva Excluida')
        //             console.log("Reserva excluida!")
        //         })
        //         .catch((error) => {
        //             console.log(error + 'Deu algum erro')
        //         })
        // )


    }


    // function deleteDay(date) {

    //     let indice = calendar.indexOf(date)
    //     calendar.splice(indice, 1)

    //     setLocate(false)
    //     setCalendar(calendar)
    //     setHandleList(!handleList)
    //     toast.info('Excluido ' + date)


    // }


    function handleNew() {

        toast.success('Dados salvos!')

    }

    let dadosLocacaoString = dadosLocacao.map((item) => item.protocolo).toString()
    let dadosLocacaoNumber = parseInt(dadosLocacaoString)


    return (

        <>

            <>
                {isModal ? (
                    <ModalReserva onClose={() => setIsModal(false)}>
                        <div id='modal-reserva'>
                            <Text textAlign='center' color='#fff' fontSize={22} fontWeight='bold'>-----------Minha Reserva------------</Text>
                            {dadosLocacao.map((item) => item.protocolo == '' ? (
                                <Text textAlign='center' color='#fff'>Não há reservas...</Text>
                            ) : <>


                                {dadosLocacao.map((item) => {
                                    return (

                                        <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' marginTop='3%'>
                                            <Text color='#fff'> <strong>Nome:</strong> {item.nome + ' ' + item.sobrenome}</Text>

                                            {item.detalhes.map((dados, index) => (
                                                <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' color='#fff'>
                                                    <span><strong>Carro:</strong> {dados.nome}</span>
                                                    <strong>Reserva:</strong>

                                                    {dados.reservas != [] && (
                                                        <Box display='flex' alignItems='center' justifyContent='center'>
                                                            {dados.reservas != [] && (<span onClick={excluirReserva}  >{datasUser[0]}</span>)}
                                                        </Box>
                                                    )}


                                                    {(dados.reservas).length > 1 && (
                                                        <Box display='flex' alignItems='center' justifyContent='center'>
                                                            {(dados.reservas).length > 1 && (<span onClick={excluirReserva}  >{datasUser[1]}</span>)}
                                                        </Box>
                                                    )}

                                                    {(dados.reservas).length > 2 && (
                                                        <Box display='flex' alignItems='center' justifyContent='center'>
                                                            {(dados.reservas).length > 2 && (<span >{dados.reservas[2]}</span>)}
                                                        </Box>
                                                    )}

                                                    {(dados.reservas).length > 2 && (
                                                        <Box display='flex' alignItems='center' justifyContent='center'>
                                                            {(dados.reservas).length > 2 && (<span >{dados.reservas[3]}</span>)}
                                                        </Box>
                                                    )}

                                                    {(dados.reservas).length > 2 && (
                                                        <Box display='flex' alignItems='center' justifyContent='center'>
                                                            {(dados.reservas).length > 2 && (<span >{dados.reservas[4]}</span>)}
                                                        </Box>
                                                    )}

                                                    <span><strong>Dias: </strong> {dados.diasTotal} {dados.diasTotal < 2 ? 'dia' : 'dias'} </span>
                                                    <span><strong>Total:</strong> R$ {dados.total},00 </span>
                                                    <span><strong>Com Desconto:</strong> R$ {dados.desconto},00 </span>

                                                </Box>

                                            ))}
                                            <br></br>
                                            <Box display='flex'>
                                                <Text color='#fff'>Duvidas:</Text>
                                                <Link href='https://wa.me/5588997293834?text=Ol%C3%A1%20gostaria%20de%20saber%20mais%20sobre%20seus%20servi%C3%A7os' target='blank'>
                                                    <FaIcons.FaWhatsappSquare className='icon' color='green' size={25} />
                                                </Link>
                                            </Box>

                                            {/* <Button onClick={() => excluirReserva(item)} backgroundColor='transparent' border='1px solid white' color='#fff'>Excluir reserva </Button> */}
                                        </Box>
                                    )

                                })}

                            </>

                            )}

                        </div>
                    </ModalReserva>

                ) : ''}

            </>


            <Box padding={2} justifyContent='space-between' width='100%' height='20' display='flex' alignItems='center' position='fixed' zIndex='10' backgroundColor='#fff' borderBottom='2px solid #367588'>
                <Link href='/'>
                    <Image
                        src={logo}
                        width={250}
                    />
                </Link>

                <Box width='100%' display='flex' justifyContent='end' alignItems='center' marginRight='4%'>
                    {dadosLocacaoNumber > 0 && (
                        <Box margin={8}>
                            <Link href='#modal-reserva' onClick={() => setIsModal(true)}>
                                <FaIcons.FaCar className='icon' color='green' size={25} />
                            </Link>

                        </Box>
                    )}


                    <AiIcons.AiOutlineUserSwitch className='icon' color={situacao == false ? '#0B173B' : 'green'} size={30} />

                    {user > 0 && userLogged.email == 'fernando.gdev@gmail.com' && (
                        <Box display='flex' pos='relative' width={4} height={4} backgroundColor='#C0392B' borderRadius='50%' alignItems='center' justifyContent='center' marginBottom={4}>
                            <Link href='./Solicitacoes' style={{ fontWeight: 'bold', color: '#fff', fontSize: 10 }}>{user}</Link>
                        </Box>
                    )}

                    <Heading fontSize={14} marginLeft={4}><Link href='' onClick={HandleLogin} >{situacao == false ? 'LOGIN' : 'SAIR'}</Link></Heading>
                </Box>


                <div>
                    {/* <Link href="/Menu">
            <Text cursor="pointer" color='#fff' > <strong>Home</strong></Text>
          </Link> */}
                    <Menu>
                        {({ isOpen }) => (
                            <>
                                {/* rightIcon={<HamburgerIcon /> */}

                                <MenuButton colorScheme='transparent' isActive={isOpen} as={Button} rightIcon=''>
                                    {isOpen ? <MdIcons.MdClose className='icon' color='#0B173B' size={30} /> : <GiIcons.GiHamburgerMenu className='icon' color='#0B173B' size={30} />}
                                </MenuButton>
                                <MenuList>

                                    {ClienteAtual.map((user) => user.email == 'fernando.gdev@gmail.com' && (
                                        <Box>
                                            <MenuItem><Link href='/Cadastrar'>Cadastrar novo veículo</Link></MenuItem>
                                            <MenuItem><Link href='#modal-reserva' onClick={() => setIsModal(true)}>Minha reserva</Link></MenuItem>
                                            <MenuItem><Link href='/Solicitacoes'>Solicitações</Link></MenuItem>
                                            <MenuItem><Link href='/Historico'>Histórico</Link></MenuItem>
                                        </Box>

                                    ))}

                                    {ClienteAtual.map((user) => user.email != 'fernando.gdev@gmail.com' && (
                                        <Box>
                                            <MenuItem><Link href='#modal-reserva' onClick={() => setIsModal(true)}>Minha reserva</Link></MenuItem>
                                        </Box>

                                    ))}

                                    <MenuItem onClick={notifySobre}>Quem somos </MenuItem>

                                </MenuList>
                            </>
                        )}
                    </Menu>
                </div>
            </Box>

        </>

    )
}





// function handleNew() {

//     for (var i = 0; i < datasGaragem.length; i++) {

//         var array = datasGaragem[i];

//         if (datasUser.includes(array)) {
//             let indice = datasGaragem.indexOf(array)
//             datasGaragem.splice(indice, 1)

//             setDatasGaragem(datasGaragem)
//         }

//         console.log(datasGaragem)

//     }

// }
