import React, {useState, useEffect, useRef} from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import {useParams, useNavigate} from 'react-router-dom';
import NotFound from './NotFound';
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { useGetSubiect } from '../hooks/useGetSubiect';
import { faClock, faLock} from '@fortawesome/free-solid-svg-icons';
import { Card, CardBody, CardHeader, CardFooter, Divider, Link, Image, Button, Modal,ModalContent,ModalHeader,ModalBody, Input,
Listbox, ListboxItem, cn,ModalFooter, useDisclosure,useDraggable } from '@nextui-org/react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../hooks/useAuthContext';

export const AddNoteIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <path
          d="M7.37 22h9.25a4.87 4.87 0 0 0 4.87-4.87V8.37a4.87 4.87 0 0 0-4.87-4.87H7.37A4.87 4.87 0 0 0 2.5 8.37v8.75c0 2.7 2.18 4.88 4.87 4.88Z"
          fill="currentColor"
          opacity={0.4}
        />
        <path
          d="M8.29 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM15.71 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM12 14.75h-1.69V13c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.75H7c-.41 0-.75.34-.75.75s.34.75.75.75h1.81V18c0 .41.34.75.75.75s.75-.34.75-.75v-1.75H12c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"
          fill="currentColor"
        />
      </svg>
    );
  };
  
  export const CopyDocumentIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <path
          d="M15.5 13.15h-2.17c-1.78 0-3.23-1.44-3.23-3.23V7.75c0-.41-.33-.75-.75-.75H6.18C3.87 7 2 8.5 2 11.18v6.64C2 20.5 3.87 22 6.18 22h5.89c2.31 0 4.18-1.5 4.18-4.18V13.9c0-.42-.34-.75-.75-.75Z"
          fill="currentColor"
          opacity={0.4}
        />
        <path
          d="M17.82 2H11.93C9.67 2 7.84 3.44 7.76 6.01c.06 0 .11-.01.17-.01h5.89C16.13 6 18 7.5 18 10.18V16.83c0 .06-.01.11-.01.16 2.23-.07 4.01-1.55 4.01-4.16V6.18C22 3.5 20.13 2 17.82 2Z"
          fill="currentColor"
        />
        <path
          d="M11.98 7.15c-.31-.31-.84-.1-.84.33v2.62c0 1.1.93 2 2.07 2 .71.01 1.7.01 2.55.01.43 0 .65-.5.35-.8-1.09-1.09-3.03-3.04-4.13-4.16Z"
          fill="currentColor"
        />
      </svg>
    );
  };
  
  export const EditDocumentIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <path
          d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52v7.95C2 19.94 4.07 22 7.52 22h7.95c3.46 0 5.52-2.06 5.52-5.52V8.52C21 5.06 18.93 3 15.48 3Z"
          fill="currentColor"
          opacity={0.4}
        />
        <path
          d="M21.02 2.98c-1.79-1.8-3.54-1.84-5.38 0L14.51 4.1c-.1.1-.13.24-.09.37.7 2.45 2.66 4.41 5.11 5.11.03.01.08.01.11.01.1 0 .2-.04.27-.11l1.11-1.12c.91-.91 1.36-1.78 1.36-2.67 0-.9-.45-1.79-1.36-2.71ZM17.86 10.42c-.27-.13-.53-.26-.77-.41-.2-.12-.4-.25-.59-.39-.16-.1-.34-.25-.52-.4-.02-.01-.08-.06-.16-.14-.31-.25-.64-.59-.95-.96-.02-.02-.08-.08-.13-.17-.1-.11-.25-.3-.38-.51-.11-.14-.24-.34-.36-.55-.15-.25-.28-.5-.4-.76-.13-.28-.23-.54-.32-.79L7.9 10.72c-.35.35-.69 1.01-.76 1.5l-.43 2.98c-.09.63.08 1.22.47 1.61.33.33.78.5 1.28.5.11 0 .22-.01.33-.02l2.97-.42c.49-.07 1.15-.4 1.5-.76l5.38-5.38c-.25-.08-.5-.19-.78-.31Z"
          fill="currentColor"
        />
      </svg>
    );
  };
  
const ViewSubiect = () => {
    const {subiectId, materie} = useParams();
    const navigate = useNavigate();
    const {user} = useAuthContext();
    const [loading, setIsLoading] = useState(false);

    const [images, setImages] = useState([]);
    const [canvasImages, setCanvasImages] = useState([]);
    const [text, setText] = useState('');
    const [texts, setTexts] = useState([]);

    const addToSubiect = async(type, rezolvare)=>{
        const rezolvari =[{type: type, rezolvare: rezolvare}];
        const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/addToSubiect`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                rezolvari,
                username:user.username,
                id: subiectId
            })
        });
        const json = await response.json();
        if(!response.ok){
            console.log(json.error);
        }
        if(response.ok){
            console.log(json);
       }
    }

    useEffect(() => {
        const fetchAndOrganizeRezolvari = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/getRezolvariSubiect/${subiectId}/${user?.username}`,{
                method: 'GET',
            });
            
            if (!response.ok) {
              throw new Error('Eroare la încărcarea rezolvărilor');
            }
            
            const json = await response.json();
            
            console.log(json);

            let canvasTemp = [];
            let imageTemp = [];
            let textsTemp = [];
            
            json.forEach(item => {
              switch(item.type) {
                case 'canvas':
                  canvasTemp.push(item.rezolvare);
                  break;
                case 'image':
                  imageTemp.push(item.rezolvare);
                  break;
                case 'text':
                  textsTemp.push(item.rezolvare);
                  break;
                default:
                  console.warn('Tip rezolvare necunoscut:', item.type);
              }
            });

            console.log("canvastemp",canvasTemp);

            setCanvasImages(canvasTemp);
            setImages(imageTemp);
            setTexts(textsTemp);
            
          } catch (error) {
            console.error('Eroare procesare rezolvari:', error);
          }
        };
      
        if (subiectId && user?.username) {
          fetchAndOrganizeRezolvari();
        }
    }, [subiectId, user?.username])

    const [materii, setMaterii] = useState(['informatica', 'matematica', 'logica', 'economie']);
    const { viewSubiect, subiect , error, isLoading, refetchSubiect} = useGetSubiect(subiectId);
    const timp = (createdAt) => {
        return formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ro });
    };
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const targetRef = React.useRef(null);
    const {moveProps} = useDraggable({targetRef, canOverflow: true, isDisabled: !isOpen});
    const canvasRef = useRef(null);
    const handleSave = async () => {
        if (canvasRef.current) {
            const exportImage = await canvasRef.current.exportImage('png');
            addToSubiect('canvas', exportImage);
            setCanvasImages((prev) => [...prev, exportImage]);
        }
    };
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const handleClearCanvas = () => {
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
        setIsConfirmOpen(false);
    };
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    const handleInsertImage = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                addToSubiect('image', reader.result);
                setImages((prevImages) => [...prevImages, reader.result]);
            };
        }
    };
    const openFilePicker = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => handleInsertImage(e.target.files[0]);
        input.click();
    };
    const [isConfirmOpenTextBox, setIsConfirmOpenTextBox] = useState(false);
    const handleSaveText = () => {
        setTexts((prevTexts) => [...prevTexts, text]);
        addToSubiect('text', text);
        setText('');
        setIsConfirmOpenTextBox(false);
    }
    const storageBoxStyle = "flex flex-col items-center p-4 bg-default-100 rounded-xl gap-2 hover:bg-default-200 transition-colors cursor-pointer";
    const solutionItemStyle = "flex justify-between items-center p-1.5 bg-default-200 rounded-md hover:bg-default-100 transition-colors text-sm";

    if(!materii.includes(materie.toLowerCase())){
        return <NotFound/>
    }

    return (
        <div className='flex flex-row relative z-30'>
            <Modal isOpen={isConfirmOpenTextBox} onOpenChange={setIsConfirmOpenTextBox}>
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">
                            Adaugă text
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Text"
                                placeholder="Introdu rezolvarea aici:"
                                variant="bordered"
                                value={text}
                                onValueChange={setText}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Anulează
                            </Button>
                            <Button color="primary" onPress={handleSaveText}>
                                Salvează
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal ref={targetRef} isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader {...moveProps} className="flex flex-col gap-1">
                        Whiteboard
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <ReactSketchCanvas
                                ref={canvasRef}
                                width="100%"
                                height="600px"
                                strokeWidth={4}
                                strokeColor="black"
                                className="cursor-crosshair"
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() =>{ if (canvasRef.current) {setIsConfirmOpen(true)}}}>
                            Clear
                        </Button>
                        <Button color="primary" onPress={() => {handleSave(); onClose()}}>
                            Save
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
            <Modal isOpen={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Confirmare
                            </ModalHeader>
                            <ModalBody>
                                <p>Sigur vrei să ștergi tot conținutul?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" onPress={onClose}>
                                    Anulare
                                </Button>

                                <Button 
                                    color="danger" 
                                    onPress={() => {
                                        handleClearCanvas(); 
                                        onClose();
                                    }}
                                >
                                    Șterge
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className='w-1/2 h-[calc(100vh-65px)] overflow-hidden'>
                {subiect && (
                    <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                        <Viewer
                            fileUrl={subiect}
                            plugins={[defaultLayoutPluginInstance]}
                        />
                    </Worker>
                )}
            </div>
            <div className='flex flex-col w-1/2 p-5 pt-1 '>
                <div className='w-full flex flex-col gap-16'>
                    <div className='flex mx-auto'>
                        <p className='text-2xl font-bold'> 
                            {`${viewSubiect?.materie.charAt(0).toUpperCase()}${viewSubiect?.materie.slice(1)} 
                            ${viewSubiect?.titlu.charAt(0).toUpperCase()}${viewSubiect?.titlu.slice(1)}`}
                        </p>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <div>
                            <p className='text-lg'>
                                Descriere: <span 
                                className='font-bold'>{`${viewSubiect?.descriere.charAt(0).toUpperCase()}${viewSubiect?.descriere.slice(1)}`}</span>
                            </p>
                            <p className='text-lg'>
                                Postat de: <span onClick={() => navigate(`/profil/${viewSubiect?.username}`)}
                                className='font-bold cursor-pointer'>{`${viewSubiect?.username.charAt(0).toUpperCase()}${viewSubiect?.username.slice(1)}`}</span>
                            </p>
                            <p className='text-lg'>
                                Profil: <span 
                                className='font-bold'>{`${viewSubiect?.profil.charAt(0).toUpperCase()}${viewSubiect?.profil.slice(1)}`}</span>
                            </p>
                        </div>
                        <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-300 dark:border-default-300">
                            <Listbox aria-label="Listbox menu with icons" variant="faded">
                                <ListboxItem key="textbox" onPress={() => setIsConfirmOpenTextBox(true)}
                                 startContent={<AddNoteIcon className={iconClasses} />}>
                                    New textbox
                                </ListboxItem>

                                <ListboxItem key="image" onPress={openFilePicker}
                                 startContent={<FontAwesomeIcon icon={faImage} className={iconClasses} />}>
                                    Insert image
                                </ListboxItem>


                                <ListboxItem
                                    key="whiteboard"
                                    onPress={onOpen}
                                    startContent={<EditDocumentIcon className={iconClasses} />}
                                >
                                    Open whiteboard
                                </ListboxItem>
                            </Listbox>
                        </div>
                    </div>
                </div>
                <div>
                <div className="mt-8 flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-4">
                        {[
                        {
                            type: 'images',
                            title: 'Imagini',
                            icon: <FontAwesomeIcon icon={faImage} className="text-2xl" />,
                            count: images.length,
                        },
                        {
                            type: 'text',
                            title: 'Notițe',
                            icon: <AddNoteIcon className="text-2xl" />,
                            count: texts.length,
                        },
                        {
                            type: 'canvas',
                            title: 'Schițe',
                            icon: <EditDocumentIcon className="text-2xl" />,
                            count: canvasImages.length,
                        }
                        ].map((item) => (
                        <div key={item.type} className={storageBoxStyle}>
                            <div className="text-default-500">{item.icon}</div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-default-500 text-sm">{item.count} elemente</p>
                        </div>
                        ))}
                    </div>

                    {[
                        { type: 'images', items: images, setter: setImages },
                        { type: 'text', items: texts, setter: setTexts },
                        { type: 'canvas', items: canvasImages, setter: setCanvasImages }
                    ].map((section) => (
                        section.items.length > 0 && (
                        <div key={section.type} className="pt-4">
                            <h4 className="font-medium mb-2 capitalize">{section.type === 'text' ? 'Notițe' : section.type === 'canvas' ? 'Schițe' : 'Imagini'}</h4>
                            <div className="grid grid-cols-2 gap-2">
                            {section.items.map((_, index) => (
                                <div key={index} className={cn(solutionItemStyle, "min-w-[150px]")}>
                                <span className="text-xs">Soluția #{index + 1}</span>
                                <Button 
                                    size="sm" 
                                    variant="flat" 
                                    color="danger"
                                    className="h-6 min-w-16"
                                    onPress={() => {
                                    section.setter(prev => prev.filter((_, i) => i !== index));
                                    }}
                                >
                                    Șterge
                                </Button>
                                </div>
                            ))}
                            </div>
                        </div>
                        )
                    ))}
                    </div>
                </div>
                <div className="mt-auto pt-2">
                    <Button 
                        fullWidth 
                        color="primary" 
                        size="lg"
                        onPress={() => {
                        console.log('Trimite soluțiile:', { images, texts, canvasImages });
                        }}
                        className="font-semibold text-lg"
                    >
                        Corectează Subiectul
                    </Button>
                </div>
            </div>
        </div>
        
    );
}
 
export default ViewSubiect;