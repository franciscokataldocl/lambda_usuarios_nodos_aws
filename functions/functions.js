const { getFacultyRoles } = require("../bannerData");
const { saveFile } = require("../helpers/saveJson");

const { extractProperties } = require("../helpers/usersExtractProperties");


const FetchDataBlackBoard = async (method, body = null, url) => {
    const requestOptions = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: body ? JSON.stringify(body) : null,
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('error fetch FetchDataBlackBoard', error);
        throw error;
    }
};






const usersFromBlackboard = async (studentId) => {
    try {
        const response = await FetchDataBlackBoard(
            "GET",
            null,
            `${process.env.BLACKBOARD_URL}/users?studentId=${studentId}`
        );

        return response
    } catch (error) {
        console.log(error)
    }
}

let usersWithApiId= [];
let contadorUsuarios= 0;
let usuariosEncontradosEnBlackBoard=0;
const usuariosWithIdBlackBoard = async () => {
    const tamanoSubarreglo = 100;
    const delayEntreSubarreglos = 6000;

     const usersFromBanner = await getFacultyRoles();
    console.log('usersFromBanner', usersFromBanner.length)
    const subarreglos = dividirArregloEnSubarreglos(usersFromBanner, tamanoSubarreglo);
    
//    console.log(subarreglos[0]);
    for (const subarreglo of subarreglos) {
        await procesarSubarreglo(subarreglo);
        await delay(delayEntreSubarreglos);
    }

    console.log('usersWithApiId', usersWithApiId.length)
    const properties = extractProperties(usersWithApiId);

    saveFile('users.json', usersWithApiId)
    return {
        users: usersWithApiId,
        properties,
    };
}

const dividirArregloEnSubarreglos = (arr, tamanoSubarreglo) => {
    const subarreglos = [];
    for (let i = 0; i < arr.length; i += tamanoSubarreglo) {
        subarreglos.push(arr.slice(i, i + tamanoSubarreglo));
    }
    return subarreglos;
};

const procesarSubarreglo = async (subarreglo) => {
    subarreglo.forEach(async (user) => {
        const blackBoardUser = await usersFromBlackboard(user.RUT);
        contadorUsuarios++;
        if(blackBoardUser && blackBoardUser.results && blackBoardUser.results[0]){
            usuariosEncontradosEnBlackBoard++;
            const newUser ={
                RUT: user.RUT,
                ROL: user.ROL,
                BB_ID:blackBoardUser.results[0].id,
                NIVEL: user.NIVEL,
                FACULTAD: user.FACULTAD,
                CAMPUS: user.VCAMPUS,
                CARRERA: user.VCARRERA,
                PERIODO: user.PERIODO,
              }
              usersWithApiId.push(newUser);
        }
    });
     
};


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



module.exports = {
    usuariosWithIdBlackBoard,
    FetchDataBlackBoard
}