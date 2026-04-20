export async function fetchAPIJson(url,params=null) {
    
  try {
    const response = await fetch(`/api${url}?${String(params)}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    //console.log(result)
    return result;
  } catch (error) {
    console.error(error.message);
  }
}