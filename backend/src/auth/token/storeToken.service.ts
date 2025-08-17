import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreTokenService {
  private readonly map = new Map<
    string,
    { value: string; expiresIn: number }
  >();

  set(key: string, value: string):string {
    const expiresIn = Date.now() + 10 * 60 * 1000;
    setTimeout(
      () => {
        this.map.delete(key);
      },
      10 * 60 * 1000,
    );
    this.map.set(key, { value, expiresIn });
    return value;
  }
}
