import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

export class News extends Component {
  static defautProps = {
    country: "us",
    pageSize: 8,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  async componentDidMount() {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=dd72b400715b4ec1bf5947e5b05ceb3d&page=1&pageSize=${this.props.pageSize}`;
    // we have set the state of the loading to true so that the spinner can be shown until the json data from the api is fetched and parsed.
    this.setState({ loading: true });

    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      // now we have set the loading state to false since the data from the api is fetched and parsed.
      loading: false,
    });
  }
  handlePrevClick = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${
      this.props.country
    }&category=${
      this.props.category
    }&apiKey=dd72b400715b4ec1bf5947e5b05ceb3d&page=${
      this.state.page - 1
    }&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      page: this.state.page - 1,
      articles: parsedData.articles,
      loading: false,
    });
  };
  handleNextClick = async () => {
    //math.ceil gives the ceiling value i.e. if 2.8 it gives 3
    //here if the no of the next page is greater than the result of math.ceil of the total number of results divided by the pagesize i.e. 20 then we donot render anything but if the next page number is less than tha value i.e. if totalResults in the json , if it is for eg 38 then the math.ceil returns 2 thus it doesnot show page 3 cuz 3>2 and math.ceil returns 2 when we divide  38/2 .
    if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / 20))) {
      let url = `https://newsapi.org/v2/top-headlines?country=${
        this.props.country
      }&category=${
        this.props.category
      }&apiKey=dd72b400715b4ec1bf5947e5b05ceb3d&page=${
        this.state.page + 1
      }&pageSize=${this.props.pageSize}`;
      this.setState({ loading: true });
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        page: this.state.page + 1,
        articles: parsedData.articles,
        loading: false,
      });
    }
  };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{ margin: "35px 0" }}>
          NewsMonkey- Top Headlines
        </h1>
        {/* we show spinner if and only if the loading is true. */}
        {this.state.loading && <Spinner />}
        <div className="row my-3 ">
          {/* we map the articles only when the loading state is false i.e when the loading state is true we have to only show the spinner nothing else to render but as soon as the loading state hits to false it have to map through each article and render it. */}
          {!this.state.loading &&
            this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : "who are you"}
                    description={
                      element.description
                        ? element.description
                        : "loremfjlkdsjflsdjfkljsdlkfjdslkfjlks"
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            //this button will be disabled if the page no is less than or equal to 1 we can find this feature of page in the documentation of the news api
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
