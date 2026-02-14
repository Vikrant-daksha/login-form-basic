import React, { useState } from "react";
import api from "../api/axiosinstance";

function SearchPage() {

    type user = {
        name: string;
        email: string;
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState<user[]>([]);

    const handleSearch = async() => {
        try{
            const res = await api.get(`/api/client/search?q=${searchTerm}`)
            console.log(res.data);
            setFilteredData(res.data);
        } catch (err) {
            console.error("error:", err)
        }
    }

    return(
        <div>
            <input type="text" onChange={(e) => {setSearchTerm(e.target.value)}} ></input>
            <button onClick={handleSearch}>Search</button>
            {filteredData.map((elem) => (
                <>
                <div>{elem.name}</div>
                <div>{elem.email}</div>
                </>
            ))}
            <div>
            </div>
        </div>
    );
}

export default SearchPage