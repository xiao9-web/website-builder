# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace

COPY gradle/ gradle/
COPY gradlew .
COPY build.gradle.kts settings.gradle.kts ./
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true

COPY src/ src/
RUN ./gradlew bootJar --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S blog && adduser -S blog -G blog
COPY --from=build /workspace/build/libs/*.jar app.jar
RUN mkdir -p /app/static-output && chown -R blog:blog /app

USER blog
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
