import CmpSignInUp from "../components/CmpSignInUp";
import {Input, Button, Select, SelectItem, Autocomplete, AutocompleteItem, Spinner} from "@nextui-org/react";
import {useState} from 'react';
import {Link} from 'react-router-dom'
import { useSignup } from "../hooks/useSignup";
import { useAuthContext } from '../hooks/useAuthContext'
import NotFound from "./NotFound.js";
import { Error } from "../components/alertBox.js";

export const MailIcon = (props) => (
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
        d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z"
        fill="currentColor"
      />
    </svg>
  );

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

const SignUp = () => {
    const { user } = useAuthContext()

    const [isVisible, setIsVisible] = useState(false);;

    const toggleVisibility = () => setIsVisible(!isVisible);

    const [isVisibleConf, setIsVisibleConf] = useState(false);

    const toggleVisibilityConf = () => setIsVisibleConf(!isVisibleConf);

    const judete = [
    { label: 'Alta tara', value: 'Alta tara' },
    { label: 'Alba', value: 'Alba' },
    { label: 'Arad', value: 'Arad' },
    { label: 'Arges', value: 'Arges' },
    { label: 'Bacau', value: 'Bacau' },
    { label: 'Bihor', value: 'Bihor' },
    { label: 'Bistrita-Nasaud', value: 'Bistrita-nasaud' },
    { label: 'Botosani', value: 'Botosani' },
    { label: 'Braila', value: 'Braila' },
    { label: 'Brasov', value: 'Brasov' },
    { label: 'Bucuresti', value: 'Bucuresti' },
    { label: 'Buzau', value: 'Buzau' },
    { label: 'Calarasi', value: 'Calarasi' },
    { label: 'Caras-Severin', value: 'Caras-Severin' },
    { label: 'Cluj', value: 'Cluj' },
    { label: 'Constanta', value: 'Constanta' },
    { label: 'Covasna', value: 'Covasna' },
    { label: 'Dambovita', value: 'Dambovita' },
    { label: 'Dolj', value: 'Dolj' },
    { label: 'Galati', value: 'Galati' },
    { label: 'Giurgiu', value: 'Giurgiu' },
    { label: 'Gorj', value: 'Gorj' },
    { label: 'Harghita', value: 'Harghita' },
    { label: 'Hunedoara', value: 'Hunedoara' },
    { label: 'Ialomita', value: 'Ialomita' },
    { label: 'Iasi', value: 'Iasi' },
    { label: 'Ilfov', value: 'Ilfov' },
    { label: 'Maramures', value: 'Maramures' },
    { label: 'Mehedinti', value: 'Mehedinti' },
    { label: 'Mures', value: 'Mures' },
    { label: 'Neamt', value: 'Neamt' },
    { label: 'Olt', value: 'Olt' },
    { label: 'Prahova', value: 'Prahova' },
    { label: 'Salaj', value: 'Salaj' },
    { label: 'Satu Mare', value: 'Satu Mare' },
    { label: 'Sibiu', value: 'Sibiu' },
    { label: 'Suceava', value: 'Suceava' },
    { label: 'Teleorman', value: 'Teleorman' },
    { label: 'Timis', value: 'Timis' },
    { label: 'Tulcea', value: 'Tulcea' },
    { label: 'Vaslui', value: 'Vaslui' },
    { label: 'Valcea', value: 'Valcea' },
    { label: 'Vrancea', value: 'Vrancea' },
    ];

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [statut, setStatut] = useState('');
    const [judet, setJudet] = useState('');
    const {signup, error, isLoading, errorFields} = useSignup();

    const handleSignUpSubmit = async (e) =>{
        await signup(username, email, password, confirmPassword, statut, judet);
    }

    if(user)
        return (
        <NotFound/>
    )

    return (
        <div className="flex flex-row">
            {error && <Error error={error}/>}
            <form className="contains-SignUp minhgh-signUp relative z-10 border-r-2 border-[#c4c8d8]">
                <p className="signUp-create-account-text" style={{}}>CREATE ACCOUNT</p>
                <div className='contains-inputs contains-inputs-sgup'>
                    <div className='flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                        <Input maxLength="20" required isClearable type="username" variant="bordered"
                            label="Username" size='md' className="bg-white"
                            onChange={(e) => {setUsername(e.target.value)}}
                            value={username}
                            classNames={{
                                helperWrapper: "p-0 pb-1",
                                errorMessage: "absolute"
                            }}
                            isInvalid={errorFields?.find(field => field.field === "username")?.error  ? true : false}
                            errorMessage={
                                error 
                                    ? errorFields?.find(field => field.field === "username")?.error 
                                    : null
                            } 
                        />
                    </div>
                    <div className='flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                        <Input required isClearable type="email" variant="bordered"label="Email" size='md'
                            isInvalid={errorFields?.find(field => field.field === "email")?.error  ? true : false}
                            errorMessage={
                                error 
                                    ? errorFields?.find(field => field.field === "email")?.error 
                                    : null
                            } className="bg-white"
                            classNames={{
                                helperWrapper: "p-0 pb-1",
                                errorMessage: "absolute"
                            }}
                            onChange={(e) => { setEmail(e.target.value);}}
                            value={email}
                        />
                    </div>
                    <div className='flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                        <Input required variant="bordered"label="Password" size='md' className="bg-white"
                            isInvalid={errorFields?.find(field => field.field === "pass")?.error  ? true : false}
                            errorMessage={
                                error 
                                    ? errorFields?.find(field => field.field === "pass")?.error 
                                    : null
                            } 
                            classNames={{
                                helperWrapper: "p-0 pb-1",
                                errorMessage: "absolute"
                            }}
                            endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                            }
                            type={isVisible ? "text" : "password"}
                            onChange={(e) => { setPassword(e.target.value); console.log(password)}}
                            value={password}
                        />
                    </div>
                    <div className='flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                        <Input required variant="bordered"label="Confirm Password" size='md'
                            isInvalid={errorFields?.find(field => field.field === "cpass")?.field  ? true : false}
                            errorMessage={
                                error 
                                    ? errorFields?.find(field => field.field === "cpass")?.error 
                                    : null
                            } 
                            classNames={{
                                helperWrapper: "p-0 pb-1",
                                errorMessage: "absolute"
                            }} className="bg-white"
                            endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibilityConf}>
                                {isVisibleConf ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                            }
                            type={isVisibleConf ? "text" : "password"}
                            onChange={(e) => { setConfirmPassword(e.target.value); console.log(confirmPassword)}}
                            value={confirmPassword}
                        />
                    </div>
                    <div style={{width:'100%', display:'flex', justifyContent:'space-between'}}>
                        <div style={{width:'48%'}}>
                            <Select required
                                isInvalid={errorFields?.find(field => field.field === "statut")?.error  ? true : false}
                                errorMessage={
                                    error 
                                        ? errorFields?.find(field => field.field === "statut")?.error 
                                        : null
                                } className="bg-white max-w-xs"
                                classNames={{
                                    helperWrapper: "p-0 pb-1",
                                    errorMessage: "absolute"
                                }}
                                size='md'
                                label="Statut" 
                                variant = "bordered"
                                onChange={(e) => { setStatut(e.target.value); console.log(e.target.value)}}
                                value={statut}
                            >
                                <SelectItem value = "Elev">
                                    Elev
                                </SelectItem>
                                <SelectItem value = "Profesor">
                                    Profesor
                                </SelectItem>
                            </Select>
                        </div>
                        <div style={{width:'48%'}}>
                            <Autocomplete required
                                isInvalid={errorFields?.find(field => field.field === "judet")?.error  ? true : false}
                                errorMessage={
                                    error 
                                        ? errorFields?.find(field => field.field === "judet")?.error 
                                        : null
                                } className="bg-white max-w-xs"
                                classNames={{
                                    helperWrapper: "p-0 pb-1",
                                    errorMessage: "absolute"
                                }}
                                size='md'
                                defaultItems={judete}
                                label="Judet" 
                                variant = "bordered"
                                onSelectionChange={(value) => { setJudet(value); console.log(judet)}}
                                value={judet}
                            >
                                {(judete) => <AutocompleteItem key={judete.value}>{judete.label}</AutocompleteItem>}
                            </Autocomplete>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="submit-div">
                        <Button color="default" type = "submit" onClick={handleSignUpSubmit} disabled = {isLoading}
                            variant="bordered" size='lg' className="bg-white">
                            {!isLoading && 'Submit'} {isLoading && <Spinner/>}
                        </Button>   
                        <p className="signInP">
                            Already registered? <Link to="/signin" className="change-sign"> Sign-In </Link>
                        </p>
                    </div>
                </div>
            </form>
            <div className="contains-cmpSignInUp minhgh-signUp">
                <CmpSignInUp/>
            </div>
        </div>
    );
};

export default SignUp;
