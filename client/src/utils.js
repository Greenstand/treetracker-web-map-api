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
    if(
      sub.length > 0 && 
      sub[0] !== "test" && 
      sub[0] !== "dev" &&
      sub[0] !== "wallet" &&
      sub[0] !== "ready"
    ){
      return sub[0];
    }else{
      return undefined;
    }
  }else{
    throw new Error(`the domain is wrong :${domain}`);
  }
}

/*
 * get wallet name form url
 */
function parseWallet(url){
  const r = url.match(/(@(\S+)|wallet=([.-\w]+))/);
  if(r){
    return r[2] || r[3];
  }else{
    return undefined;
  }
}

export {parseMapName, parseWallet}
