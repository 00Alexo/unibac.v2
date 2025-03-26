import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotFound from './NotFound';
import DOMPurify from 'dompurify';
import { useAuthContext } from '../hooks/useAuthContext';

const ViewTema= () => {
    const {user} = useAuthContext();
    const { classId, id } = useParams();
    const navigate = useNavigate();
    const [temaData, setTemaData] = useState(null);
    const [sanitizedContent, setSanitizedContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);



    const getTema = async () => {
        const response = await fetch(`${process.env.REACT_APP_API}/api/class/getTema/${classId}/${id}/${user?.username}`);
        const json = await response.json();
        
        if (response.ok) {
            const cleanContent = DOMPurify.sanitize(json.content);
            setTemaData(json);
            setSanitizedContent(cleanContent);
        }

        if(!response.ok)
            console.log(json.error);
    };

    useEffect(() => {
        getTema();
    }, [classId, id, user]);

    if (!classId || !id || !temaData) {
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
                
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{temaData.titlu}</h1>
                
                <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">Autor: {temaData.username}</span>
                    <span className="mr-4">Publicată la: {temaData.time}</span>
                    <span className="mr-4">Deadline: {temaData.deadline}</span>
                </div>
            </div>

            <div className="prose max-w-none bg-white rounded-lg shadow-sm p-6 border">
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Trimite soluția ta</h2>
                    
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        {temaData.submissions?.[user.username] && (
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-2">
                                    Ultima trimitere: {temaData.submissions[user.username].time}
                                </p>
                                <div className="flex items-center gap-2 text-green-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span>Tema a fost trimisă cu succes</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Încarcă fișierul cu soluția
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comentarii (opțional)
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Adaugă observații sau comentarii..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Se trimite...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                                        </svg>
                                        Trimite tema
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default ViewTema;