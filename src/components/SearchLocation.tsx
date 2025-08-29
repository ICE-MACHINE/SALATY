import useWidth from "../contexts/Width/UseWidth.tsx";
import useMode from "../contexts/Mode/UseMode";
import Map from "./Map.tsx";
import SearchBar from "./SearchBar.tsx";
import useLocation from "../contexts/Location/UseLocation.tsx";
export default function SearchLocation(){
    const { mode } = useMode();
    const { width } = useWidth();
    const isMobile = width < 700;
    const { getPosition } = useLocation();
    return (
        <div style={{
             height: 'calc(100vh - 60px)',
              width: '100%' ,
              marginBottom:isMobile?"60px":"0",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                gap:"20px"
              }}>
            <SearchBar />
                <div
                style={{
                    maxHeight: '500px',
                    height:"50%",
                    width: '90%',
                    borderRadius: '50px',

                }}
                >
            <Map />
            </div>
            <div style={{
                backgroundColor: mode === 'dark' ? '#333' : '#fff',
                color: mode === 'dark' ? '#fff' : '#000',
                padding: '10px',
                borderRadius: '5px'
            }}>
                موقعك الحالي {getPosition().place || "غير معروف"}
            </div>
        </div>
    );
}