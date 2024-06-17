
const {usuariosWithIdBlackBoard} = require("./functions/functions");
const { fetchNodes } = require("./helpers/fetchNodes");

require('dotenv').config();



const main = async () => {

    console.time();

    const {properties} = await usuariosWithIdBlackBoard();
    const nodes = await fetchNodes(properties);
    console.timeEnd();


}

main();