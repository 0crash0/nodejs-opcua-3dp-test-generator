import React, { useEffect, useState } from 'react';
import axios from 'axios';
const MyComponent = () => { const [data, setData] = useState(null);
    useEffect(() => { const fetchData = async () => {
        try { const response = await axios.get('/api/data');
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };
        fetchData();
    }, []);

    return (
        <div> {data ? ( <p>{data.message}</p> ) : ( <p>Loading data...</p> )} </div>
    );
};

export default MyComponent;