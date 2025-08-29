import useMode from "../contexts/Mode/UseMode";
import { useState } from "react";
import useLocation from "../contexts/Location/UseLocation";
export default function SearchBar(){
    const { mode } = useMode();
    const { searchLocation } = useLocation();
    const [query, setQuery] = useState("");
    return (
        <div style={{
            color: mode === 'dark' ? '#fff' : '#000',
            borderRadius: '5px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap:"30px",
        }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث هنا..."
                style={{
                    width: '80%',
                    maxWidth:"300px",
                    padding: '10px',
                    borderRadius: '5px',
                    border: mode === 'dark' ? '1px solid #555' : '1px solid #ccc'
                }}
            />
            <button
                style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: mode === 'dark' ? '#555' : '#007bff',
                    color: '#fff',
                    cursor: 'pointer'
                }}
                disabled={!query.trim()}
                onClick={() =>{
                    searchLocation(query.trim());
                    setQuery("");
                }}
            >
                بحث
            </button>
        </div>
    );
}