import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface INewsProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  siteURL:string;
  listName:string;
  componentTitle:string;
  emptyMessage:string;
  context:WebPartContext
  webpartHeight:boolean;
  heightWeb:string;
}
