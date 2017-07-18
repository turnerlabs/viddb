$(document).ready(function(){

    google.charts.load("current", {packages:["corechart", "bar"]});
    //google.charts.setOnLoadCallback(drawChart);

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

        $('#video-content').empty();
        $('#wordcloud').empty();

        /*
        $('#video-content').append(
            $('<pre>').text(
                JSON.stringify(labels, null, '  ')
            )
        );
        */

        // {text: 'bumble', size: 29, href: 'https://en.wikipedia.org/wiki/Beadle'}
        var newLabels = labels.map(function(obj){
            var n = {};
            n['text'] = obj.Label;
            n['size'] = obj.total;
            return n;
        });
        d3.wordcloud()
            .size([500, 400])
            .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
            .words(newLabels)
            .onwordclick(function(d, i) {
            if (d.href) { window.location = d.href; }
            })
            .start();

        /* histobram */
        drawHistogram(labels);
    });

    $.getJSON('/api/labels/' + vidName, function(result) {
        window.currentVideoLabels = result;
    });

    $.getJSON('/api/celebs/' + vidName, function(result) {
        window.currentVideoCelebs = result;
    });

    $.getJSON('/api/celebSummary/' + vidName, function(celebs) {
        var html = '';
        celebs.map(function(celeb) {
            html += '<span><img height="100" width="100" src="' + celeb.thumbnailUrl + '"></span>&nbsp;';
        });
        $('#celebSummary').html(html);
    });    

    //reload the video source
    var src = 'http://video-metadata-ui.dev.services.ec2.dmtio.net/stream/' + vidName + '.mp4';
    console.log(src);
    $("#vid").attr("src", src)
    $('#vid').bind('play', setTimeInterval);
    $('#vid').bind('pause', clearTimeInterval);
    $('#vid').bind('ended', clearTimeInterval);
}

function setTimeInterval(e) {
    window.currentInterval = setInterval(function() {
        $('#currentTime').html(vid.currentTime);
        var baseTime = Math.floor(vid.currentTime);
        $('#currentLabels').html(getHTML(window.currentVideoLabels, baseTime));
        $('#currentCelebs').html(getHTML(window.currentVideoCelebs, baseTime));
    }, 100);
}

function clearTimeInterval(e) {
    clearInterval(currentInterval);
}

function getHTML(objects, baseTime) {
    var HTMLString = '';
    if (objects[baseTime]) {
       HTMLString += '<span>';
       objects[baseTime].map(function(object) {
           var labelType = 'label-default';
           if (object === 'People' || object === 'Person') labelType = 'label-success'
           HTMLString += '<span class="label ' + labelType + '">' + object + "</span>&nbsp;";
       });
       HTMLString += '</span>';
    }
    return HTMLString;
}

function drawHistogram(labelData) {
    var maxLength = labelData.length > 20 ? 20 : labelData.length;

    var chartData = [['Label', 'Total']];
    for(i=0;i<maxLength;i++){
        var l = labelData[i].Label;
        var t = labelData[i].total;
        var lt = [l, t];
        chartData.push(lt);
    }

    var data = google.visualization.arrayToDataTable(chartData);

    var options = {
        title: 'Label Distribution',
        legend: { position: 'none' },
        vAxis: {title: 'Label Data'},
        bars: 'horizontal'
    };

    var chart = new google.charts.Bar(document.getElementById('chart_div'));
    chart.draw(data, options);
}