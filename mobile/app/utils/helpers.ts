export async function makeApiCall<T>(
  url: string,
  timeout: number = 60000,
  data: object | null = null,
  method: string = 'GET',
  headers: Record<string, string> = {}
): Promise<T> {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(new Error('Request timed out'));
    }, timeout);
  });

  const requestOptions: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: data ? JSON.stringify(data) : null,
    signal,
  };

  return Promise.race([
    fetch(url, requestOptions).then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    }),
    timeoutPromise,
  ]);
}
