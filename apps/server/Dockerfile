FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /workspace

COPY apps/server/pom.xml ./pom.xml
RUN mvn -B -DskipTests dependency:go-offline

COPY apps/server/src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=build /workspace/target/website-builder-0.1.0-SNAPSHOT.jar ./app.jar

EXPOSE 8080

USER app

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
