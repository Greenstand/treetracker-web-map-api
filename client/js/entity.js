/*
 * get entity, edit the DOM
 */
const axios = require("axios");

const entity = {
  name: "entity",
  getById: async function(id){
    const res = await axios.get(`/entities/${id}`);
    if(res.status !== 200){
      throw Error("entity load fails");
    }
    return res.data;
  },
  getByWallet: async function(name){
    const res = await axios.get(`/entities?wallet=${name}`);
    if(res.status !== 200){
      throw Error("entity load fails");
    }
    return res.data;
  },
};

module.exports = entity;
