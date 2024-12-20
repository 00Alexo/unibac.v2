import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Input,
Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Avatar} from "@nextui-org/react";
import React from 'react'
import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import {useLogout} from '../hooks/useLogout'

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
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

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

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered maxWidth="full" className="bg-[#f9f9f9]"  
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
            Features
          </Link>
        </NavbarItem>
        <NavbarItem className="dropdownHead"style={{cursor:'pointer'}}>
          <Link color="foreground">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem className="dropdownHead"style={{cursor:'pointer'}}>
          <Link color="foreground">
            Integrations
          </Link>
        </NavbarItem>
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
                src={' '}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownSection showDivider>
                <DropdownItem key="profil" onPress={() => navigate(`/profile/${user.username}`)}>
                  Profil
                </DropdownItem>
                <DropdownItem key="settings" onPress={() => navigate(`/profile/${user.username}/setari`)}>
                  Setari
                </DropdownItem>
              </DropdownSection>
              <DropdownSection showDivider>
                <DropdownItem key="teme" onPress={() => navigate(`/profile/${user.username}/teme`)}>
                  Nothing Here Yet
                </DropdownItem>
              </DropdownSection>
              <DropdownItem key="logout" color="danger" className="text-danger" onPress={handleLogoutClick}>
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