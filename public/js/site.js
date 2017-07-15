$(document).ready(function(){


    $.getJSON('/api/getVideoList', function(videoResult){
        
        var vids = {vids: videoResult.res}
        var sideHtml = nunjucks.render('../templates/sidebar.njk', vids);
        $('#sidebar-placeholder').replaceWith(sideHtml);

        $('a.video').click(getVideoInfo);


        $("#wrapper").toggleClass("toggled");
    });
    
    
});

function getVideoInfo(e){
    var vidName = e.target.id;
    console.log(vidName);

    $.getJSON('/api/getLabelCount/' + vidName, function(listResult){
        var labels = listResult.res;

        console.log(labels);

        $('#video-content').empty();
        
        $('#video-content').append(
            $('<pre>').text(
                JSON.stringify(labels, null, '  ')
            )
        );

    });

}
