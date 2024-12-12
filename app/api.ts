// TODO: expo restricts usage of react-native npm packages, eject & use https://www.npmjs.com/package/react-native-zeroconf for network discovery. However, this eliminates the expo go app for live ui updates 

// The 10.0.0.x range is commonly used most out of the box network setups.
// This app is currently restricted from discovering ip's outside of that range. 
const subnet = '10.0.0';
// set client <-> server port
const port = 5001;

// valid endpoints configured in server
export type ValidEndpoint = "discover_ping" | "os_action"

// valid http methods for request
export type HttpMethod = "GET" | "POST" // ...etc

// sendRequest is a helper function that sends a general http request and returns the full response
export const sendRequest = async (method: HttpMethod, endpoint: ValidEndpoint, ip: string, signal?: AbortSignal, queryParams?: URLSearchParams): Promise<Response> => {
  let url = `http://${ip}:${port}/${endpoint}`;

  const queryString = queryParams?.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const response = await fetch(url, {
    method: method,
    signal: signal,
  });
  return response
}

// scanNetwork scans the local network for devices by sending /discover ping requests to potential IPs rangin from 10.0.0.1 -> 10.0.0.255
// if a valid response is received, it sets the discovered IP using the provided setServerIP state updater function in the HomeScreen component)
export const scanNetwork = async (setServerIP: React.Dispatch<React.SetStateAction<string>>) => {
  console.log("..scanning network")
  // array of all possible ip's in subnet 0 - 255
  const ips = Array.from({ length: 255 }, (_, i) => `${subnet}.${i + 1}`);   // ["10.0.0.1", "10.0.0.2", ..., "10.0.0.255"]

  // controllers store AbortController instances for managing ongoing network requests
  const controllers: AbortController[] = [];

  // found flips to true when an ip is found, stopping subsequent fetch attempts
  let found = false;
 
  // fetchIP is an async function that sends a request to http://10.0.0.{ip}:5001/discover
  // if a request receives a valid response, it aborts all controllers running in parallel 
  const fetchIP = async (ip: string) => {
    if (found) return;
    const controller = new AbortController();
    controllers.push(controller);
    
    // abort after .5 second, lookup should be quick
    const timeoutId = setTimeout(() => controller.abort(), 500);
    
    try {
      let response = await sendRequest("GET", "discover_ping", ip, controller.signal)
      clearTimeout(timeoutId);

      // If a valid response is received and no IP has been found yet
      if (response.ok && !found) {
        found = true;
        setServerIP(ip);

        // abort all pending network requests
        controllers.forEach((ctrl) => ctrl.abort());
      }
    } catch {
      // if there's an error, ignore and clear timeout
      clearTimeout(timeoutId);
    }
  };

  // create array of fetchIP functions ranging from ip = 1 to 255
  const requests = ips.map((ip) => fetchIP(ip));

  // allSettle vs all: we want to until all requests have been completed, even if some fail
  await Promise.allSettled(requests);
};

// triggerKeyPress sends the keypress action to the /key endpoint in server.py
export const triggerKeyPress = async (serverIP: string, key_action: string) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("action", key_action);

    const response = await sendRequest("GET", "os_action", serverIP, undefined, queryParams);
    if (!response.ok) {
      alert(`Failed to send request: ${response.status}`);
    }
    return response
  } catch (error) {
    alert(`Failed to send request: ${(error as Error).message}`);
  }
};

// adjustVolume triggers key press and set's the vollume state to value received from server
export const adjustVolume = async(serverIP: string, key_action: string, setVolume: React.Dispatch<React.SetStateAction<string>>) => {
  const res = await triggerKeyPress(serverIP, key_action)
  if (res && res.ok) {
    const data = await res.json();
    if (data.volume !== "") {
      setVolume(data.volume);
    }
  } else {
    console.log("failed to adjust volume");
  }
}

// reScan scans the network again for /discovery_ping response in case of new network location
export const reScan = (i: number, incrRescan: React.Dispatch<React.SetStateAction<number>>) => {
  incrRescan(i + 1)
}