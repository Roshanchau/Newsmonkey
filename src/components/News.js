import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  // document.title = `${capitalizeFirstLetter(
  //   props.category
  // )}-NewsMonkey`;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    // console.log(props.setProgress);
    //we have used this url to fetch different kind of news like through country , category, and etc.
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    // this.setState({ loading: true });
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    // console.log(parsedData);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    updateNews();
  }, []);

  // async componentDidMount() {
  //   // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=f7ef9ecf57b1472884e30ae7725a7d35&page=1&pageSize=${props.pageSize}`;
  //   // // we have set the state of the loading to true so that the spinner can be shown until the json data from the api is fetched and parsed.
  //   // this.setState({ loading: true });

  //   // let data = await fetch(url);
  //   // let parsedData = await data.json();
  //   // console.log(parsedData);
  //   // this.setState({
  //   //   articles: parsedData.articles,
  //   //   totalResults: parsedData.totalResults,
  //   //   // now we have set the loading state to false since the data from the api is fetched and parsed.
  //   //   loading: false,
  //   // });

  // }
  const handlePrevClick = async () => {
    // let url = `https://newsapi.org/v2/top-headlines?country=${
    //   props.country
    // }&category=${
    //   props.category
    // }&apiKey=f7ef9ecf57b1472884e30ae7725a7d35&page=${
    //   this.state.page - 1
    // }&pageSize=${props.pageSize}`;
    // this.setState({ loading: true });
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // this.setState({
    //   page: this.state.page - 1,
    //   articles: parsedData.articles,
    //   loading: false,
    // })
    setPage(page - 1);
    updateNews();
  };
  const handleNextClick = async () => {
    //math.ceil gives the ceiling value i.e. if 2.8 it gives 3
    //here if the no of the next page is greater than the result of math.ceil of the total number of results divided by the pagesize i.e. 20 then we donot render anything but if the next page number is less than tha value i.e. if totalResults in the json , if it is for eg 38 then the math.ceil returns 2 thus it doesnot show page 3 cuz 3>2 and math.ceil returns 2 when we divide  38/2 .
    // if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / 20))) {
    //   let url = `https://newsapi.org/v2/top-headlines?country=${
    //     props.country
    //   }&category=${
    //     props.category
    //   }&apiKey=f7ef9ecf57b1472884e30ae7725a7d35&page=${
    //     this.state.page + 1
    //   }&pageSize=${props.pageSize}`;
    //   this.setState({ loading: true });
    //   let data = await fetch(url);
    //   let parsedData = await data.json();
    //   this.setState({
    //     page: this.state.page + 1,
    //     articles: parsedData.articles,
    //     loading: false,
    //   });
    // }
    setPage(page + 1);
    updateNews();
  };

  const fetchMoreData = async () => {
    setPage(page + 1);
    // this.setState({ page: this.state.page + 1 });
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    // console.log(parsedData);
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    // this.setState({
    //   articles: this.state.articles.concat(parsedData.articles),
    //   totalResults: parsedData.totalResults,
    // });
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: "35px 0" }}>
        {`NewsMonkey- Top Headlines from ${capitalizeFirstLetter(
          props.category
        )} `}
      </h1>
      {/* we show spinner if and only if the loading is true. */}
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={!loading && <Spinner />}
      >
        <div className="container">
          <div className="row my-3 ">
            {/* we map the articles only when the loading state is false i.e when the loading state is true we have to only show the spinner nothing else to render but as soon as the loading state hits to false it have to map through each article and render it. */}
            {
              /*!loading &&*/
              articles.map((element) => {
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
              })
            }
          </div>
        </div>
      </InfiniteScroll>
      {/* <div className="container d-flex justify-content-between">
          <button
            //this button will be disabled if the page no is less than or equal to 1 we can find this feature of page in the documentation of the news api
            disabled={page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={handlePrevClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={
              page + 1 >
              Math.ceil(totalResults / props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={handleNextClick}
          >
            Next &rarr;
          </button>
        </div> */}
    </>
  );
};
News.defautProps = {
  country: "us",
  pageSize: 8,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
