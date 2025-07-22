<!-- Start the project with Docker -->

## Prerequisites

If you don't have Docker installed, please install it first:
👉 [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

we recommend using **OrbStack** as a lightweight alternative to Docker Desktop:
👉 [https://orbstack.dev/](https://orbstack.dev/)

---

## Launch the application with Docker Compose

**Make sure to run the command inside the `surgical-app` directory**

```sh
cd surgical-app && docker-compose up --build
```

then you can see the app at http://localhost:12000

## Stop the containers

```sh
docker-compose down
```

or you can stop ctrl + c

## Starting the app from the second time onward

```sh
docker-compose up
```

## tips

If you make changes to the Docker image or Dockerfile, you need to run docker-compose up --build again to rebuild the latest image.
