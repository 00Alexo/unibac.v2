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
    const [materii, setMaterii] = useState(['informatica', 'matematica', 'logica', 'economie'])

    const getSubiecte = async () => {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/getSubiecte?materie=${materie}`, {
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
        {subiecte.map((subiect) => (
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
        ))}
    </div>
    );
    };

export default Subiecte;
