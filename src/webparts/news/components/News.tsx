import * as React from "react";
//import styles from './News.module.scss';
import { INewsProps } from "./INewsProps";
//import styles from './News.module.scss';
//import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import styles from "./News.module.scss";
import * as moment from "moment";
interface INewslink {
  Logo: any;
  ID: string;
  Title: string;
  RedirectLink: any;
  ShortDetails: string;
  NewsDetails: string;
  PublishDate: any;
  ExpiryDate: any;
  AuthorNews: {
    Title: string;
    EMail: String;
  };
  Author: {
    Title: string;
    EMail: String;
  };
  Department: string;
  NewsProfile: string;
}
//multiple items
interface IAllNewsLinks {
  AllNews: INewslink[];
}

export default class QuickLinkWebpart extends React.Component<
  INewsProps,
  IAllNewsLinks
> {
  properties: any;
  AuthorNews: any;
  constructor(props: INewsProps, state: IAllNewsLinks) {
    super(props);
    this.state = {
      AllNews: [],
    };
  }

  componentDidMount() {
    //alert ("Componenet Did Mount Called...");
    //console.log("First Call.....");
    this.getNewsData();
  }

  public getNewsData = () => {
    console.log("This is link Detail function");

    let selectecolumns =
      "*,AuthorNews/Title,AuthorNews/EMail,Author/Title,Author/EMail";
    console.log(selectecolumns);
    let expandcolumn = "AuthorNews,Author";
    /* let expandcolumn:"NewsAuthor,Author;"
    console.log(expandcolumn); */

    //api call
    let listURL = `${this.props.siteURL}/_api/web/lists/getbytitle('${this.props.listName}')/items?$select=${selectecolumns}&$expand=${expandcolumn}&$orderby=ID desc`;
    console.log(listURL);

    this.props.context.spHttpClient
      .get(listURL, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON: any) => {
          //console.log(responseJSON);
          this.setState({ AllNews: responseJSON.value });
        });
        console.log(this.state.AllNews);
      });
  };
  public render(): React.ReactElement<INewsProps> {

    let webpartHeight = parseInt(this.props.heightWeb);
    let WebHeight: string;

    if (webpartHeight == 2) {
      WebHeight = "600px";
    }  else  WebHeight = "400px";
    return (
      /*  Component Title */
      <div
        className={styles["maincontainer"]}
        style={{ height:  WebHeight}}
      >
        <div>
          <p className={styles["componentTitle"]}>
            {this.props.componentTitle}
          </p>
          <div>
            <form action="/url" method="GET">
            <input type="text" id="lname" name="lname"/>
  <button type="submit" value="Submit" className={styles.btn1}>Search</button>
  <button type="reset" value="Reset" className={styles.btn1}>Reset</button>
          
            </form>
          </div><br />
        </div>

        {/*   Empty Message */}
        <div style={{ display: this.state.AllNews.length === 0 ? "" : "none" }}>
          <p>{this.props.emptyMessage}</p>
        </div>
        <div className={styles["allNewsContainer"]}>
          {this.state.AllNews.map((news) => {
            return (
              <div
                className={styles.newscard}
                /*onClick={() => window.open(news.RedirectLink.SiteURL, "_blank")} */
              >
                <img
                  src={
                    news.NewsProfile == null
                      ? require("./Image/images1.png")
                      : window.location.origin +
                        JSON.parse(news.NewsProfile).serverRelativeUrl
                  }
                  alt=""
                />
                <div className={styles.paragraph}>
                  <p style={{ color: "gray", fontWeight: "bold" }}>
                    {moment(news.PublishDate).format("LL")} /{" "}
                    {news.AuthorNews == null
                      ? news.Author.Title
                      : news.AuthorNews.Title}
                  </p>
                  <p style={{ fontWeight: "bold" }}>{news.ShortDetails}</p>
                  <p className={styles.line}>{news.NewsDetails}</p>
                  <br />
                  <button className={styles.btncolor}>READ MORE</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
