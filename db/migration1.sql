DELIMITER //
CREATE PROCEDURE LabelCount(
    IN video_name VARCHAR(255)
)
BEGIN

	SELECT 
	    DISTINCT Labels AS Label,
	    COUNT(Labels) AS total 
	FROM 
	    AWSLabelResults 
	WHERE 
	    VideoName = video_name 
	GROUP BY
	    label 
	ORDER BY 
	    total desc;
    
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE CelebCount(
	IN video_name VARCHAR(500)
)
BEGIN

	SELECT DISTINCT Celebrities AS celebrity, COUNT(Celebrities) AS total
	FROM AWSCelebResults
	WHERE VideoName = video_name
	GROUP BY celebrity
	ORDER BY total DESC;
    
END //
DELIMITER ;
