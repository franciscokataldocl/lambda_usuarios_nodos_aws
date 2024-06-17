const { FetchDataBlackBoard } = require("../functions/functions");
const { saveFile } = require("./saveJson");

const fetchNodes = async (properties) => {

//------------------obtener niveles
    let {results} = await FetchDataBlackBoard(
        "GET",
        null,
        `${process.env.BLACKBOARD_URL}/institutionalHierarchy/nodes/_163_1/children`
    );

 
    const filtrados = results.filter(item => item.title !== 'INSTITUCIONALES');
    for (let i = filtrados.length - 1; i >= 0; i--) {
        const externalId = filtrados[i].externalId;
        if (!properties.niveles.some(nivel => externalId.includes(nivel))) {
          filtrados.splice(i, 1);
        }
      }
   

      saveFile('niveles.json', filtrados);
   
    //------------------obtener niveles>PROD
    let produccion = [];
    const itemsProduccion = await Promise.all(filtrados.map(async item => {
        const { results } = await FetchDataBlackBoard(
            "GET",
            null,
            `${process.env.BLACKBOARD_URL}/institutionalHierarchy/nodes/${item.id}/children`
        );
        const itemProduccion = results.find(item => item.title === 'Producción');
        if (itemProduccion) {
            produccion.push(itemProduccion);
        }
    }));
 
    saveFile('produccion.json', produccion);


    //------------------obtener niveles>PROD>FACULTAD
    let facultades = [];
    const itemsFacultad = await Promise.all(produccion.map(async item => {
        const { results } = await FetchDataBlackBoard(
            "GET",
            null,
            `${process.env.BLACKBOARD_URL}/institutionalHierarchy/nodes/${item.id}/children`
        );
        if (results) {
            const filteredResults = results.filter(result => {
                return properties.facultades.some(facultad => result.externalId.includes(facultad));
            });
            if (filteredResults.length > 0) {
                facultades.push(...filteredResults); 
            }
        }
    }));
    saveFile('facultades.json', facultades);


    //------------------obtener niveles>PROD>FACULTAD>CAMPUS

    let campus = [];
    const itemsCampus = await Promise.all(facultades.map(async item => {
        const { results } = await FetchDataBlackBoard(
            "GET",
            null,
            `${process.env.BLACKBOARD_URL}/institutionalHierarchy/nodes/${item.id}/children`
        );
        if (results) {
            const filteredResults = results.filter(result => {
                return properties.campus.some(campus => result.externalId.includes(campus));
            });
            if (filteredResults.length > 0) {
                campus.push(...filteredResults);
            }
        }
    }));
    saveFile('campus.json', campus);




    let carreras = [];
    const itemsCarreras = await Promise.all(campus.map(async item => {
        const { results } = await FetchDataBlackBoard(
            "GET",
            null,
            `${process.env.BLACKBOARD_URL}/institutionalHierarchy/nodes/${item.id}/children`
        );
        if (results) {
            const filteredResults = results.filter(result => {
                return properties.carreras.some(carreras => result.externalId.includes(carreras));
            });
            if (filteredResults.length > 0) {
                carreras.push(...filteredResults); 
            }
        }
    }));
    saveFile('carreras.json', carreras);
   
}






module.exports = {
    fetchNodes
}