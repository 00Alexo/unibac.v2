import {Input, Button, Select, SelectItem, Autocomplete, AutocompleteItem, Tooltip, Textarea, CircularProgress,Modal,ModalContent,
ModalHeader,ModalBody,ModalFooter, useDisclosure,Checkbox, Spinner} from "@nextui-org/react";
import {useEffect, useState} from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import {Error, NotificationBox} from '../components/alertBox';
import Loading from "../components/Loading";
import { useNavigate } from 'react-router-dom';
import NotFound from "./NotFound";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

export const subiecte = [
    {key: "informatica", label: "Informatica"},
    {key: "matematica", label: "Matematica"},
    {key: "logica", label: "Logica"},
    {key: "economie", label: "Economie"},
  ];
export const profile = [
    {key: "mate-info", label: "Mate-Info"},
    {key: "filologie", label: "Filologie"},
    {key: "bio-chimie", label: "Bio-Chimie"},
];

const PosteazaSubiect = () => {
    const {user} = useAuthContext();
    const [profil, setProfil] = useState("");
    const [materie, setMaterie] = useState("");
    const [descriere, setDescriere] = useState("");
    const [titlu, setTitlu] = useState("");
    const [subiect, setSubiect] = useState("");
    const [error, setError] = useState("");
    const [barem, setBarem] = useState("");
    const [loading, setLoading] = useState("");
    const [errorFields, setErrorFields] = useState("");

    const nextStep = async () =>{
        setLoading(true);
        const formData = new FormData();
    
        formData.append("username", user.username);
        formData.append("profil", profil);
        formData.append("materie", materie);
        formData.append("descriere", descriere);
        formData.append("titlu", titlu);
    
        formData.append("subiect", subiect); 
        formData.append("barem", barem);
    
        const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/uploadPdf`, {
            method: 'POST',
            body: formData,
        });

        const json = await response.json();

        if (response.ok) {
            console.log("Fișierele au fost încărcate cu succes!", json);
            setLoading(false);
        }
        if (!response.ok){
            console.log(json);
            setError(json.error);
            setErrorFields(json.errorFields);
            setTimeout(()=>{
                setError(null);
            }, 7000)
            setLoading(false);
        }
    }

    if(!user)
        return <NotFound/>;
    return(
        <div>
            {error && <Error error={error}/>}
            <div className="w-2/3 mt-10 rounded-lg mx-auto border border-zinc-300 p-4 flex flex-col gap-7 bg-[#FFFFFF] z-50 relative">
                <div className="flex flex-col gap-1">
                    <p className="text-3xl text-gray-950 font-bold">Posteaza un subiect</p>
                    <p> Completeaza formularul pentru a posta un subiect nou.</p>
                </div>
                <div className="flex flex-row gap-20">
                    <div className="flex flex-col gap-2 w-[48%]">
                        <p className="font-bold"> Profil </p>
                        <Select
                            className="w-[100%]"
                            label="Selectează profilul"
                            value={profil}
                            onChange={(e) => setProfil(e.target.value)}
                            classNames={{
                                trigger: errorFields.includes("profil") ? "border-errorBorder border-2" : "",
                            }}
                            >
                            {profile.map((profil) => (
                                <SelectItem key={profil.key}>{profil.label}</SelectItem>
                            ))}
                        </Select>

                    </div>
                    <div className="flex flex-col gap-2 w-[48%]">
                        <p className="font-bold"> Materie </p>
                        <Select className="w-[100%]" label="Selecteaza o materie"
                        classNames={{
                            trigger: errorFields.includes("materie") ? "border-errorBorder border-2" : "",
                        }}
                        value={materie}
                        onChange={(e) => {setMaterie(e.target.value); console.log(materie)}}>
                            {subiecte.map((subiect) => (
                            <SelectItem key={subiect.key}>{subiect.label}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-[100%] min-h-[100px]">
                    <p className="font-bold"> Titlu </p>
                    <Textarea
                        value={titlu}
                        onChange={(e) => {setTitlu(e.target.value); console.log(titlu)}}
                        className=" bg-gray-100 hover:bg-gray-200 text-black focus:ring-2
                        focus:outline-none rounded-lg"
                        classNames={{
                            inputWrapper: `bg-gray-100 hover:bg-gray-200 text-black ${
                                errorFields.includes("titlu") ? "border-[2px] border-errorBorder" : ""
                            }`,
                            input: "resize-y max-h-[40px]",
                        }}
                        isClearable
                        placeholder="Accentul principal al subiectului..."
                        variant="flat" // Elimină border-ul implicit
                    />
                </div>
                <div className="flex flex-col gap-2 w-[100%] min-h-[100px]">
                    <p className="font-bold"> Descriere </p>
                    <Textarea
                        value={descriere}
                        onChange={(e) => {setDescriere(e.target.value); console.log(titlu)}}
                        className="w-[100%] bg-gray-100 hover:bg-gray-200 text-black focus:ring-2
                        focus:outline-none rounded-lg"
                        classNames={{
                            inputWrapper: `bg-gray-100 hover:bg-gray-200 text-black ${
                                errorFields.includes("titlu") ? "border-[2px] border-errorBorder" : ""
                            }`,
                            input: "resize-y max-h-[40px]",
                        }}
                        isClearable
                        placeholder="O scurta descriere a subiectului..."
                        variant="flat" // Elimină border-ul implicit
                    />
                </div>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-5">
                        <input
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                            
                                if (file) {
                                    const validTypes = ["application/pdf"];
                                  
                                  if (validTypes.includes(file.type)) {
                                    setSubiect(file);
                                    console.log("Fișier valid:", file);
                                  } else {
                                    setError("Doar fișiere PDF sunt permise!");
                                    setTimeout(()=>{
                                        setError(null);
                                    }, 7000)
                                    e.target.value = "";
                                  }
                                }
                            }}
                            type="file"
                            name="file-input-subiect"
                            id="file-input-subiect"
                            accept='.pdf' 
                        />
                        <label 
                            for="file-input-subiect" 
                            className={`cursor-pointer flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black 
                            border border-gray-400 rounded-lg px-4 py-2 transition-all duration-300 
                            ${errorFields.includes("subiect") ? "border-[2px] border-[#C71772]" : ""}`}
                        >
                            <FontAwesomeIcon icon={faCamera} /> <span>Inserează subiectul</span>
                        </label>

                        <input
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                            
                                if (file) {
                                    const validTypes = ["application/pdf"];
                                  
                                  if (validTypes.includes(file.type)) {
                                    setBarem(file);
                                    console.log("Fișier valid:", file);
                                  } else {
                                    setError("Doar fișiere PDF sunt permise!");
                                    setTimeout(()=>{
                                        setError(null);
                                    }, 7000)
                                    e.target.value = "";
                                  }
                                }
                            }}
                            type="file"
                            name="file-input-barem"
                            id="file-input-barem"
                            accept='.pdf' 
                        />
                        <label 
                            for="file-input-barem"
                            className={`cursor-pointer flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black 
                            border border-gray-400 rounded-lg px-4 py-2 transition-all duration-300 
                            ${errorFields.includes("barem") ? "border-[2px] border-[#C71772]" : ""}`}
                        >
                            <FontAwesomeIcon icon={faCamera} /> <span>Inserează baremul</span>
                        </label>
                    </div>

                    <div>
                        <Button disabled={loading} className="border-black text-black hover:bg-black hover:text-white transition-all duration-300" 
                        variant="bordered" size="lg" onPress={() => nextStep()}>
                            Posteaza {loading && <Spinner/>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
    
export default PosteazaSubiect;