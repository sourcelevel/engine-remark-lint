.PHONY: image test

IMAGE_NAME ?= plataformatec/engine-remark-lint

image:
	docker build --rm -t $(IMAGE_NAME) .

test: image
	docker run --rm --workdir /usr/src/app $(IMAGE_NAME) npm test

publish: image
	docker push $(IMAGE_NAME)
