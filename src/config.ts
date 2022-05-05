export interface IConfig {
  debug: boolean;
  luaMsgPath: string;
  donationAlertPriceList: Record<string, string>;
  donationAlertMessages: string[];
  twitchMessages: string[];
  refreshInterval: number;
  port: number;
}
