import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import pt from 'date-fns/locale/pt'
import { format } from "date-fns";
import { addDays } from 'date-fns'



import { toast } from 'react-toastify';

import { Calendar } from "react-date-range";
import { DateRange } from 'react-date-range'

import { Button, Box, Text, CircularProgress } from '@chakra-ui/react'

import * as BsIcons from 'react-icons/bs';


export default function Locate() {

    const [load, setLoad] = useState(false)
    const [calendar, setCalendar] = useState([])
    const [arrayData, setArrayData] = useState([])
    const [arrayDb, setArrayDb] = useState([])
    const [handleList, setHandleList] = useState(false)

    // useEffect(() => {
    //     setCalendar((format(new Date(), 'dd/MM/yyyy' + '+')))

    // }, [])


    // Adiciona os dias a lista local, para fazer comparações de datas
    const handleSelect = (date) => {

        // console.log(format(date, 'dd/MM/yyyy'))
        let diaAtual = ((format(date, 'dd/MM/yyyy')))

        setCalendar((prevState) => [...prevState, diaAtual])

    }


    // Atualiza a lista do array dos dias, para salvar no localstorage
    useEffect(() => {

        localStorage.setItem('locateList', JSON.stringify(calendar))

    }, [calendar])



    useEffect(() => {
        const storageList = localStorage.getItem('locateList');

        if (storageList) {
            setArrayDb(JSON.parse(storageList))
        } else {
            console.log('Não há lista!')
        }

    }, [calendar])



    function changeLocate() {

        setLoad(true)

        setTimeout(() => {
            setLoad(false)

            for (var i = 0; i < calendar.length; i++) {
                var array = calendar[i];

                if (arrayDb.includes(array)) {
                    toast.warn('"' + array + '"' + " Data indisponivel!");

                }
                else {
                    toast.success("Datas disponíveis, prossiga com sua locação.");
                }

            }

        }, 2500);

    }


    function deleteDay(date) {

        let indice = calendar.indexOf(date)
        calendar.splice(indice, 1)

        setCalendar(calendar)
        setHandleList(!handleList)
        alert('Excluiu ' + date)


    }


    return (
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
            <Calendar
                locale={pt}
                onChange={handleSelect}
                readOnly
                className="inputBox"
            />

            <Box display='flex' width='95%' height='auto' flexDirection='column'>
                {/* <Input display='block' width='100%' height='100px' backgroundColor='green.100' flexWrap='hard'
                    value={calendar}
                    readOnly
                    className="inputBox"
                /> */}

                <Box width='95%' height='auto' alignItems='center' justifyContent='center' fontSize={12} marginTop={3} flexDirection='column'>
                    {/* <Text display='block' backgroundColor='green.200' padding={2} > {calendar.map((item) => 'Dia: ' + item + ' * ')}</Text> */}

                    {calendar.map((item) => {
                        return (
                            <Box display='flex' width='100%' marginTop='1%' alignItems='center' justifyContent='center'>
                                <Text display='flex' width='30%' alignItems='center' justifyContent='center'> Dia: {item} </Text>
                                <BsIcons.BsXCircle color="red" onClick={() => deleteDay(item)} />
                            </Box>
                        )

                    })}

                    {/* <Text backgroundColor='green.200' width='100%' > {calendar.map((item) => 'Dia: ' + item + ' * ')}</Text> */}

                </Box>

                <Box marginTop={1} marginBottom={10}>Total: {calendar.length <= 1 ? calendar.length + ' dia' : calendar.length + ' dias'}</Box>

                <Button backgroundColor='blue.200' onClick={changeLocate}> {load ? <CircularProgress size={6} isIndeterminate color='green.300' marginLeft='2%' /> : 'Verificar disponibilidade'} </Button>
            </Box>


        </Box>

    );
}
