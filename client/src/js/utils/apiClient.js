const ROOT_API_URL = `${process.env.REACT_APP_API_URL}`

export function getResource(route) {
  console.log(`${ROOT_API_URL}/${route}`);
  return fetch(`${ROOT_API_URL}/${route}`, {
    method: "GET"
  }).then(response => response.json());
}
