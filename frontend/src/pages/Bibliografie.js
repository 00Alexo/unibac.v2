const Bibliografie = () => {
    return (
        <div className="min-h-[100vh-72px] bg-gray-50 p-8">
            <div className="max-w-[900px] mx-auto relative z-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-blue-200 pb-2">
                    Bibliografie - Resurse de Invatare
                </h1>
                
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow mb-6">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">📚</span>
                        <h2 className="text-xl font-semibold text-gray-700">Tehnologii utilizate</h2>
                    </div>
                    <ul className="space-y-4">
                        <li className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-medium text-gray-800">Client-side</h3>
                            <p className="text-md text-gray-600">
                                React (CRA), NextUI, TailwindCSS, FontAwesome, Nivo, React-Pdf-Viewer, TSParticles, ThreeJS, React-Three-Fiber, React-Three-Drei,
                                FramerMotion, Marked, Pdfjs-Dist, React-Router-Dom, VantaJS, HighlightJS, Date-Fns
                            </p>
                        </li>
                        <li className="border-l-4 border-green-500 pl-4">
                            <h3 className="font-medium text-gray-800">Sever-side</h3>
                            <p className="text-md text-gray-600">
                                Express, MongoDB, BcryptJs, JsonWebToken, Dotenv, Gridfs-Stream, Multer, Openai, Pdf-Parse, Socket.io, uuidv4
                                </p>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow mb-6">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">📄</span>
                        <h2 className="text-xl font-semibold text-gray-700">Subiecte si bareme</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-gray-800">"Examenul national de bacalaureat 2024 (Economie)"</h3>
                            <p className="text-sm text-gray-600 mt-2">Edupedu, 2024</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="font-medium text-gray-800">"Barem de notare si evaluare bac 2024 (Economie)"</h3>
                            <p className="text-sm text-gray-600 mt-2">Edupedu, 2024</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">🌐</span>
                        <h2 className="text-xl font-semibold text-gray-700">Tutoriale vizualizate | Surse</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer" 
                            onClick={() => window.open('https://www.youtube.com/watch?v=ntKkVrQqBYY&t=13103s')}>
                            <div className="flex items-center text-blue-600">
                                <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M12.586 4.586l-3 3L4 3h-.586a1 1 0 0 0-.707.293l-1.414 1.414A1 1 0 0 0 2 5.414V16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.586z"/>
                                </svg>
                                <span className="text-sm">MERN Stack Project: Realtime Chat App Tutorial    </span>
                            </div>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                            onClick={() => window.open('https://threejs.org/docs/')}>
                            <div className="flex items-center text-blue-600">
                                <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM6.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.7 3.2a4 4 0 0 1 7.4 0 1 1 0 1 1-7.4 0z"/>
                                </svg>
                                <span className="text-sm">ThreeJS && VantaJS Documentation</span>
                            </div>
                        </div>

                        <div className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                            onClick={() => window.open('https://platform.openai.com/docs/api-reference/chat/create')}>
                            <div className="flex items-center text-blue-600">
                                <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM6.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.7 3.2a4 4 0 0 1 7.4 0 1 1 0 1 1-7.4 0z"/>
                                </svg>
                                <span className="text-sm">OpenAI API Documentation</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                        📌 Bibliografia este actualizată periodic și include toate resursele utilizate în dezvoltarea conținuturilor educaționale.
                    </p>
                </div>
            </div>
        </div>
    );
}
 
export default Bibliografie;