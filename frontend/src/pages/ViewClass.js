import { useLocation, useNavigate, useParams, Link} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';
import checkmark from '../assets/blue-checkmark.png'
import { useGetProfile } from '../hooks/useGetProfile';
import NotFound from './NotFound';
import {Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Checkbox
} from "@nextui-org/react";
import { useAuthContext } from '../hooks/useAuthContext';
import {Error, NotificationBox} from '../components/alertBox';
import Loading from '../components/Loading';
import {useViewClass} from "../hooks/useViewClass"
import { MailIcon, EyeFilledIcon, EyeSlashFilledIcon } from './SignUp';
import { useJoinClass } from '../hooks/useJoinClass';

const ViewClass = () => {
    const {user} = useAuthContext();
    const {classId} = useParams();
    const {classData, error, isLoading, refetchClass} = useViewClass(classId, user?.username);
    const location = useLocation();
    const navigate = useNavigate();
    const [successfullyCreatedClass, setSuccessfullyCreatedClass] = useState(false);
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [id, setId] = useState(classId);
    const [password, setPassword] = useState(null);
    const {joinClass, error: errorCreateClass, isLoading: isLoadingCreateClass, errorFields, notification} = useJoinClass();

    const handleJoinClass = async (e) =>{
        const close = await joinClass(classId, password, user?.username, user?.token);
        
        if(close){
            onClose();
            refetchClass();
        }
    }

    useEffect(() => {
        if (location.state?.fromCreateClass) {
            setSuccessfullyCreatedClass(true);
            navigate('.', { state: { fromCreateClass: false }, replace: true });
            setTimeout(() =>{
                setSuccessfullyCreatedClass(false);
            }, 5000)
        }
    }, [location]);

    return (
        <div className='relative z-40'>
            {errorCreateClass && <Error error={errorCreateClass}/>}
            {notification && <NotificationBox notification={notification}/>}
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Alatura-te clasei {classData.className}</ModalHeader>
                    <ModalBody>
                        <div className='flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                            <Input
                                autoFocus
                                label="ID"
                                isInvalid={errorFields?.includes("classId")}
                                placeholder="Introdu ID-ul clasei"
                                variant="bordered"
                                value={id}
                            />
                        </div>
                        <div className='flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                            <Input
                                endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                                }
                                isInvalid={errorFields?.includes("password")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={isVisible ? "text" : "password"}
                                label="Password"
                                placeholder="Introdu parola clasei"
                                variant="bordered"
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter className='mt-5'>
                        <Button color="danger" variant="flat" onClick={onClose}>
                            Close
                        </Button>
                        <Button color="primary" onClick={() => handleJoinClass()}>
                            Join
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
            {successfullyCreatedClass &&
            <div class="after-loggin-animation">
                <div class="center">
                    <img src={checkmark} class="thumb"/>
                    <div class="circle-wrap">
                    <div class="circle-lg"></div>
                    </div>
                    <div class="dots-wrap">
                    <div class="dot dot--t"></div>
                    <div class="dot dot--tr"></div>
                    <div class="dot dot--br"></div>
                    <div class="dot dot--b"></div>
                    <div class="dot dot--bl"></div>
                    <div class="dot dot--tl"></div>
                    </div>
                </div>
                <p className='text-center scslogin'> Clasa creata cu succes!! </p>
            </div>
            }
            {classData && !error &&(
                <>
                    <p>{classData.creator}</p>
                    
                </>
            )}
            {error === 'Clasa privata' && 
                <main className="mt-5 flex flex-col items-center justify-center bg-light p-4">
                    <div className="flex flex-col items-center space-y-4">
                    <h1 className="bi bi-link-45deg text-6xl"></h1>
                    <h2 className="text-4xl font-bold text-gray-500 mr-5 ml-5">{classData.msg}</h2>
                    <div>
                        <Button color="primary" variant="ghost" size='lg' className='mt-3'
                        onClick={() => onOpen()}>
                            Alatura-te
                        </Button>
                    </div>
                    </div>
                </main>
            }
        </div>
        
    );
};

 
export default ViewClass;