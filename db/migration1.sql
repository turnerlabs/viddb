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
