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


export const EyeSlashFilledIcon = (props) => (
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
      d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
      fill="currentColor"
    />
    <path
      d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
      fill="currentColor"
    />
    <path
      d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
      fill="currentColor"
    />
    <path
      d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
      fill="currentColor"
    />
    <path
      d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
      fill="currentColor"
    />
  </svg>
);

export const EyeFilledIcon = (props) => (
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
      d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
      fill="currentColor"
    />
    <path
      d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
      fill="currentColor"
    />
  </svg>
);



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

    const subjectConfig = [
      { name: 'Informatică', path: 'informatica' },
      { name: 'Matematică', path: 'matematica' },
      { name: 'Psihologie', path: 'psihologie' },
      { name: "Economie", path: "Economie"},
      { name: "Logica", path: "Logica"}
    ];
    

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
            {subjectConfig.map(({ name, path }) => (
              <DropdownItem
                key={path}
                onClick={() => navigate(`/subiecte/${path}`)}
              >
                {name}
              </DropdownItem>
            ))}
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
                  <DropdownItem onClick={() => {navigate(`/profile/${user.username}/postari`)}}
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
                  <DropdownItem onClick={() => {navigate(`/profile/${user.username}/postari`)}}
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
                  <DropdownItem onClick={() => {navigate(`/profile/${user.username}/overview`)}}
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
                name = {user?.username?.charAt(0).toUpperCase()}
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