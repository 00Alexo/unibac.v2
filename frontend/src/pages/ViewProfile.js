import {useState, useRef, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import NotFound from './NotFound';
import { useGetProfile } from '../hooks/useGetProfile';
import { Avatar, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { ResponsiveCalendar } from '@nivo/calendar';
import uploadImage from '../assets/uploadImage.png'
import DOMPurify from 'dompurify';

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

    // if(view != undefined && view != null && view?.toLowerCase() != 'setari' && view?.toLowerCase() != 'articole'
    // && view?.toLowerCase() != 'subiecte'
    // && view?.toLowerCase() != 'activitate' && view?.toLowerCase() != 'clase' && view?.toLowerCase() != 'profil')
    //     return <PageNotFound/>

    // if(view && view.toLowerCase() === 'setari' && user?.username.toLowerCase() !== username?.toLowerCase()){
    //     return <PageNotFound/>
    // }

    if (!userProfile){
        return <NotFound/>
    }

    return (
        <div className='flex flex-row z-30 relative p-4 gap-4 h-[calc(100vh-65px)]'>
            <div className='flex flex-col w-2/12 border border-secondary rounded-lg bg-white pt-4 pr-5 pl-5 h-full'> {/* left side*/}
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        <div className='mb-'>
                            <p className='text-3xl font-semibold'>
                                {userProfile.username?.charAt(0).toUpperCase() + userProfile.username?.slice(1).toLowerCase()}
                            </p>
                            <p className='text-gray-500 text-md mt-1 ml-1'>
                                {userProfile.statut?.charAt(0).toUpperCase() + userProfile.statut?.slice(1).toLowerCase()}
                            </p>
                        </div>
                        <nav className='space-y-2 border-t pb-4 pt-4'>
                            {['Overview', 'Activitate', 'Postari', 'Clase', 'Favorite'].map((item) => {
                                const currentView = view?.toLowerCase() || 'overview';
                                const isActive = currentView === item.toLowerCase();
                                return (
                                    <p 
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
                    <div className='border-t pb-4 pt-4 flex flex-row'>
                        <p className='font-semibold pr-1'> Joined: </p>
                        {userProfile.createdAt ? (
                            new Date(userProfile.createdAt).toLocaleDateString('ro-RO', {
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
            <div className='w-10/12 flex flex-col justify-between p-2'> {/* right side*/}
                <div className='h-[40%] flex flex-row justify-between'>
                    <div className='border border-secondary rounded-lg bg-white w-[30%]'>
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
                            name = {userProfile.username.charAt(0).toUpperCase()}
                            as="button"
                            onMouseEnter={() => {
                                if(user && user.username === userProfile.username){
                                setIsHovered(true); 
                                }
                            }}
                            onMouseLeave={() => {
                                if(user && user.username === userProfile.username){
                                    setIsHovered(false); 
                                }
                            }}
                            onClick={() => {if(user && user.username === userProfile.username) fileInputRef.current?.click()}}
                            className="transition-transform w-full h-full rounded-sm text-9xl cursor-pointer "
                            src={isHovered ? uploadImage : `${userProfile.avatar}`}
                        />
                    </div>
                    <div className='border border-secondary rounded-lg bg-white w-[68.5%]'>
                        test
                    </div>
                </div>
                <div className='h-[27.5%] flex flex-row justify-between'>
                    <div className='border border-secondary rounded-lg bg-white w-[30%] pt-4 pr-6 pl-6 pb-4'>
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
                    <div className='border border-secondary rounded-lg bg-white w-[68.5%] pr-10 pl-10 pt-4 pb-4'>
                        <div className='flex flex-row justify-between'>
                            <p className='text-2xl'> 134 de subiecte rezolvate in ultimul an</p>
                            <Select
                                className="max-w-28"
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
                            data={[
                                { day: '2024-01-01', value: 3 },
                                { day: '2025-02-05', value: 10 },
                                { day: '2025-01-01', value: 10 },
                                { day: '2025-03-05', value: 57 },
                                { day: '2025-04-01', value: 43 },
                                { day: '2025-05-05', value: 37 },
                                { day: '2025-06-01', value: 23 },
                                { day: '2025-07-05', value: 17 },
                            ]}
                            from={`${anSelectat}-01-01`}
                            to={`${anSelectat}-01-31`}
                            emptyColor="#eeeeee"
                            colors={['#9be9a8', '#40c463', '#30a14e', '#216e39']}
                            margin={{ top: 4, right: 10, bottom: 4, left: 10 }}
                            yearSpacing={40}
                            monthBorderColor="#ffffff"
                            dayBorderWidth={2}
                            dayBorderColor="#ffffff"
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
                    <div className='border border-secondary rounded-lg bg-white w-[68.5%]'>
                        test
                    </div>
                    <div className='border border-secondary rounded-lg bg-white w-[30%]'>
                        test
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default ViewProfile;