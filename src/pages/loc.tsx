import { Geolocation, Position } from "@capacitor/geolocation";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem"
import { IonButton } from "@ionic/react";
import "@tensorflow/tfjs-core";
import axios from 'axios';

/*let loc, locObj = {
    lattitude: 0.0,
    longitude: 0.0
};
let res;
const loader = async () => {
    try {
        await Promise.all([
            loc = await Geolocation.getCurrentPosition(),
            console.log(loc),
            locObj['latitude'] = loc.coords.latitude,
            locObj['longitude'] = loc.coords.longitude,
            res = await axios.get('http://localhost:3000/saveloc', {
                params: {
                    loc: JSON.stringify(locObj)
                }
            }),
            saveJson(locObj),
            console.log(res.data.message)
        ]);    
    } catch (err) {
        console.log(err.message);
    }
};
*/
const getLoc = async():Promise<Position["coords"]> => {
    const pos = await Geolocation.getCurrentPosition({
        timeout: 10000
    }); 
    return pos.coords;
}

interface q {
    id: string,
    lattitude: number,
    longitude: number
};

export async function saveJson(loc:q){
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
    const fp = await Filesystem.getUri({ path:"Location.json" , directory:Directory.Data});
    console.log(fp.uri);
}

interface p {
    onVer: (i: string) => void;
}

const CheckLocation: React.FC<p> = ({onVer}) => {

    const verifyLocation = async () => {
        //await loader();
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
            console.log(curloc.latitude-locObj.latitude);
            console.log(locObj.longitude-locObj.longitude);
            if ((Math.abs(curloc.latitude-locObj.latitude)<0.05) && (Math.abs(curloc.longitude-locObj.longitude)<0.05)){
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