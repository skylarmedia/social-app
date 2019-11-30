export const ImagePosts = (props) => {
    getType = url => {
        if (url !== 'No Files') {
          var checkUrl = new URL(url);
    
          var query_string = checkUrl.search;
    
          var search_params = new URLSearchParams(query_string);
    
          var type = search_params.get('type');
    
          return type;
        }
      };
    const { image } = this.props
    return(
        <div>
            WORKS
            {/* <img src={image} /> */}
        </div>
    )
}