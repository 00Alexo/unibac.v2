import {useState, useRef, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import NotFound from './NotFound';
import { useGetProfile } from '../hooks/useGetProfile';
import { Avatar, Select, SelectItem, Tooltip, Table, Input, Button,
TableHeader, TableColumn, TableBody, TableRow, TableCell, ScrollShadow } from '@nextui-org/react';
import { ResponsiveCalendar } from '@nivo/calendar';
import uploadImage from '../assets/uploadImage.png'
import DOMPurify from 'dompurify';
import Loading from '../components/Loading';

const ViewProfile = () => {
    const {user} = useAuthContext();
    const navigate = useNavigate();
    const {username} = useParams();
    const {view} = useParams();
    const {viewUser: userProfile, error, isLoading, refetchProfile} = useGetProfile(username);
    const [loading, setLoading] = useState(true);
    const [anSelectat, setAnSelectat] = useState('2025');
    const [avatar, setAvatar] = useState(null);
    const [eroare, setErroare] = useState('')
    const [notification, setNotification] = useState(null);
    const fileInputRef = useRef(null);
    const [isHovered, setIsHovered] = useState(null);
    const [dataForCalendar, setDataForCalendar] = useState([]);
    const [totalSubiecte, setTotalSubiecte] = useState(0);
    const [clase, setClase] = useState([]);
    const [subiecteData, setSubiecteData] = useState([]);
    const [articoleData, setArticoleData] = useState([]);

    const getUserSubiecteData = async(req, res) =>{
        const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/getSubiectePostateByUser/${username}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const json = await response.json();

        if(!response.ok){
            console.log(json);
            setSubiecteData(json.error);
        }

        if(response.ok){
            console.log(json);
            setSubiecteData(json);
        }
    }


    const getUserSubiecteTotale = async () =>{
        const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/getUserSubiecteTotale/${username}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const json = await response.json();
        if(!response.ok){
            console.log(json.error);
            setErroare("A apărut o eroare la încărcarea subiectelor.");
            setTimeout(() => {
                setErroare(null);
            }, 7000);
            setLoading(false);
        }
        if(response.ok){
            console.log(json);
            setLoading(false);
            setDataForCalendar(json);
            const total = json.reduce((sum, entry) => sum + entry.value, 0);
            setTotalSubiecte(total);
        }
    }

    const getUserClasses = async(req, res) =>{
        const response = await fetch(`${process.env.REACT_APP_API}/api/class/getUserClasses?username=${username}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const json = await response.json();

        if(!response.ok){
            console.log(json);
            setClase(json.error);
        }

        if(response.ok){
            console.log(json);
            setClase(json);
        }
    }

    const updateUserAvatar = async (pic) =>{
        setLoading(true);
        if (!pic) {
            console.log("No file selected");
            return;
        }
        const formdata = new FormData();
        console.log(pic);
        formdata.append("file", pic);
        formdata.append("upload_preset", "unibac07");
        formdata.append("cloud_name", process.env.REACT_APP_CLOUDINARY_API2);
        const cloudinary = await fetch(`${process.env.REACT_APP_CLOUDINARY_API}`, {
            method: "post",
            body: formdata,
          })
        const js = await cloudinary.json();
        if(!cloudinary.ok){
            console.log(js.error);
            setErroare("A apărut o eroare la încărcarea avatarului.");
            setTimeout(() => {
                setErroare(null);
            }, 7000);
            setLoading(false);
            return;
        }
        console.log(js);
        const avatarUrl = js.secure_url;
        console.log(avatarUrl);
        userProfile.avatar = avatarUrl;
        console.log(userProfile.avatar);
        setAvatar(avatarUrl);

        const response = await fetch(`${process.env.REACT_APP_API}/api/user/updateUserAvatar`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({avatar: avatarUrl, username: user.username, userAuth: user.username})
        })
        const json = await response.json();
        if(!response.ok){
            console.log(json.error);
            setErroare("A apărut o eroare la încărcarea avatarului.");
            setTimeout(() => {
                setErroare(null);
            }, 7000);
            setLoading(false);
        }
        if(response.ok){
            console.log(json);
            setNotification(`Avatarul a fost schimbat cu succes!`);
            setTimeout(() => {
                setNotification(null);
            }, 7000)
            setLoading(false);
        }
    }

    useEffect(() =>{
        if(user){
            getUserClasses();
            getUserSubiecteTotale();
            getUserSubiecteData();
        }
    }, [user])

    if(view != undefined && view != null && view?.toLowerCase() != 'setari' && view?.toLowerCase() != 'overview'
    && view?.toLowerCase() != 'activitate' && view?.toLowerCase() != 'postari')
        return <NotFound/>

    if(view && view.toLowerCase() === 'setari' && user?.username.toLowerCase() !== username?.toLowerCase()){
        return <NotFound/>
    }

    if (!userProfile && !isLoading) {
        return <NotFound/>
    }

    return (
        <div className='flex flex-row z-30 relative p-4 gap-4 h-[calc(100vh-65px)]'>
            {isLoading && <Loading/>}
            <div className='flex flex-col w-2/12 border border-secondary rounded-lg rounded-b-none bg-slate-100 shadow-md pt-4 pr-5 pl-5 h-full'> {/* left side*/}
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        <div className='mb-'>
                            <p className='text-3xl font-semibold'>
                                {userProfile?.username?.charAt(0).toUpperCase() + userProfile?.username?.slice(1).toLowerCase()}
                            </p>
                            <p className='text-gray-500 text-md mt-1 ml-1'>
                                {userProfile?.statut?.charAt(0).toUpperCase() + userProfile?.statut?.slice(1).toLowerCase()}
                            </p>
                        </div>
                        <nav className='space-y-2 border-t pb-4 pt-4'>
                        {['Overview', 'Activitate', 'Postari', 
                                ...(user?.username === userProfile?.username ? ['Setari'] : [])].map((item) => {
                                const currentView = view?.toLowerCase() || 'overview';
                                const isActive = currentView === item.toLowerCase();
                                return (
                                    <p  onClick={() => navigate(`/profile/${userProfile.username}/${item.toLowerCase()}`)}
                                        key={item}
                                        className={`flex justify-between items-center cursor-pointer
                                            text-gray-700 hover:text-blue-600 hover:bg-gray-200 p-2 rounded-lg
                                            ${isActive ? 'bg-secondary/20 text-secondary font-medium' : ''}`}
                                    >
                                        <span>{item}</span>
                                        {(item === 'Activitate' || item === 'Favorite' || item === 'Postari') && (
                                            <span className='bg-gray-100 px-2 rounded-full text-sm'>
                                                {item === 'Activitate' ? '(31)' : '(36)'}
                                            </span>
                                        )}
                                    </p>
                                )
                            })}
                        </nav>
                    </div>
                    <div className='border-t pb-4 pt-4 flex flex-col'>
                        <div className='flex flex-row'>
                            <p className='font-semibold pr-1'> Judet: </p>
                            <p> {userProfile?.judet} </p>
                        </div>
                        <div className='flex flex-row'>
                            <p className='font-semibold pr-1'> Joined: </p>
                            {userProfile?.createdAt ? (
                                new Date(userProfile?.createdAt).toLocaleDateString('ro-RO', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                            ) : (
                                'Data înregistrării nu este disponibilă'
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {view?.toLowerCase() === 'overview' || !view ? (
            <div className='w-10/12 flex flex-col justify-between p-2'> {/* right side*/}
                <div className='h-[40%] flex flex-row justify-between'>
                    <div className='border border-secondary rounded-lg bg-slate-100 shadow-md w-[30%]'>
                        <input
                            style={{display:'none'}}
                            ref={fileInputRef}
                            type='file'
                            accept='image/*' 
                            onChange={(e) => {
                                updateUserAvatar(e.target.files[0]);
                                console.log(e.target.files[0]);
                            }}>
                        </input>
                        <Avatar
                            isBordered
                            color = "secondary"
                            showFallback
                            name = {userProfile?.username.charAt(0).toUpperCase()}
                            as="button"
                            onMouseEnter={() => {
                                if(user && user.username === userProfile?.username){
                                setIsHovered(true); 
                                }
                            }}
                            onMouseLeave={() => {
                                if(user && user.username === userProfile?.username){
                                    setIsHovered(false); 
                                }
                            }}
                            onClick={() => {if(user && user.username === userProfile?.username) fileInputRef.current?.click()}}
                            className="transition-transform w-full h-full rounded-sm text-9xl cursor-pointer "
                            src={isHovered ? uploadImage : `${userProfile?.avatar}`}
                        />
                    </div>
                    <div className='rounded-lg w-[68.5%] bg-slate-100 shadow-md'>
                    <ScrollShadow hideScrollBar={true} className='bg-slate-100 shadow-md flex border-2 h-[100%] rounded-2xl flex-row w-[100%] justify-between'>
                        <Table removeWrapper className='max-w-[1200px] mx-auto'>
                            <TableHeader>
                                <TableColumn className="text-md">Clasa</TableColumn>
                                <TableColumn className="text-md">Subiect</TableColumn>  
                                <TableColumn className="text-md"> Membri</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={"Acest utilizator nu este membrul unei clase."}>
                                {clase?.map((clasa, index) => {
                                    return(
                                        <TableRow key={index} className='rounded cursor-pointer hover:bg-[#E1E4F1]'
                                        onClick={() => navigate(`/clase/${clasa.classId}`)}>
                                        <TableCell className='max-w-[500px]'>
                                            <div className='flex flex-row gap-3'>
                                                <Avatar src={clasa.avatar} size="lg"/>
                                                <div className='flex flex-col'>
                                                    <p className='text-lg'>{clasa.className}</p>
                                                    <p className='w-full max-w-lg break-words'>{clasa.description}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{clasa.subject}</TableCell>
                                        <TableCell>{clasa.students.length + clasa.teachers.length + 1}</TableCell>
                                    </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </ScrollShadow>
                    </div>
                </div>
                <div className='h-[27.5%] flex flex-row justify-between'>
                    <div className='border border-secondary rounded-lg bg-slate-100 shadow-md w-[30%] pt-4 pr-6 pl-6 pb-4'>
                        <p className='text-xl font-bold'> Insigne</p>
                        <div className='flex flex-row gap-2 flex-wrap'>
                            {userProfile?.badges?.map((user, index) => (
                                <Tooltip
                                showArrow
                                placement={index === 0 ? 'left' : index === (userProfile?.badges.length-1) ? 'right' : 'top'}
                                content={
                                    <div className="px-1 py-2">
                                    <div className="text-small font-bold">{user.name}</div>
                                    <div className="text-tiny">{user.description}</div>
                                    </div>
                                }
                                >
                                <div className='cursor-pointer w-[60px] h-[60px]'>
                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(user.icon) }} />
                                </div>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                    <div className='border border-secondary rounded-lg bg-slate-100 shadow-md w-[68.5%] pr-10 pl-10 pt-4 pb-4'>
                        <div className='flex flex-row justify-between'>
                            <p className='text-2xl'> {totalSubiecte} de subiecte rezolvate in ultimul an</p>
                            <Select
                                className="max-w-28" color='primary'
                                placeholder={anSelectat}
                                onChange={(e) => { setAnSelectat(e.target.value); console.log(e.target.value)}}
                                value={anSelectat}
                            >
                            {['2025', '2024', '2023'].map((an) => (
                                <SelectItem key={an}>{an}</SelectItem>
                            ))}
                            </Select>
                        </div>
                        <ResponsiveCalendar
                        data={dataForCalendar}
                        from={`${anSelectat}-01-01`}
                        to={`${anSelectat}-01-31`}
                        emptyColor="#C6CFEF"  // Schimbat aici
                        colors={['#9be9a8', '#40c463', '#30a14e', '#216e39']}
                        margin={{ top: 4, right: 10, bottom: 4, left: 10 }}
                        yearSpacing={40}
                        monthBorderColor="#F1F5F9"
                        dayBorderWidth={2}
                        dayBorderColor="#F1F5F9"
                        legends={[{
                            anchor: 'bottom-right',
                            direction: 'row',
                            translateY: 36,
                            itemCount: 4,
                            itemWidth: 42,
                            itemHeight: 36
                        }]}
                    />
                    </div>
                </div>
                <div className='h-[27.5%] flex flex-row justify-between'>
                    <div className='border border-secondary rounded-lg bg-slate-100 shadow-md w-[68.5%]'>
                        <div class="lines1">
                            <div class="line1"></div>
                            <div class="line1"></div>
                            <div class="line1"></div>
                            <div class="line1"></div>
                            <div class="line1"></div>
                            <p className='text-8xl font-bold mt-14 text-[#1a365d]' 
                            style={{textShadow: '0 0 15px rgba(59,130,246,0.5)'}}>
                                UNIBAC
                            </p>
                            <div class="line1"></div>
                            <div class="line1"></div>
                            <div class="line1"></div>
                            <div class="line1"></div>
                            <div class="line1"></div>
                        </div>
                    </div>
                    <div className='border border-secondary rounded-lg bg-slate-100 shadow-md w-[30%]'>
                        <p className='text-xl font-bold pl-4 pt-3'> Statistici</p>
                        <div className='w-full pl-3 pr-3 pt-2 pb-2 rounded-md flex justify-between items-center'>
                            <div className='flex flex-row items-center gap-2'> 
                                <div className='pt-1 pb-1'> 
                                    <svg height='40px' width='40px' fill="#78c1ee" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xmlSpace="preserve">
                                        <g>
                                            <path d="M88.845,93.085V6.915C88.845,5.857,87.987,5,86.93,5H13.07c-1.058,0-1.915,0.857-1.915,1.915v86.17   c0,1.058,0.857,1.915,1.915,1.915H86.93C87.987,95,88.845,94.143,88.845,93.085z M85.015,91.17h-70.03V8.83h70.03V91.17z"/>
                                            <path d="M39.612,22.713H77.91c0.793,0,1.436-0.644,1.436-1.437s-0.643-1.436-1.436-1.436H39.612c-0.794,0-1.437,0.643-1.437,1.436   S38.818,22.713,39.612,22.713z"/>
                                            <path d="M39.612,37.074H77.91c0.793,0,1.436-0.643,1.436-1.436s-0.643-1.437-1.436-1.437H39.612c-0.794,0-1.437,0.644-1.437,1.437   S38.818,37.074,39.612,37.074z"/>
                                            <path d="M39.612,51.437H77.91c0.793,0,1.436-0.644,1.436-1.437s-0.643-1.437-1.436-1.437H39.612c-0.794,0-1.437,0.644-1.437,1.437   S38.818,51.437,39.612,51.437z"/>
                                            <path d="M39.612,65.798H77.91c0.793,0,1.436-0.644,1.436-1.437s-0.643-1.436-1.436-1.436H39.612c-0.794,0-1.437,0.643-1.437,1.436   S38.818,65.798,39.612,65.798z"/>
                                            <path d="M39.612,80.159H77.91c0.793,0,1.436-0.643,1.436-1.436s-0.643-1.437-1.436-1.437H39.612c-0.794,0-1.437,0.644-1.437,1.437   S38.818,80.159,39.612,80.159z"/>
                                            <path d="M22.091,26.447h8.617c0.476,0,0.862-0.387,0.862-0.862v-8.617c0-0.476-0.387-0.861-0.862-0.861h-8.617   c-0.476,0-0.861,0.386-0.861,0.861v8.617C21.229,26.061,21.615,26.447,22.091,26.447z M22.953,17.83h6.893v6.893h-6.893V17.83z"/>
                                            <polygon points="25.816,22.277 24.209,20.361 23.475,20.977 25.831,23.784 29.323,19.45 28.578,18.85  "/>
                                            <path d="M30.708,73.553h-8.617c-0.476,0-0.861,0.387-0.861,0.862v8.617c0,0.476,0.386,0.861,0.861,0.861h8.617   c0.476,0,0.862-0.386,0.862-0.861v-8.617C31.57,73.939,31.184,73.553,30.708,73.553z M29.846,82.17h-6.893v-6.893h6.893V82.17z"/>
                                            <polygon points="29.323,76.897 28.578,76.296 25.816,79.724 24.209,77.808 23.475,78.423 25.831,81.231  "/>
                                            <path d="M30.707,44.829H22.09c-0.476,0-0.861,0.386-0.861,0.862v8.617c0,0.476,0.386,0.861,0.861,0.861h8.617   c0.476,0,0.862-0.386,0.862-0.861v-8.617C31.569,45.215,31.183,44.829,30.707,44.829z M29.845,53.446h-6.893v-6.894h6.893V53.446z"/>
                                            <polygon points="29.322,48.174 28.577,47.572 25.815,51 24.208,49.084 23.474,49.699 25.83,52.507  "/>
                                            <polygon points="28.544,32.825 26.397,34.972 24.251,32.825 23.544,33.532 25.69,35.679 23.544,37.824 24.251,38.531    26.397,36.386 28.544,38.532 29.251,37.825 27.104,35.679 29.251,33.532  "/>
                                            <path d="M22.089,40.85h8.617c0.476,0,0.862-0.387,0.862-0.862V31.37c0-0.476-0.387-0.862-0.862-0.862h-8.617   c-0.476,0-0.861,0.387-0.861,0.862v8.617C21.228,40.463,21.613,40.85,22.089,40.85z M22.951,32.232h6.893v6.893h-6.893V32.232z"/>
                                            <polygon points="28.544,61.549 26.397,63.695 24.251,61.549 23.544,62.256 25.69,64.402 23.544,66.548 24.251,67.255    26.397,65.109 28.544,67.256 29.251,66.549 27.104,64.402 29.251,62.256  "/>
                                            <path d="M22.089,69.573h8.617c0.476,0,0.862-0.387,0.862-0.862v-8.617c0-0.476-0.387-0.862-0.862-0.862h-8.617   c-0.476,0-0.861,0.387-0.861,0.862v8.617C21.228,69.187,21.613,69.573,22.089,69.573z M22.951,60.956h6.893v6.893h-6.893V60.956z"/>
                                        </g>
                                    </svg>
                                </div>
                                <p className='text-center text-xl text-[#78c1ee]'> {totalSubiecte} </p>
                            </div>
                            <p className='text-[#94959C] text-md'> Subiecte</p>
                        </div>
                        <div className='w-full pl-3 pr-3 pb-2 rounded-md flex justify-between items-center'>
                            <div className='flex flex-row items-center gap-2'> 
                                <div className='pt-1 pb-1'> 
                                    <svg height='40px' width='40px' fill="#70D49D" viewBox="0 0 64 64" id="book">
                                        <path d="M52 4H15a6 6 0 0 0-6 6v45a5.2 5.2 0 0 0 5.23 5H33a1 1 0 0 0 0-2H14.23A3.18 3.18 0 0 1 11 55v-.27a2.73 2.73 0 0 1 .11-.6 3 3 0 0 1 .12-.3c0-.08.07-.16.1-.23a3.73 3.73 0 0 1 .52-.71A3 3 0 0 1 14 52h38a2.6 2.6 0 0 0 .56-.06h.18l.26-.07V53a1 1 0 0 1-1 1H14a1 1 0 0 0 0 2h38a3 3 0 0 0 1-.18V57a1 1 0 0 1-1 1H42a1 1 0 0 0 0 2h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3ZM13.1 50.09l-.28.07a4.43 4.43 0 0 0-.59.18c-.1 0-.2.08-.3.12a5.21 5.21 0 0 0-.52.28l-.27.17L11 51V10a4 4 0 0 1 4-4v44h-1a4.43 4.43 0 0 0-.9.09ZM17 50V6h35a1 1 0 0 1 1 1v42a1 1 0 0 1-1 1Z"></path>
                                        <path d="M46 14H24a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h22a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1zm-1 7H25v-5h20zm-1 17H26a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2zm0 5H26a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2zm-6 15h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2z"></path>
                                    </svg>
                                </div>
                                <p className='text-center text-xl text-[#70D49D]'> 32 </p>
                            </div>
                            <p className='text-[#94959C] text-md'> Articole</p>
                        </div>
                        <div className='w-full pl-3 pr-3 pb-2 rounded-md flex justify-between items-center'>
                            <div className='flex flex-row items-center gap-2'> 
                                <div className='pt-1 pb-1'> 
                                    <svg width="40px" height="40px" viewBox="0 0 24 24" version="1.1" >
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g  fill="#AD7D61" fill-rule="nonzero">
                                                <path d="M8.06561801,18.9432081 L14.565618,4.44320807 C14.7350545,4.06523433 15.1788182,3.8961815 15.5567919,4.06561801 C15.9032679,4.2209348 16.0741922,4.60676263 15.9697642,4.9611247 L15.934382,5.05679193 L9.43438199,19.5567919 C9.26494549,19.9347657 8.82118181,20.1038185 8.44320807,19.934382 C8.09673215,19.7790652 7.92580781,19.3932374 8.03023576,19.0388753 L8.06561801,18.9432081 L14.565618,4.44320807 L8.06561801,18.9432081 Z M2.21966991,11.4696699 L6.46966991,7.21966991 C6.76256313,6.9267767 7.23743687,6.9267767 7.53033009,7.21966991 C7.79659665,7.48593648 7.8208027,7.90260016 7.60294824,8.19621165 L7.53033009,8.28033009 L3.81066017,12 L7.53033009,15.7196699 C7.8232233,16.0125631 7.8232233,16.4874369 7.53033009,16.7803301 C7.26406352,17.0465966 6.84739984,17.0708027 6.55378835,16.8529482 L6.46966991,16.7803301 L2.21966991,12.5303301 C1.95340335,12.2640635 1.9291973,11.8473998 2.14705176,11.5537883 L2.21966991,11.4696699 L6.46966991,7.21966991 L2.21966991,11.4696699 Z M16.4696699,7.21966991 C16.7359365,6.95340335 17.1526002,6.9291973 17.4462117,7.14705176 L17.5303301,7.21966991 L21.7803301,11.4696699 C22.0465966,11.7359365 22.0708027,12.1526002 21.8529482,12.4462117 L21.7803301,12.5303301 L17.5303301,16.7803301 C17.2374369,17.0732233 16.7625631,17.0732233 16.4696699,16.7803301 C16.2034034,16.5140635 16.1791973,16.0973998 16.3970518,15.8037883 L16.4696699,15.7196699 L20.1893398,12 L16.4696699,8.28033009 C16.1767767,7.98743687 16.1767767,7.51256313 16.4696699,7.21966991 Z"></path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <p className='text-center text-xl text-[#AD7D61]'> 142 </p>
                            </div>
                            <p className='text-[#94959C] text-md'> Probleme</p>
                        </div>
                    </div>
                </div>
            </div>
            ) : view?.toLowerCase() == 'activitate' ? (
                <div className='w-10/12 flex flex-col justify-between p-2'>
                    <div className='h-[70%]'>
                    <ScrollShadow size={0} hideScrollBar={true} className='bg-slate-100 shadow-md border-secondary border-2 w-[100%] mx-auto h-[100%] rounded-xl pt-5 pb-5 pl-5 pr-5 flex gap-3 flex-col'>
                        {userProfile?.activitate.slice().reverse().map((activitate, index) => {
                            return(
                                <div className='flex flex-row p-1 items-center justify-between'>
                                    <div className='flex flex-row items-center gap-3'>
                                        <Avatar src={activitate.currentAvatar} size="lg"/>
                                        <p className='text-lg break-words'>
                                        {userProfile.displayName} {activitate.msg}</p>
                                    </div>
                                    <div>
                                        <p className='text-md break-words'> 
                                            {activitate.timestamp}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </ScrollShadow>
                    </div>
                    <div className='w-[100%] h-[26%]'>
                        <div className='border border-secondary rounded-lg bg-slate-100 shadow-md h-full'>
                            <div class="lines1">
                                <div class="line1"></div>
                                <div class="line1"></div>
                                <div class="line1"></div>
                                <div class="line1"></div>
                                <div class="line1"></div>
                                <p className='text-9xl font-bold mt-8 text-[#1a365d]' 
                                style={{textShadow: '0 0 15px rgba(59,130,246,0.5)'}}>
                                    UNIBAC
                                </p>
                                <div class="line1"></div>
                                <div class="line1"></div>
                                <div class="line1"></div>
                                <div class="line1"></div>
                                <div class="line1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ): view?.toLowerCase() == 'setari' ? (
            <div className='w-10/12 flex flex-col p-2 gap-6'>
                <div className='border border-secondary rounded-lg bg-slate-100 shadow-md p-6'>
                    <h2 className='text-xl font-bold text-[#1a365d] mb-4'>Schimbare Email</h2>
                    
                    <div className='flex flex-col gap-4 max-w-2xl'>
                        <div className='flex items-center gap-4'>
                            <span className='w-32 font-medium'>Email curent:</span>
                            <Input
                                variant="bordered"
                                value="user@example.com"
                                classNames={{
                                    inputWrapper: "bg-default-100",
                                    input: "text-default-600"
                                }}
                            />
                        </div>
        
                        <div className='flex items-center gap-4'>
                            <span className='w-32 font-medium'>Noul email:</span>
                            <Input
                                type="email"
                                variant="bordered"
                                placeholder="Introdu noul email"
                                classNames={{
                                    inputWrapper: "hover:border-secondary focus-within:border-secondary"
                                }}
                            />
                        </div>
        
                        <div className='flex items-center gap-4'>
                            <span className='w-32 font-medium'>Parola curentă:</span>
                            <Input
                                type="password"
                                variant="bordered"
                                placeholder="••••••••"
                                classNames={{
                                    inputWrapper: "hover:border-secondary focus-within:border-secondary"
                                }}
                            />
                        </div>
        
                        <div className='ml-[136px]'>
                            <Button 
                                color="secondary"
                                radius="md"
                                className='px-6 h-10 text-md font-medium'
                            >
                                Actualizează Email
                            </Button>
                        </div>
                    </div>
                </div>
        
                {/* Secțiune Schimbare Parolă */}
                <div className='border border-secondary rounded-lg bg-slate-100 shadow-md p-6 '>
                    <h2 className='text-xl font-bold text-[#1a365d] mb-4'>Schimbare Parolă</h2>
                    
                    <div className='flex flex-col gap-4 max-w-2xl'>
                        <div className='flex items-center gap-4'>
                            <span className='w-32 font-medium'>Parola curentă:</span>
                            <Input
                                type="password"
                                variant="bordered"
                                placeholder="••••••••"
                                classNames={{
                                    inputWrapper: "hover:border-secondary focus-within:border-secondary"
                                }}
                            />
                        </div>
        
                        <div className='flex items-center gap-4'>
                            <span className='w-32 font-medium'>Parola nouă:</span>
                            <Input
                                type="password"
                                variant="bordered"
                                placeholder="••••••••"
                                classNames={{
                                    inputWrapper: "hover:border-secondary focus-within:border-secondary"
                                }}
                            />
                        </div>
        
                        <div className='flex items-center gap-4'>
                            <span className='w-32 font-medium'>Confirmă parola:</span>
                            <Input
                                type="password"
                                variant="bordered"
                                placeholder="••••••••"
                                classNames={{
                                    inputWrapper: "hover:border-secondary focus-within:border-secondary"
                                }}
                            />
                        </div>
        
                        <div className='ml-[136px]'>
                            <Button 
                                color="secondary"
                                radius="md"
                                className='px-6 h-10 text-md font-medium'
                            >
                                Actualizează Parola
                            </Button>
                        </div>
                    </div>
                </div>
        
                <div className='border border-danger rounded-lg bg-danger-50 p-6'>
                    <h2 className='text-xl font-bold text-danger mb-2'>Zona periculoasă</h2>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-default-600 mb-2'>Ștergere definitivă a contului</p>
                            <p className='text-sm text-default-500'>Această acțiune nu poate fi anulată</p>
                        </div>
                        <Button 
                            variant="bordered"
                            color="danger"
                            radius="md"
                            className='border-danger'
                        >
                            Șterge contul
                        </Button>
                    </div>
                </div>
            </div>
            ) : view?.toLowerCase() == 'postari' ? (
            <div className='w-10/12 flex flex-col p-2 gap-6'>
                <div className='border border-secondary rounded-lg bg-slate-100 shadow-md p-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl font-bold text-[#1a365d]'>Subiecte Postate</h2>
                        <Select 
                            label="Filtru" 
                            className="max-w-[200px]"
                            defaultSelectedKeys={["toate"]}
                        >
                            <SelectItem key="toate">Toate subiectele</SelectItem>
                            <SelectItem key="verificate">Verificate</SelectItem>
                            <SelectItem key="mate-info">Mate-Info</SelectItem>
                        </Select>
                    </div>
        
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {subiecteData?.map((postare) => (
                            <div key={postare._id} className='border border-default-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
                                <div className='flex justify-between items-start mb-3'>
                                    <div>
                                        <h3 className='text-xl font-semibold flex items-center gap-2'>
                                            {postare.titlu}
                                            {postare.verified && (
                                                <span className='text-success-500'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            )}
                                        </h3>
                                        <p className='text-default-500 text-sm'>{postare.materie} • {postare.profil}</p>
                                    </div>
                                </div>
                                
                                <p className='text-default-600 mb-4'>{postare.descriere}</p>
                                
                                <div className='flex justify-between items-center text-sm'>
                                    <span className='text-default-400'>
                                        {new Date(postare.createdAt).toLocaleDateString('ro-RO')}
                                    </span>
                                    <div className='flex gap-2'>
                                        <Button size="sm" color="secondary" variant="flat"
                                        onClick={() => {navigate(`/subiecte/${postare.materie}/${postare._id}`)}}>
                                            Vezi Subiect
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {subiecteData?.length === 0 && (
                            <div className='col-span-2 text-center text-default-500'>
                                Niciun subiect publicat
                            </div>
                        )}
                    </div>
                </div>
        
                <div className='border border-secondary rounded-lg bg-slate-100 shadow-md p-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl font-bold text-[#1a365d]'>Articole Publicate</h2>
                        <Button color="primary"
                        onClick={() => {navigate(`/articole/posteaza`)}}>
                            Scrie un articol
                        </Button>
                    </div>
        
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {articoleData?.map((articol) => (
                            <div key={articol._id} className='border border-default-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
                                <div className='flex justify-between items-start mb-3'>
                                    <div>
                                        <h3 className='text-xl font-semibold'>{articol.titlu}</h3>
                                        <p className='text-default-500 text-sm'>{articol.categorie} • {articol.timpLectura}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-default-400 text-sm'>
                                            {articol.vizualizari} vizualizări
                                        </span>
                                        <Avatar src={`https://ui-avatars.com/api/?name=${articol.username}`} size="sm" />
                                    </div>
                                </div>
                                
                                <p className='text-default-600 mb-4 line-clamp-3'>{articol.conținut}</p>
                                
                                <div className='flex justify-between items-center text-sm'>
                                    <div className='flex gap-2'>
                                        {articol.tags.map((tag) => (
                                            <span key={tag} className='px-2 py-1 bg-default-100 rounded-full text-xs'>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className='flex gap-2'>
                                        <Button size="sm" color="secondary" variant="flat">
                                            Citește
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {articoleData?.length === 0 && (
                            <div className='col-span-2 text-center text-default-500'>
                                Niciun articol publicat
                            </div>
                        )}
                    </div>
                </div>
            </div>
            ) : <></>}
        </div>
    );
}
 
export default ViewProfile;