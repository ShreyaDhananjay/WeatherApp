FROM openjdk:8
ADD target/docker-spring-weatherapi.jar docker-spring-weatherapi.jar
EXPOSE 8082
ENTRYPOINT [ "java", "-jar", "docker-spring-weatherapi.jar" ]