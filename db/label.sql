select * from AWSLabelResults limit 100;

-- Video list
select distinct VideoName as vid from AWSLabelResults;

-- count of labels sorted by total
select distinct Labels as Label, count(Labels) as total 
from AWSLabelResults
where VideoName = 'Chuck_history_reel_7'
group by label
order by total desc;

-- num labels per/timestamp
select distinct TimeStamp as timestamp, count(Labels) as num_labels
from AWSLabelResults
where VideoName = 'Chuck_history_reel_7'
group by timestamp
order by timestamp;

-- labels at timestamp
select TimeStamp, labels from AWSLabelResults
where TimeStamp in (0, 8);


