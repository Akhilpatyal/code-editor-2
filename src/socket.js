import {io} from 'socket.io-client';
export const initSocket=async ()=>{
    const options={
        'force new connection':true,
        reconnectionAttempt:Infinity,
        timeout:10000,
        transport:['websocket'],
    };
    return io(process.env.REACT_BACKEND_URL,options)
};