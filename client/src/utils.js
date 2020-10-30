
function parseMapName(domain){
  const matcher = domain.match(/^((\w+\.?)+org|localhost)$/);
  if(matcher){
    if(domain === "localhost"){
      return undefined;
    }
    const sub = domain.match(/^([^.]+)\..*$/);
    if(sub[1] !== "test" && sub[1] !== "dev"){
      return sub[1];
    }else{
      return undefined;
    }
  }else{
    throw new Error(`the domain is wrong :${domain}`);
  }
}


module.exports = {parseMapName}
