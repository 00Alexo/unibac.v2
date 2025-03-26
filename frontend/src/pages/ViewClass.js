import { useLocation, useNavigate, useParams, Link} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';
import checkmark from '../assets/blue-checkmark.png'
import { useGetProfile } from '../hooks/useGetProfile';
import NotFound from './NotFound';
import {Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Checkbox, ScrollShadow, Chip
} from "@nextui-org/react";
import { useAuthContext } from '../hooks/useAuthContext';
import {Error, NotificationBox} from '../components/alertBox';
import Loading from '../components/Loading';
import {useViewClass} from "../hooks/useViewClass"
import { MailIcon, EyeFilledIcon, EyeSlashFilledIcon } from './SignUp';
import { useJoinClass } from '../hooks/useJoinClass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrash, faComments, faSmile, faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faBook, faFileAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

const ViewClass = () => {
    const {user} = useAuthContext();
    const {classId, view} = useParams();
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
    const [mesaj, setMesaj] = useState('');
    const scrollRef = useRef(null);

    const handleJoinClass = async (e) =>{
        const close = await joinClass(classId, password, user?.username, user?.token);
        
        if(close){
            onClose();
            refetchClass();
        }
    }

    const trimiteMesaj = async()=>{
        const response = await fetch(`${process.env.REACT_APP_API}/api/class/trimiteMesaj`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: user.username, content: mesaj, classId: classId})
        })
        const json = await response.json();
        if(!response.ok){
            console.log(json.error);
        }
        if(response.ok){
            console.log(json);
            setMesaj('');
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

    useEffect(() => {
        if (scrollRef.current) {
            // Așteaptă următorul frame pentru a permite renderizarea
            requestAnimationFrame(() => {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            });
        }
    }, [classData?.chat]); // Rulează de fiecare dată când se actualizează mesajele

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            // Verifică dacă utilizatorul este deja aproape de jos
            const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
            
            if (isNearBottom) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [classData?.chat?.length]); // Rulează când se schimbă numărul de mesaje

    if(view != undefined && view != null && view?.toLowerCase() != 'anunturi' && view?.toLowerCase() != 'teme'
    && view?.toLowerCase() != 'teste' && view?.toLowerCase() != 'lectii' && view?.toLowerCase() != 'chat' && view?.toLowerCase() != 'logs')
        return <NotFound/>

    if (!classData && !isLoading) {
        return <NotFound/>
    }

    if(error == 'Clasa invalida!')
        return <NotFound/>

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
            {classData && !error &&  (
                <div className='flex flex-col w-[80%] min-h-[calc(100vh-70px)] pt-8 mx-auto relative z-10'>
                    {/* div poza profil */}
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row items-center gap-4'>
                            <Avatar
                                showFallback
                                name = {classData.className.charAt(0).toUpperCase()}
                                as="button"
                                className="w-28 h-28 text-6xl transition-transform"
                                src={classData?.avatar}
                            />
                            <div className='flex flex-col'>
                                <p className="text-4xl font-bold text-foreground">
                                    {classData.className}
                                </p>
                                <p className="text-default-500">
                                    {classData.subject}
                                </p>
                            </div>
                        </div>
                        {user?.username === classData.creator || classData.teachers.includes(user?.username) ?(
                            <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                            <button 
                                onClick={() => navigate(`/clase/${classId}/profesor/posteazaLectie`)}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faBook} className="text-lg" />
                                <span className="text-sm md:text-base">Postează Lecție</span>
                            </button>
                        
                            <button
                                onClick={() => navigate(`/clase/${classId}/profesor/posteazaTema`)}
                                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faTasks} className="text-lg" />
                                <span className="text-sm md:text-base">Postează Temă</span>
                            </button>

                            <button
                                onClick={() => navigate(`/clase/${classId}/profesor/posteazaTest`)}
                                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faFileAlt} className="text-lg" />
                                <span className="text-sm md:text-base">Postează Test</span>
                            </button>
                        </div>
                        ) : <></>}
                    </div>
                    {/* div descriere + statistici*/}
                    <div className='flex justify-between w-[100%] mt-8 max-h-[170px]'>
                        <div className='w-[63%] border border-default-200 rounded-lg p-6 bg-slate-100 shadow-md'>
                            <h2 className="text-xl font-semibold mb-1">Descriere</h2>
                            <p className="text-default-600">{classData.description}</p>
                        </div>

                        <div className='w-[35%] border border-default-200 rounded-lg p-6 pt-4 bg-slate-100 shadow-md'>
                            <h2 className="text-xl font-semibold mb-2">Statistici</h2>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span>Studenți</span>
                                    <span className="text-primary">{classData?.students?.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Teme</span>
                                    <span className="text-primary">{classData?.assignments?.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Lectii</span>
                                    <span className="text-primary">{classData?.assignments?.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* restu */}
                    <div className='flex w-[100%] mt-8 justify-between'>
                        <div className='w-[63%] rounded-lg p-6'>
                            <div className="flex gap-4 mb-6 border-b border-default-400">
                                {['Anunturi', 'Teme', 'Teste', 'Lectii', 'Chat', 'Logs'].map((tab) => (
                                    <Button 
                                        key={tab}
                                        variant="light" 
                                        className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                                        onClick={() => navigate(`/clase/${classId}/${tab.toLowerCase()}`)}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </div>
                            {view?.toLowerCase() == 'anunturi' || !view ? (
                                <div className='border border-default-200 rounded-lg p-4 bg-slate-100 
                                shadow-md h-[37vh] max-h-[340px] flex gap-4 flex-col'>
                                <p className='bold text-2xl'> Anunturi </p>
                                <ScrollShadow hideScrollBar className="space-y-4 max-h-[300px]">
                                {classData?.anunturi?.reverse().map((anunt, index) => (
                                    <div key={index} className="border border-default-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={anunt.username} size="sm" />
                                                <div>
                                                    <h3 className="font-semibold">{anunt.username}</h3>
                                                    <p className="text-default-500 text-sm">{anunt.time}</p>
                                                </div>
                                            </div>
                                            {(user?.username === anunt.username) && (
                                                <div className="flex gap-2">
                                                    <Button isIconOnly size="sm" variant="light">
                                                        <FontAwesomeIcon icon={faEdit} className="text-default-600" />
                                                    </Button>
                                                    <Button isIconOnly size="sm" variant="light" color="danger">
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-default-700 whitespace-pre-line">{anunt.anunt}</p>
                                    </div>
                                ))}
                                </ScrollShadow>

                                {classData?.anunturi?.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-default-500 mb-4">Nu există anunțuri momentan</p>
                                    </div>
                                )}
                                </div>
                            ) : view?.toLowerCase() == 'chat' ? (
                                <div className="w-full h-[37vh] max-h-[340px] flex flex-col">
                                    <div className="border-b border-default-200 pb-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary-100 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faComments} className="text-primary-600 text-xl"/>
                                            </div>
                                            <h2 className="text-2xl font-bold">Chatul Clasei</h2>
                                            <Chip color="primary" variant="flat">{classData?.students?.length + classData?.teachers?.length + 1} membri</Chip>
                                        </div>
                                    </div>

                                    <ScrollShadow hideScrollBar ref={scrollRef} className="flex-1 space-y-4 pr-4 mb-4">
                                        {classData?.chat?.map((msg, index) => (
                                            <div key={index} className={`flex ${msg.username === user?.username ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] rounded-xl p-4 ${
                                                    msg.username === user?.username 
                                                        ? 'bg-primary-100 ml-auto' 
                                                        : 'bg-default-100'
                                                }`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Avatar 
                                                            name={msg.username} 
                                                            size="sm" 
                                                            src={msg.avatar || `https://ui-avatars.com/api/?name=${msg.username}`}
                                                        />
                                                        <div>
                                                            <p className="font-semibold">
                                                                {msg.username}
                                                                {classData.teachers.includes(msg.username) && (
                                                                    <span className="ml-2 text-success-500 text-sm">Profesor</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-default-500 ml-24">
                                                            {msg.time}
                                                        </p>
                                                    </div>
                                                    <p className="text-default-700 whitespace-pre-wrap">{msg.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </ScrollShadow>

                                    <div className="border-t border-default-200 pt-4">
                                        <div className="flex gap-2">
                                            <Input
                                                fullWidth
                                                variant="bordered"
                                                placeholder="Scrie un mesaj..."
                                                endContent={
                                                    <div className="flex items-center gap-2">
                                                        <Button isIconOnly variant="light" size="sm">
                                                            <FontAwesomeIcon icon={faSmile} className="text-default-500"/>
                                                        </Button>
                                                        <Button isIconOnly variant="light" size="sm">
                                                            <FontAwesomeIcon icon={faPaperclip} className="text-default-500"/>
                                                        </Button>
                                                    </div>
                                                }
                                                value={mesaj}
                                                onChange={(e) => setMesaj(e.target.value)}
                                            />
                                            <Button color="primary" onClick={() => trimiteMesaj()}>
                                                <FontAwesomeIcon icon={faPaperPlane} className="mr-2"/>
                                                Trimite
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : view?.toLowerCase() == 'lectii' ? (
                                <div className='border border-default-200 rounded-lg p-4 bg-slate-100 shadow-md h-[37vh] max-h-[340px] flex gap-4 flex-col'>
                                    <p className='bold text-2xl'> Lecții </p>
                                    <ScrollShadow hideScrollBar className="space-y-4 max-h-[300px]">
                                        {classData?.lessons && [...classData?.lessons].reverse().map((lectie, index) => (
                                            <div 
                                                onClick={() => navigate(`/clase/${classId}/lectii/${lectie.id}`)}
                                                key={lectie.id} 
                                                className="border border-default-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{lectie.titlu}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Avatar 
                                                                name={lectie.username} 
                                                                size="sm" 
                                                                className="text-tiny"
                                                            />
                                                            <span className="text-default-500 text-sm">{lectie.username}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-default-400 text-sm">{lectie.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </ScrollShadow>

                                    {classData?.lectii?.length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-default-500">Nu există lecții momentan</p>
                                        </div>
                                    )}
                                </div>
                            ) :  view?.toLowerCase() == 'teme' ? (
                                <div className='border border-default-200 rounded-lg p-4 bg-slate-100 shadow-md h-[37vh] max-h-[340px] flex gap-4 flex-col'>
                                    <p className='bold text-2xl'> Teme </p>
                                    <ScrollShadow hideScrollBar className="space-y-4 max-h-[300px]">
                                        {classData?.assignments && [...classData?.assignments].reverse().map((lectie, index) => (
                                            <div 
                                                onClick={() => navigate(`/clase/${classId}/teme/${lectie.id}`)}
                                                key={lectie.id} 
                                                className="border border-default-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{lectie.titlu}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Avatar 
                                                                name={lectie.username} 
                                                                size="sm" 
                                                                className="text-tiny"
                                                            />
                                                            <span className="text-default-500 text-sm">{lectie.username}</span>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span className="text-default-400 text-sm">{lectie.time}</span>
                                                        <span className="text-default-400 text-sm">Deadline: {lectie.deadline}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </ScrollShadow>

                                    {classData?.assignments?.length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-default-500">Nu există teme momentan</p>
                                        </div>
                                    )}
                                </div>
                            ) : <></>}
                        </div>

                        <div className='w-[35%]'>
                            <div className='border border-default-200 rounded-lg p-6 bg-slate-100 shadow-md mb-6'>
                                <div className="flex gap-6 h-[180px]">
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-medium text-default-600 mb-2">Profesori ({classData?.teachers?.length + 1})</h3>
                                        <ScrollShadow className="space-y-3 h-[150px]" hideScrollBar>
                                            {/* Creatorul clasei */}
                                            <div className="flex items-center gap-2">
                                                <Avatar name={classData?.creator} size="sm" />
                                                <span className="font-medium">{classData?.creator}</span>
                                                <span className="text-success-500 text-sm">(Creator)</span>
                                            </div>
                                            
                                            {/* Alți profesori */}
                                            {classData?.teachers?.map((teacher, index) => (
                                                <div key={`teacher-${index}`} className="flex items-center gap-2 justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar name={teacher} size="sm" />
                                                        <span>{teacher}</span>
                                                    </div>
                                                    {user?.username === classData?.creator && (
                                                        <Button 
                                                            size="sm" 
                                                            color="danger" 
                                                            variant="light"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} className="text-sm" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </ScrollShadow>
                                    </div>

                                    {/* Coloana Elevi */}
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-medium text-default-600 mb-2">Elevi ({classData?.students?.length})</h3>
                                        <ScrollShadow className="space-y-3 h-[150px]" hideScrollBar>
                                            {classData?.students?.map((student, index) => (
                                                <div key={`student-${index}`} className="flex items-center gap-2 justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar name={student} size="sm" />
                                                        <span>{student}</span>
                                                    </div>
                                                    {(user?.username === classData?.creator || classData.teachers?.includes(user?.username)) && (
                                                        <Button 
                                                            size="sm" 
                                                            color="danger" 
                                                            variant="light"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} className="text-sm" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </ScrollShadow>
                                    </div>
                                </div>
                            </div>
                            <div className='border border-default-200 rounded-lg p-6 bg-slate-100 shadow-md'>
                                <h2 className="text-lg font-semibold mb-4">Activitate Recentă</h2>
                                <div className="space-y-3">
                                    {classData?.logs?.slice(classData?.logs?.length - 3,classData?.logs?.length).reverse().map((log, index) => (
                                        <div key={index} className="text-sm">
                                            <p className="text-default-600">{log}</p>
                                        </div>
                                    ))}
                                </div>
                                {classData?.logs?.length == 0 && (<p>Nu exista activitate recenta.</p>)}
                            </div>
                        </div>
                    </div>
                </div>
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