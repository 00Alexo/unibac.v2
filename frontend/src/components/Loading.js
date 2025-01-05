import {Spinner} from "@nextui-org/react"

const Loading = () => {
    return ( 
        <div 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajustează opacitatea și culoarea overlay-ului după nevoi
                zIndex: 999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Spinner size="lg" color="primary" />
        </div>
    );
}
 
export default Loading;