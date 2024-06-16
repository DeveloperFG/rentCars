import { useState } from "react";

import { Box, Button, CircularProgress, CircularProgressLabel, Heading } from '@chakra-ui/react'

import * as BsIcons from 'react-icons/bs';
import * as RxIcons from 'react-icons/rx';

import { toast } from 'react-toastify';

import firebase, { storage } from "../../db/db";

import Link from "next/link";


export default function Menu() {

    const [nome, setNome] = useState('')
    const [motor, setMotor] = useState('')
    const [cor, setCor] = useState('')
    const [ano, setAno] = useState('')
    const [alarme, setAlarme] = useState('')
    const [ar, setAr] = useState('')
    const [som, setSom] = useState('')
    const [carregador, setCarregador] = useState('')
    const [suporte, setSuporte] = useState('')
    const [sensor, setSensor] = useState('')
    const [direcao, setDirecao] = useState('')
    const [diaria, setDiaria] = useState('')
    // const [km, setKm] = useState('')
    const [disponibilidade, setDisponibilidade] = useState('')

    const [imgCarro, setImgCarro] = useState('')
    const [urlCarro, setUrlCarro] = useState('')
    const [inputCarro, setInputCarro] = useState()
    const [reservas, setReservas] = useState([])

    const [load, setLoad] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const [id, setId] = useState('')
    const [nomeAlter, setNomeAlter] = useState('')
    const [disponibilidadeAlter, setDisponibilidadeAlter] = useState('')
    const [diariaAlter, setDiariaAlter] = useState('')

    const [listCar, setListCar] = useState([])
    const [editar, setEditar] = useState(false)

    const [controle, setControle] = useState(0)

    function onChangeAlarme(event) {
        setAlarme(event.target.value);
    }

    function onChangeAr(event) {
        setAr(event.target.value);
    }

    function onChangeSom(event) {
        setSom(event.target.value);
    }

    function onChangeCarregador(event) {
        setCarregador(event.target.value);
    }

    function onChangeSuporte(event) {
        setSuporte(event.target.value);
    }

    function onChangeSensor(event) {
        setSensor(event.target.value);
    }


    const handleFile = (e) => {

        setInputCarro()

        if (e.target.files[0]) {

            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {

                setImgCarro(image)
                setUrlCarro(URL.createObjectURL(e.target.files[0]))

            } else {
                toast.warn("envie uma imagem do tipo PNG ou JPEG", {
                    icon: "🚫"
                });
                setImgCarro('');
                setInputCarro('');
                return;
            }

        }
    }



    async function handleCadastrar() {

        // cadastrar empresa com foto de perfil

        setLoad(true)

        if (nome == '' || motor == '' || cor == '' || ano == '' || direcao == '' || diaria == '' || ar == '' || disponibilidade == '' || alarme == '' || som == '' || carregador == '' || suporte == '' || sensor == '' || imgCarro == '') {
            toast.info("Preencha todos os campos!", {
                icon: "😒"
            });
            setLoad(false)
            return;
        }

        const uploadTask = await firebase.storage()
            .ref(`img/Garagem/${imgCarro.name}`)
            .put(imgCarro)
            .then(async () => {

                toast.success("Upload sucesso!", {
                    icon: "😁"
                });

                await firebase.storage().ref('img/Garagem')
                    .child(imgCarro.name).getDownloadURL()
                    .then(async (ul) => {
                        let urlFoto = ul;

                        await firebase.firestore().collection('Garagem')
                            .doc()
                            .set({
                                nome: nome,
                                motor: motor,
                                cor: cor,
                                ano: ano,
                                alarme: alarme,
                                ar: ar,
                                som: som,
                                carregador: carregador,
                                suporte: suporte,
                                sensor: sensor,
                                direcao: direcao,
                                diaria: diaria,
                                disponibilidade: disponibilidade,
                                reservas: reservas,
                                profile: ul,
                            })
                            .then(() => {
                                setLoad(false)
                                toast.success("Novo carro cadastrado!", {
                                    icon: "✅"
                                });

                                setTimeout(refreshPage, 2500)

                            })
                            .catch((error) => {
                                console.log(error + 'Deu algum erro')
                                toast.error("Erro ao fazer upload!", {
                                    icon: "❌"
                                });
                            })
                    })
            })

    }



    function deleteImgPerfil() {
        setImgCarro('')
        setUrlCarro('')
        setInputCarro('')
    }


    async function buscarCarro() {

        if (id == '') {
            toast.info('Digite o id do veículo')
            return;
        }

        await firebase.firestore().collection('Garagem')
            .doc(id)
            .get()
            .then((snapshot) => {
                setNomeAlter(snapshot.data().nome);
                setDisponibilidadeAlter(snapshot.data().disponibilidade);
                setDiariaAlter(snapshot.data().diaria);
            })

        setControle(2)

    }

    async function atualizarCar() {

        await firebase.firestore().collection('Garagem')
            .doc(id)
            .update({
                nome: nomeAlter,
                disponibilidade: disponibilidadeAlter,
                diaria: diariaAlter

            })

            .then(() => {
                toast.success('Dados atualizados!!!')
                setId('')
                setNomeAlter('')
                setDisponibilidadeAlter('')
                setDiariaAlter('')
                setControle(0)

            })
            .catch((error) => {
                toast.error('Erro ao atualizar!!!')

            })
    }


    async function listarCarros() {

        await firebase.firestore().collection('Garagem')
            .get()
            .then((snapshot) => {
                let lista = []

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nome: doc.data().nome,
                        diaria: doc.data().diaria,
                        disponibilidade: doc.data().disponibilidade,
                    })
                })

                setListCar(lista)

            })

            .then(() => {
                toast.info('Busca realizada com sucesso!')
                setControle(1)
            })

            .catch(() => {
                toast.error('Erro ao buscar no banco!')
            })
    }


    function AtualizarDados() {
        setEditar(!editar)
    }



    function refreshPage() {
        window.location.reload()
    }



    return (

        <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column'>

            <Box width='100%' display='flex' alignItems='star' marginTop='5%' marginLeft='5%'>
                <Link href='./'>
                    <BsIcons.BsFillArrowLeftCircleFill className='icon' color="black" size={22} />
                </Link>
            </Box>


            <section style={{ display: 'flex', flexDirection: 'column' }}>

                <br></br>

                {!editar ? (

                    <>

                        <strong style={{ fontSize: '22px', color: '#367588' }}> Cadastre seu novo carro 📋</strong>
                        <Box display='flex' marginTop={3}>
                            <small>Atualizar Disponibilidade</small>
                            <RxIcons.RxUpdate onClick={AtualizarDados} className='icon' color='#367588' size={22} />
                        </Box>

                        <br></br>

                        <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Modelo:</strong>

                            <input style={{ width: '100px', borderBottom: '2px solid' }}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder='ex: Onix'
                            />

                        </Box>


                        <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Motor:</strong>

                            <input style={{ width: '100px', borderBottom: '2px solid' }}
                                value={motor}
                                onChange={(e) => setMotor(e.target.value)}
                                placeholder='ex: 1.0 Turbo'
                            />
                        </Box>


                        <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Cor:</strong>

                            <input style={{ width: '100px', borderBottom: '2px solid' }}
                                value={cor}
                                onChange={(e) => setCor(e.target.value)}
                                placeholder='ex: preto'
                            />
                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Ano:</strong>

                            <input style={{ width: '100px', borderBottom: '2px solid' }}
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                                placeholder='ex: 2023'
                            />
                        </Box>


                        <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom='4%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Direção:</strong>

                            <input style={{ width: '100px', borderBottom: '2px solid' }}
                                value={direcao}
                                onChange={(e) => setDirecao(e.target.value)}
                                placeholder='ex: Elétrica'
                            />

                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Valor Diária:</strong>

                            <input style={{ width: '100px', borderBottom: '2px solid' }}
                                value={diaria}
                                onChange={(e) => setDiaria(e.target.value)}
                                placeholder='ex: 250'
                            />
                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Disponibilidade:</strong>

                            <input style={{ width: '100px', borderBottom: '2px solid' }}
                                value={disponibilidade}
                                onChange={(e) => setDisponibilidade(e.target.value)}
                                placeholder='sim ou nao'
                            />
                        </Box>


                        <Box display='flex' alignItems='center' justifyContent='space-between' marginTop='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Ar condicionado:</strong>

                            <Box display='flex' onChange={onChangeAr} >
                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ margin: '5%' }}>sim</p>
                                    <input type="radio" value={true} name="ar" style={{ margin: '5px' }} />
                                </Box>

                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ marginLeft: '5%' }}>não</p>
                                    <input type="radio" value={false} name="ar" style={{ margin: '5px' }} />
                                </Box>

                            </Box>

                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='space-between' marginTop='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Alarme:</strong>

                            <Box display='flex' onChange={onChangeAlarme} >
                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ margin: '5%' }}>sim</p>
                                    <input type="radio" value={true} name="alarme" style={{ margin: '5px' }} />
                                </Box>

                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ marginLeft: '5%' }}>não</p>
                                    <input type="radio" value={false} name="alarme" style={{ margin: '5px' }} />
                                </Box>

                            </Box>

                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='space-between' marginTop='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Som / Bluetooth:</strong>

                            <Box display='flex' onChange={onChangeSom} >
                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ margin: '5%' }}>sim</p>
                                    <input type="radio" value={true} name="som" style={{ margin: '5px' }} />
                                </Box>

                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ marginLeft: '5%' }}>não</p>
                                    <input type="radio" value={false} name="som" style={{ margin: '5px' }} />
                                </Box>

                            </Box>

                        </Box>


                        <Box display='flex' alignItems='center' justifyContent='space-between' marginTop='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Carregador / USB:</strong>

                            <Box display='flex' onChange={onChangeCarregador} >
                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ margin: '5%' }}>sim</p>
                                    <input type="radio" value={true} name="carregador" style={{ margin: '5px' }} />
                                </Box>

                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ marginLeft: '5%' }}>não</p>
                                    <input type="radio" value={false} name="carregador" style={{ margin: '5px' }} />
                                </Box>

                            </Box>

                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='space-between' marginTop='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Suporte / Celular:</strong>

                            <Box display='flex' onChange={onChangeSuporte} >
                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ margin: '5%' }}>sim</p>
                                    <input type="radio" value={true} name="suporte" style={{ margin: '5px' }} />
                                </Box>

                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ marginLeft: '5%' }}>não</p>
                                    <input type="radio" value={false} name="suporte" style={{ margin: '5px' }} />
                                </Box>

                            </Box>

                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='space-between' marginTop='2%'>
                            <strong style={{ marginRight: '10px', color: '#367588' }}>Sensor / Ré:</strong>

                            <Box display='flex' onChange={onChangeSensor} >
                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ margin: '5%' }}>sim</p>
                                    <input type="radio" value={true} name="sensor" style={{ margin: '5px' }} />
                                </Box>

                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <p style={{ marginLeft: '5%' }}>não</p>
                                    <input type="radio" value={false} name="sensor" style={{ margin: '5px' }} />
                                </Box>

                            </Box>

                        </Box>


                        <br></br>

                        <>
                            <span>Imagem do veículo:</span>
                            < label className='label-avatar'>
                                <input type='file' multiple accept='image/*' value={inputCarro} onChange={handleFile} /> <br />
                            </label>
                        </>


                        <Box>
                            {imgCarro.length != '' && (
                                <Box display='flex' alignItems='center' justifyContent='start' height='10'>
                                    <BsIcons.BsXCircle className='icon' color="red" onClick={deleteImgPerfil} />
                                    <span style={{ margin: '2%', color: 'red' }}>excluir imagem</span>
                                </Box>

                            )}
                        </Box>

                        <Box marginTop='4%'>
                            <Button onClick={handleCadastrar} color='#367588'> Finalizar cadastro </Button>
                            {load ? <CircularProgress size={8} isIndeterminate color='green.300' marginLeft='2%' /> : ''}
                        </Box>

                    </>

                ) :

                    <>

                        <Box display='flex' width='100%'>

                            <p style={{ marginRight: '10px', color: '#000' }}>Id do carro:</p>

                            <input style={{ width: '200px', borderBottom: '2px solid' }}
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder='ex: bnctlU0Tw567U'
                            />

                        </Box>

                        <Box display='flex' width='100%'>

                            <p style={{ marginRight: '10px', color: '#000' }}>Nome do carro:</p>

                            <input style={{ width: '200px', borderBottom: '2px solid' }}
                                value={nomeAlter}
                                onChange={(e) => setNomeAlter(e.target.value)}
                                placeholder='ex: Onix'
                            />

                        </Box>

                        <Box display='flex' width='100%'>

                            <p style={{ marginRight: '10px', color: '#000' }}>Disponibilidade:</p>

                            <input style={{ width: '200px', borderBottom: '2px solid' }}
                                value={disponibilidadeAlter}
                                onChange={(e) => setDisponibilidadeAlter(e.target.value)}
                                placeholder='ex: sim ou nao'
                            />

                        </Box>

                        <Button isDisabled={controle == 0 ? false : true} marginTop={4} onClick={listarCarros} >1- Listar Veículos</Button>
                        <Button isDisabled={controle == 1 ? false : true} marginTop={2} onClick={buscarCarro} >2- Buscar dados </Button>
                        <Button isDisabled={controle == 2 ? false : true} marginTop={2} onClick={atualizarCar} >3- Atualizar dados </Button>

                        <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' marginTop={6} >
                            <strong>Carros na garagem</strong>

                            {listCar.map((item) => {
                                return (
                                    <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' marginTop={4}>
                                        <small> <strong> Id: </strong>{item.id}</small>
                                        <small> <strong> Nome: </strong>{item.nome}</small>
                                        <small> <strong> Diária: </strong>{item.diaria}</small>
                                        <small> <strong> Disponibilidade: </strong>{item.disponibilidade}</small>
                                    </Box>
                                )
                            })}
                        </Box>

                    </>

                }

            </section>
        </Box>
    )
}
