import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const UnityGame = () => {
    const { unityProvider } = useUnityContext({
        loaderUrl: "/Unity/Build/UnityGameBuild.loader.js", 
        dataUrl: "/Unity/Build/UnityGameBuild.data.unityweb", 
        frameworkUrl: "/Unity/Build/UnityGameBuild.framework.js.unityweb", 
        codeUrl: "/Unity/Build/UnityGameBuild.wasm.unityweb", 
    });

    return (
        <div>
            <Unity
                style={{
                    width: '100vw',
                    justifySelf: 'center',
                    alignSelf: 'center',
                }}
                unityProvider={unityProvider}
            />
        </div>
    );
};

export default UnityGame;
