import { createContext, useState } from 'react'

import { useDisclosure } from '@chakra-ui/react'

export const UserContext = createContext({});

export function ContextProvider({ children }) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [user, setUser] = useState({})

    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [cpf, setCpf] = useState('')
    const [imgExtras, setImgExtras] = useState([]);
    const [urls, setUrls] = useState([]);

    const [controlStep, setControlStep] = useState(0)

    const [dataVisitante, setDataVisitante] = useState([])

    return (
        <UserContext.Provider value={{ isOpen, onOpen, onClose, nome, setNome, sobrenome, setSobrenome, cpf, setCpf, user, setUser, controlStep, setControlStep, imgExtras, setImgExtras, urls, setUrls, dataVisitante, setDataVisitante }}>
            {children}
        </UserContext.Provider>
    )
}