import { useRef, useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {useNavigate, useParams} from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { Error } from '../components/alertBox';

export default function PosteazaLectie() {
  const editorRef = useRef(null);
  const {user} = useAuthContext();
  const {classId, view} = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [titlu, setTitlu] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const response = await fetch(`${process.env.REACT_APP_API}/api/class/posteazaLectie`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: user.username, classId, content, titlu})
    })
    const json = await response.json();
    if(!response.ok){
        console.log(json.error);
        setError(json.error);
        setTimeout(() => setError(""), 7000);
    }
    if(response.ok){
        navigate(`/clase/${classId}/lectii/${json.id}`);
    }
  }

  return (
    <div className='relative z-10'>
      {error && <Error error={error}/>}
      <Editor
        apiKey={process.env.REACT_APP_TINYMCEAPI}
        value={content}
        onEditorChange={setContent}
        init={{
          height: 700,
          menubar: true,
          branding: true,
          statusbar: true,
          autoresize_bottom_margin: 50,
          autoresize_min_height: 500,
          plugins: 'anchor autolink charmap codesample emoticons codesample image imagetools link lists media searchreplace table visualblocks wordcount linkchecker',
          toolbar: 'undo redo | blocks fontfamily fontsize codesample | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
          images_upload_handler: async (blobInfo) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.readAsDataURL(blobInfo.blob());
              reader.onload = () => {
                resolve(reader.result);
              };
            });
          },
          file_picker_callback: (cb, value, meta) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            
            input.addEventListener('change', (e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                cb(reader.result, { title: file.name });
              });
              reader.readAsDataURL(file);
            });
            
            input.click();
          }
        }}
      />

      <div className="mt-4 pr-2 pl-2">
        <input
          type="text"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
          placeholder="Titlul lecției"
          className="w-full px-4 py-2 border rounded-lg border-secondary mb-2 focus:ring-2"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Salvează Lecția
        </button>
      </div>
    </div>
  );
}