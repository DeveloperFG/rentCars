import React, { useEffect, useState, useContext } from 'react'

import { UserContext } from '@/context/userContext';

import firebase from '../../connection/db'

import {
  Button, Box, Text, Card, CardBody, Stack, Heading, Divider, CardFooter, ButtonGroup, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton
  , ModalBody, FormControl, FormLabel, Input, Menu, ModalFooter, Textarea, Progress
} from '@chakra-ui/react'


import ModalFeed from '../components/modalFeed';
import ModalEscolha from '@/components/modalEscolha';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules'

import ReactPlayer from 'react-player';


import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';

// import intro2 from '../video/intro2.mp4'

import banner from '../img/banner2.png'
import feedback from '../img/feedback.png'


// Descontos

import dez from '../img/desc/dez.png'
import quinze from '../img/desc/quinze.png'
import vinte from '../img/desc/vinte.png'
import vinceCinco from '../img/desc/vinteCinco.png'
import trinta from '../img/desc/trinta.png'
import trintaCinco from '../img/desc/trintaCinco.png'
import quarenta from '../img/desc/quarenta.png'


import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';

import swal from 'sweetalert';

import "react-datepicker/dist/react-datepicker.css";


import { Calendar } from "react-date-range";
import pt from 'date-fns/locale/pt'
import { format } from "date-fns";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file


import { CheckIcon, CloseIcon, } from '@chakra-ui/icons'

import { CircularProgress } from '@chakra-ui/react'

import { toast } from 'react-toastify';

import Link from 'next/link'

import Image from "next/image"

import logo from '../img/logo32.png'
import frota01 from '../img/03.jpg'
import frota02 from '../img/04.jpg'

import bomba from '../img/bomba.png'

import whats from '../img/comp.png'
import Header from './Header';


