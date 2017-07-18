# Videofi

### Current APIs

#### `/api/getVideoList`
Retrieves a list of all videos

#### `/api/getLabelCount/:videoName`
Returns a unique list of all labels in the provided video, including counts.  Sorted in desc order

#### `/api/labels/:videoName`
Returns all labels and their respective timestamp for a provided video

#### `/api/celebs/:videoName`
Returns all celebs and their respective timestamp for a provided video

#### `/api/celebTimeStamps/:celebName`
Returns a list of timestams for a celeberty (**Shit, bug, i forgot to specify the video name** )

#### `/api/getCelebCount/:videoName`
Returns a list of celebs and their number of occurances in a video. Can also be used to calculate "facetime" since each occurance is a second.