FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy the jar file into the container
COPY target/userservice-0.0.1-SNAPSHOT.jar userservice-0.0.1-SNAPSHOT.jar
# Make the port available to the outside world
EXPOSE 8890
# Run the jar file
CMD ["java", "-jar", "userservice-0.0.1-SNAPSHOT.jar"] 
