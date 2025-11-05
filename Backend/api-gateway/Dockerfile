FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy the jar file into the container
COPY target/api-gateway-0.0.1-SNAPSHOT.jar api-gateway-0.0.1-SNAPSHOT.jar
# Make the port available to the outside world
EXPOSE 8800
# Run the jar file
CMD ["java", "-jar", "api-gateway-0.0.1-SNAPSHOT.jar"] 
