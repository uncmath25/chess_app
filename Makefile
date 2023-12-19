.PHONY: clean build run stop

CLIENT_IMAGE_NAME="uncmath25/chess-app-client"
SERVER_IMAGE_NAME="uncmath25/chess-app-server"
CLIENT_PORT=3000
SERVER_PORT=3030

default: run

clean:
	@echo "*** Cleaning repo of unnecessary artifacts... ***"

build: clean
	@echo "*** Building local chess app... ***"
	cd client && docker build -t $(CLIENT_IMAGE_NAME) .
	# cd server && docker build -t $(SERVER_IMAGE_NAME) .

run: build
	@echo "*** Running local chess app... ***"
	docker run -d --rm -p $(CLIENT_PORT):$(CLIENT_PORT) --env-file .env.dev -v "$$(pwd)/client/src:/usr/src/app/src" --name chess-app-client $(CLIENT_IMAGE_NAME)
	# docker run -d --rm -p $(SERVER_PORT):$(SERVER_PORT) --env-file .env.dev -v "$$(pwd)/server/src:/src" --name chess-app-server $(SERVER_IMAGE_NAME)

stop:
	@echo "*** Stopping local chess app... ***"
	docker rm -f chess-app-client
	# docker rm -f chess-app-server
