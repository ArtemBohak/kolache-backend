import { Global, Injectable } from '@nestjs/common';

@Global()
@Injectable()
export class ApiService {
  async post(
    url: string,
    body: Record<string, any>,
    options: Omit<RequestInit, 'body'> = {},
  ) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        ...options,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', ...options.headers },
      });

      const responseData = await response.json();
      return responseData;
    } catch (e) {
      console.log(`Error with POST ${url} \n`, e);
      return null;
    }
  }
}
