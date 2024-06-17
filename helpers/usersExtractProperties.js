let niveles=[];
let facultades=[];
let campus=[];
let carreras=[];

const removeRepeatedProperties = (users, property, array) => {
    users.forEach(user => {
        const value = user[property];
        if (!array.includes(value)) {
            array.push(value);
        }
    });
};

const extractProperties = (users) => {
    const batchSize = 100;
    const delay = 5000; // 5 segundos
    const totalBatches = Math.ceil(users.length / batchSize);
    let batchesProcessed = 0;

    for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        setTimeout(() => {
            removeRepeatedProperties(batch, 'NIVEL', niveles);
            removeRepeatedProperties(batch, 'FACULTAD', facultades);
            removeRepeatedProperties(batch, 'CAMPUS', campus);
            removeRepeatedProperties(batch, 'CARRERA', carreras);
            batchesProcessed++;
            if (batchesProcessed === totalBatches) {
                console.log('Todos los usuarios han sido procesados:');
                return {
                    niveles,
                    facultades,
                    campus,
                    carreras
                  }
            }
        }, delay * (i / batchSize));
    }
};


module.exports = {
    extractProperties
}