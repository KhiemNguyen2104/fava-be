import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AmadeusService {
  private readonly baseURL = 'https://test.api.amadeus.com/v1';
  private token: string;
  private tokenExpiry: number;

  private async authenticate() {
    if (this.token && Date.now() < this.tokenExpiry) return;

    const client_id = process.env.AMADEUS_KEY;
    const client_secret = process.env.AMADEUS_SECRET;

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', client_id || '');
    params.append('client_secret', client_secret || '');

    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
    } catch (error) {
      throw new HttpException('Authentication with Amadeus failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async searchCity(keyword: string): Promise<string> {
    await this.authenticate();

    try {
      const response = await axios.get(`${this.baseURL}/reference-data/locations/cities`, {
        headers: { Authorization: `Bearer ${this.token}` },
        params: {
          keyword: keyword,
          max: 5,
        },
      });

      return response.data.data[0].name;
    } catch (error) {
      throw new HttpException('Failed to fetch city data', error.message)
    }
  }
}
