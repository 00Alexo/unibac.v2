import {Navbar, Input, NavbarBrand, NavbarContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Switch, Badge,
Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tabs, Tab, Card, CardBody, Tooltip,
NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Avatar, cn, DropdownSection} from "@nextui-org/react";
import React from 'react'
import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import {useLogout} from '../hooks/useLogout'
import { useGetProfile } from "../hooks/useGetProfile";
import { useJoinClass } from "../hooks/useJoinClass";
import { Error } from "./alertBox";
import { EyeFilledIcon, EyeSlashFilledIcon } from '../pages/SignUp';


export const SearchIcon = ({size = 24, strokeWidth = 1.5, width, height, ...props}) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height={height || size}
        role="presentation"
        viewBox="0 0 24 24"
        width={width || size}
        {...props}
      >
        <path
          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
        <path
          d="M22 22L20 20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  };

const NavBar = () => {
    const {user} = useAuthContext();
    const [id, setId] = useState(null);
    const [password, setPassword] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { viewUser: userData, refetchProfile} = useGetProfile(user?.username);
    const {isOpen : isOpenClass, onOpen:onOpenClass, onOpenChange: onOpenChangeClass, onClose: onCloseClass} = useDisclosure();
    const {joinClass, error: errorCreateClass, isLoading: isLoadingCreateClass, errorFields, notification: notificationClass} = useJoinClass();

    const {logout} = useLogout();

  const handleLogoutClick = () =>{
    logout();
  }

    const menuItems = [
        "Nothing here yet",
    ];

    const [isHovered, setIsHovered] = useState([]);

    const handleMouseEnter = (index) => {
        setIsHovered(prevState => {
          const newState = [...prevState];
          newState[index] = true;
          return newState;
        });
      };
      
      const handleMouseLeave = (index) => {
        setIsHovered(prevState => {
          const newState = [...prevState];
          newState[index] = false;
          return newState;
        });
      };

      const handleJoinClass = async (e) =>{
        const close = await joinClass(id, password, user?.username, user?.token);
        
        if(close){
            onCloseClass();
        }
      }

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered maxWidth="full" className="bg-navBarPrimar"  
    classNames={{
      item: [
        "flex",
        "relative",
        "h-full",
        "items-center",
        "data-[active=true]:after:content-['']",
        "data-[active=true]:after:absolute",
        "data-[active=true]:after:bottom-0",
        "data-[active=true]:after:left-0",
        "data-[active=true]:after:right-0",
        "data-[active=true]:after:h-[2px]",
        "data-[active=true]:after:rounded-[2px]",
        "data-[active=true]:after:bg-primary",
      ],
    }}>
      <Modal 
        isOpen={isOpenClass} 
        onOpenChange={onOpenChangeClass}
        placement="top-center"
      >
        <ModalContent>
        {(onClose) => (
            <>
            {errorCreateClass &&  <Error error={errorCreateClass}/>}  
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
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit cursor-pointer" onClick={() => navigate("/")}>UNIBAC</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem className="dropdownHead"style={{cursor:'pointer'}}>
          <Link color="foreground">
            Bibliografie
          </Link>
        </NavbarItem>
        <Dropdown>
          <NavbarItem style={{cursor:'pointer'}} className="dropdownHead">
            <DropdownTrigger>
              <Link color="foreground">
                Subiecte
              </Link>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu variant="faded"
          itemClasses={{
            base: "gap-4",
          }}>
          <DropdownSection showDivider={userData?.statut=="profesor"} title="Elevi"> 
          <DropdownItem
            onClick={() => navigate('/subiecte/informatica')}
            key="Informatica"
          >
            Informatica
          </DropdownItem>
          <DropdownItem
            onClick={() => navigate('/subiecte/matematica')}
            key="Matematica"
          >
            Matematica
          </DropdownItem>
          <DropdownItem
            onClick={() => navigate('/subiecte/fizica')}
            key="Fizica"
          >
            Fizica
          </DropdownItem>
          <DropdownItem
            onClick={() => navigate('/subiecte/chimie')}
            key="Chimie"
          >
            Chimie
          </DropdownItem>
          <DropdownItem
            onClick={() => navigate('/subiecte/romana')}
            key="Romana"
          >
            Romana
          </DropdownItem>
          <DropdownItem
            onClick={() => navigate('/subiecte/biologie')}
            key="Biologie"
          >
            Biologie
          </DropdownItem>
          <DropdownItem
            onClick={() => navigate('/subiecte/Istorie')}
            key="Istorie"
          >
            Istorie
          </DropdownItem>
          <DropdownItem
            onClick={() => navigate('/subiecte/geografie')}
            key="Geografie"
          >
            Geografie
          </DropdownItem>
          <DropdownItem
            onClick={() => navigate('/subiecte/Psihologie')}
            key="Psihologie"
          >
            Psihologie
          </DropdownItem>
          </DropdownSection>
          {userData?.statut=="profesor" &&
          <DropdownSection  title="Profesori">
            <DropdownItem
              onClick={() => navigate('/subiecte/posteaza')}
              key="Posteaza"
            >
              Posteaza un subiect
            </DropdownItem>
          </DropdownSection>
          }
        </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <NavbarItem style={{cursor:'pointer'}} className="dropdownHead">
            <DropdownTrigger>
              <Link color="foreground">
                Features
              </Link>
            </DropdownTrigger>
          </NavbarItem>
            <DropdownMenu variant="faded"
            itemClasses={{
              base: "gap-4",
            }}>
            <DropdownItem onClick={() => {navigate('/minaAi'); window.location.reload();}}
              key="MinaAi"
            >
              MinaAi
            </DropdownItem>
            <DropdownItem onClick={() => {navigate('/compiler')}}
              key="MinaAi"
            >
              Compiler
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/games')}
              key="Games"
            >
              Games
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/subiecte')}
              key="SubiecteList"
            >
              Subiecte
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/clase')}
              key="clase"
            >
              Clase
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/concursuri')}
              key="concursuri"
            >
              Concursuri
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {userData?.statut === 'profesor' &&
          <Dropdown>
              <NavbarItem style={{cursor:'pointer'}}className="dropdownHead">
                <DropdownTrigger>
                  <Link color="foreground">
                    Profesori
                  </Link>
                </DropdownTrigger>
              </NavbarItem>
                <DropdownMenu variant="faded"
                itemClasses={{
                  base: "gap-4",
                }}>
                <DropdownSection showDivider title="Subiecte"> 
                  <DropdownItem onClick={() => {navigate('/subiecte/posteaza')}}
                    key="Subiect"
                  >
                    Posteaza un subiect
                  </DropdownItem>
                  <DropdownItem onClick={() => {navigate(`/profile/${user.username}/subiecte`)}}
                    key="Subiect"
                  >
                    Subiecte postate de tine
                  </DropdownItem>
                </DropdownSection>
                
                <DropdownSection showDivider title="Articole"> 
                  <DropdownItem onClick={() => {navigate('/articole/posteaza')}}
                    key="Subiect"
                  >
                    Posteaza un articol
                  </DropdownItem>
                  <DropdownItem onClick={() => {navigate(`/profile/${user.username}/idkyet`)}}
                    key="Subiect"
                  >
                    Articole postate de tine
                  </DropdownItem>
                </DropdownSection>

                <DropdownSection showDivider title="Clase"> 
                  <DropdownItem onClick={() => {navigate('/clase/createClass')}}
                    key="Subiect"
                  >
                    Creeaza o clasa
                  </DropdownItem>
                  <DropdownItem onClick={() => {navigate(`/profile/${user.username}/idkyet`)}}
                    key="Subiect"
                  >
                    Clasele tale
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
          </Dropdown>
        }
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
            <Input
            onKeyDown={(e) => {
            if(e.key === 'Enter'){
                navigate(`/search/${search}`);
                window.location.reload()
            }
            }}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            classNames={{
                base: "max-w-full sm:max-w-[10rem] h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
            />
        </NavbarItem>
        {!user &&
        <NavbarItem>
          <Button  color="primary" variant="flat" onPress = {() => navigate("/signin")}>
            Sign In
          </Button>
        </NavbarItem>
        }
        {user &&
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                color = "primary"
                showFallback
                name = {user.username.charAt(0).toUpperCase()}
                as="button"
                className="transition-transform"
                src={userData?.avatar}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownSection showDivider>
                <DropdownItem key="profil" onClick={() => navigate(`/profile/${user.username}`)}>
                  Profil
                </DropdownItem>
                <DropdownItem key="settings" onClick={() => navigate(`/profile/${user.username}/setari`)}>
                  Setari
                </DropdownItem>
              </DropdownSection>
              <DropdownSection showDivider>
                <DropdownItem key="claseleMele" onClick={() => navigate(`/profile/${user.username}/clase`)}>
                  Clasele mele
                </DropdownItem>
                <DropdownItem key="joinClass" onClick={() => onOpenClass()}>
                  Clasa noua
                </DropdownItem>
                <DropdownItem key="teme" onClick={() => navigate(`/profile/${user.username}/teme`)}>
                  Teme
                </DropdownItem>
              </DropdownSection>
              <DropdownItem key="logout" color="danger" className="text-danger" onClick={handleLogoutClick}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        }
      </NavbarContent>
      <NavbarMenu className="bg-[#f9f9f9]">
        <Input
            onKeyDown={(e) => {
            if(e.key === 'Enter'){
                navigate(`/search/${search}`);
                window.location.reload()
            }
            }}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            classNames={{
                base: "max-w-full sm:max-w-[10rem] h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
        />
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
 
export default NavBar;