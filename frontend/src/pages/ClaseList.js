import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useAuthContext } from "../hooks/useAuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faPersonChalkboard,
  faInfoCircle,
  faUsers,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import { ScrollShadow, Navbar, Input, NavbarBrand, NavbarContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Switch, Badge,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tabs, Tab, Card, CardBody, Tooltip,
    NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Avatar, cn, DropdownSection} from "@nextui-org/react";
import { useJoinClass } from "../hooks/useJoinClass";
import { Error } from "../components/alertBox";
import { EyeFilledIcon, EyeSlashFilledIcon } from '../pages/SignUp';

const ClaseList = () => {
    const {user} = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [publicClasses, setPublicClasses] = useState([]);
    const [id, setId] = useState(null);
    const [password, setPassword] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const {isOpen : isOpenClass, onOpen:onOpenClass, onOpenChange: onOpenChangeClass, onClose: onCloseClass} = useDisclosure();
    const {joinClass, error: errorCreateClass, isLoading: isLoadingCreateClass, errorFields, notification: notificationClass} = useJoinClass();
    const handleJoinClass = async (e) =>{
        const close = await joinClass(id, password, user?.username, user?.token);
        
        if(close){
            onCloseClass();
        }
    }

    const joinPublicClass = async(id) =>{
        await joinClass(id, null, user?.username, user?.token);
    }

    const getPublicClasses = async(req, res)=>{
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API}/api/class/getPublicClasses`,{
            method: 'GET'
        });
        const json = await response.json();
        if(!response.ok){
            console.log(json.error);
        }
        if(response.ok){
            console.log(json);
            setPublicClasses(json);
        }
        setLoading(false);
    }

    useEffect(() =>{
        getPublicClasses();
    }, [user])



  return (
    <div className="min-h-screen bg-gray-50 p-8">
        {errorCreateClass &&  <Error error={errorCreateClass}/>}  
      <Modal 
        isOpen={isOpenClass} 
        onOpenChange={onOpenChangeClass}
        placement="top-center"
      >
        <ModalContent>
        {(onClose) => (
            <>
            <ModalHeader className="flex flex-col gap-1">Alatura-te unei clase</ModalHeader>
            <ModalBody>
                <div className='flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                  <Input
                    isInvalid={errorFields?.includes("classId")}
                    autoFocus
                    label="ID"
                    placeholder="Introdu ID-ul clasei"
                    variant="bordered"
                    value={id}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setId(value);
                      }
                    }}
                    onPaste={(e) => {
                      const paste = e.clipboardData.getData('text');
                      if (!/^\d+$/.test(paste)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className= 'flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                    <Input
                        isInvalid={errorFields?.includes("password")}
                        endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                        }
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
                <Button color="danger" variant="flat" onClick={onCloseClass}>
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
      {loading && <Loading />}

      <div className="max-w-[90vw] mx-auto relative z-30">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          Clase publice
        </h1>
        <div className="mt-8 mb-8 p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl transform transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
                {/* Text Section */}
                <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Nu găsești clasa dorită?
                </h2>
                <p className="text-lg text-blue-100 opacity-90">
                    Creează sau alătură-te unei clase private
                </p>
                </div>

                {/* Button */}
                <button onClick={() => onOpenClass()}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg ring-2 ring-white/20 hover:bg-white/20 transition-all duration-300">
                <FontAwesomeIcon 
                    icon={faPlusCircle} 
                    className="text-white h-5 w-5"
                />
                <span className="text-white font-semibold text-lg">
                    Clasă privată
                </span>
                </button>
            </div>
        </div>

        <ScrollShadow hideScrollBar className="max-h-[585px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {publicClasses.map((clase) => (
            <div 
              key={clase._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-blue-500 p-4 rounded-t-lg">
                <h3 className="text-white font-bold text-xl mb-1">{clase.className}</h3>
                <p className="text-blue-100 text-sm">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
                  {clase.creator}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faPersonChalkboard} className="mr-2 w-4" />
                  <span>{clase.teachers.length} profesori</span>
                </div>

                <div className="flex items-start text-gray-600">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2 w-4 mt-1" />
                  <p className="text-sm">{clase.description}</p>
                </div>

                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faUsers} className="mr-2 w-4" />
                  <span>{clase.students.length} studenti</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-100 p-4 rounded-b-lg">
                <button 
                  className={`w-full py-2 px-4 rounded-md transition-colors 
                    ${user 
                      ? "bg-blue-500 hover:bg-blue-600 text-white" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                  `}
                  disabled={!user}
                  onClick={() => joinPublicClass(clase.classId)}
                >
                  {user ? "Înscrie-te acum" : "Conectează-te pentru a te alătura"}
                </button>
              </div>
            </div>
          ))}
        </ScrollShadow>

        {publicClasses.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-xl">
              Momentan nu exista clase publice disponibile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaseList;