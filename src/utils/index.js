export function formatFirstLetterToUpperCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export async function fetchData(options) {
  const response = await fetch(
    `https://api.spacetraders.io/v2/${options.endpoint}`,
    {
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body || null,
    }
  );
  if (!response.ok) {
    console.log(response);
    throw new Error(`Request failed with status: ${response.status}`);
  }
  const responseData = await response.json();

  console.log("Response:", responseData);

  return responseData.data;
}
