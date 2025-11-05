FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy the jar file into the container
COPY target/review-service-0.0.1-SNAPSHOT.jar review-service-0.0.1-SNAPSHOT.jar
# Make the port available to the outside world
EXPOSE 8950
# Run the jar file
CMD ["java", "-jar", "review-service-0.0.1-SNAPSHOT.jar"]
