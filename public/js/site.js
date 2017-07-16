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
        $('#wordcloud').empty();

        
        $('#video-content').append(
            $('<pre>').text(
                JSON.stringify(labels, null, '  ')
            )
        );

        // {text: 'bumble', size: 29, href: 'https://en.wikipedia.org/wiki/Beadle'}
        var newLabels = labels.map(function(obj){
            var n = {};
            n['text'] = obj.Label;
            n['size'] = obj.total;
            return n;
        });
        d3.wordcloud()
            .size([500, 300])
            .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
            .words(newLabels)
            .onwordclick(function(d, i) {
            if (d.href) { window.location = d.href; }
            })
            .start();

        /* histobram */
        
    });

}
