#
# The include should be a single file that contains:
# export DB_USER := {user}
# export DB_PASSWORD := {password}
#
include env

$(info $$DB_USER is [${DB_USER}])
$(info $$DB_PASSWORD is [${DB_PASSWORD}])

all:
	DEBUG=mapadm:* nodemon bin/www

docker_build:
	echo "make sure {ver} is set!"
	test ${ver}
	docker build -t donwb/mapadm:0.${ver} .

docker_run:
	docker run -p 3000:3000 -e DB_USER=${DB_USER} -e DB_PASSWORD=${DB_PASSWORD} -e DB=${DB} -e DB_SERVER=${DB_SERVER} -e DB_PORT=${DB_PORT} -d donwb/mapadm:0.1

.PHONY: all docker_build docker_run