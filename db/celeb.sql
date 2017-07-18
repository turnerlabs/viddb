select * from AWSCelebResults limit 100;

-- count per celeb
select distinct Celebrities as celebrity, count(Celebrities) as total
from AWSCelebResults
where VideoName = 'Chuck_history_reel_7'
group by celebrity
order by total desc;

-- timestamps for celeberity
select ISO, TimeStamp from AWSCelebResults
where Celebrities = 'Charles Barkley';

select ISO, TimeStamp from AWSCelebResults where Celebrities = 'Charles';

select Celebrities, count(Celebrities) as face_time from AWSCelebResults
where VideoName = 'Chuck_history_reel_7'
group by Celebrities
order by face_time desc;


select * from AWSCelebResults where VideoName = 'Chuck_history_reel_7';

