import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotFound from './NotFound';
import DOMPurify from 'dompurify';
import { useAuthContext } from '../hooks/useAuthContext';

const ViewLectie = () => {
    const {user} = useAuthContext();
    const { classId, id } = useParams();
    const navigate = useNavigate();
    const [lectieData, setLectieData] = useState(null);
    const [sanitizedContent, setSanitizedContent] = useState('');

    const getLectie = async () => {
        const response = await fetch(`${process.env.REACT_APP_API}/api/class/getLectie/${classId}/${id}/${user?.username}`);
        const json = await response.json();
        
        if (response.ok) {
            const cleanContent = DOMPurify.sanitize(json.content);
            setLectieData(json);
            setSanitizedContent(cleanContent);
        }

        if(!response.ok)
            console.log(json.error);
    };

    useEffect(() => {
        getLectie();
    }, [classId, id, user]);

    if (!classId || !id || !lectieData) {
        return <NotFound />;
    }

    return (
        <div className="max-w-full mx-auto p-6 relative z-10">
            <div className="mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Înapoi
                </button>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{lectieData.titlu}</h1>
                
                <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">Autor: {lectieData.username}</span>
                    <span>Publicată la: {lectieData.time}</span>
                </div>
            </div>

            <div className="prose max-w-none bg-white rounded-lg shadow-sm p-6 border">
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>
        </div>
    );
}
 
export default ViewLectie;