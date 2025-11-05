FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy the jar file into the container
COPY target/delivery-service-0.0.1-SNAPSHOT.jar delivery-service-0.0.1-SNAPSHOT.jar
# Make the port available to the outside world
EXPOSE 8970
# Run the jar file
CMD ["java", "-jar", "delivery-service-0.0.1-SNAPSHOT.jar"]
