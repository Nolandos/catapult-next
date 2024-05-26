import {Address, Client} from 'viem';

// eslint-disable-next-line import/no-cycle
import {IPresale} from './interface/presale';

// eslint-disable-next-line import/no-cycle
import {PresaleV4} from './presale-v4';

export type PresaleVersion = 'v2' | 'v3' | 'v4'

export class PresaleFactory {
  public static async createInstance(
    version: PresaleVersion,
    publicClient: Client,
    presaleContractAddress: Address,
  ): Promise<IPresale> {
    switch (version) {
      case 'v4': {
        return PresaleV4.createInstance(publicClient, presaleContractAddress);
      }
      default: {
        throw new Error('Unsupported version');
      }
    }
  }
}
