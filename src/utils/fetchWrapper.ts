// src/utils/fetchWrapper.ts

export const fetchWrapper = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(options.headers || {});

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 401) {
      window.location.href = "/";
      return response;
    }

    if (response.status === 403) {
      console.error("Forbidden: Access denied.");
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
