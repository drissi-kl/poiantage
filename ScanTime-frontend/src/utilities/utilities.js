// this funciton for get token value and use it as bearer token
const getToken = () => {
    let token = document.cookie.match(/token=[0-9A-Za-z|]+/);
    if (token) {
        token = token[0].split('=')[1];
        return token;
    }
    return false;
}

const formatTime = (t) => {
    let time = t/1000;
    const h = Math.floor(time / ( 60 * 60))
    time -= h * 60 * 60;

    const m = Math.floor(time / 60)
    time -=  m * 60;
   
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const inverseFormatTime = (t) =>{
    let h=t.match(/[0-9]+(?=h)/g)[0];
    let m=t.match(/[0-9]+(?=m)/g)[0];
    return (h*60 +m)*60*1000;
}

export { getToken, formatTime, inverseFormatTime   };