export default function Home() {

  // Dados user
  let { nome, setNome, sobrenome, setSobrenome, dataVisitante, setDataVisitante } = useContext(UserContext);


  const [loadVideo, setLoadVideo] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState();
  const [isModalEscolha, setIsModalEscolha] = useState();

  const [cars, setCars] = useState([])
  const [carSelected, setCarSelected] = useState([])
  const [idSelected, setIdSelected] = useState('')

  // modal 1 - formulario
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)


  // cliente logado
  const [userLogged, setUserLogged] = useState({})

  const [nomeVisitante, setNomeVisitante] = useState('')

  const [ClienteAtual, setClienteAtual] = useState([])
  const [comentario, setComentario] = useState('')
  const [qualificacao, setQualificacao] = useState('')


  const [feedBack, setFeedBack] = useState('')
  const [loadFeed, setLoadFeed] = useState([])

  const [load, setLoad] = useState(false)
  const [loadVerifique, setLoadVerifique] = useState(false)

  const [spinnerFeed, setSpinnerFeed] = useState(false)

  // const [startDate, setStartDate] = useState(new Date());

  const [clientes, setClientes] = useState([])
  const [dataUsers, setDataUsers] = useState([])

  // Data
  let timeElapsed = Date.now();
  let today = new Date(timeElapsed).toLocaleString();

  let data = new Date();
  let dia = data.getDate();
  let mesatual = data.getMonth()
  let ano = data.getFullYear();

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const mesFormatado = meses[mesatual]


  // protocolo para clientes
  const [protocolo, setProtocolo] = useState('')
  const [listaSorteados, setListaSorteados] = useState([])

  // variavéis do calendario
  const [calendar, setCalendar] = useState([])
  const [handleList, setHandleList] = useState(false)

  const [locate, setLocate] = useState(false)
  const [atualizada, setAtualizada] = useState([])

  const [dadosLocacao, setDadosLocacao] = useState([])

  const [testeArray, setTesteArray] = useState([])


  function handleChangeSelect(e) {
    setQualificacao(e.target.value);
  }


  // selecionar data no calendario
  const handleSelect = (date) => {

    // console.log(format(date, 'dd/MM/yyyy'))
    let diaAtual = ((format(date, 'dd/MM/yyyy')))

    setCalendar((prevState) => [...prevState, diaAtual])
    setLocate(false)

  }



  function changeLocate() {

    setLoadVerifique(true)

    for (var i = 0; i < calendar.length; i++) {

      var array = calendar[i];

      if (atualizada.includes(array) && atualizada.includes(array) != 10) {

        toast.warn('"' + array + '"' + " Data indisponivel!");
        setLoadVerifique(false)
        return;

      }

    }

    if (array.length == 10) {
      setLocate(true)
      setLoadVerifique(false)

    }


  }


  function deleteDay(date) {

    let indice = calendar.indexOf(date)
    calendar.splice(indice, 1)

    setLocate(false)
    setCalendar(calendar)
    setHandleList(!handleList)
    // toast.info('Excluido ' + date)


  }



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
    } else {
      console.log('Não há usuários logados!')
    }

  }, [])


  // Carregar informação do cliente para criar array com locação de veículos
  useEffect(() => {

    async function loadAgendamento() {

      await firebase.firestore().collection('Clientes').onSnapshot((doc) => {
        let DataUser = [];

        doc.forEach((doc) => {
          DataUser.push({
            id: doc.id,
            nome: doc.data().nome,
            sobrenome: doc.data().sobrenome,
            detalhes: doc.data().detalhes,
          })

        })

        // let listSolicitados = DataUser.filter((item) => {
        //   return (item.situacao === 'Solicitado')

        // })

        let dadosUnico = DataUser.filter((item) => {
          return (item.nome === ClienteAtual.map((dados) => dados.nome).toString())

        })

        let dadosReserva = dadosUnico.map((item) => item.detalhes)

        // if (dadosReserva != '') {

        //   for (const obj of dadosUnico) {
        //     setClientes(obj.detalhes[0].reservas)
        //   }
        // }

        // setDadosLocacao(dadosUnico)
        setClientes(dadosReserva)
      })
    }

    loadAgendamento()

  }, [cars])


  useEffect(() => {

    async function loadAgendamento() {

      await firebase.firestore().collection('Clientes').onSnapshot((doc) => {
        let DataUser = [];

        doc.forEach((doc) => {
          DataUser.push({
            id: doc.id,
            nome: doc.data().nome,
            detalhes: doc.data().detalhes,
            protocolo: doc.data().protocolo,
          })

        })

        let dadosUnico = DataUser.filter((item) => {
          return (item.nome === ClienteAtual.map((dados) => dados.nome).toString())

        })
        setDadosLocacao(dadosUnico)
      })
    }

    loadAgendamento()

  }, [cars])


  useEffect(() => {


    setLoad(true)

    async function loadCars() {

      await firebase.firestore().collection('Garagem').onSnapshot((doc) => {
        let DataUser = [];

        doc.forEach((doc) => {
          DataUser.push({
            id: doc.id,
            nome: doc.data().nome,
            motor: doc.data().motor,
            cor: doc.data().cor,
            ano: doc.data().ano,
            alarme: doc.data().alarme,
            ar: doc.data().ar,
            som: doc.data().som,
            carregador: doc.data().carregador,
            suporte: doc.data().suporte,
            sensor: doc.data().sensor,
            direcao: doc.data().direcao,
            diaria: doc.data().diaria,
            reservas: doc.data().reservas,
            profile: doc.data().profile,
            disponibilidade: doc.data().disponibilidade,
          })

        })
        setCars(DataUser)
        setLoad(false)
      })

    }

    loadCars()

  }, [])



  useEffect(() => {


    setSpinnerFeed(true)

    async function LoadFeedBack() {

      await firebase.firestore().collection('Comentarios').onSnapshot((doc) => {
        let DataFeed = [];

        doc.forEach((doc) => {
          DataFeed.push({
            id: doc.id,
            cliente: doc.data().cliente,
            message: doc.data().message,
            star: doc.data().star,
            data: doc.data().data,

          })

        })
        let filterFeeds = DataFeed.slice(0, 2)
        setLoadFeed(filterFeeds)
        setSpinnerFeed(false)
      })

    }

    LoadFeedBack()

  }, [])


  useEffect(() => {
    function gerarProtocolo() {
      // gerar dentro de um intervalo
      // let teste = Math.floor(Math.random() * (200 - 100 + 1)) + 100;

      let NumeroSorteado = Math.floor(Math.random() * 1000000);

      setProtocolo(NumeroSorteado)

      let validando = listaSorteados.includes(NumeroSorteado)

      if (validando) {

        console.log('numero ja foi sorteado')
        return;

      } else (

        listaSorteados.push(NumeroSorteado),
        setProtocolo(NumeroSorteado),
        localStorage.setItem('userProtocoll', JSON.stringify(NumeroSorteado))

      )

    }

    gerarProtocolo()

  }, [])


  function handleFinalizar(dados) {

    let stringProtocolo = dadosLocacao.map((item) => item.protocolo).toString()
    let numberProtocolo = parseInt(stringProtocolo)

    if (numberProtocolo > 0) {
      alert('Você já tem uma reserva ativa!!!')
      // alert('Para mais informações entre em contato conosco ou entre com um novo usuário!!!')

      if (window.confirm('Deseja prosseguir com a reserva?')) {

        let newVisitante = atualizada.concat(calendar)

        // descontos 
        let dez = (calendar.length * dados.diaria / 100) * 10
        let quinze = (calendar.length * dados.diaria / 100) * 15
        let vinte = (calendar.length * dados.diaria / 100) * 12
        let vinteCinco = (calendar.length * dados.diaria / 100) * 25
        let trinta = (calendar.length * dados.diaria / 100) * 30
        let trintaCinco = (calendar.length * dados.diaria / 100) * 35
        let quarenta = (calendar.length * dados.diaria / 100) * 40

        let desconto = (calendar.length == 2 ? dez : calendar.length > 2 && calendar.length <= 5 ? quinze : calendar.length > 5 && calendar.length <= 10 ? vinte : calendar.length > 10 && calendar.length <= 15 ? vinteCinco : calendar.length > 15 && calendar.length <= 20 ? trinta : calendar.length > 20 && calendar.length <= 25 ? trintaCinco : calendar.length > 25 ? quarenta : '')


        let DadosCar = []

        if (ClienteAtual == '') {
          DadosCar.push({
            id: idSelected,
            nome: dados.nome,
            reservas: calendar,
            dataCliente: calendar,
            datasDB: newVisitante,
            diasTotal: calendar.length,
            valor: dados.diaria * calendar.length,
            desconto: (dados.diaria * calendar.length) - desconto
          })

          localStorage.setItem('dadosCar', JSON.stringify(DadosCar))

        }

        if (ClienteAtual != '') {
          swal({
            title: "RC-Locações",
            text: ` Deseja fazer a reserva ? `,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
            .then((willDelete) => {
              if (willDelete) {
                // criar lista de array de locação

                // let ListaLocacao = []

                // ListaLocacao.push({
                //   detalhes: [{ nome: dados.nome, reservas: calendar, diasTotal: calendar.length, total: dados.diaria * calendar.length, desconto: (dados.diaria * calendar.length) - desconto }],

                // })

                // let testeString = JSON.stringify(ListaLocacao)

                firebase.firestore().collection('Clientes')
                  .doc(userLogged.uid)
                  .update({
                    protocolo: protocolo,
                    situacao: 'Solicitado',
                    detalhes: [{ nome: dados.nome, reservas: calendar, diasTotal: calendar.length, total: dados.diaria * calendar.length, desconto: (dados.diaria * calendar.length) - desconto }],
                  })


                swal(`Parabéns ${ClienteAtual.map((item) => item.nome + ' ' + item.sobrenome)}, Numero da sua solicitação ${protocolo} - aguarde nosso contanto... `, {
                  icon: "success",
                });

                onClose()
                setCalendar([])
                setLocate(false)
                handleCarsReservas()
                handleHistorico()

              } else {
                swal("Reserva cancelada!");
              }
            });

        } else {

          swal({
            title: "RC-Locações",
            text: ` Deseja prosseguir com a solicitação? `,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
            .then((willDelete) => {
              if (willDelete) {

                swal(`Você será redirecionado!`, {
                  icon: "success",
                });

                window.location.href = "/Etapas";
                onClose()

              } else {
                swal("Solicitação cancelada!");
              }
            });
        }

      } else {

        redirecionarSuporte()

      }

    }




  }


  function redirecionarSuporte() {

    if (window.confirm('Deseja prosseguir para nosso whatsapp?')) {
      alert('Você será redirecionado...')
      window.location.href = 'https://wa.me/5588997293834?text=Ol%C3%A1%20estou%20com%20duvidas...%20'

    } else {
      alert('Cancelado!')

    }

    return;
  }


  function filtrarCar(selecionado) {
    let stringProtocolo = dadosLocacao.map((item) => item.protocolo).toString()
    let numberProtocolo = parseInt(stringProtocolo)

    if (numberProtocolo > 0) {
      alert('Atenção você tem uma reserva ativa!!!')
      alert('Verifique a reserva no icone do carro ou no menu.')
    }

    if (ClienteAtual != '') {
      onOpen()

    } else {
      setIsModalEscolha(true)

    }


    let selectt = cars.filter((item) => {
      return (item.nome === selecionado.nome)

    })

    for (const obj of selectt) {
      setIdSelected(obj.id);
      setAtualizada(obj.reservas)
    }

    setCarSelected(selectt)

  }


  // atualizar reservas em cada carro

  function handleCarsReservas() {

    let datasAtualizada = atualizada.concat(calendar)

    firebase.firestore().collection('Garagem')
      .doc(idSelected)
      .update({
        reservas: datasAtualizada
      })

      .then(() => {
        console.log("Reserva atualizada!")
      })
      .catch((error) => {
        console.log(error + 'Deu algum erro')
      })


  }


  function handleClose() {
    onClose()

    setNome('')
    setSobrenome('')
    setLocate(false)
    setCalendar([])
  }


  async function irMessagens() {

    if (ClienteAtual == '') {
      toast.warn('Faça login para deixar seu comentário!')
      return;
    }


    if (feedBack == '') {
      toast.info('Digite seu comentário!')
      return
    }

    if (qualificacao == '') {
      toast.info('Selecione uma classificação!')
      return
    }


    await firebase.firestore().collection('Comentarios')
      .doc()
      .set({
        cliente: ClienteAtual.map((item) => item.nome + '' + item.sobrenome),
        message: feedBack,
        star: qualificacao,
        data: today
      })
      .then(() => {
        toast.success('Agradecemos seu feedback!')
        setTimeout(closeModal, 2000)

      })
      .catch((error) => {
        console.log(error + 'Deu algum erro')
        toast.error(error + 'Deu algum erro')
      })

  }


  function closeModal() {
    setComentario('')
    setFeedBack('')
    setQualificacao('')
    setIsModalVisible(false)

  }


  function closeModalEscolha() {
    setIsModalEscolha(false)

  }


  function handleVisitante() {
    toast('⏳Você estar acessando como visitante...')

    setTimeout(onOpen, 2500)

    setTimeout(fecharModalEscolha, 2000)

  }

  function handleCliente() {
    toast('⏳Faça login para continuar...')
    setTimeout(renderizarLogin, 2500
    )
  }


  function renderizarLogin() {
    window.location.href = "./Login"
  }


  function fecharModalEscolha() {
    setIsModalEscolha(false)
  }


  async function handleHistorico() {

    let cliente = ClienteAtual.map((item) => item.nome).toString()
    let carro = carSelected.map((item) => item.nome).toString()
    let diaAtual = dia

    await firebase.firestore().collection('Historico')
      .doc()
      .set({
        cliente: cliente,
        status: 'cliente',
        carro: carro,
        dia: diaAtual,
        mes: mesFormatado,
        locacao: calendar

      })
      .then(() => {
        console.lo("Histórico criado!");
      })
      .catch((error) => {
        console.log(error + 'Deu algum erro')
      })
  }


  setTimeout(function () {
    setLoadVideo(true)
  }, 1500)


  console.log(clientes)

  return (

    <Box backgroundColor='white'>

      <>
        {isModalEscolha ? (
          <ModalEscolha onClose={closeModalEscolha}>
            <div id='modal-Escolha'>
              <Box width='100%' display='flex' alignItems='start' justifyContent='start' flexDirection='column'>
                <Box width='100%' display='flex' alignItems='start' justifyContent='start' marginTop='10%' >
                  <Heading fontSize={16} color='#FFF' textAlign='start'>------------Continuar como ?---------------</Heading>
                </Box>

                <Box width='100%' display='flex' alignItems='center' justifyContent='center' marginBottom={3} marginTop={3} border='2px solid white' cursor='pointer' onClick={handleCliente}>
                  <BiIcons.BiSolidUserCheck className='icon' color='#fff' size={80} />
                  <Text color='#fff' marginLeft={2}>Cliente</Text>
                </Box>

                <Box width='100%' display='flex' alignItems='center' justifyContent='center' border='2px solid white' cursor='pointer' onClick={handleVisitante}>
                  <BiIcons.BiSolidUserX className='icon' color='fff' size={80} />
                  <Text color='#fff' marginLeft={2}>Visitante</Text>
                </Box>

              </Box>
            </div>
          </ModalEscolha>

        ) : ''}

      </>

      <>
        {isModalVisible ? (
          <ModalFeed onClose={closeModal} >
            <div id='modal-Feed'>
              <Box width='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column'>

                <Box width='90%' display='flex' marginBottom='2%' >
                  <Heading fontSize={16} color='#FFF'>Deixe seu comentário</Heading>
                </Box>
                <Box width='90%' display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Input color='#fff' placeholder='Seu nome' marginBottom='2%' value={ClienteAtual != '' ? ClienteAtual.map((item) => item.nome + ' ' + item.sobrenome) : comentario} onChange={(e) => setComentario(e.target.value)} />
                  <Textarea width="100%" color='#fff' placeholder='Seu comentário' marginBottom='2%' value={feedBack} onChange={(e) => setFeedBack(e.target.value)} />
                </Box>

                <Box width='90%' display='flex' alignItems='start' justifyContent='start' marginTop='2%' marginBottom='3%' >
                  <Heading fontSize={12} color='#FFF'>De 1 a 5 com quantas estrelas você avalia nossos serviços: </Heading>
                </Box>

                <Box display='flex' width='90%' marginBottom='3%' >
                  <select value={qualificacao} onChange={handleChangeSelect} style={{ backgroundColor: 'transparent', color: 'gray', border: '1px solid white' }} >
                    <option value=''> Selecionar...</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </Box>

                <Box width='90%' alignItems='start' justifyContent='start' marginTop='2%' marginBottom='3%' >
                  <Button width='100%' backgroundColor='#126180' color='#fff' onClick={irMessagens} >Enviar comentário</Button>
                </Box>

              </Box>
            </div>
          </ModalFeed>



        ) : null}

      </>

      <>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={handleClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color='#367588 '>Período do aluguel</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} mt={-6}>
              <FormControl >
                <Calendar
                  locale={pt}
                  onChange={handleSelect}
                  readOnly
                  className="inputBox"
                />


                <Box display='flex' width='95%' height='auto' alignItems='center' justifyContent='center' fontSize={12} marginTop={3} flexDirection='column'>
                  {/* <Text display='block' backgroundColor='green.200' padding={2} > {calendar.map((item) => 'Dia: ' + item + ' * ')}</Text> */}

                  <Heading color='#367588' fontSize={16}>Dias selecionados</Heading>

                  {calendar.map((item) => {
                    return (
                      <Box display='flex' width='100%' marginTop='1%' alignItems='center' justifyContent='center' flexDirection='row'>
                        <Text display='flex' width='30%' alignItems='center' justifyContent='center'> Dia: {item} </Text>
                        <BsIcons.BsXCircle color="red" onClick={() => deleteDay(item)} />
                      </Box>
                    )

                  })}
                  <Box>

                    {locate && (
                      <Box wi display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                        <iframe src="https://lottie.host/?file=94390cab-0707-4df8-9eb9-92a4edceba92/7CS2tUdWI6.json"></iframe>
                        <span>{calendar.length == 1 ? 'Dia disponível' : 'Todos os dias disponíveis'}</span>
                      </Box>
                    )}

                  </Box>

                </Box>

                {/* <Box display='flex' width='100%' marginTop={5} alignItems='center' justifyContent='center'>
                  {!locate ? <Button width='100%' colorScheme='blue' onClick={changeLocate}> {load ? <CircularProgress size={6} isIndeterminate color='green.300' marginLeft='2%' /> : 'VERIFICAR DISPONIBILIDADE'} </Button> : <Button width='100%' colorScheme='blue' >{ClienteAtual != '' ? 'Fazer reserva' : 'Proseguir com reserva'}</Button>}

                </Box> */}

              </FormControl>

              <br></br>
              <hr></hr>

              {calendar.length >= 1 ? (
                <FormControl mt={4}>
                  <Heading color='#367588' fontSize={16}>Detalhes da sua Locação</Heading>

                  {carSelected.map((item) => {
                    return (
                      <>
                        {ClienteAtual != '' && (
                          <>
                            <Box display='flex' flexDirection='row' alignItems='center'>
                              <CheckIcon boxSize={3} marginRight='6px' color='green' />
                              <Text> Cliente: </Text><Heading display='inline' marginLeft='5px' marginRight='5px' fontSize={16}> {ClienteAtual.map((item) => item.nome + ' ' + item.sobrenome)} </Heading>
                            </Box>

                            {/* <Box display='flex' flexDirection='row' alignItems='center'>
                              <CheckIcon boxSize={3} marginRight='6px' color='green' />
                              <Text> Cpf: </Text><Heading display='inline' marginLeft='5px' marginRight='5px' fontSize={16}> {ClienteAtual.map((item) => item.cpf)} </Heading>
                            </Box> */}
                          </>
                        )}

                        {ClienteAtual == '' && (
                          <Box display='flex' flexDirection='row' alignItems='center'>
                            <CheckIcon boxSize={3} marginRight='6px' color='green' />
                            <Text> Cliente: </Text><Heading display='inline' marginLeft='5px' marginRight='5px' fontSize={16}> Visitante </Heading>
                          </Box>
                        )}

                        <Box display='flex' flexDirection='row' alignItems='center'>
                          <CheckIcon boxSize={3} marginRight='6px' color='green' />
                          <Text> Seu carro é: </Text><Heading display='inline' marginLeft='5px' marginRight='5px' fontSize={16}> {item.nome} </Heading>
                        </Box>

                        <Box display='flex' flexDirection='row' alignItems='center'>
                          <CheckIcon boxSize={3} marginRight='6px' color='green' />
                          <Text> Diária desse veículo </Text><Heading display='inline' marginLeft='5px' marginRight='5px' fontSize={16}> R$ {item.diaria},00 </Heading>
                        </Box>

                        <Box display='flex' flexDirection='row' alignItems='center'>
                          <CheckIcon boxSize={3} marginRight='6px' color='green' />
                          <Text>Você ficará <Heading display='inline' marginLeft='5px' fontSize={16}>{calendar.length}</Heading> {calendar.length <= 1 ? 'dia com o Veículo' : 'dias com o Veículo'} </Text>
                        </Box>

                        <Box display='flex' flexDirection='row' alignItems='center'>
                          <CheckIcon boxSize={3} marginRight='6px' color='green' />
                          <Text> {calendar.length == 4 ? 'Você pagará ' : 'Você irá pagar'}  </Text><Heading display='inline' marginLeft='5px' marginRight='5px' fontSize={16} color={calendar.length <= 3 ? 'black' : 'red'} > R$ {item.diaria * calendar.length},00 </Heading>


                          <>
                            {calendar.length == 2 && (
                              <Image
                                src={dez}
                                width={70}
                              />
                            )}

                            {calendar.length > 2 && calendar.length <= 5 && (
                              <Image
                                src={quinze}
                                width={70}
                              />
                            )}

                            {calendar.length > 5 && calendar.length <= 10 && (
                              <Image
                                src={vinte}
                                width={70}
                              />
                            )}


                            {calendar.length > 10 && calendar.length <= 15 && (
                              <Image
                                src={vinceCinco}
                                width={70}
                              />
                            )}

                            {calendar.length > 15 && calendar.length <= 20 && (
                              <Image
                                src={trinta}
                                width={70}
                              />
                            )}

                            {calendar.length > 20 && calendar.length <= 25 && (
                              <Image
                                src={trintaCinco}
                                width={70}
                              />
                            )}

                            {calendar.length > 25 && (
                              <Image
                                src={quarenta}
                                width={70}
                              />
                            )}


                          </>

                        </Box>

                        {calendar.length >= 1 && (
                          <Box display='flex' alignItems='center' flexDirection='column'>

                            <Box width='100%' display='flex' alignItems='center' justifyContent='start' flexDirection='row'>
                              {calendar.length > 1 && <CheckIcon boxSize={3} marginRight='6px' color='green' />}


                              {calendar.length == 2 && <Text>Total a pagar com desconto <strong style={{ color: 'green' }}> R$ {(calendar.length * item.diaria - ((calendar.length * item.diaria) / 100) * 10)},00</strong> </Text>}

                              {calendar.length > 2 && calendar.length <= 5 && <Text>Total a pagar com desconto <strong style={{ color: 'green' }}> R$ {(calendar.length * item.diaria - ((calendar.length * item.diaria) / 100) * 15)},00</strong> </Text>}

                              {calendar.length > 5 && calendar.length <= 10 && <Text>Total a pagar com desconto <strong style={{ color: 'green' }}> R$ {(calendar.length * item.diaria - ((calendar.length * item.diaria) / 100) * 20)},00</strong> </Text>}

                              {calendar.length > 10 && calendar.length <= 15 && <Text>Total a pagar com desconto <strong style={{ color: 'green' }}> R$ {(calendar.length * item.diaria - ((calendar.length * item.diaria) / 100) * 25)},00</strong> </Text>}

                              {calendar.length > 15 && calendar.length <= 20 && <Text>Total a pagar com desconto <strong style={{ color: 'green' }}> R$ {(calendar.length * item.diaria - ((calendar.length * item.diaria) / 100) * 30)},00</strong> </Text>}

                              {calendar.length > 20 && calendar.length <= 25 && <Text>Total a pagar com desconto <strong style={{ color: 'green' }}> R$ {(calendar.length * item.diaria - ((calendar.length * item.diaria) / 100) * 35)},00</strong> </Text>}

                              {calendar.length > 25 && <Text>Total a pagar com desconto <strong style={{ color: 'green' }}> R$ {(calendar.length * item.diaria - ((calendar.length * item.diaria) / 100) * 40)},00</strong> </Text>}

                            </Box>

                            <ModalFooter>
                              <Box display='flex' width='100%' marginTop={5} alignItems='center' justifyContent='center'>
                                {!locate ? <Button width='70%' colorScheme='blue' onClick={changeLocate}> {loadVerifique ? <CircularProgress title='aguarde...' size={6} isIndeterminate color='green.300' marginLeft='2%' /> : 'VERIFICAR DISPONIBILIDADE'} </Button> : <Button width='80%' colorScheme='blue' onClick={() => handleFinalizar(item)} >{ClienteAtual != '' ? 'Fazer reserva' : 'Prosseguir com reserva'}</Button>}

                                <Box marginLeft={6}>
                                  <Button colorScheme='red' onClick={handleClose}>Cancel</Button>
                                </Box>

                              </Box>
                            </ModalFooter>

                          </Box>
                        )}


                      </>

                    )
                  })}

                </FormControl>

              ) : ''}

            </ModalBody>

          </ModalContent>
        </Modal>
      </>


      <Header />

      <Box display='flex' alignItems='center' justifyContent='center' width='100%' flexDirection='column'>
        <Box height='130px' className='banner-index'>
          <Image
            src={banner} width='100%' height='200px'
          />
        </Box>

        <Box width='100%' display='flex' alignItems='center' justifyContent='center' className='break-name-user'>
          {ClienteAtual.map((item) => {
            return (
              <>
                <Text fontSize={11} color='gray'>Bem vindo: {item.nome} {item.sobrenome} </Text>
              </>
            )
          })}
        </Box>

        {/* <Text fontSize={16}>{userLogged.uid}</Text> */}

        <Box alignItems='center' justifyContent='center' display='flex' flexDirection='column' className='break-tittle'>
          <Box>
            <strong style={{ color: '#006400', fontWeight: 'bolder' }}>Veículos disponíveis</strong>
          </Box>


          <Box>
            <p>Viage em alguns clicks!</p>
          </Box>

        </Box>


        {load ? <Box height='20vh'><CircularProgress isIndeterminate color='green.300' marginLeft='2%' />  </Box> :

          <>

            <Box marginTop='10%' width='100%'>

              <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                // loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                  clickable: true,
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className="swiper_container"


              >
                {cars.map((item, index) => {
                  return (
                    <>
                      <SwiperSlide style={{ backgroundColor: 'white' }}>
                        <Box key={index} alignItems='center' justifyContent='center' display='flex' flexDirection='column' height='65vh' fontFamily='sans-serif' fontSize='12px'>
                          <img width='60%' alt='imagem' src={item.profile} style={{ marginBottom: '3%' }} className='break-imagens' />

                          <strong style={{ color: '#006400', fontWeight: 'bolder', fontSize: '1rem' }}>{item.nome}</strong>

                          <Box width='100%' display='flex' alignItems='center' justifyContent='center'>
                            <CheckIcon boxSize={2.5} margin='6px' color='green' />
                            <span style={{ color: '#000' }}>Ano {item.ano} </span>

                            <CheckIcon boxSize={2.5} margin='6px' color='green' />
                            <span style={{ color: '#000' }}> Motor {item.motor} </span>

                            <CheckIcon boxSize={2.5} margin='6px' color='green' />
                            <span style={{ color: '#000' }}>Cor {item.cor} </span>

                            {item.alarme == 'true' ? <CheckIcon boxSize={2.5} margin='6px' color='green' /> : <CloseIcon boxSize={2.5} margin='6px' color='red' />}
                            <span style={{ color: '#000' }}>{item.alarme == 'true' ? 'Alarme' : 'Alarme'}</span>
                          </Box>

                          <Box width='100%' display='flex' alignItems='center' justifyContent='center'>
                            {item.som == 'true' ? <CheckIcon boxSize={2.5} margin='6px' color='green' /> : <CloseIcon boxSize={2.5} margin='6px' color='red' />}
                            <span style={{ color: '#000' }}>{item.som ? 'Som / Bluetooth' : 'Som / Bluetooth'} </span>

                            {item.suporte == 'true' ? <CheckIcon boxSize={2.5} margin='6px' color='green' /> : <CloseIcon boxSize={2.5} margin='6px' color='red' />}
                            <span style={{ color: '#000' }}>{item.suporte ? 'Suporte / Celular' : 'Suporte / Celular'} </span>
                          </Box>

                          <Box width='100%' display='flex' alignItems='center' justifyContent='center'>
                            {item.sensor == 'true' ? <CheckIcon boxSize={2.5} margin='6px' color='green' /> : <CloseIcon boxSize={2.5} margin='6px' color='red' />}
                            <span style={{ color: '#000' }}>{item.sensor ? 'Sensor de Ré' : 'Sensor de Ré'} </span>

                            <CheckIcon boxSize={2.5} margin='6px' color='green' />
                            <span style={{ color: '#000' }}>Direção {item.direcao}</span>
                          </Box>

                          <Box width='100%' display='flex' alignItems='center' justifyContent='center'>
                            <CheckIcon boxSize={2.5} margin='6px' color='green' />
                            <span style={{ color: '#000' }}>{item.ar ? 'Ar condicionado' : 'Ar condicionado'} </span>
                          </Box>


                          {item.disponibilidade == 'nao' ?

                            <Box width='100%' display='flex' alignItems='center' justifyContent='center' marginTop='5%'>
                              <Link href='' style={{ width: '150px', backgroundColor: 'gray', color: '#fff', fontSize: '16px', padding: '0.5%', textAlign: 'center', borderRadius: '4px', fontWeight: 'bolder' }} onClick={() => alert("Fast-car: indisponível")}>Carro indisponível</Link>
                            </Box>

                            :

                            <Box width='100%' display='flex' alignItems='center' justifyContent='center' marginTop='5%'>
                              <Link href='#modal-Escolha' style={{ width: '150px', backgroundColor: '#32CD32', color: '#fff', fontSize: '16px', padding: '0.5%', textAlign: 'center', borderRadius: '4px', fontWeight: 'bolder' }} onClick={() => filtrarCar(item)}>Simular reserva</Link>
                            </Box>

                          }



                        </Box>
                      </SwiperSlide>
                    </>
                  )
                })}

                <div className='slider-controler' style={{ backgroundColor: 'white' }}>

                  <div className='swiper-button-prev slider-arrow'>
                    <ion-icon name="arrow-back-outline"></ion-icon>
                  </div>

                  <div className='swiper-button-next slider-arrow'>
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>
                  <div className='swiper-pagination'></div>
                </div>
              </Swiper>
            </Box>

          </>

        }




      </Box>

      <Box display='flex' alignItems='center' justifyContent='end' marginRight='1%'>
        <Image src={bomba} width={30} style={{ marginRight: '0.2%' }} />
        <Box display='flex' alignItems='center' justifyContent='start' flexDirection='column'>
          <Text color='#08298A' fontSize={10}>Política de Abastecimento</Text>
          <strong style={{ display: 'flex', width: '100%', fontSize: '10px', textAlign: 'left' }}>Mesmo nível</strong>
        </Box>
      </Box>


      <Box fontSize='1rem' marginTop='3%' className='break-locacao'>
        <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' width='100%' backgroundColor='#08298A'>
          <Box marginTop='5%'>
            <strong style={{ color: 'white', fontSize: '1.5rem', }}>Locação de veículo </strong>
          </Box>

          <Box display='flex' alignItems='center' justifyContent='center' marginTop='2%'>
            <BsIcons.BsCalendarDate className='icon' color='#fff' size={30} />
            <span style={{ color: '#fff', margin: '3%' }}>Diária</span>

            <BsIcons.BsCalendar2Minus className='icon' color='#fff' size={30} />
            <span style={{ color: '#fff', margin: '3%' }}>Semanal</span>


            <BsIcons.BsCalendar3 className='icon' color='#fff' size={30} />
            <span style={{ color: '#fff', margin: '3%' }}>Mensal</span>
          </Box>
        </Box>

        <Box width='100%' display='flex' alignItems='center' justifyContent='center' backgroundColor='#08298A' className='break-cars2'>

          <Box width='100%' display='flex' alignItems='center' justifyContent='center' marginTop='3%' marginBottom='1%' >
            <Image src={frota01} style={{ borderRadius: '5px' }} className='break-cars' />
          </Box>

          <Box width='100%' display='flex' alignItems='center' justifyContent='center' marginTop='3%' marginBottom='1%' >
            <Image src={frota02} style={{ borderRadius: '5px' }} className='break-cars' />
          </Box>

        </Box>


      </Box>

      {/* <Box alignItems='center' justifyContent='center' display='flex' marginTop='4%'>
        <strong style={{ color: '#006400', fontWeight: 'bolder' }}>Prévia da frota</strong>
      </Box>

      <Box width='100%' marginTop='0.5%' alignItems='center' justifyContent='center' display='flex'>
        {loadVideo && (
          <ReactPlayer
            className='react-player'
            url='https://youtu.be/_uwsq9CSDu4'
            controls={true}
          // width='90%'
          // height='30vh'
          // light="../img/banner.png"
          />
        )}
      </Box> */}

      <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' marginTop='10%' >
        <Image src={feedback} style={{ borderRadius: '5px' }} className='break-feed' />

        {spinnerFeed ? <Box height='20vh'><CircularProgress isIndeterminate color='green.300' marginLeft='2%' />  </Box> :
          <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
            {loadFeed.map((feed) => {
              return (
                <Box height='auto' backgroundColor='#F8F8FF' borderRadius='5px' marginTop='5%' padding='3%' className='feeds' >
                  <Box display='flex' alignItems='center' justifyContent='start' >
                    <Heading marginRight='2%' fontSize={18} color='#1E90FF'> - {feed.cliente}</Heading>
                    {Array(parseInt(feed.star)).fill().map((...index) => (
                      <BsIcons.BsStarFill className='icon' color='orange' size={16} />
                    ))}
                  </Box>
                  <Box marginTop='1%'>
                    <span>"{feed.message}"</span>
                  </Box>
                  <Box marginTop='1%'>
                    <span style={{ color: '#a9a9a9', fontWeight: 'bolder', }}> {feed.data}</span>
                  </Box>
                </Box>
              )

            })}
          </Box>
        }


        {/* <Heading fontSize={18} color='#1E90FF'> - {feed.cliente} ⭐⭐⭐⭐⭐ </Heading> */}

        <Box display='flex' alignItems='end' justifyContent='end' marginTop='5%' marginBottom='3%' className='mais-feeds'>
          <Box display='flex' alignItems='center' justifyContent='center' marginRight='1.5%'>
            <BsIcons.BsFillChatRightDotsFill className='icon' color='#0B173B' size={22} style={{ marginRight: '2%' }} />
            <Link href='#modal-Feed' onClick={() => setIsModalVisible(!isModalVisible)}>Comentar</Link>
          </Box>

          <Box display='flex' alignItems='center' justifyContent='center'>
            <BsIcons.BsFillChatRightTextFill className='icon' color='#0B173B' size={22} style={{ marginRight: '2%' }} />
            <Link href='./Feeds'>Todos </Link>
          </Box>

        </Box>

      </Box>

      <Box width='100%' height='auto' display='flex' alignItems='center' justifyContent='center' flexDirection='column' backgroundColor='#0B173B'>

        <Box padding='5%'>
          {/* <Box marginBottom='5%'>
            <Heading color='#fff' fontSize='1.3rem' marginBottom='3%' >RC-LOCAÇÕES | FALE CONOSCO </Heading>
          </Box> */}

          <Box display='flex' width='100%' alignItems='center' justifyContent='center' marginTop='10%' marginBottom='2%'>
            <Image
              src={logo}
              width={250}
            />

          </Box>

          <Box width='100%' display='flex' alignItems='center' justifyContent='space-around' fontFamily='sans-serif' fontSize='0.9rem' padding='3%'>
            <BsIcons.BsFillTelephoneForwardFill className='icon' color='#fff' size={25} />
            <Link href=''>
              <FaIcons.FaWhatsappSquare className='icon' color='#fff' size={25} />
            </Link>
            {/* <Link href='https://wa.me/5588997293834?text=Ol%C3%A1%20gostaria%20de%20saber%20mais%20sobre%20seus%20servi%C3%A7os' target='blank'>
              <FaIcons.FaWhatsappSquare className='icon' color='#fff' size={25} />
            </Link> */}

            <Link href="">
              <FaIcons.FaInstagramSquare className='icon' color='#fff' size={25} />
            </Link>
            {/* <Link href="https://www.instagram.com/rc_locacoes_de_veiculos/?igshid=MzRlODBiNWFlZA%3D%3D" target='blank'>
              <FaIcons.FaInstagramSquare className='icon' color='#fff' size={25} />
            </Link> */}
            <Link href="">
              <FaIcons.FaLink className='icon' color='#fff' size={25} />
            </Link>
            {/* <Link href="https://api.whatsapp.com/send?text=[https://rc-locacao.vercel.app/]">
              <FaIcons.FaLink className='icon' color='#fff' size={25} />
            </Link> */}

          </Box>


          <Box width='100%' height='2vh' borderBottom='0.5px solid white'></Box>

          <Box width='100%' height='auto' display='flex' alignItems='center' justifyContent='center' backgroundColor='#0B173B' color='#fff' flexDirection='column'>
            {/* <p> © Feito por <a href='https://fsolutions.online//' target='_blank' style={{ color: '#0040FF' }}> Fsolutions</a> - Todos os direitos reservados </p> */}
            <Box display='flex' marginTop='3%' >
              <a href='https://portfoliofg.netlify.app/' target='_blank' style={{ color: '#fff' }}> Copyright © 2023 | Feito por <small style={{ fontSize: '15px', color: '#4682B4' }}> Fernando Gustavo </small> </a>
            </Box>

          </Box>
        </Box>

      </Box>

      {/* <Box width='100%' className='query-link' backgroundColor='blue'>
        <Link href="https://api.whatsapp.com/send?text=[https://rc-locacao.vercel.app/]" target='_blank'><Image src={whats} className='query-whats' /></Link>
      </Box> */}

    </Box >
  )
}


