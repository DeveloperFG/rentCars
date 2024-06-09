import React, { useEffect, useState, useContext } from 'react'

import { UserContext } from '@/context/userContext';

import {
    Box, Button, Flex, Text, Heading, useSteps, Stepper, Step, StepIndicator,
    StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, Link
} from "@chakra-ui/react";


import { CircularProgress } from '@chakra-ui/react'

import Registro from "./Registro";
import Email from "./Email";
import Visitante from './Visitante';
import Final from './Final';


function Etapas() {

    let { controlStep, setControlStep } = useContext(UserContext);

    const [ClienteAtual, setClienteAtual] = useState([])


    const steps = [
        { title: 'Etapa', description: 'Documentos' },
        { title: 'Etapa', description: 'Dados Pessoais' },
        { title: 'Etapa', description: 'Conclusão' },
    ]

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    })



    useEffect(() => {

        if (controlStep == 0) {
            return;
        }

        setActiveStep(activeStep + 1)

    }, [controlStep])


    useEffect(() => {
        const storageAuth = localStorage.getItem('userLogged');

        if (storageAuth) {
            setClienteAtual(JSON.parse(storageAuth))
        } else {
            console.log('Não há usuários logados!')
        }

    }, [])



    return (

        <Box width='100%' height='100vh' display='flex' alignItems='center' justifyContent='center' flexDirection='column'>

            <Stepper display='flex' width='95%' alignItems='center' justifyContent='center' size='md' marginTop='5%' index={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator style={{ width: '22px', height: '22px' }}>
                            <StepStatus
                                complete={<StepIcon style={{ fontSize: '12px' }} />}
                                incomplete={<StepNumber style={{ fontSize: '12px' }} />}
                                active={<StepNumber style={{ fontSize: '12px' }} />}
                            />
                        </StepIndicator>

                        <Box flexShrink='0'>
                            <StepTitle style={{ fontSize: '12px', fontWeight: 'bolder' }}>{step.title}</StepTitle>
                            <StepDescription style={{ fontSize: '12px' }}>{step.description}</StepDescription>
                        </Box>

                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>

            {activeStep == 0 && (
                <Registro />
            )}

            {activeStep == 1 && (
                <Email />
            )}

            {activeStep == 2 && (
                <Final />
            )}


        </Box>
    )
}

export default Etapas;


// onClick={() => setActiveStep(index)}