const { execQuery } = require("./oracleConnect");
const { getBannerData } = require("./query/getBannerData");


const getFacultyRoles = async () => {

    const qry = getBannerData;
  

    return await execQuery(qry)
}

module.exports = { getFacultyRoles }