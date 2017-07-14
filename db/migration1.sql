DELIMITER //
CREATE PROCEDURE LabelCount(
    IN videoName VARCHAR(255)
)
BEGIN

	SELECT 
	    DISTINCT Labels AS Label,
	    COUNT(Labels) AS total 
	FROM 
	    AWSLabelResults 
	WHERE 
	    VideoName = videoName 
	GROUP BY
	    label 
	ORDER BY 
	    total desc;
    
END //
DELIMITER ;
