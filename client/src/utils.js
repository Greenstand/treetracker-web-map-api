function parseMapName(domain){
  const matcher = domain.match(/^((\w+\.?)+org|localhost)$/);
  if(matcher){
    if(domain === "localhost"){
      return undefined;
    }
    const sub = domain.match(/([^.]+)/g);
    //discard primary domain
    sub.pop();
    sub.pop();
    if(sub.length > 0 && sub[0] !== "test" && sub[0] !== "dev"){
      return sub[0];
    }else{
      return undefined;
    }
  }else{
    throw new Error(`the domain is wrong :${domain}`);
  }
}


module.exports = {parseMapName}
