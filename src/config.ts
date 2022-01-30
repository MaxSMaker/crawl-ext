export interface IConfig {
  debugMsg: boolean;
  luaMsgPath: string;
  donationAlertPriceList: Record<string, string>;
  donationAlertMessages: string[];
  twitchMessages: string[];
  refreshInterval: number;
}
