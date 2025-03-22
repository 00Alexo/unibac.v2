import CmpSignInUp from "../components/CmpSignInUp";
import {Input, Button, Checkbox, Spinner} from "@nextui-org/react";
import {useState} from 'react';
import {Link} from 'react-router-dom'
import { useSignin } from "../hooks/useSignin";
import { useAuthContext } from '../hooks/useAuthContext'
import NotFound from "./NotFound.js";
import { Error } from "../components/alertBox.js";
import { MailIcon, EyeFilledIcon, EyeSlashFilledIcon } from "./SignUp.js";

const SignIn = () => {
    const { user } = useAuthContext()

    const [isVisible, setIsVisible] = useState(false);;

    const toggleVisibility = () => setIsVisible(!isVisible);

    const [isVisibleConf, setIsVisibleConf] = useState(false);;

    const toggleVisibilityConf = () => setIsVisibleConf(!isVisibleConf);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {signin, error, isLoading, errorFields} = useSignin();

    const handleSignInSubmit = async (e) =>{
      e.preventDefault();

      signin(username, password);
    }

    if(user)
      return (
      <NotFound/>
    )
    
    return (
        <div className="flex flex-row">
            {error && <Error error={error}/>}
            <form className="contains-SignUp relative z-10  border-r-2 border-[#c4c8d8]">
                <p className="signUp-create-account-text">SIGN-IN</p>
                <div className='contains-inputs'>
                    <div className='flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} size="lg"
                            isInvalid={errorFields.find(field => field.field === "username")?.error  ? true : false}
                            errorMessage={
                                error 
                                    ? errorFields.find(field => field.field === "username")?.error 
                                    : null
                            } className="bg-white"
                            classNames={{
                                helperWrapper: "p-0 pb-1",
                                errorMessage: "absolute"
                            }}
                            endContent={
                                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            label="Username or email" type="username" variant="bordered" isClearable
                        />
                    </div>
                    <div className='flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
                        <Input required variant="bordered"label="Password" size='lg'className="bg-white"
                            isInvalid={errorFields.find(field => field.field === "pass")?.error  ? true : false}
                            errorMessage={
                                error 
                                    ? errorFields.find(field => field.field === "pass")?.error 
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
                            onChange={(e) => {setPassword(e.target.value)}}
                            value={password}
                        />
                    </div>
                    <div className="flex py-2 px-1 justify-between">
                      <Checkbox
                          classNames={{
                          label: "text-small",
                          }}
                      >
                          Remember me
                      </Checkbox>
                      <p className="cursor-pointer text-[#006FEE] hover:text-blue-900 transition-colors duration-300" size="sm">
                          Forgot password?
                      </p>
                    </div>
                    <div className="or-sign-with">
                        <div className="or-sign-with-line"> </div>
                        <p style={{padding:'7px'}}>Or </p>
                        <div className="or-sign-with-line"> </div>
                    </div>
                    <div className="loginIcons">
                        <svg className="github_icon" fill = "black" xmlns="http://www.w3.org/2000/svg" cursor = "pointer" x="0px" y="0px" width="55" height="55" viewBox="0 0 30 30">
                            <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                        </svg>

                        <svg cursor="pointer" viewBox="0 -28.5 256 256" width="55" height="55" version="1.1" preserveAspectRatio="xMidYMid" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <g>
                            <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fillRule="nonzero"> </path>
                            </g>
                        </g>
                        </svg>

                        <svg cursor="pointer" x="0px" y="0px" width="55" height="55" viewBox="0 0 48 48">
                        <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                    </div>
                </div>
                <div>
                    <div className="submit-div">
                        <Button color="default" type = "submit" onClick={handleSignInSubmit} disabled = {isLoading}
                        variant="bordered" size='lg' className="bg-white">
                            {!isLoading && 'Submit'} {isLoading && <Spinner/>}
                        </Button>  
                        <p className="signInP">
                            Not registered? <Link to="/signup" className="change-sign"> Sign-Up </Link>
                        </p>
                    </div>
                </div>
            </form>
            <div className="contains-cmpSignInUp">
                <CmpSignInUp/>
            </div>
        </div>
    );
};

export default SignIn;

