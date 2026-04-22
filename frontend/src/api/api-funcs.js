/* 
Functions to call the backend api
*/


//takes a relative url and a  
export async function fetchAPIJson(url,params=null) {
  const response = await fetch(`/api${url}?${String(params)}`);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const result = await response.json();
  //console.log(result)
  return result;
}

//fetchs data from api url, if it fails uses placeholder data instead
export async function fetchOrPlaceholder(url,params=null, placeholder) {
  let data;
  try {
    data = await fetchAPIJson(url,params)
  }
  catch (error){
    console.log(error)
    console.log(`API fetch to ${url} failed, using placeholer data`)
    data = placeholder
  }

  return data
}