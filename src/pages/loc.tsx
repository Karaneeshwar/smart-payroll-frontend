import { Geolocation, Position } from "@capacitor/geolocation";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem"
import { IonButton } from "@ionic/react";
import "@tensorflow/tfjs-core";

let loc;
const loader = async () => {
    Promise.all([
        loc = await Geolocation.getCurrentPosition(),
        console.log(loc),
        saveJson(loc.coords)
    ]);    
}

const getLoc = async():Promise<Position["coords"]> => {
    const pos = await Geolocation.getCurrentPosition({
        timeout: 10000
    }); 
    return pos.coords;
}

async function saveJson(loc:Position["coords"]){
    const obj={
        location: JSON.stringify(loc)
    };
    const str = JSON.stringify(obj);
    console.log("saving...");
    await Filesystem.writeFile({
        path: "Location.json",
        data: str,
        directory: Directory.Data,
        encoding: Encoding.UTF8
    });
    console.log("Fnished saving...");
}

interface p {
    onVer: (i: string) => void;
}

const CheckLocation: React.FC<p> = ({onVer}) => {

    const verifyLocation = async () => {
        await loader();
        console.log("Reading");
        const str = await Filesystem.readFile({
            path: "Location.json",
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        if (typeof str.data==='string') {
            const locObj = JSON.parse(JSON.parse(str.data).location);
            console.log("Json is ready");
            const curloc = await getLoc();
            console.log(curloc);
            console.log(locObj);
            if (curloc.latitude==locObj.latitude && curloc.longitude==locObj.longitude){
                console.log("true");
                onVer("/tick.svg");
            } else {
                console.log("false");
                onVer("/cross.svg");
            }
        }
    };
    return (
        <IonButton onClick={verifyLocation}>Verify Location</IonButton>
    );
};

export default CheckLocation;