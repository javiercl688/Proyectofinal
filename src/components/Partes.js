import React, { useState, useEffect } from 'react';

const Partes = () => {
    const [partes, setPartes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost/path/to/your/getPartes.php') // Ajusta la URL según sea necesario
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setPartes(data.data);
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Partes</h1>
            <ul>
                {partes.map(parte => (
                    <li key={parte.id}>
                        {parte.nombre} - {parte.existencia}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Partes;
