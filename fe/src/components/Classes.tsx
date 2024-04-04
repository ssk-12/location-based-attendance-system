import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Class {
    id: string;
    name: string;
    subject: string;
    hostId: string;
    hostName: string;
    host: any
}


export const Classes: React.FC = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    navigate("/signin");
                    return;
                }
                const response = await axios.get('http://127.0.0.1:8787/api/v1/class/classes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClasses(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching classes:', error);
                setLoading(false);
            }
        };

        fetchClasses();
    }, [navigate]);


    return (
        <>
            {loading ? (
                <p className="font-semibold flex items-center justify-center min-h-[calc(100vh-46px)]">Loading classes...</p>
            ) : classes.length > 0 ? (
                <div className="p-14 m-4 flex justify-start items-center gap-6 flex-wrap">
                    {classes.map((classItem) => (
                        <div key={classItem.id} className=" shadow-lg cursor-pointer    flex flex-col  min-w-64" onClick={() => navigate(`/class/${classItem.id}/attendance`)}>
                            <div className='flex flex-col p-4 rounded-t-lg bg-gray-400'>
                                <h2 className="font-bold text-2xl">{classItem.name}</h2>
                                <p className='text-sm'>{classItem.subject}</p>
                                <p className='text-sm'>{classItem.host.name}</p>
                            </div>
                            <div className="border-t-4 rounded-b-lg max-h-10 flex justify-end items-center bg-slate-800 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
</svg>
                                
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="font-semibold flex items-center justify-center min-h-[calc(100vh-46px)]">No Classes</p>
            )}
        </>
    );
};
