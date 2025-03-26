import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";

const Subiecte = () => {
    const {materie} = useParams();
    const navigate = useNavigate();
    const [subiecte, setSubiecte] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [materii, setMaterii] = useState(['informatica', 'matematica', 'logica', 'economie', 'psihologie'])

    const getSubiecte = async () => {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/getSubiecte?materie=${materie.toLowerCase()}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const json = await response.json();

        if (response.ok) {
            setSubiecte(json);
            console.log(json);
            setLoading(false);
        }
        if (!response.ok){
            console.log(json);
            setError(json.error);
            setTimeout(()=>{
                setError(null);
            }, 7000)
            setLoading(false);
        }
    }

    useEffect(() =>{
        getSubiecte();
    }, [materie]);

    if(!materii.includes(materie.toLowerCase())){
        return <NotFound/>
    }

    return (
        <div className="flex flex-wrap gap-6 p-6">
        {subiecte?.length > 0 ? (
            subiecte.map((subiect) => (
            <div key={subiect._id} className="flex-[1_1_calc(25%-1.5rem)] min-w-[250px]" onClick={() => navigate(`/subiecte/${materie}/${subiect._id}`)}>
                <Card className="cursor-pointer z-20 h-full">
                <CardHeader className="text-lg font-bold">{subiect.titlu}</CardHeader>
                <CardBody>
                    <p><strong>Postat de:</strong> <span className="capitalize">{subiect.username}</span></p>
                    <p><strong>Materie:</strong> {subiect.materie}</p>
                    <p><strong>Profil:</strong> {subiect.profil}</p>
                    <p>{subiect.descriere}</p>
                </CardBody>
                </Card>
            </div>
            ))
        ) : (
            <div className="w-full flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative inline-block">
                <svg 
                  className="w-24 h-24 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <div className="absolute -top-2 -right-2 bg-red-100 rounded-full p-2">
                  <svg 
                    className="w-8 h-8 text-red-500"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-700">Niciun subiect disponibil momentan</h3>
              <p className="text-gray-500 text-center max-w-md">
                Pare că încă nu există subiecte postate pentru această materie. 
              </p>
            </div>
          )}
        </div>
    );
    };

export default Subiecte;
