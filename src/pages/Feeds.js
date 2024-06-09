import { useState, useEffect } from "react";


import firebase from '../../connection/db'

import { Box, Button, Flex, Text, Heading } from "@chakra-ui/react";
import { CircularProgress } from '@chakra-ui/react'

import * as BsIcons from 'react-icons/bs';

import Image from "next/image"

import feed from './../img/feedback.png'


export default function Feeds() {

    const [fullFeeds, setFullFeeds] = useState([])

    const [spinnerFeed, setSpinnerFeed] = useState(false)


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
                setFullFeeds(DataFeed)
                setSpinnerFeed(false)
            })

        }

        LoadFeedBack()

    }, [])


    return (
        <Box display='flex' alignItems='center' justifyContent='center' marginTop='5%' flexDirection='column'>
            <Image src={feed} alt="todos" />

            {spinnerFeed ? <Box height='20vh'><CircularProgress isIndeterminate color='green.300' marginLeft='2%' />  </Box> :
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                    {fullFeeds.map((feed) => {
                        return (
                            <Box height='auto' backgroundColor='#F8F8FF' borderRadius='5px' marginTop='5%' padding='3%' className='feeds' >
                                <Box display='flex' alignItems='center' justifyContent='start' >
                                    <Heading marginRight='2%' fontSize={18} color='#1E90FF'> - {feed.cliente} </Heading>
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

        </Box>
    )
}
