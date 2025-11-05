FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy the jar file into the container
COPY target/eureka-server-0.0.1-SNAPSHOT.jar eureka-server-0.0.1-SNAPSHOT.jar
# Make the port available to the outside world
EXPOSE 8990
# Run the jar file
CMD ["java", "-jar", "eureka-server-0.0.1-SNAPSHOT.jar"] 
