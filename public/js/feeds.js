function getFeeds(event){
    $.ajax({
        url: "/api/feeds",
        method: "GET"
    }).then((res) => {
          
        $('.feeds').empty();
        console.log(res);
    })

}